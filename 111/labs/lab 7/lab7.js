/*
  Author: Quinn Smiley
  Description: CS 111 - Lab 7
*/

// TODO #1: Interval in seconds between light changes
const MAX_INTERVAL = 3;

// TODO #2: Get all the lights into a nodeList
const LIGHTS = document.querySelectorAll(".light");
//console.log(LIGHTS);

// TODO #3: Variables to keep track of the current light and direction
let currentLightIndex = 0;
let direction = 1;

// TODO #4: Variable to keep track of the count down set to initial interval
let countDown = MAX_INTERVAL;

// Function to toggle the lights, called every second by setInterval
function toggleLights() {

    // TODO #6: Decrement the countdown
    countDown--;
  
    // TODO #7: Update the countdown text
    LIGHTS[currentLightIndex].querySelector("span").textContent=countDown;
  
    if (countDown === 0) {
  
      // TODO #8: Clear the countdown text
      LIGHTS[currentLightIndex].querySelector("span").textContent = "";
  
      // TODO #9: Turn off the current light - treat nodeList like an array
        LIGHTS[currentLightIndex].classList.remove("active");

      // TODO #10: Change direction using -1 or 1 if we've reached the end of the lights
      if (currentLightIndex + direction > LIGHTS.length -1){
        direction = -1
      } else if(currentLightIndex + direction < 0){
        direction = 1
      }
  
      // TODO #11: Move to the next light based on the direction
      currentLightIndex += direction;
  
      // TODO #12: Reset the countdown
      countDown = MAX_INTERVAL;
  
      // TODO #13: Update traffic light count down text
      LIGHTS[currentLightIndex].querySelector("span").textContent = countDown;
  
      // TODO 14: Turn on the next light
      LIGHTS[currentLightIndex].classList.add("active");
    }
  }
  
  // TODO #5: Setup the initial active light and countdown text
  LIGHTS[0].querySelector("span").textContent = MAX_INTERVAL;
  LIGHTS[0].classList.add("active");
  // Start the interval
  setInterval(toggleLights, 1000);