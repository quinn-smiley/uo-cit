/*
  Author: Quinn Smiley
  Description: Project 5 CS 111
*/

// Returns a number if input is valid, otherwise returns null
function validateNumber(input) {
    // Convert the input to a number
    const number = Number(input);

    // Check if the input is a valid number
    if (!isNaN(number)) {
        return number;
    } else {
        return null;
    }
}

// Returns a string containing each dataArray element, separated by delimiter
function combineArray(dataArray([1,2,3,4,5,6,7,8],"array"), delimiter) {
    let delimiter=dataArray[0].split(" ");
    for (i=1; i<dataArray.length; i++){
        
}
}

// Returns the median value of the dataArray
function getMedian(dataArray) { }

// Collect input and inserts valid numerical user input into dataArray
function collectInput(dataArray) {}

// Displays dataArray output
function displayOutput(dataArray) {}

// Main program function
function start() {

    // Number data array
    const inputArray = [];

    // Start collecting input
    collectInput(inputArray);

    // Display output
    displayOutput(inputArray);

}

// Start the program
start();