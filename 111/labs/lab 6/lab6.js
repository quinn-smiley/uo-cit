/*
  Author: Quinn Smiley
  Description: CS 111 - Lab 6
*/

// Randomizer code adapted from textbook
function getRandomNumber(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
}

function version1() {
    // Create an object that represents a rectangle
    const rectangle={ 
        width:5, 
        height:10
    }
    function area(){
        let multiplyarea=rectangle.width*rectangle.height;
        return multiplyarea
    }
    function perimeter(){
        let multiplyperimeter=2*(rectangle.width+rectangle.height);
        return multiplyperimeter
    }
    console.log("Area: "+area())
    console.log("Perimeter: "+perimeter())
}

function version2() {
    // Create an object that represents a rectangle and includes rectangle methods
    const rectangle={ 
        width:5, 
        height:10,
        area:function(){
            let multiplyarea=rectangle.width*rectangle.height;
            return multiplyarea
        },
        perimeter:function(){
            let multiplyperimeter=2*(rectangle.width+rectangle.height);
            return multiplyperimeter
        },
    }
    console.log("Area: "+rectangle.area())
    console.log("Perimeter: "+rectangle.perimeter())
}

function version3() {
    // Create an array of 5 random rectangles
    const rectangles=[];
    for (i=1; i<=5; i++){
        const rectangle={ 
            width:getRandomNumber(1, 100), 
            height:getRandomNumber(1,100),
            area:function(){
                let multiplyarea=rectangle.width*rectangle.height;
                return multiplyarea
            },
            perimeter:function(){
                let multiplyperimeter=2*(rectangle.width+rectangle.height);
                return multiplyperimeter
            }
        }
        rectangles.push(rectangle);
        console.log("Rectangle "+i+": width = "+rectangle.width+", height = "+rectangle.height+",  area = "+rectangle.area()+", perimeter = "+rectangle.perimeter());
    }
    }

function version4() {
  // Create an array of 5 random rectangles using Object.create()
  const rectangle={ 
    width:getRandomNumber(1, 100), 
    height:getRandomNumber(1,100),
    area:function(){
        let multiplyarea=rectangle.width*rectangle.height;
        return multiplyarea
    },
    perimeter:function(){
        let multiplyperimeter=2*(rectangle.width+rectangle.height);
        return multiplyperimeter
    }
}
  
  for (i=1; i<=5; i++){
    const shape=Object.create(rectangle);
    this.width=getRandomNumber(1, 100);
    this.height=getRandomNumber(1, 100);
    shape.area=this.width*this.height;
    shape.perimeter=2*(this.width+this.height);
    console.log("Rectangle "+i+": width = "+this.width+", height = "+this.height+",  area = "+shape.area+", perimeter = "+shape.perimeter);
}
}

function start() {
    //version1();
    //version2();
    //version3();
    version4();
}

start();
