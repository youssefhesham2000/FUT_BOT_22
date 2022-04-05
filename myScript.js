/*chrome.storage.sync.get("updatedCardsData", ({ updatedCardsData }) => {
    console.log(updatedCardsData)
  });
var arr=new Array()
arr=document.getElementsByClassName("_1gbd")
var buttonId=arr[0].id
document.getElementById(buttonId).click()*/
//logIn(
//openYahooEmail()
var data
var bought=false
var lowBid=false
var crisis=""
var wait=true
var listIsFull=false
var events
var marketBuyingLimit=false
var pricesAndDetailsStatus=false
let sendingStatus
var pageURL;
var buyingLimitMsg="Your Transfer Targets list is full. Please try again later, or clear items from your Watched and Active list."
var yahooURL="https://login.yahoo.com/"
var maktoobURL="https://maktoob.yahoo.com/?p=us"
var higherBidderMsg="You are already the highest bidder. Are you sure you want to bid?"
var bidTooLowMsg="Your bid must be higher than the current bid"
var banMsg="Too many actions have been taken, and use of this feature has been temporarily disabled."
//getBackFromTransfare()
function closeTab(){
  chrome.runtime.sendMessage({Action:"closeTab"},async function(){})
}



 
async function initAlarm(){
  return fetch("http://localhost:8080/compose",
  {
    method:'post',
            headers: { "Content-Type": "application/json",
            'Accept': 'application/json'
            },
            body:JSON.stringify("test")
  }    
  )
  }
async function detectTransfareListFull(){
  var disable=document.getElementsByClassName("ut-button-group")
  console.log(disable);
  if(disable.length!=7){
    console.log("true");
    return true
  }
  console.log("false");
  return false
}
async function testTracker(){
  while(true){
    console.log(crisis);
    await sleep(2500)
    getCrisisStatus()
    console.log(crisis);
  }
}

/**
 * listeners
 * 
 */

  chrome.runtime.onMessage.addListener(async function(response, sender, sendResponse) {  
   console.log(response.Action.localeCompare("startInitialization"));
    if(response.Action.localeCompare("startInitialization")==0){ 
     console.log("in init listener");
      await initializeState()
    }
  
  });
  chrome.runtime.onMessage.addListener(async function(response, sender, sendResponse) {  
    if(response.Action.localeCompare("startMainProcess")==0){
      setEventsStatus("startBuying")
      await sleep(1000)
      await mainSystemDecider() 
    }
  });

/**
 * 
 * end of listeers
 */
/*async function detectCaptcha(){
  await sleep(5000)
  var captchaCheck=document.getElementsByClassName("ut-fun-captcha-required ut-login-generic")
  console.log(captchaCheck);
  if(captchaCheck.length!=0){
    return true
  }
  return false
}*/


async function testStateTransaction(){
  getEventStatus()
  await sleep(1000)
  console.log(events);
} 
async function initializeState(){
  console.log("in initilization");
  getData()
  await sleep(1000)
  getIntoMarket()
  await sleep(3000)
  getIntoTransfareList()
  await sleep(3000)
  clearSold()
  await sleep(1000)
  await resellAll()
  await sleep(1000)
  getIntoMarket()
  await sleep(1000)
   getIntoTransfareTarget()
  await sleep(1000)
  await clearLostBits()
  await sleep(1000)
  await sellingProcess()
  
  await sleep(1000)
  getIntoMarket()
  setEventsStatus("initialized")
 setCrisisStatus("") 
 await sleep(1000)
}
/*
stop Utils

*/
function EndInterupt(){
  getCrisisStatus()
  console.log(crisis);
  if(crisis.localeCompare("END")==0){
    console.log(crisis);
    return true
  }
  return false
} 

/**
 * 
 * End of stop Utils
 */
/**
 * 
 * emergency stop to check crisis state 
 * 
 * 
 * 
 */
