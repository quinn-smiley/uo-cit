/*
  Author: Quinn Smiley
  Description: CS 111 - Lab 8
*/

// TODO: Use operator to calculate the result and display it in the result input
// TODO: Add the calculation to the history list using a new list item
function calculate(operator) {

    // Get the numbers from the input fields

    const num1 = parseFloat(document.querySelector("#num1").value);

    const num2 = parseFloat(document.querySelector("#num2").value);
  
    // Calculate the result based on the operator

    let result;
    switch (operator) {
        case "+":
            result = num1 + num2;
            break;
        case "-":
            result = num1 - num2;
            break;
        case "*":
            result = num1 * num2;
            break;
        case "/":
            result = num1 / num2;
            break;
    }
    // Display the result

    document.querySelector("#result").value = result;
  
    // Add the result to the history
    // Get the history list

    const history = document.querySelector("#history");
    
  
    // Create a new list item

    const newHistory = document.createElement("li");
    
  
    // Set the text content of the new list item

    newHistory.textContent = `${num1} ${operator} ${num2} = ${result}`;
  
    // Append the new list item to the history list

    history.appendChild(newHistory);

    //console.log(`Operator: ${operator}`);
    //console.log(num1 + " " + operator + " " + num2 + " = " + result)
  
  }
  
  // TODO: Add event listeners to the operator buttons
  function setup() {
    document.querySelector("#add").addEventListener("click", function () {
        calculate("+");
    });
    document.querySelector("#subtract").addEventListener("click", function(){
        calculate("-")
    });
    document.querySelector("#multiply").addEventListener("click", function () {
        calculate("*");
    });
    document.querySelector("#divide").addEventListener("click", function () {
        calculate("/");
    });
  }
  
  // Setup the program, when the DOM is loaded
  window.addEventListener("DOMContentLoaded", setup);