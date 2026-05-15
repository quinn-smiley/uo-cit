/*
  Author: Quinn Smiley
  Description: CS 111 Project 8
*/

function setup() {
    // Get the canvas and context
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    
    // Set up the initial state of the drawing
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
  
    canvas.addEventListener("mousedown", function (evt) {
      // TODO: Implement the drawing functionality
      isDrawing = true;
    lastX = evt.offsetX;
    lastY = evt.offsetY;
    });
  
    canvas.addEventListener("mousemove", function (evt) {
      if (isDrawing) {
        // TODO: Implement the drawing functionality
        const x = evt.offsetX;
        const y = evt.offsetY;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        lastX = x;
        lastY = y;
      }
    });
  
    canvas.addEventListener("mouseup", function () {
      // Mouse button released, signal that we're not drawing anymore
      isDrawing = false;
    });
  
    canvas.addEventListener("mouseout", function () {
      // Mouse left the canvas, signal that we're not drawing anymore
      isDrawing = false;
    });
  
    document.querySelector("#clearButton").addEventListener("click", function () {
      // TODO: Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");

document.querySelector("#colorSelect").addEventListener("change", function (event){
    ctx.strokeStyle=(event.target.value).toLowerCase();
})
  
  //Call setup() when the DOM is loaded
  window.addEventListener("DOMContentLoaded", setup);