const audioInput=document.getElementById('audioFile');
const textInput=document.getElementById('textFile');
const textArea=document.getElementById('referenceText');
const scenarioInput=document.getElementById('scenario');
const voiceOverSubdomainField=document.getElementById('voiceOverSubdomainField');
const voiceOverSubdomainInput=document.getElementById('voiceOverSubdomain');
const otherNotesField=document.getElementById('otherNotesField');
const additionalNotesInput=document.getElementById('additionalNotes');
const preview=document.getElementById('audioPreview');
const button=document.getElementById('evaluateBtn');
const statusEl=document.getElementById('status');
const resultBody=document.getElementById('resultBody');

const API_BASE='';

audioInput.addEventListener('change',()=>{
  const file=audioInput.files?.[0];
  if(!file){preview.hidden=true;return;}
  preview.src=URL.createObjectURL(file);
  preview.hidden=false;
});

textInput.addEventListener('change',async()=>{
  const file=textInput.files?.[0];
  if(!file)return;
  if(file.type==='text/plain'||file.name.toLowerCase().endsWith('.txt')){
    textArea.value=await file.text();
  }else{
    statusEl.textContent='This file type needs server-side text extraction. For now, paste its text into the box.';
  }
});

function updateScenarioFields(){
  const isVideoVoiceOver=scenarioInput.value==='Video Voice-Over';
  const isOther=scenarioInput.value==='Other';
  voiceOverSubdomainField.hidden=!isVideoVoiceOver;
  voiceOverSubdomainInput.required=isVideoVoiceOver;
  otherNotesField.hidden=!isOther;
  additionalNotesInput.required=isOther;
  if(!isVideoVoiceOver)voiceOverSubdomainInput.value='';
  if(!isOther)additionalNotesInput.value='';
}
scenarioInput.addEventListener('change',updateScenarioFields);
updateScenarioFields();

button.addEventListener('click',async()=>{
  const audio=audioInput.files?.[0];
  const reference=textArea.value.trim();
  const scenario=scenarioInput.value;
  const scenarioSubdomain=voiceOverSubdomainInput.value;
  const additionalNotes=additionalNotesInput.value.trim();

  if(!audio){statusEl.textContent='Please upload an audio file.';return;}
  if(!reference){statusEl.textContent='Please provide the exact reference text.';return;}
  if(!scenario){statusEl.textContent='Please select a Scenario / Domain.';return;}
  if(scenario==='Video Voice-Over'&&!scenarioSubdomain){
    statusEl.textContent='Please select the Video Voice-Over content type.';return;
  }
  if(scenario==='Other'&&!additionalNotes){
    statusEl.textContent='Please describe the intended scenario in Additional Notes.';return;
  }
  if(!API_BASE){
    statusEl.textContent='The evaluation backend is not connected yet. No score has been generated.';
    resultBody.textContent='Evaluation engine not configured. This app will not invent findings or MOS scores.';
    return;
  }

  const form=new FormData();
  form.append('audio',audio);
  form.append('reference_text',reference);
  form.append('scenario',scenario);
  if(scenarioSubdomain)form.append('scenario_subdomain',scenarioSubdomain);
  if(additionalNotes)form.append('additional_notes',additionalNotes);

  button.disabled=true;
  statusEl.textContent='Processing audio...';
  try{
    const response=await fetch(API_BASE+'/evaluate',{method:'POST',body:form});
    const data=await response.json();
    if(!response.ok)throw new Error(data.detail||'Evaluation failed.');
    renderResult(data);
    statusEl.textContent='Evaluation complete.';
  }catch(error){
    statusEl.textContent=error.message;
  }finally{
    button.disabled=false;
  }
});

function addResultLine(label,value){
  if(value===undefined||value===null||value==='')return;
  const row=document.createElement('p');
  row.className='finding';
  const strong=document.createElement('strong');
  strong.textContent=label+': ';
  row.append(strong,document.createTextNode(String(value)));
  resultBody.append(row);
}

function renderResult(data){
  resultBody.replaceChildren();
  addResultLine('Classification',data.classification??(Array.isArray(data.findings)?data.findings.map(x=>x.category).join('; ')||'NONE':undefined));
  addResultLine('Explanation',data.explanation);
  if(Array.isArray(data.findings)){
    data.findings.forEach(item=>{
      const row=document.createElement('div');
      row.className='finding';
      const title=document.createElement('strong');
      title.textContent=(item.category||'Finding')+': ';
      row.append(title,document.createTextNode(item.explanation||''));
      resultBody.append(row);
    });
  }
  const scores=document.createElement('div');
  scores.className='scores';
  const basic=document.createElement('div');
  basic.className='score';
  basic.append(document.createTextNode('TTS Basic Overall MOS'));
  const basicValue=document.createElement('b');
  basicValue.textContent=data.basic_mos??'Not scorable';
  basic.append(basicValue);
  const scene=document.createElement('div');
  scene.className='score';
  scene.append(document.createTextNode('Scene Style Fit MOS'));
  const sceneValue=document.createElement('b');
  sceneValue.textContent=data.scene_fit_mos??'Not scorable';
  scene.append(sceneValue);
  scores.append(basic,scene);
  resultBody.append(scores);
  addResultLine('Recommended Domain',data.recommended_domain);
  addResultLine('Additional Notes',data.additional_notes);
}