async function mainSystemDecider(){
  getEventStatus()
  getCrisisStatus()
  await sleep(1000)
  if(crisis.localeCompare("END")==0){
    return
  }
  while(events.localeCompare("emergencyStop")!=0){
    getEventStatus()
    await sleep(1500)
    if(events.localeCompare("startBuying")==0){
     await sleep(1000)
      getIntoSearch()
      if(EndInterupt()){
        return
      }
      await sleep(500)
      await assignMaxSearchPrice()
      if(EndInterupt()){
        return
      }
      await sleep(1000)
      await buyingProcess()
      if(EndInterupt()){
        return
      }
      setEventsStatus("startSelling")
      await sleep(1000)
      console.log(events);
      if(EndInterupt()){
        return
      }
      await sleep(1000)
      getIntoMarket()
      if(EndInterupt()){
        return
      }
    }
    else if(events.localeCompare("startSelling")==0){
      if(EndInterupt()){
        return
      }
      getIntoTransfareTarget()
      await sleep(1000)
      if(EndInterupt()){
        return
      }
      await sellingProcess()
      await sleep(1000)
      getIntoMarket()
      await sleep(1000)
      //check if to buy or wait
      await sleep(500)
    }
    else if(events.localeCompare("waitForSelling")==0){
      if(checkTransfareListLimit()<100){//buy again
        console.log("less than 100");
        setEventsStatus("startBuying")
        await sleep(500)
      }
      else{
        while(checkTransfareListLimit()>50&&wait){
          console.log("more than 100");
          await sleep(10000)//check for captcha check what to do
          console.log("waiting");
          getIntoTransfareList()
          await sleep(1000)
          clearSold()
          await sleep(1000)
          getIntoMarket()
          await sleep(1000)
        }
        //check max unsold
        getIntoTransfareList()
        await sleep(500)
        if(checkUnSoldLimit()>=data.MaxDataAttributes.MaxUnsold){
          //notify
          setCrisisStatus("unsolAlarm")
          setEventsStatus("emergencyStop")
          await sleep(500)

        }else{
          getIntoMarket()
          await sleep(500)
          setEventsStatus("startBuying")
          await sleep(500) 
        }
      }        
      }
      getEventStatus()
      console.log(events);
    await sleep(1000)
    }

    getEventStatus()
    await sleep(500)
  getCrisisStatus()
  await sleep(1000)
  if(crisis.localeCompare("lostBidsAlarm")){
     initAlarm()
     setCrisisStatus("END")
     await sleep(15000)
    //end and the user will start it again
  }else if(crisis.localeCompare("unsolAlarm")){//handle
    initAlarm()
    setCrisisStatus("END")
    await sleep(15000)
  }
}
 function checkTransfareListLimit(){
  var listNumObject=document.getElementsByClassName("value")
  console.log(listNumObject[0].childNodes[0].textContent);
  return listNumObject[0].childNodes[0].textContent
}
/**
 *  start program check what to do first:
 *      to initialize by selling and clearing 
 * 
 * events var detect what to do next  
 * states:
 * buy
 * sell
 * limit exceded:
 *        open yahoo
 *        sendEmail
 * captcha solving
 * log in FUT then captcha
 *  to stop program put events to emergencyStop 
 *  crisis handler to handle log out or ban or captcha
 * 
 * 
 * 
 * 
 */
/*
buyingUtils
*/ 
function testBitPriceLower(){
  inputsELements=document.getElementsByClassName("numericInput filled")
  if(inputsELements[0].value<data.cardPricesAndDetails.BidBuyTo){
    inputsELements[0].value=data.cardPricesAndDetails.BidBuyTo
    return true
  }
  return false
}
function testBitPrice(){
  inputsELements=document.getElementsByClassName("numericInput filled")
  return (inputsELements[0].value==data.cardPricesAndDetails.BidBuyTo)
}
async function buySelectedCard(i){
  await sleep(800)
 if( testBitPrice()){
    makeBidButton=document.getElementsByClassName("btn-standard call-to-action bidButton"); 
    await simulateClick(makeBidButton[0])
    await sleep(1000)
    console.log("bought");
    
  }else if(testBitPriceLower()){
    makeBidButton=document.getElementsByClassName("btn-standard call-to-action bidButton"); 
    await simulateClick(makeBidButton[0])
    await sleep(1000)
    console.log("bought");
    bought=true
  }
  else{
    i--;
  }
  return i
}
async function selectCard(i,playersList){
  simulateClick(playersList[0].children[i])
}
async function bidTooLow(){
  await sleep(300)
  var bidLowObject=document.getElementsByClassName("ea-dialog-view--msg")
  console.log(bidLowObject);
  console.log(bidLowObject[0].childNodes[0].textContent);
  if(bidLowObject[0].childNodes[0].textContent.localeCompare(bidTooLowMsg)==0){
    lowBid=true
    await buyingLimitOkClick()
    return true
  }
  return false

}
 async function isBanned(card){
   await sleep(500)
   console.log(card);
  if(!card.classList.contains("expired")&&!card.classList.contains("highest-bid")&&!card.classList.contains("outbid")){
    console.log("true");
    return true
  }
  return false
  
}
async function detectBan(){
  var msgObj=document.getElementById("NotificationLayer")
  if(msgObj.childNodes.length!=0){
    console.log(msgObj);
  console.log(msgObj.childNodes[0].childNodes[0].textContent);
    if(msgObj.childNodes[0].childNodes[0].textContent.localeCompare(banMsg)==0){
      console.log("true");
      return true
    }
  }
  console.log("false");
  return false
  
}
async function buyingProcess(){
  marketBuyingLimit=false;
  await getData() 
  await sleep(1000)
  quality=await getCardQuality()
  color=await convertQualityToColor(quality)
  console.log(color);
  await sleep(3000)
  console.log(data);
  while(!marketBuyingLimit){
    console.log(quality);
    validIndex=await huntValid(color)
    playersList=document.getElementsByClassName("paginated");
    for(j=0;j<validIndex.length;j++){
      if(EndInterupt()){
       marketBuyingLimit=true
      }
     await pricesStatus()
    if(!isCardExpired(playersList[0].children[validIndex[j]])){
      /*if(pricesAndDetailsStatus){
        returned=stopBuying(i,j,validIndex.length)
        i=returned[0]
        j=returned[1]
      }*/
      await selectCard(validIndex[j],playersList)
      await sleep(1000)
      console.log("valid");
      await buySelectedCard(i)
      await bidTooLow()
      await sleep(500)
     
      if(await detectBan()){
        console.log("inBanned");
        await sleep(600000)
      }
      marketBuyingLimit= await isBuyingLimit()
      await sleep(500)
      if(marketBuyingLimit){
        returned=stopBuying(i,j,validIndex.length)
        i=returned[0]
        j=returned[1]
        setEventsStatus("startSelling")
        await sleep(1000)
      }
    }
    else{
      i--;
    }
  }
  clickNextPage()
}

return
}

function isCardExpired(card){
  return card.classList.contains("expired")
  }
  function stopBuying(j,limit){
    var returned=[]
    j=limit
    returned.push(j)
    return returned
  }
  async function pricesStatus(){
  }
  
   function clickNextPage(){
    nextButton=document.getElementsByClassName("flat pagination next");
    if(nextButton.length!=0){
      simulateClick(nextButton[0])
    }else{
      marketBuyingLimit=true
    }
   
  }
async function assignMaxSearchPrice(){
  await getData()
  await sleep(1000)
  inputList=document.getElementsByClassName("numericInput")
  inputList[1].value=data.cardPricesAndDetails.BidBuyTo
  await sleep(500)
  searchButton=document.getElementsByClassName("btn-standard call-to-action")
  simulateClick(searchButton[0])
  }

async function convertQualityToColor(quality){
  var color
  if(quality.localeCompare("Bronze Common")==0){
    color="rgb(64, 51, 34)"
  }
  else if(quality.localeCompare("Bronze Rare")==0){
    color="rgb(58, 39, 23)"
  }
  else if(quality.localeCompare("Silver Rare")==0){
    color="rgb(38, 41, 42)"
  }
  else if(quality.localeCompare("Silver Common")==0){
    color="rgb(52, 56, 57)"
  }
  else if(quality.localeCompare("Gold Common")==0){
    color="rgb(87, 74, 43)"
  }
  else if(quality.localeCompare("Gold Rare")==0){
    color="rgb(70, 57, 12)"
  }
  return color
}
function checkLowerBid(){
  return parseInt(playersList[0].children[i].children[1].children[1].children[1].childNodes[1].childNodes[0].textContent)<data.cardPricesAndDetails.BidBuyTo
}
function currentBit(playersList,i){
return ((playersList[0].children[i].children[1].children[1].children[1].childNodes[1].childNodes[0].textContent.localeCompare("---"))==0)||checkLowerBid()
}
 function cardColor(playersList,i,color){
  return (playersList[0].children[i].children[1].children[0].children[0].children[7].style.color.localeCompare(color))==0
}
async function huntValid(color) {
  await sleep(2000)
  playersList=document.getElementsByClassName("paginated");
  console.log(playersList);
  await sleep(1000)
  validList=[]
  for(i=0;i<20;i++){
    //check color and bit 
    if(currentBit(playersList,i)&&cardColor(playersList,i,color)){
      validList.push(i)
    }
  }
  if(validList.length==0){
    console.log(validList.length);
    await sleep(1000)
    clickNextPage()
    return await huntValid(color)
  }
  else if(validList.length!=0) {
    return validList
  }
}
async function isBuyingLimit(){
  msgBox=document.getElementsByClassName("ea-dialog-view--msg")
  console.log(msgBox);
  console.log(msgBox[0].childNodes[0].textContent);
  if(msgBox[0].childNodes[0].textContent.localeCompare(buyingLimitMsg)==0){
    await buyingLimitOkClick()
    await sleep(1000)
    return true
  }
  return false
}
async function buyingLimitOkClick(){
  buttons =document.getElementsByTagName("button")
  console.log(buttons);
  simulateClick(buttons[buttons.length-1])
}
function stopSelling(limit){
  return limit
}
/*end of buying Utils-------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------*/ 

