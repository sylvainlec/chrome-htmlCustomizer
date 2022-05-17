chrome.runtime.onInstalled.addListener(() => {
    console.clear();
    console.log(`Installation successfull.`);
});

chrome.action.onClicked.addListener(function(tab) {
    const newURL = "options.html";
    chrome.tabs.create({ url: newURL });
  });

chrome.tabs.onUpdated.addListener( function (_, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {

        chrome.storage.sync.get("cleaningRules", (result)=> {
            jsonRules=result && result["cleaningRules"] ?result["cleaningRules"]:'[]';
            try{
                customisationRules= JSON.parse(jsonRules);
            } catch(e){
                customisationRules=[];
            }
        
            for(let rule of customisationRules){
                console.log(`LOADED: ${rule.name}`);
            }

            const rulesToApply=customisationRules.filter(
                r=> r.urls.
                filter(
                    site=>tab.url.startsWith(site)
                ).length>0);
    
            for(let rule of rulesToApply){
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tab.id },
                        function: applyWebsiteModifications,
                        args:[rule]
                    }
                  );
            }
          });
    }
  })

function applyWebsiteModifications(rule){
    [
        function removeBySelector(removeRule){
            document.querySelector(removeRule.querySelector).remove();
            console.log(`Removing element ${removeRule.querySelector} done...`); 
        },
        function changeCssBySelector(styleRule){
            document.querySelector(styleRule.querySelector).style[styleRule.cssRule]=styleRule.cssValue;
            console.log(`Css ${styleRule.cssRule} set to ${styleRule.cssValue} for element ${styleRule.querySelector}...`); 
        },
        function removeByInnerText(innerTextRule){
            const elements=Array.from(document.querySelectorAll(innerTextRule.querySelector));
            const foundElement=elements.find(el=>el.innerText.startsWith(innerTextRule.innerText));
 
                const offset=innerTextRule.depthOffset||0;
                let realTarget=foundElement;
                for(let depthOffset=0;depthOffset<offset;depthOffset++){
                    realTarget=realTarget.parentElement||null;
                }
                if(realTarget){
                    realTarget.remove();
                }
            console.log(`Removing element ${innerTextRule.querySelector} with inner text ${innerTextRule.innerText} done...`); 
        }
    ].map(func=>{
        if (Array.isArray(rule[func.name])) {
            rule[func.name].map(rule=>func(rule));
        }
    });

    console.log(`Cleaning complete for ${rule.name}!`);
}