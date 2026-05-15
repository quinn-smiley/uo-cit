/*
  Author: Quinn Smiley
  Description: Project 7 CS 111
*/

// TODO: Write a function that converts a decimal number to binary
//       and returns the binary number as a string left-padded with zeros
//       to a length of 4 digits.
//       Example:
//         decimalToBinary(5) returns "0101".
//       Required elements:
//       - toString() method
//       - padStart() method
//       - return statement
function decimalToBinary(decimal) {
    let convert = decimal.toString(2);
    let pad = convert.padStart(4, "0")
    return pad
}

//console.log(decimalToBinary(5));


// TODO: Write a function that tests the decimalToBinary() function
//       by calling it for each decimal number from 0 to 15
//       and logging the result to the console.
//       Then disable the function by commenting out the function call.
//       Example: convertNumbersTest() logs:
//         Decimal 0 is 0000
//         Decimal 1 is 0001
//         Decimal 2 is 0010
//         ...
//       Required elements:
//       - for loop
//       - console.log()
//       - decimalToBinary() function


function convertNumbersTest() {
  for (let i=0; i<=15 ; i++){
    console.log("Decimal "+i+" is "+decimalToBinary(i))
  }
}


// Test the number conversion function, then disable
//convertNumbersTest();

// TODO: Write a function that shows the hidden image by removing the "hidden" class
//       You will need to determine the correct CSS class or id value for selection.
//       Required elements:
//       - querySelector()
//       - classList.remove()
//       - variable to store image reference
function showImage() { 
  const makeVisible = document.querySelector("#duck-rocket");
  makeVisible.classList.remove("hidden");
}

// TODO: Write a function that updates the HTML to display the decimal number
//       and the binary number by updating the appropriate HTML elements.
//       Use the "on" class to turn the lights for each binary digit or or off.
//       Required elements:
//       - querySelector()
//       - querySelectorAll()
//       - textContent
//       - add() and remove() classList methods
//       - for loop
//       - conditional statement
//       - Test binary string using [] notation rather than String charAt() method
//       - Access NodeList as array using [] notation
//       - variable to store decimal reference
//       - variable to store lights NodeList reference
function updateHTMLNumbers(decimal, binary) { 
  //console.log(decimal+ " " +binary)
  const decimalRef = document.querySelector("#decimal-display");
  decimalRef.textContent = decimal;

  const lightsNodeList = document.querySelectorAll(".light");

  for (let i=0; i<lightsNodeList.length; i++){
    if (binary[i] === "1"){
      lightsNodeList[i].classList.add("on");
    } else {
      lightsNodeList[i].classList.remove("on");
    }
  }
}

//updateHTMLNumbers(5, decimalToBinary(5));

// TODO: Write a function that starts a countdown timer to call updateHTMLNumbers()
//       function every second. The countdown will start at 10.
//       Required elements:
//       - setInterval()
//       - clearInterval()
//       - decimalToBinary() function
//       - updateHTMLNumbers() function
//       - showImage() function
//       - decrementing operator
//       - conditional statement
//       - variable to store countdown value with initial value of 10
//       - variable to store interval ID
//       - variable to store binary value
function start() {
  let countdown = 10;
  const timer = setInterval(function(){
    //console.log(countdown);
    const binary = decimalToBinary(countdown);
    updateHTMLNumbers(countdown, binary);
    if (countdown === 0){
      clearInterval(timer);
      showImage();
    } else {
      countdown--;
    }
    //console.log(countdown);
  }, 1000)
}

// Start the program
start();