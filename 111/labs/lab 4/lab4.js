/* 
Author: Quinn Smiley
Description: CS 111 - Lab 4
*/

//function addTwoNums(num1, num2) {
//    return num1 + num2;
//}

//setInterval(function(num1, num2){
//    console.log("heehehe")
//   return num1+num2
//}, 1000)

//const divRef=document.querySelector("div");
//divRef.textContent="asd"

//const spanRef=document.querySelector("#counter")
//spanRef.textContent=0

const timeInterval=1000;

function start(){
    //console.log("working");
    const spanRef=document.querySelector("#counter");
    spanRef.textContent="0"
    
    const nowRef=document.querySelector("#now")

    setInterval(function(){
        let counter=parseInt(spanRef.textContent)
        counter=counter+1
        spanRef.textContent=counter

        nowRef.textContent=new Date().toLocaleString()

    }, timeInterval)
}

start();