var open=true;
var botEmail="EMAIL"
var botpass="pass"
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {  
  if(response.Action.localeCompare("setState")==0){
    console.log("change state");
    console.log(response.STATE);
  let eventStatus=response.STATE
  chrome.storage.sync.set({ eventStatus }); 
  if(eventStatus.localeCompare("initialized")==0){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id,{Action:"startMainProcess"} , function(response) {});  
  });
  }
  }
});
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {  
  if(response.Action.localeCompare("setCrisis")==0){
    console.log("change crisis");
    console.log(response.STATE);
  let crisisStatus=response.STATE
  chrome.storage.sync.set({ crisisStatus }); 
  }
});

chrome.runtime.onMessage.addListener(
  function(response, sender, sendResponse) {
    if (response.Action === "setOpenYahooVar"){
      open=true
    }
  }
);
chrome.runtime.onMessage.addListener(
  function(response, sender, sendResponse) {
    if (response.Action === "openYahoo"&&open){
      open=false
      var newURL = "https://login.yahoo.com/";
      chrome.tabs.create({ url: newURL });
    }
  }
);
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
  if(response.Action.localeCompare("startProgram")==0){
    console.log("in start");
    let crisisStatus=""
    chrome.storage.sync.set({ crisisStatus });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id,{Action:"startInitialization"} , function(response) {});  
  });
    console.log("sent");
  }
})
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
  if(response.Action.localeCompare("stopProgram")==0){
    console.log("in stop");
    let crisisStatus="END"
    chrome.storage.sync.set({ crisisStatus }); 
  }
})
//set update status t activate interrupts
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
  if(response.Action==="updatePricesData"){
    console.log("in back");
    var pricesAndDetailsUpdated=true
    chrome.storage.sync.set({ pricesAndDetailsUpdated });

  }
})
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {  
  if(response.Action.localeCompare("loggedIn")==0){
    var sendingEmailStatus="loggedIn"
    chrome.storage.sync.set({ sendingEmailStatus });
  }
})
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {  
  if(response.Action.localeCompare("setEmailStat")==0){
    var sendingEmailStatus=response.STATE
    chrome.storage.sync.set({ sendingEmailStatus });
  }
})
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {  
  if(response.Action.localeCompare("closeTab")==0){
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
      //'tabs' will be an array with only one element: an Object describing the active tab
      //  in the current window. To remove the tab, pass the ID: to chrome.tabs.remove().
      chrome.tabs.remove(tabs[0].id);
    });
  }
})

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {  
  if(response.Action.localeCompare("gotIn")==0){
    var sendingEmailStatus="gotIn"
    chrome.storage.sync.set({ sendingEmailStatus });
  }
})
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {  
  if(response.Action.localeCompare("setLoggedIn")==0){
    var logInVar=response.STATE
    chrome.storage.sync.set({ logInVar});
  }
})
//url tracker listener
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {  
  if(response.Action.localeCompare("getPageURL")==0){
    var URL;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
       URL= activeTab.url.toString() ;
      console.log(URL); // or do whatever you need
      sendResponse({url:URL})
   });
   console.log(URL)
  }
  return true
})

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {  
  if(response.Action.localeCompare("getURL")==0){
    var URL;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
       URL= activeTab.url.toString() ;
      console.log(URL); // or do whatever you need
      sendResponse({url:URL})
   });
  }
  return true
})

chrome.storage.sync.get("DataAttribute",({ DataAttribute })=>{
  var data=DataAttribute;
  console.log(data);
  })
