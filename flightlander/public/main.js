"use strict";

// rotate(45 

rotate(45, ellipse(60, 20, "outline", "olivedrab"))
.then(image => ctx.drawImage(image, 0, 0));

overlay(rotate(90, ellipse(60, 20, "solid", "olivedrab")), rectangle(60, 20, "outline", "blue"))
.then(image => ctx.drawImage(image, 300, 300));

/*
text("Goodbye tgfif", 36, "indigo")
.then(image => ctx.drawImage(image, 0, 0));
*/

/*
overlay(rectangle(60, 100, 127, "rgb(0, 255, 0)"),
        rectangle(100, 60, 127, "rgb(0, 0, 255)"))
.then(image => ctx.drawImage(image, 0, 0));
*/

/*	
underlay(circle(6, "solid", "yellow"), square(4, "solid", "orange"))
.then(image => ctx.drawImage(image, 0, 0));


ellipse(30, 60, 100, "blue")
.then(image => ctx.drawImage(image, 0, 0));
*/

/*
above( beside(triangle(40, "solid", "red"), triangle(30, "solid", "red"))
     , rectangle(70, 30, "solid", "black")).then(image => ctx.drawImage(image, 0, 0));
*/

/*
const redSolidCircle = circle(20, "solid", "red");
const circleOutline = circle(20, "outline", { "color": "black" 
                                                  , "width": 2
                                                  , "style": "solid"
                                                  , "cap": "butt"
                                                  , "join": "miter"
                                                  });

const blackBox = rectangle(40, 30, "solid", "black");
const redTriangle = triangle(40, "solid", "red");

placeImage(triangle, canvas.width/2, canvas.height/2, null);
*/
// placeImage(blackBox, canvas.width/2, canvas.height/2, null);

// placeImage(redSolidCircle, canvas.width/2, canvas.height/2, null);
// placeImage(circleOutline, canvas.width/2, canvas.height/2, null);

// console.log(above(blackBox, redTriangle));

/*
// red square
ctx.beginPath();
ctx.rect(20, 40, 50, 50);
ctx.fillStyle = "#FF0000";
ctx.fill();
ctx.closePath();


ctx.beginPath();
ctx.rect(160, 10, 100, 40);
ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
ctx.stroke();
ctx.closePath();
*/

// above

// beside

// overlayAlign


/*
export { circle
       };
*/
