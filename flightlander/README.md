<h1>Flight Lander</h1>

<h2>The Calculus of Images</h2>

<a href="https://htdp.org/2020-8-1/Book/part_one.html#%28part._sec~3aarith-images%29">The Arithmetic of Images</a>
is an interesting section in <q>How To Design Programs</q> touching on a something that comes up a lot in games
or any other kind of graphical programming.

One of Eddi Woo's excellent youtube lessons <a href="https://www.youtube.com/watch?v=JsduHKckB04&t=2s">
What is the basic building block of all mathematics? (A surprising answer!)</a> explains that sets and
what operations hold between elements of a given set form the foundation of the subject.

A reason HTDP started with <em>arithmetic</em> of various types was because it lead to <em>algebra</em>
where things are assigned to variables, which can be done with images &mash; though that requires different
thinking to most <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial">canvas tutorials</a>
which don't encourage thinking of images as being akin to integers, strings and other atomic types.

<h3>What is the type of an image?</h3>


Instead of drawing things on a screen, the idea is that functions like circle, square etc return something to
pass functions like overlay, underlay, above, and beside which in turn return something that can be drawn.

Figuring out what should be returned lead into a maze whose dead ends included ImageData and Image Obects themselves.
Finally, I reached the enlightenment that what should be returned is a 
<a href="https://javascript.info/promise-basics">promise</a>.

To draw what is returned from what Racket calls 
<a href="https://docs.racket-lang.org/teachpack/2htdpimage.html#%28def._%28%28lib._2htdp%2Fimage..rkt%29._image~3f%29%29">
image?</a> requires <em>then</em> chaining:

```javascript
circle(20, "solid", "red")
.then(image => ctx.drawImage(image, 0, 0));
```

Though a little ugly and alien at first, it sidesteps many other complexities of web application development.

<h3>What operations can be done on images?</h3>

Much as summing a list of integers would return a new integer, the basic idea here is that functions that consume
any number of images returns a new image. (Due to the nitty-gritty of JavaScript, in the same way that the basic
image creation functions return promises containing the image, these functions similarly have promises as an
outer wrapper).

Again, here I'm going to use <a href="https://docs.racket-lang.org/teachpack/2htdpimage-guide.html">HTDP</a> as a guide
and translate it's examples to JavaScript.

```javascript
above(triangle(40, "solid", "red"), rectangle(40, 30, "solid" "black"));
```

creates a simple picture of a house. 

<img src="house1.png" />

Note there are no co-ordinates, the above function hides all the maths.

This function was my introduction to JavaScript's relatively new 
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters">funName(...args)</a>
syntax which allows a function to take any number of parameters and converts them into a list.


The next step was to emulate 2htdpimage's beside operator, which only needed slight addaption of the above operator:

```javascript
above( beside(triangle(40, "solid", "red"), triangle(40, "solid", "red"))
     , rectangle(80, 30, "solid", "black"));
```

<img src="house2.png" />

<h2>Drawing traditional maths graphs</h2>

The first gotcha in trying to use Cartesian co-ordinates is the <em>center</em>, ie x=0 and y=0,
is the top left corner. Is is easily moved to wherever we want the center to be with

```javascript
  ctx.translate(x0, y0);
```

The second gotcha is the computer graphics convention is for down to be positive and up negative, so
the sign of y needs to be flipped (ie -y).

Lets start by defining the function I wish I had, which would let me 

```javascript


```

Return values <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createImageData">


https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createImageData

<h3>Canvas co-ordiants -> Cartesian co-ordinates</h3>

<h2>Colour Calculations</h2>

<table>
<tr><th>keyword</th><th>#hex</th><th>rgb</th><th>hsl</th></tr>
<tr><td>black</td><td>#000000</td><td>rgb(0, 0, 0)</td><td>hsl(0, 100%, 50%)</td></tr>
<tr><td>brown</td><td>#A52A2A</td><td>rgb(165, 42, 42)</td><td></td></tr>
<tr><td>red</td><td>#FF0000</td><td>rgb(255, 0, 0)</td><td>hsl(0, 100%, 50%)</td></tr>
<tr><td>orange</td><td>#FFA500</td><td>rgb(255, 165, 0)</td><td></td></tr>
<tr><td>yellow</td><td>#FFFF00</td><td>rgb(255, 215, 0)</td><td>hsl(60, 100%, 50%)</td></tr>
<tr><td>green</td><td>#008000</td><td>rgb(0, 128, 0)</td><td>hsl(120, 100%, 50%)</td></tr>
<tr><td>blue</td><td>#0000FF</td><td>rgb(0, 0, 255)</td><td>hsl(240, 100%, 50%)</td></tr>
<tr><td>indigo</td><td>#4B0082</td><td>rgb(75, 0, 130)</td><td></td></tr>
<tr><td>violet</td><td>#EE82EE</td><td>rgb(238, 130, 238)</td><td></td></tr>
<tr><td>white</td><td>#FFFFFF</td><td>rgb(255, 255, 255)</td><td></td></tr>
</table>

<h3><a href="https://en.wikipedia.org/wiki/HSL_and_HSV">hue, saturation, lightness</a></a>

<h4>Hue</h4>

A color wheel based on the 
<a href="https://en.wikipedia.org/wiki/Munsell_color_system">Munsell Color System</a>


hue, saturation, lightness

Cylindrical model, where 0° is red, 


<code><pre>
├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API">Canvas</a>
│   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement">HTMLCanvasElement</a>
│   │   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement#Properties">Properties</a>
│   │   .   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/width">width</a>
│   │   .   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/height">height</a>
│   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D">CanvasRenderingContext2D</a>
│   .   ├── Constructor/Instantiator
│   .   │   └── <a href="developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext">HTMLCanvasElement.getContext()</a>
│   .   ├── Properties
│   .   │   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle">fillStyle</a>
│   .   │   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font">font</a>
│   .   └── Methods
│   .   .   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect">clearRect()</a>
│   .   .   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage">drawImage()</a>
│   .   .   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText">fillText()</a>
│   .   .   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/restore">restore()</a>
│   .   .   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate">rotate()</a>
│   .   .   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save">save()</a>
│   .   .   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/translate">translate()</a>
└── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement">HTMLImageElement</a>
.   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement#Constructor">Constructor</a>
.   │   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image">Image()</a>
.   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement#Properties">Properties</a>
.   .   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/width">width</a>
.   .   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/height">height</a>
.   .   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/src">src</a>
</pre></code>

