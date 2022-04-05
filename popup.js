// Initialize butotn with users's prefered color

/*chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});*/

// When the button is clicked, inject setPageBackgroundColor into current page
/*changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});*/
botEmail="";
botPass="";
targetedEmails=[];
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
/*chrome.runtime.onInstalled.addListener((se) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: 'onboarding.html'
    });
  }
});*/
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}


 /*async function openYahooTab(){
  var newURL = "https://login.yahoo.com/";
     chrome.windows.create({
      url:newURL
      
    },async function(){
      await sleep(10000)
      chrome.tabs.query({currentWindow: false, active: true,lastFocusedWindow: true}, function (tabs){   
          var activeTab = tabs[0];
          alert(activeTab.url) 
        chrome.tabs.sendMessage(activeTab.id, {"Action": "sendNotification"});
       });
  })
  }*/
  function stopPeep(){
    console.log("inpeep");
    return fetch("http://localhost:8080/peep",
    {
      method:'post',
              headers: { "Content-Type": "application/json",
              'Accept': 'application/json'
              },
              body:JSON.stringify("test")
    }    
    )/*.then((response)=>response.text() )
    .then(
       body =>{
        console.log(body)
        console.log("sucessedLoaded");
      }
    )*/
  
    }
  function startProcess(){
    chrome.runtime.sendMessage({Action:"startProgram"})
  }
  function stopProcess(){
    chrome.runtime.sendMessage({Action:"stopProgram"})
  }
  document.getElementById("Stop").addEventListener('click',
      stopProcess);
  document.getElementById("Start").addEventListener('click',
      startProcess);
      document.getElementById( "StopPeep").addEventListener('click',
      stopPeep);
     
/*function callTest(){
  chrome.runtime.sendMessage({Action:"test"})
}
document.getElementById('test').addEventListener('click',
    callTest);
// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("updatedCardsData", ({ updatedCardsData }) => {
    alert(updatedCardsData)
  });
}*/
