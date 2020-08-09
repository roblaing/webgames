<h1>Flight Lander</h1>

<h2>The Calculus of Images</h2>

<a href="https://htdp.org/2020-8-1/Book/part_one.html#%28part._sec~3aarith-images%29">The Arithmetic of Images</a>
is an interesting section in <q>How To Design Programs</q> touching on a something that comes up a lot in games
or any other kind of graphical programming.

One of Eddi Woo's excellent youtube lessons <a href="https://www.youtube.com/watch?v=JsduHKckB04&t=2s">
What is the basic building block of all mathematics? (A surprising answer!)</a> explains that sets and
what operations hold between elements of a given set form the foundation of the subject.

This used to be called <em>calculus</em>, which has become synonymous with "the calculus of infinitesimals", 
thereby robbing language of an important concept which is possibly why the HTDP authors used <em>arithmetic</em> 
for the same concept.

I prefer <em>calculus of images</em> since we can actually also use images to do differentiation and integration.

<h3>What is the type of an image?</h3>

JavaScript's <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image">Image Object</a> is
the natural choice, but it took quite a bit of frustration to figure out how to get functions to return this object
instead of drawing on the canvas. It involved trip down the rabbit hole of ImageData and other extraneous stuff, 
but I eventually found what I wanted was 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL">toDataURL</a> which stores
the object as a png bitmap (for some reason, keeping drawings in vector format would require third party libraries).

Images are not created in the actual canvas, but in a hidden doodling area:

```javascript
const shadowCanvas = document.createElement("canvas");
const shadowCtx = shadowCanvas.getContext("2d");
```

An image creation function follows these steps:

<ol>
  <li>The bounding box &mdash; maximum width and height of the given shape &mdash; is calcuated. On gotcha is
for stroked shapes, the width of the line needs to be added to these.</li>
  <li>The shadow canvas is sized to this box</li>
  <li>shadowCtx.clearRect(0, 0, width, height);</li>
  <li>The shape gets drawn on the shadowCtx using some of the 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D">CanvasRenderingContext2D's</a>
many, many methods</li>
  <li>image.src = shadowCanvas.toDataURL(); return image;</li>
</ol>

<h3>What operations can be done on an image?</h3>

So now that we have some kinde of <em>atoms</em> which can be allocated to literals to build things out of, 
how can we assemble things out of them?

Again, here I'm going to use <a href="https://docs.racket-lang.org/teachpack/2htdpimage-guide.html">HTDP</a> as a guide
and translate it's examples to JavaScript.

```javascript
above(createTriangle(40, "solid", "red"), createRectangle(40, 30, "solid" "black"));
```

should create a simple picture of a house. Note there are no co-ordinates, the above function hides all the maths.

This function was my introduction to JavaScript's relatively new 
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters">funName(...args)</a>
syntax which allows a function to take any number of parameters and converts them into a list.


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

