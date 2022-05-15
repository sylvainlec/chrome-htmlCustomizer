let customisationRules=[];
url = chrome.runtime.getURL('rules.json');

fetch(url)
.then((response) => response.json())
.then((json) =>{
    customisationRules=json;
    console.log("Rules successfully loaded.")
});

chrome.runtime.onInstalled.addListener(() => {
    console.clear();
    console.log(`Installation successfull.`);
});

chrome.action.onClicked.addListener(function(tab) {
    const newURL = "options.html";
    chrome.tabs.create({ url: newURL });
    // chrome.action.setTitle({tabId: tab.id, title: "You are on tab:" + tab.id});
  });

chrome.tabs.onUpdated.addListener( function (_, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
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
    }
  })

function applyWebsiteModifications(rule){
    function removeElementBySelector(removeRule){
        document.querySelector(removeRule.querySelector).remove();
        console.log(`Removing element ${removeRule.querySelector} done...`); 
    }
    function changeCssStylingBySelector(styleRule){
        document.querySelector(styleRule.querySelector).style[styleRule.cssRule]=styleRule.cssValue;
        console.log(`Css ${styleRule.cssRule} set to ${styleRule.cssValue} for element ${styleRule.querySelector}...`); 
    }

    rule.remove.map(r=>removeElementBySelector(r));
    rule.styles.map(s=>changeCssStylingBySelector(s));

    console.log("Cleaning complete!");
}