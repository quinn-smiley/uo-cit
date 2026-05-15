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
    if (evt.shiftKey === true){
      ctx.strokeStyle = window.getComputedStyle(canvas).backgroundColor;
    } else {
     ctx.strokeStyle = document.querySelector("#colorSelect").value;
    }
  });

  canvas.addEventListener("mousemove", function (evt) {
    if (isDrawing) {
      // TODO: Implement the drawing functionality
      const x = evt.offsetX;
      const y = evt.offsetY;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.lineWidth = selectedWidth;
      ctx.globalAlpha = selectedOpacity;
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


  //const canvas = document.querySelector("#canvas");
  //const ctx = canvas.getContext("2d");


  //Color Selection//
  document.querySelector("#colorSelect").addEventListener("change", function (event) {
    ctx.strokeStyle = (event.target.value).toLowerCase();
  })


  //Width Selection//


  const widths = ["1", "3", "5", "7"];

  const widthSelect = document.querySelector("#widthSelect");

  for (let i = 0; i < widths.length; i++) {

    const option = document.createElement("option");

    option.textContent = widths[i];

    option.value = widths[i];

    widthSelect.appendChild(option);
  }

  let selectedWidth = widths[0];

  widthSelect.addEventListener("change", function (){
    selectedWidth = widthSelect.value;
  })



  //Opacity Slider//

  let selectedOpacity = 1;

  const opacitySelect = document.querySelector('#opacitySlider');


  opacitySelect.addEventListener("change", function(){
    selectedOpacity = opacitySelect.value;
  })


}



//Call setup() when the DOM is loaded
window.addEventListener("DOMContentLoaded", setup);