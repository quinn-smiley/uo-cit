/*
  Author: Quinn Smiley
  Description: CS 111 - Lab 5
*/

//let a=[1,2,3];
//console.log([]);
//console.log(a);

let inputArray=[];

inputArray.push("I am a string");
inputArray.push(true);
inputArray.push(3.14);
inputArray.push([1,2,3]);

console.log("Array length: "+inputArray.length);

let removedData=inputArray.pop();

//console.log(inputArray);
//console.log(removedData);

for (let i=0; i<inputArray.length; i++){
  console.log(i+": "+inputArray[i])
}

removedData.map(function(element, index){
  console.log("Removed data: "+element)
});

let splitData=inputArray[0].split(" ");
//console.log(splitData);

for (let i=0; i<splitData.length; i++){
  let str=splitData[i]
  let first=str.charAt(0).toUpperCase()
  let rest=str.slice(1, str.length)
  // console.log(first);
  // console.log(rest);
  let result=first+rest
  console.log("Split data: "+result)
}

let nums=[50, 51, 52, 53, 54, 55]

nums.filter(function(element, index){
  return element % 2 === 1
}).map(function(element, index){
  console.log("Odd number: "+element)
})

let sum=nums.reduce(function(element1, element2){
  return element1+element2
})

console.log("Sum: "+sum);

let x=undefined
let y=null

console.log("x value: "+x+", type of x: "+typeof(x));
console.log("y value: "+y+", type of y: "+typeof(y));