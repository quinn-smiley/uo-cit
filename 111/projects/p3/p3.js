/*
  Author: Quinn Smiley
  Description: Project 3 CS 111
*/

const MinNumber=1;
const MaxNumber=1000;
const OddTargetNumber=5000;
const NumLoops=20;
const IntervalTimerMS=5000;

function oddEvenNumbers(){
  clearDiv();
  let totalPercent=0;
  for (let i=1; i<=NumLoops; i++){ //i starts at 1; must be less than or equall to NumLoops; adds 1 to count every time the loop is executed
    let oddCount=0;
    let evenCount=0; 
    while(oddCount<OddTargetNumber){
      let randomNumber=getRandomNumber(MinNumber, MaxNumber);
      if(randomNumber % 2 === 0){
        evenCount++ 
      } else {
        oddCount++
      }
    }
    let percent = 100*(oddCount / (oddCount + evenCount));
    percent=Math.round(percent);
    totalPercent=totalPercent+percent;
    appendToDiv(i+". Percent odd ("+oddCount+", "+evenCount+"): "+percent+"%")
  }
  let averagePercentage=totalPercent/NumLoops;
  appendToDiv("Average percent odd: "+averagePercentage);
  appendToDiv("Pausing for "+IntervalTimerMS+" ms...")
}

function start(){
  oddEvenNumbers();
  setInterval(oddEvenNumbers, IntervalTimerMS);
}

start();
