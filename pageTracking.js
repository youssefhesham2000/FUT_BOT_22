console.log("i worked");
let mainURL="https://www.ea.com/en-gb/fifa/ultimate-team/web-app/"
let returnedURL
let authMsg="Unable to authenticate with the FUT servers. You will now be logged out of the application."
let pageStatus="Home"
let logMsg="Getting Started"
var pass
var loggedIn=false
var dataLog
trackTheSiteStatus()
async function getDataLog(){
  chrome.storage.sync.get("DataAttribute",({ DataAttribute })=>{
    dataLog=DataAttribute;
  })
}
    async function detectCaptcha(){
      await sleep(3000)
      var funCaptchObj=document.getElementById("fc-iframe-wrap")
      await sleep(500)
      console.log(funCaptchObj);
     console.log(typeof funCaptchObj);
      if(funCaptchObj!==null){
      /*  //callcaptcha
        await sleep(500)
        var iFrame=document.getElementsByClassName("fc-iframe-wrap")
        console.log(iFrame[0].contenWindow);
        /*var IDoc=iFrame.document
        console.log(IDoc);s
        console.log(iFrame.getElementById("triggerLiteMode"));*/
        console.log("captcha detected");
        
        /* console.log(iFrame);
        var verify=iFrame.getElementById("triggerLiteMode")
        console.log(verify);
        simulateClick(verify)*/
        await sleep(1000)
        return true
      }
      return false
    }
async function detectAuth(){
  var MsgObject=document.getElementsByClassName("ea-dialog-view--msg")
  if(MsgObject[0].childNodes[0].textContent.localeCompare(authMsg)==0){
    await authOkClick()
    await sleep(1000)
    return true
  }
  return false
}
function setLoggedIn(state){
  chrome.runtime.sendMessage({Action:"setLoggedIn",STATE:state},async function(){})
}

async function authOkClick(){
  buttons =document.getElementsByTagName("button")
  console.log(buttons);
  simulateClick(buttons[buttons.length-1])
}
function stopSelling(limit){
  return limit
}
async function logClick(){
  var button=document.getElementsByClassName("btn-standard call-to-action")
  simulateClick(button[0])
}
async function detectLogIn(){
  await sleep(3000)
  
  var logDetector=document.getElementsByClassName("flat alt camel-case")
  if(logDetector.length!=0){
    var button=document.getElementsByClassName("btn-standard call-to-action")
    if(!button[0].classList.contains("disabled")){
      setLoggedIn(true)
      setCrisisStatusPageTracker("END")
      await sleep(1000)
      await logClick()
      
      return true
    }
    
  }
  return false
}
async function LoadDraftsFetch(){
  return fetch("http://localhost:8080/compose",
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
async function toData(url){
  return fetch(url).then((response)=>{
    return response.blob();
  }).then(blob=>{
    return URL.createObjectURL(blob)
  })
}
async function download(url){
  await sleep(10000)
  const a=document.createElement("a")
  a.href=await toData(url)
  a.download=""
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
async function trackTheSiteStatus(){
   while(true){
    await sleep(2000)
    await getURL()
    await sleep(1000)
    if(returnedURL.localeCompare(mainURL)==0){
        console.log("working fine");
      if(await detectAuth()){
        setCrisisStatusPageTracker("END")
        await sleep(1000)
      }
       await detectLogIn()
      if(await detectCaptcha()){
        console.log("in captcha solving");
        LoadDraftsFetch()
      }
      chrome.storage.sync.get("logInVar",({ logInVar })=>{
        loggedIn =logInVar;
        
        })
      if(!await detectCaptcha()&&loggedIn){
        setLoggedIn(false)
        chrome.runtime.sendMessage({Action:"startProgram"})
      }

    }
    else if(returnedURL.includes("https://signin.ea.com/")){
        console.log("logIn Needed");
        getDataLog()
        await sleep(1000)
        //setCrisisStatusPageTracker("END")
        logInFUT(dataLog.AccountInfo.passWord)
        setCrisisStatusPageTracker("")
        await sleep(500)
        await getURL()
        await sleep(1000)
       /* if(returnedURL.localeCompare(mainURL)==0){//check for captcha also inside the if 
            chrome.runtime.sendMessage({Action:"startProgram"})
        }/*
        else if captcha  : solve it 
        */
        
        
        
    }
    /*
    else if(){
        //compare with log in and call associate fns
    }
    else if(){
        //compare with captcha and call download and fetch fn's
    }*/
}
}
async function logInFUT(pass){
    await sleep (10000)
   /* logInButton=document.getElementsByClassName("btn-standard call-to-action")
    console.log(logInButton);
    await simulateClick(logInButton[0])*/
    passInput=document.getElementById("password")
    passInput.value=pass
    await sleep(1500)
    signInButton=document.getElementsByClassName("origin-ux-element origin-ux-button     origin-ux-button-primary  btn-next origin-ux-button-primary-purple")
    console.log(signInButton);
   signInButton[0].click()
  }
function setCrisisStatusPageTracker(state){
    chrome.runtime.sendMessage({Action:"setCrisis",STATE:state},async function(){})
  }
async function getURL(){
    await sleep(1000)
    chrome.runtime.sendMessage({Action:"getURL"}, function(response) {
        returnedURL=response.url
      }); 
} 

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }