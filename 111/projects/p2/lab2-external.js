 /* Author: Quinn Smiley
 Description: Lab 2 External JavaScript File CS 111*/
 // Access PI and powers through the Math object
 //let area = Math.PI * Math.pow(5, 2);
 //let area = Math.PI * 5**2;
 //console.log("Area of a circle with radius 5: " + area);

 //function circleArea(radius) {
    // Access PI and powers through the Math object
    // let area = Math.PI * Math.pow(5, 2);
 //   let area = Math.PI * radius**2;
 //   console.log("Area of a circle with radius " + radius + ": " + area);
 // }

 // circleArea(5);

  function circleArea(radius) {
    // Access PI and powers through the Math object
    // let area = Math.PI * Math.pow(5, 2);
    let area = Math.PI * radius**2;
    return area;
  }
  
  let radius = 5;
  let area = circleArea(radius); // Get the circle area
  console.log("Area of a circle with radius " + radius + ": " + area);

let radius_1=15

  function sphereArea(radius){
    let area=4 * Math.PI * radius**2;
    return area;
  }

  console.log("Area of a sphere with radius "+radius_1+": "+sphereArea(radius_1));

  function isSphere(radius,area){
    return area >= Math.floor(sphereArea(radius))
  }

  console.log("Is a sphere with radius 4 and area 50 a sphere?"+isSphere(4,50))
  console.log("Is a sphere with radius 8 and area 201 a sphere?"+isSphere(8,201))
  console.log("Is a sphere with radius 12 and area 1809 a sphere?"+isSphere(12,1809))

  
  if(isSphere(4,50)) {
    console.log("It is a sphere!")
  } else {
    console.log("It is not a sphere!")
  }