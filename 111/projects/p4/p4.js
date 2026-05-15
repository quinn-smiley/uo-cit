/*
  Author: Quinn Smiley
  Description: Project 4 CS 111
*/

const min=0;
const max=255;

function generateRandomColor() {
  const range=Math.floor(max)-Math.floor(min);
  const randomFraction=Math.random(min, max);
  const randomNumber=Math.floor(randomFraction*range);
  //console.log (randomNumber);
  return randomNumber
}

function start (){
  let counter=0
  function generateRandomColors(){
    counter++
    const red=generateRandomColor();
    const green=generateRandomColor();
    const blue=generateRandomColor();
    //console.log(red+", "+green+", "+blue);

    let rgb=("rgb("+red+", "+green+", "+blue+")")
    const colorOfDiv=document.querySelector("#colorDiv");
    colorOfDiv.style.backgroundColor = rgb;
    colorOfDiv.textContent=rgb;
    
    let counterDiv=document.querySelector("#counterDiv");
    counterDiv.textContent=("Counter: "+counter);
    if (counter>=5){
      clearInterval(intervalID);
    }
  }
  generateRandomColors();

  const intervalID=setInterval(generateRandomColors, 3000);

  }


start();

