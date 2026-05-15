/*
  Author: Quinn Smiley
  Description: CS 111 - Lab 3
*/

appendToDiv("All setup!");

function sumSequence(min, max){
    if (min > max){
        return 0
    }
    let total=0;
    for (let i=min; i<=max; i=i+1){
        total=total+i
    }

    return total
}
// sum of ALL numbers between 10 and 50

let min=10;
let max=50;

let sum=sumSequence(min, max);

appendToDiv("Sequence sum between 10 and 50 is "+sum+".");

function countRandomLoops(min, max, target){

    if (min>max){
        return 0
    }

    let loops=0;
    let randomNumber=getRandomNumber(min, max)
    while (randomNumber !=target){
        randomNumber=getRandomNumber(min, max)
        loops=loops+1
    }

    return loops
}

min=1;
max=100;
target=73;

let count=countRandomLoops(min, max, target)

appendToDiv("It took "+count+" loops to get 73.")

function promptForCombinedText(){
    let combined=""
    let input="";

    do{
        input=prompt("Enter something(or 'q' to quit")
        if (input!="q"){
            if (combined!=""){
                combined=combined+""
            }

            combined=combined+input
        }
    }while (input !="q")

    return combined
}

let words=promptForCombinedText()

appendToDiv("Your combined input is "+words)

function timeoutFunction() {
    appendToDiv("Timeout function called");
  }

  setTimeout(timeoutFunction, 3000);

  function intervalFunction(){
    appendToDiv("Interval function called.")
  }

  let timeoutVariable=setInterval(intervalFunction, 3000)

  function clearIntervalFunction(){
    clearInterval(timeoutVariable)
    appendToDiv("Clear interval function called.")
  }

  setTimeout(clearIntervalFunction, 10000);