/*download and fetch fns-----------------------------------------------------------------------------------------------------------------------*/ 
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
/*
log in utils---------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------
*/
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
/*
end of log in utils---------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------
*/
/*
 selling  utils---------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------
*/
async function checkUnSoldLimit(){
 await sleep(20000)
  var listObject=document.getElementsByClassName("itemList")
  console.log(listObject[1].children.length);
  return listObject[1].children.length
}
async function solveSellingError(){
  getData()
  await sleep(2500)
  var listObj=document.getElementsByClassName("itemList")
  console.log(listObj);
  var j=0
  if(listObj[2].length!=0){
    while(listObj[2].length!=0){
      await selectCard(j,listObj[2])
      await sleep(1000)
      j=j+1
      await sellWonItems()
      await sleep(1000)

    }
    
  }
}
async function sellingProcess(){
 getData()
  await sleep(2500)
  while(await activeBidsNum()!=0){
    await sleep(2500)
  }
  if(await activeBidsNum()==0){
    console.log("first");
    console.log(LostBitsLimit());
    console.log(await getNumOfLostBids());
    if(await getNumOfLostBids()>= LostBitsLimit()){
      //TO DO: NOTIFY USING EMAIL
      //changeState to open yahoo and send email  
      console.log("seond");
      setEventsStatus("emergencyStop")
      await sleep(500)
      setCrisisStatus("lostBidsAlarm")
      await sleep(1000)
      return
    }
    else{
      console.log("else");
      if(getNumOfLostBids()!=0){
       await clearLostBits()
      }
      wonList=await acessWonItems()
      listLength=wonList.children.length
      console.log(wonList);
      while(wonList.children.length!=0&&!listIsFull){
        await pricesStatus()
        /*if(pricesAndDetailsStatus){
          i=stopSelling(listLength)
        }*/
        if(EndInterupt()){
          listIsFull=true
        }
        console.log("in for");
        listIsFull=await detectTransfareListFull()
        if(!listIsFull){
          await sellWonItems()
        }
        listIsFull=await detectTransfareListFull()
        console.log(listIsFull);
        await sleep(3000)
      }
      console.log("getting out of selling");
      setEventsStatus("waitForSelling")
      await sleep(1000)
      return
    }
  }
}
 async function clearLostBits(){
   if(await getNumOfLostBids()!=0){
    clearButton=document.getElementsByClassName("btn-standard section-header-btn mini call-to-action")
    simulateClick(clearButton[3])
    await sleep(1000)
   }
 
}
async function getNumOfLostBids(){
  lists=document.getElementsByClassName("itemList")
  console.log(lists);
  return lists[3].children.length
}
async function getNumOfUnsold(){
  await sleep(20000)
  unsoldList=document.getElementsByClassName("itemList")
  console.log(unsoldList[1].children.length);
  return unsoldList.length
}
async function activeBidsNum(){
  activeBidsList=document.getElementsByClassName("itemList")
  console.log(activeBidsList);
  console.log(activeBidsList[0].children.length);
  return activeBidsList[0].children.length
}
async function resellAll(){
  var unSoldList=document.getElementsByClassName("itemList")
  console.log(unSoldList);
  if(unSoldList[1].children.length!=0){
    listIsFull=false
  resellButton=document.getElementsByClassName("btn-standard section-header-btn mini call-to-action")
  console.log(resellButton);
  simulateClick(resellButton[1])
  await sleep(500)
  divElement=document.getElementsByClassName("ut-button-group")
  console.log(divElement);
  simulateClick(divElement[6].children[1])
  }
}
async function acessWonItems(){
 await sleep(1000)
  itemLists=document.getElementsByClassName("sectioned-item-list");
  console.log(itemLists);
  wonList=itemLists[2].children[1]
  return wonList
}
async function sellWonItems(){
  listOnTransfareButton=document.getElementsByClassName("accordian")
  console.log(listOnTransfareButton);
  simulateClick(listOnTransfareButton[0])
  await sleep(1000)
  await setSellingAttributes()
  sellButton=document.getElementsByClassName("btn-standard call-to-action")
  console.log(sellButton);
  await sleep(1000)
  simulateClick(sellButton[4])
  //see when listing is phorbiding
}
 function clearSold(){
  var soldList=document.getElementsByClassName("itemList")
  console.log(soldList);
  if(soldList[0].childNodes.length!=0){
    clearButtons=document.getElementsByClassName("btn-standard section-header-btn mini call-to-action")
    console.log(clearButtons);
    listIsFull=false;
    simulateClick(clearButtons[0])
  }
  
}
async function setSellingAttributes(){
  getData()
  await sleep(1000)
  inputsElements=document.getElementsByClassName("numericInput filled")
  console.log(inputsElements);
  inputsElements[0].value=data.cardPricesAndDetails.BidSell//set to be selling price
  inputsElements[1].value=data.cardPricesAndDetails.ByNowSell//set to be by Now price
 //to DO: figure how to click the fucking list li 
  //simulateClick(durationList.children[1])
  await sleep(1000)
  
}
/*
end of selling  utils---------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------
*/
/*async function getStarted(){
  chrome.runtime.sendMessage({Action:"initialize"},async function(){
    await sleep(1000)
    chrome.storage.sync.get("eventStatus",({eventStatus})=>{
      events=eventStatus
  })
  await sleep(1000);
  })
}*/
function setEventsStatus(state){
  chrome.runtime.sendMessage({Action:"setState",STATE:state},async function(){})
}

