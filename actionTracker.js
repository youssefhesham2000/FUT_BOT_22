/*
console.log("tracker worked");
let currentURL=""
var crisisTracker
let sendingStatusTracker
chrome.runtime.onMessage.addListener(async function(response, sender, sendResponse) {  
  if(response.Action.localeCompare("startChecking")==0){
   await track()
  }
});
while(true){
  if(sendingStatusTracker.localeCompare("openYahoo")){
    setEmailStatusTracker("yahooIsOpened")
    openYahooEmailTracker()
    
  }
  else if(sendingStatusTracker.localeCompare("yahooIsOpened")==0){
    logEmail()
  }
  else if(sendingStatusTracker.localeCompare("putPass")==0){
    putPass()
  }
  else if(sendingStatusTracker.localeCompare("gotIn")==0){
    getURL()
    await sleep(1000)
    if(currentURL.includes("https://maktoob.yahoo.com/")){
      var maktoob=document.getElementsByClassName("ybarMailLink")
        maktoob[0].click()
    }
    else if(currentURL.includes("https://mail.yahoo.com/")){

    }
  } 
}
function checkMail(){
  var mail=document.getElementsByClassName("H_A hd_n p_a L_0 R_0")
  
}
async function getURL(){
  await sleep(1000)
  chrome.runtime.sendMessage({Action:"getURL"}, function(response) {
      currentURL=response.url
    }); 
} 
async function track(){
    console.log("in action");
      openYahooEmailTracker()
}
function getCrisisTrackingStatus(){
  chrome.storage.sync.get("crisisStatus",({crisisStatus})=>{
    crisisTracker=crisisStatus
})
}
async function getEmailStatusTracker(){
  chrome.storage.sync.get("sendingEmailStatus",({ sendingEmailStatus })=>{
    sendingStatusTracker=sendingEmailStatus;
  })
}
async function setEmailStatusTracker(state){
  chrome.runtime.sendMessage({Action:"setEmailStat",STATE:state}, function(response) {  });
}

async function openYahooEmailTracker(){
  console.log("content ");
  chrome.runtime.sendMessage({Action:"openYahoo"},async function(response) {
  });
  await sleep(5000)
  await getPageURL()
  await sleep(1000)
  console.log(pageURL);
  yahooCheck=document.getElementsByClassName("js grid light-theme ")
  if(yahooCheck.length==0&&!pageURL.localeCompare(maktoobURL)==0){
    //get to get out of maktoob to mail
  }
  if(pageURL===yahooURL){
    await logEmail()
    return
  }
    await getEmailStatusTracker()
    await sleep(1500)
    console.log(sendingStatusTracker);
    if(sendingStatusTracker.localeCompare("loggedIn")==0){
      await putPass()
      return
    }
    else if(sendingStatusTracker.localeCompare("gotIn")==0){
      
       chrome.runtime.sendMessage({Action:"sendEmail"}, function(response) {  }); 
    }
    else if(sendingStatusTracker.localeCompare("sendEmail")==0){
      await sendEmail()
      setCrisisStatusTracker("END")
      chrome.runtime.sendMessage({Action:"setOpenYahooVar"}, function(response) {  }); 
    }
  } 
  async function sendEmail(){
    await sleep(3000)
    listButtonElements=document.getElementsByClassName("hd_n P_0 M_0");
    listButtonElements[0].children[3].children[0].children[1].click();
    await sleep(7000)
    draftContentElements=document.getElementsByClassName("M_0 P_0 ");
    console.log(draftContentElements);
    draftContentElements[14].childNodes[2].childNodes[0].click() 
    await sleep(5000)
    sendButtonElements=document.getElementsByClassName("q_Z2aVTcY e_dRA k_w r_P H_6VdP s_3mS2U en_0 M_1gLo4F V_M cZ1RN91d_n y_Z2hYGcu A_6EqO u_e69 b_0 C_52qC I4_Z29WjXl it3_dRA");
    console.log(sendButtonElements);
    sendButtonElements[0].click()

  }
  function setCrisisStatusTracker(state){
    chrome.runtime.sendMessage({Action:"setCrisis",STATE:state},async function(){})
  }
  async function putPass(){
    await sleep(10000)
  passElement=document.getElementById("login-passwd")
  passElement.value=botpass
  setEmailStatusTracker("gotIn")
  await sleep(2000)
  document.getElementById("login-signin").click()
  

  }
  async function getEmailStatus(){
    chrome.storage.sync.get("sendingEmailStatus",({ sendingEmailStatus })=>{
      sendingStatus=sendingEmailStatus;
    })
  }
  async function logEmail(){
    var changeStat=true
    await sleep(3000)
    var anotherAcc=document.getElementsByClassName("pure-button puree-button-link add-account page-button-link")
    console.log(anotherAcc);
    if(anotherAcc.length!=0){
      setEmailStatusTracker("yahooIsOpened")
      await sleep(1000)
      anotherAcc[0].click()
    }
  await sleep(1000)  
  console.log("first");
  emailElement=document.getElementById("login-username")
  emailElement.value=botEmail
  await sleep(2000)
  setEmailStatusTracker("putPass")
  document.getElementById("login-signin").click()

  } 
//figure it's role
/*chrome.runtime.onMessage.addListener( 
    function(request,sender,sendResponse){
      console.log("sucess message");
      if(request.Action==="updateMaxData"){
       console.log("got in");
       chrome.storage.sync.get("DataAttribute",({ DataAttribute })=>{
       
        data=DataAttribute;
        console.log(data);
      })
      }
    }
     )
*/