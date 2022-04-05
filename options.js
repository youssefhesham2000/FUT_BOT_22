let positions=["Any","Defender","MidField"]
class AccountInfo{
  constructor(passWord){
    this.passWord=passWord
  }
}
class MaxDataAttributes{
  constructor(MaxLostBits,MaxUnsold,MaxPerDay){
    this.MaxLostBits=MaxLostBits
    this.MaxUnsol=MaxUnsold
    this.MaxPerDay=MaxPerDay
  }
}
class cardPricesAndDetails{
  constructor(cardQuality,cardRarity,BidBuyTo,BidSell,ByNowSell){
    //this.tournment=tournment
    this.cardQuality=cardQuality
    //this.position=position
    this.cardRarity=cardRarity
    //this.BidBuyFrom=BidBuyFrom
    this.BidBuyTo=BidBuyTo
    //this.ByNowBuyFrom=ByNowBuyFrom
    //this.ByNowBuyTo=ByNowBuyTo
    this.BidSell=BidSell
    this.ByNowSell=ByNowSell
    //this.Duration=Duration
  }
}
class Data{                                            //toDo: add tournment
  constructor(cardPricesAndDetails,MaxDataAttributes,AccountInfo){
    this.cardPricesAndDetails=cardPricesAndDetails
    this.MaxDataAttributes=MaxDataAttributes
    this.AccountInfo=AccountInfo
  }
}
function getMaxAttributes(){
  MaxPDay=document.getElementById("MaxPerDay").value;
  MaxLostBits=document.getElementById("MaxLostBIts").value;
  MaxUnsold=document.getElementById("MaxUnsold").value;
  let updated=new MaxDataAttributes(MaxLostBits,MaxUnsold,MaxPDay);
  return updated
}
function getAccountAttributes(){
  passWord=document.getElementById("Password")
  let info=new AccountInfo(passWord)
  return info
}
function getPricesAttributes(){
  //tournment=document.getElementById("Tournment").value
  cardQuality=document.getElementById("quality").value
  //position=document.getElementById("position").value
  cardRarity=document.getElementById("rarity").value
  //BidBuyFrom=document.getElementById("BidFromPrice").value
  BidBuyTo=document.getElementById("BidToPrice").value
  //ByNowBuyFrom=document.getElementById("ByNowFromPrice").value
  //ByNowBuyTo=document.getElementById("ByNowToPrice").value
  BidSell=document.getElementById("BidSellPrice").value
  ByNowSell=document.getElementById("ByNowSellPrice").value
  //Duration=document.getElementById("Duration").value
  let updated=new cardPricesAndDetails(cardQuality,cardRarity,BidBuyTo,BidSell,ByNowSell);
  return updated
}
function setData(){
  var DataAttribute=new Data(getPricesAttributes(),getMaxAttributes(),getAccountAttributes());
  chrome.storage.sync.set({ DataAttribute });
  console.log("setting");
  var pricesAndDetailsUpdated=false
  chrome.storage.sync.set({ pricesAndDetailsUpdated });
}
function updateMaxData(){
  chrome.storage.sync.get("DataAttribute",({DataAttribute})=>{
    DataAttribute.MaxDataAttributes=getMaxAttributes();
    chrome.storage.sync.set({ DataAttribute });
    console.log("in options");
    chrome.runtime.sendMessage({Action:"updateMaxData"})
  } );
  
  //send message to update
}
function updatePricesData(){
  chrome.storage.sync.get("DataAttribute",({ DataAttribute })=>{
    DataAttribute.cardPricesAndDetails=getPricesAttributes();
    chrome.storage.sync.set({ DataAttribute });
    chrome.runtime.sendMessage({Action:"updatePricesData"})
      //send message to update
  });
}

document.getElementById('updateData').addEventListener('click',
    setData);
document.getElementById('updateSellBuy').addEventListener('click',
    updatePricesData);
document.getElementById('updateMaxData').addEventListener('click',
    updateMaxData);