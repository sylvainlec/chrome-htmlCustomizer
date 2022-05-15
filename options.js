let actualRules=[];
const storageKey="cleaningRules";
const submitButton=document.getElementById("formSubmitButton");
const textArea=document.getElementById("rulesTextArea");

chrome.storage.sync.get(storageKey, (result)=> {
    actualRules=result?result[storageKey]:'';
    textArea.value=actualRules;
    console.log('Rules retrieved!');
  });


submitButton.addEventListener('click', (_) => {
    const form = document.forms[0];
    const formData= new FormData(form);
    for (var [key, value] of formData.entries()) { 
        console.log(key, value);
      }
    const newRules=formData.get("rules");
    chrome.storage.sync.set({"cleaningRules": newRules}, ()=> {
        console.log('New rules successfully saved!');
      });
});