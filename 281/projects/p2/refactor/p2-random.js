/*
    CIT 281 Project 2
    Name: Quinn Smiley
*/

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomInteger(minLength, maxLength) {
    return Math.floor(Math.random() * (maxLength - minLength) + minLength);
  }
  
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  let result = "";

// Single Letter
function getRandomLetter(){
    let singleResult = alphabet[getRandomInteger(0, 26)];
    return singleResult
}

// Random String
minLength = 10;
maxLength = 20;
let finalString = "";

function getRandomString(minLength, maxLength){
    let stringLength = getRandomInteger(minLength, maxLength + 1);
    for (i = 1; i < stringLength; i++){
        finalString += getRandomLetter();
    }
    return finalString
}

//Alphabetical Order


function getSortedString(finalString){
    //let order = getRandomString().split("");
    //let sorted = order.sort();
    return getRandomString().split("").sort().join("");
}
   
  
  for (let i = 0; i < getRandomInteger(5, 26); i++) {
    result += alphabet[getRandomInteger(1, alphabet.length - 1)];
    getRandomLetter();
  }


console.log(getRandomString(10, 20));
console.log(getSortedString());