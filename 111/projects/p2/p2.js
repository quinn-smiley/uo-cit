/*
  Author: Quinn Smiley
  Description: Project 2 CS 111
*/

function test() {
    let randomNumber = getRandomNumber(1, 100);
    appendToDiv("Testing output");
    appendToDiv("");
    appendToDiv("Random number: " + randomNumber);
  }
  
 //test();

 const MinimumRandomNumber=-50;
 const MaximumRandomNumber=50;
 const ComparisonNumber=0;

 function checkRandomNumberRange(randomNumber){
  appendToDiv("*** Random number: "+randomNumber+" ***")
  if (randomNumber<ComparisonNumber){
    appendToDiv("Random number < "+ComparisonNumber)
  }else if(randomNumber>ComparisonNumber){
    appendToDiv("Random number > "+ComparisonNumber)
  }
   }

const pi=3.14;

function calculateCircleCircumference(radius){
  let circumference=2*pi*radius;
  if (radius<0){
    return-1;
  }
  return circumference;
}

function calculateCircleArea(radius){
  let area=pi*(radius*radius);
  if (radius<0){
    return -1;
  }
  return area;
}

function calculateSphereSurfaceArea(radius){
  let surfacearea=4*pi*(radius*radius);
  if (radius<0){
    return -1;
  }
  return surfacearea;
}

function calculateSphereVolume(radius){
  let spherevolume=4/3*pi*(radius*radius*radius);
  if (radius<0){
    return -1;
  }
  return spherevolume;
}

function doCalculations(randomNumber){
  checkRandomNumberRange(randomNumber);
  const Circlecircumference=calculateCircleCircumference(randomNumber)
  if (Circlecircumference<0){
    appendToDiv("Circle circumference: Radius must be >= 0")
} else {
  appendToDiv("Circle circumference: "+Circlecircumference)
}
  calculateCircleArea(randomNumber)
    const CircleArea=calculateCircleArea(randomNumber)
    if (CircleArea<0){
      appendToDiv("Circle area: Radius must be >= 0")
    } else {
      appendToDiv("Circle area: "+CircleArea)
    }
  calculateSphereSurfaceArea(randomNumber)
    const SphereSurfaceArea=calculateSphereSurfaceArea(randomNumber)
    if (SphereSurfaceArea<0){
      appendToDiv("Sphere surface area: Radius must be >= 0")
    } else {
      appendToDiv("Sphere surface area: "+SphereSurfaceArea)
    }
  calculateSphereVolume (randomNumber)
    const SphereVolume=calculateSphereVolume(randomNumber)
    if (SphereVolume<0){
      appendToDiv("Sphere volume: Radius must be >= 0")
    } else {
      appendToDiv("Sphere volume: "+SphereVolume)
    }
}

function start(){
  let setup=getRandomNumber(MinimumRandomNumber, MaximumRandomNumber);
  doCalculations(setup);
  setup=getRandomNumber(MinimumRandomNumber, MaximumRandomNumber);
  doCalculations(setup);
  setup=getRandomNumber(MinimumRandomNumber, MaximumRandomNumber);
  doCalculations(setup);
  setup=getRandomNumber(MinimumRandomNumber, MaximumRandomNumber);
  doCalculations(setup);
  setup=getRandomNumber(MinimumRandomNumber, MaximumRandomNumber);
  doCalculations(setup);
}

start();