function getEventStatus(){
  chrome.storage.sync.get("eventStatus",({eventStatus})=>{
    events=eventStatus
})
}
function setCrisisStatus(state){
  chrome.runtime.sendMessage({Action:"setCrisis",STATE:state},async function(){})
}

function getCrisisStatus(){
  chrome.storage.sync.get("crisisStatus",({crisisStatus})=>{
    crisis=crisisStatus
})
}
/*navigation Utils-------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------*/ 
function getBackFromTransfare(){
  var buttons=document.getElementsByClassName("ut-navigation-button-control")
  console.log(buttons);
  simulateClick(buttons[0])
}
 function getIntoMarket(){
  ///might be removed later
  transfareButtons=document.getElementsByClassName("ut-tab-bar-item icon-transfer");
  console.log( transfareButtons);
  console.log( transfareButtons[0]);
  simulateClick( transfareButtons[0]) 
}
 function getIntoSearch(){
  searchButton=document.getElementsByClassName("tile col-1-1 ut-tile-transfer-market")
  console.log(searchButton);
  console.log(searchButton[0]);
  simulateClick(searchButton[0])
}
function getIntoTransfareList(){
  transfareListButton=document.getElementsByClassName("tile col-1-2 ut-tile-transfer-list")
  console.log(transfareListButton);
  simulateClick(transfareListButton[0])
}
 function getIntoTransfareTarget(){
  transfareTargetDiv=document.getElementsByClassName("tile col-1-2 ut-tile-transfer-targets");
simulateClick(transfareTargetDiv[0]);
}
/*end of navigation*/ 


