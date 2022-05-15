const customisationRules=
[
    {
        name:"TVA and Journal montreal adblocker message and scroll",
        active:true,
        urls:[
            "https://www.tvanouvelles.ca/",
            "https://www.journaldemontreal.com/"
        ],
        remove:[
            {
                description:"Removing the annoying pannel",
                querySelector:".popup-adblocker"
            }
            ],
        styles:[
            {
                description:"Removing the blocked scroll",
                querySelector:"body",
                cssRule:"overflow",
                cssValue:"auto"
            }
        ]
    }
];

chrome.runtime.onInstalled.addListener(() => {
    console.clear();
    console.log(`Installation successfull.`);
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