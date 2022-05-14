const annoyingWebsites=[
    "https://www.tvanouvelles.ca/",
    "https://www.journaldemontreal.com/"
];

chrome.runtime.onInstalled.addListener(() => {
    console.clear();
    console.log(`Installation successfull.`);
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
        if(annoyingWebsites.filter(site=>tab.url.startsWith(site)).length>0) {
            console.log("Annoying website detected!")
            chrome.scripting.executeScript(
                {
                    target: { tabId: tab.id },
                    function: applyWebsiteModifications
                },
                ()=>console.log("Pannel successfully removed."),
              );
        }
    }
  })

function applyWebsiteModifications(){
    document.querySelector("body").style.overflow='auto';
    document.querySelector(".popup-adblocker").remove();
    // removeAnnoyingPannel();
    // changeBodyScrollModeToAuto();
}
  