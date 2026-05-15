// CS 111 Project 2 provided code file

function isValidNumber(value) {
  return typeof value === "number" && isFinite(value);
}

function getRandomNumber(min, max) {
  // Error check
  if (!min) {
    appendToDiv("Minimum parameter required");
  } else if (!max) {
    appendToDiv("Maximum parameter required");
  } else if (!isValidNumber(min)) {
    appendToDiv("Minimum parameter must be a valid number");
  } else if (!isValidNumber(max)) {
    appendToDiv("Maximum parameter must be a valid number");
  } else if (max <= min) {
    appendToDiv("Maximum parameter must be greater than mimimum parameter");
  } else {
    // Calculate the range (max - min)
    const range = Math.floor(max) - Math.floor(min);

    // Generate a random number between 0 and 1
    const randomFraction = Math.random();

    // Scale the random fraction to the range and add the minimum value
    const randomNumber = Math.floor(randomFraction * range + min);

    return randomNumber;
  }
}

function appendToDiv(text) {
  // Make sure HTML has at least one div for appending
  const divRef = document.querySelector("div");
  if (!divRef) {
    console.error("Your HTML code must have at least one div element");
  }

  // Convert input parameter to text and ensure length > 0,
  // removing leading and trailing white space
  if (divRef) {
    const newText = text.toString().trim();

    // Appending to div
    console.log("Appending " + newText);
    const newDiv = document.createElement("div");
    if (newText.length === 0) {
      // Empty string equates to br tag
      const br = document.createElement("br");
      newDiv.appendChild(br);
    } else {
      newDiv.textContent = newText;
    }
    divRef.appendChild(newDiv);
  }
}

function clearDiv() {
  // Make sure HTML has at least one div for appending
  const divRef = document.querySelector("div");
  if (!divRef) {
    console.error("Your HTML code must have at least one div element");
  }

  // Convert input parameter to text and ensure length > 0,
  // removing leading and trailing white space
  if (divRef) {
    divRef.textContent = "";
  }
}