function LostBitsLimit(){
  return data.MaxDataAttributes.MaxLostBits
}
async function getCardQuality(){
  return data.cardPricesAndDetails.cardQuality+" "+ data.cardPricesAndDetails.cardRarity
}
function getCardPosition(){
  return data.cardPricesAndDetails.position
}
function getCardLeague(){
  return data.cardPricesAndDetails.tournment
}
function cardQualitySearch(list){
return list[0].children[0].childNodes[1].childNodes[0].textContent
}
function cardPositionSearch(list){
  return list[0].children[5].childNodes[1].childNodes[0].textContent
}
  function cardLeagueSearch(list){
    return list[0].children[list[0].children.length-1].childNodes[1].childNodes[0].textContent
}
//still not working
function liClick(htmlElement){
var evt = document.createEvent("MouseEvents")
evt.initMouseEvent("mousedown", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
htmlElement.dispatchEvent(evt);
}
async function checkPlayerBio(){
  //returns 0 if it's suitable to buy
  getData()
  playerBioButton=document.getElementsByClassName("more")
  simulateClick(playerBioButton[0])
  await sleep(800)
  playerBioInfo=document.getElementsByClassName("pseudo-table")
  return(Math.abs(getCardQuality().localeCompare(cardQualitySearch(playerBioInfo)))
 /* +Math.abs(getCardLeague().localeCompare(cardLeagueSearch(playerBioInfo)))
  /*+(getCardPosition().localeCompare(cardPositionSearch(playerBioInfo)))
  */)
  
}
async function putSearchAttributes(){
  getData()
  await sleep(20000)

  /*qualityObject=document.getElementsByClassName("ut-item-search-view")
  console.log(qualityObject);
  simulateClick(qualityObject[0].children[2].children[0])
  await sleep(3000)
  qualities=document.getElementsByClassName("inline-list")
  console.log(qualities);
  await sleep(3000)
  console.log(document.querySelector("body > main > section > section > div.ut-navigation-container-view--content > div > div > section.ut-navigation-container-view.ui-layout-right > div.ut-navigation-container-view--content > article > div.ut-pinned-list > div:nth-child(2) > ul:nth-child(2)"))

  simulateClick(qualities[1].children[1])

 /* for(i=1;i<qualities.length;i++){
    if(qualities[i].innerText.localeCompare(getCardQuality())==0){
      console.log(qualities[i].innerText)
      qualities[1].children[1].click()
    }
  }*/
  /*var rect = qualities[1].children[1].getBoundingClientRect();
  console.log(rect);
  click(rect.x,rect.y)
  console.log(document.querySelector("body > main > section > section > div.ut-navigation-container-view--content > div > div.ut-pinned-list-container.ut-content-container > div > div.ut-pinned-list > div.ut-item-search-view > div.inline-list-select.ut-search-filter-control.has-default.has-image.is-open > div > ul > li:nth-child(2)"));
  document.querySelector("body > main > section > section > div.ut-navigation-container-view--content > div > div.ut-pinned-list-container.ut-content-container > div > div.ut-pinned-list > div.ut-item-search-view > div.inline-list-select.ut-search-filter-control.has-default.has-image.is-open > div > ul > li:nth-child(2)").click()
simulateClick(document.querySelector("body > main > section > section > div.ut-navigation-container-view--content > div > div.ut-pinned-list-container.ut-content-container > div > div.ut-pinned-list > div.ut-item-search-view > div.inline-list-select.ut-search-filter-control.has-default.has-image.is-open > div > ul > li:nth-child(2)"))
*/
}

//end of not working

/*
returns true if the cards class contains expired Class
*/ 


async function simulateClick(htmlObject){
 console.log(htmlObject);
  htmlObject.dispatchEvent(new MouseEvent('mousedown'))
  htmlObject.dispatchEvent(new MouseEvent('mouseup'))
}
async function getData(){
  chrome.storage.sync.get("DataAttribute",({ DataAttribute })=>{
    data=DataAttribute;
  })
}



//sendEmail() and Notificationss
/*async function getPageURL(){
  await sleep(1000)
  chrome.runtime.sendMessage({Action:"getPageURL"}, function(response) {
      pageURL=response.url
    }); 
} */
async function openYahooEmail(){
  console.log("content ");//to do create a function to get url
  //if(response.tab==="https://login.yahoo.com/"){
  chrome.runtime.sendMessage({Action:"openYahoo"},async function(response) {
  });
 /* await sleep(5000)
  await getPageURL()
  await sleep(1000)
  console.log(pageURL);
  yahooCheck=document.getElementsByClassName("js grid light-theme ")
  if(yahooCheck.length==0&&!pageURL.localeCompare(maktoobURL)==0){
    return
  }
  if(pageURL===yahooURL){
    await logEmail()
    return
  }
    await getEmailStatus()
    await sleep(1500)
    console.log(sendingStatus);
    if(sendingStatus.localeCompare("loggedIn")==0){
      await putPass()
      return
    }
    else if(sendingStatus.localeCompare("gotIn")==0){
       var maktoob=document.getElementsByClassName("_yb_1pnjd _yb_vh6vu")
       if(maktoob.length!=0){
         maktoob[0].click()
       }
    }*/
    
  }  
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  var botEmail="youssefhesham2000@yahoo.com"
  var botpass="FUCKYoussef0100"
  targetedEmails=[];
  targetedEmails[0]="aklyoussef27@gmail.com" 
  async function getEmailStatus(){
    chrome.storage.sync.get("sendingEmailStatus",({ sendingEmailStatus })=>{
      sendingStatus=sendingEmailStatus;
    })
  }
  
  
