<h1>Game 1: RiceRocks</h1>

This game comes from a Mooc I did several years ago, Rice University's 
<a href="https://www.coursera.org/learn/interactive-python-1">Interactive Python</a> which I translated into
JavaScript.

The sprite sheets and sound effects all date back to an assignment for that course, which is still offered by Coursera for free.

We need a simple http server &mdash; something every modern programing language has. The simplest is probably nodejs's 
<a href="https://www.npmjs.com/package/http-server">http-server</a> which runs from the command line, defaulting to
<code>http://127.0.0.1:8080</code> and assuming index.html and other files are in <code>./public</code>, so that's the
subdirectory I'll put everything in. In future, more complex projects, I'll start adding subdirectories.

I found the original course a great introduction to object-oriented programming, an idiom I've subsequently become
disenchanted with and am attempting to apply <a href="https://en.wikipedia.org/wiki/Event-driven_programming">
event-driven programming</a>.

Broadly, I've based my JavaScript on the W3C's <a href="https://courses.edx.org/courses/course-v1:W3Cx+HTML5.2x+4T2015/course/">
HTML5 Part 2</a> Mooc whose second week is titled "Game Programming with HTML5" which I've used to structure my notes on.

<h2>Events</h2>

The first thing to think of is user interaction, which makes your starting point 

<a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener">
target.addEventListener(type, listener [, options]);</a> 
 
placing you in a maze of twisty little passages, all alike.

<h3>What is the <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">event target?</a></h3>

In my first iteration, I chose <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window">window</a>
as my <em>target</em> (ie object) to attach addEventListener, but after running into a bug I'll explain now, I switched to
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document">document</a>. This didn't fix the bug, but seems
to be the more appropriate choice, since it gets keyboard events, whereas they only "bubble up" to window.

My first version of this game had lots of classes &mdash; board, pieces, game... &mdash; leading to very verbose,
hard to read or change code. I've found getting to grips with the 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model">DOM</a> provided by browsers confusing
enough without cluttering it up further.

<h3>What is the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Event">event type</a>?</h3>

The bewilderingly long <a href="https://developer.mozilla.org/en-US/docs/Web/Events">full list</a> is provided by Mozilla,
and this is intertwined with our choice of event target above.

In RiceRocks, a simple version of the old arcade game Asteroids, the user presses arrow keys to maneuver
and the space bar to shoot. The limited number of events to handle make it a nice introduction.

For this simple example, we only need 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event">keydown</a> and
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/keyup_event">keyup</a>, which are in
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document#Events">document's list</a> of events it handles.

A snag I hit was that while I had not problem handling the arrow and space bar, pressing any other key
would cause further presses of the arrow and space bar to be ignored. I'll explain how I fixed that now.

<h3>What is the listener?</h3>

My own convention goes like so:

```javascript
target.addEventListener(type, (event) => my_listener(Arg1, Arg2, ..., event));
```

This circumvents two frustrations I have with beginner tutorials on this subject: they either disregard the
<em>event</em> object by writing a callback with no arguments in examples which don't illustrate much, or put
<code>function (event) {... lines and lines of code ...}</code> as the second argument.

<code>my_listener(Arg1, Arg2, ..., event)</code> will typically be a <em>dispatcher</em> &mdash; which in 
JavaScript usually means a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch">
switch</a> block &mdash; which handles different cases of an event object attribute, modifying the <em>game state</em> 
which is a key concept I'll get to shortly.

In this example, <code>key_listener</code> is nearly identical for "keydown" and "keyup", only requiring one boolean
argument to differentiate them.

```javascript
function key_listener(Bool, event) {
  switch (event.key) {
    case "ArrowLeft":
      inputStates.left = Bool;
      break;
    case "ArrowUp":
      inputStates.up = Bool;
      break;
    case "ArrowRight":
      inputStates.right = Bool;
      break;
    case " ":
      inputStates.space = Bool;
      break;
    default:
      event.preventDefault();
  }
}
```

Something I discovered refactoring my old code is that the keyCode attribute for 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent">keyboad events</a> is deprecated,
which is good because figuring out which numbers go with which keys makes unreadable code. 

The current ways is to use 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key">KeyboardEvent.key</a> as above.

It took several frustrating hours to discover the magic incantation to stop other keys from breaking the game,
and the solution was counter-intuitively making
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault">Event.preventDefault()</a>
the default for switch.

<h3>What are the options?</h3>

A common gripe against JavaScript is, that if like me you only revisit it every few years, everything
keeps changing from last time. 

When I first wrote this code, addEventListener had three arguments, and the third was usually set to <code>false</code>.

At time of writing, this now equates to <code>addEventListener(type, listener, {passive: false});</code>
where <em>{passive: false}</em> is the default, so could be ommitted.

I initially tried to fix the bug of browser no longer listening to the keyboard if a "wrong key" is pressed 
by playing with <em>{capture: true}</em> or <em>{capture: false}</em>, but that got me nowhere.

Truth is, I don't really know what setting these various options does, and Googling just led down a rabbit hole of waffle,
so just left this third parameter out

To recap, my two event listeners so far look like this:

```javascript
document.addEventListener('keydown', (event) => key_listener(true,  event));
document.addEventListener('keyup',   (event) => key_listener(false, event));
```

So we now have a simple framework whereby, if we want to make the game more complex, we can add more case statements to
handle other keys. The number of events that need to be handled tend to proliferate, so using them as the starting point
for the various components makes keeping the overall design clean much simpler.

<h2>The game loop</h2>

Video games are a great way of learning concurrent programming because seeing lots of things happening on a screen simultaniously
makes otherwise dry and abstract theory easy to visualise.

In the case of JavaScript &mdash; which at time of writing doesn't support parallelism because it is single threaded &mdash; 
concurrency is an optical illusion created by looping through sequential steps over-and-over very rapidly.

To avoid a snag old video games suffer from in that they became unplayable as hardware got faster, we use
<a href="https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame">Window.requestAnimationFrame(callback)</a>
to set the loop speed to 60/second irrespective of the hardware.

We create or infinite game loop according to this basic template:

```javascript
function loop() {
  ...
  window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
```

Much of my thinking on concurreny programming has been shaped by learning Erlang, where the <em>state</em> is kept as
an argument in the loop function, with its new value passed when it recursively calls itself at the end of each loop cycle. 
This is because Erlang doesn't allow variables to be overwritten with new values &mdash; making parallelism easier &mdash; 
whereas with Javascript the state can be a compound data structure available as a global variable.

<h2>Painting the canvas</h2>

A key part of the game loop is constantly redrawing the screen, which is quite a convoluted process in JavaScript,
which I blame for the gazillion frameworks which supposedly simply this. Since I'm ideologically opposed
to frameworks, a first step is to create a function to draw a sprite out of plain vanilla browser builtins.

A snag here is that it involves the <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D">
CanvasRenderingContext2D</a> object (instantiated as ctx) and its many methods, of which we need at least 5 to handle rotating
space objects:

<ol>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save">ctx.save();</a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/translate">ctx.translate(x, y);</a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate">ctx.rotate(angle);</a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage">
ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);</a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/restore">ctx.restore();</a></li>
</ol>

This function then needs to be applied iteratively over a list of sprites to create the illusion of concurrency.

This part is often called the <a href="https://en.wikipedia.org/wiki/Physics_engine">physics engine</a> since it involves
some arithmetic and trigonometry.

<a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage">
ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);</a>

has nine parameters which have to be unpacked carefully.

<dl>
  <dt>image</dt><dd>This is an instantiated image object such as <em>spaceship</em> after 
    <code>const spaceship = new Image(); spaceship.src = "double_ship.png";</code> has been called.<br>
    A gotcha is that if the file hasn't been downloaded completely by the browser, no image will appear.
    </dd>
  <dt>sx</dt><dd>Top left corner of the source file. The only complex sprite sheet in this example is explosion 
    which has 24 images which are 128 pixels wide each. To get the first image, sx = 0, the second, sx = 128, ...</dd>
  <dt>sy</dt><dd>Top left corner of the source file. None of the sprite sheets in this game have more than one row. 
    If they did, sy would need to be incremented the same way as sx. Computer graphic ys differ from the Cartesian 
    plain in that down is positive.</dd>
  <dt>sWidth</dt><dd>Source width: For explosion, 128, for the spaceship with rocket on or off, 90.</dd>
  <dt>sHeight</dt><dd>Source height (measured downward from zero)</dd>
  <dt>dx</dt><dd>Where to draw the image on the canvas. The gotcha here is that what typically store the position
   of our sprite by its centre, and this needs to be converted to its top left corner.</dd>
  <dt>dy</dt><dd>As dx</dd>
  <dt>dWidth</dt><dd>This isn't necessarily the same as sWidth since we often need to scale it.</dd>
  <dt>sHeight</dt><dd>Dito.</dd>
</dl>



<h3>Initialising the game state</h3>

When to start? Luckily, there's an event for that. In fact, there's a confusing choice, so I'm semi-randomly picking one:

```javascript
window.addEventListener("DOMContentLoaded", init);
```

Here I'm not bothering with <code>(event) => init(event)</code> since
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event">DOMContentLoaded</a>
has no properties to read. It's a common idiom in Erlang among other to call the function that sets up the initial
state <code>init()</code>.

Before diving into the init function, lets look at the global constants I've defined at the top of the 
<a href="https://github.com/roblaing/webgames/blob/master/ricerocks/public/game1.js">game1.js</a> file:

```javascript
const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");
const audio_ctx = new window.AudioContext() || new window.webkitAudioContext();
const background = new Image();
const spaceship = new Image();
const asteroid = new Image();
const explosion = new Image();
const splash = new Image();
const missile = new Image();
const debris = new Image();
```

Here is probably a good time to run through what in game programming jargon are known as graphical <em>assets</em>, and
digressing into responsive design.

<table>
<tr>
<td><a href="https://github.com/roblaing/webgames/blob/master/ricerocks/public/nebula_blue.f2014.png">Background</a></td>
<td>1 x 800 × 600 pixels</td>
</tr>
<tr>
<td><a href="https://github.com/roblaing/webgames/blob/master/ricerocks/public/double_ship.png">Spaceship</a></td>
<td>2 x 90 × 90 pixels</td>
</tr>
<tr>
<td><a href="https://github.com/roblaing/webgames/blob/master/ricerocks/public/asteroid_blue.png">Asteroid</a></td>
<td>1 x 90 × 90 pixels</td>
</tr>
<tr>
<td><a href="https://github.com/roblaing/webgames/blob/master/ricerocks/public/explosion_alpha.png">Explosion</a></td>
<td>24 x 128 x 128 pixels</td>
</tr>
<tr>
<td><a href="https://github.com/roblaing/webgames/blob/master/ricerocks/public/splash.png">Splash</a></td>
<td>1 x 400 x 300 pixels</td>
</tr>
<tr>
<td><a href="https://github.com/roblaing/webgames/blob/master/ricerocks/public/shot2.png">Shot</a></td>
<td>1 x 10 x 10 pixels</td>
</tr>
<tr>
<td><a href="https://github.com/roblaing/webgames/blob/master/ricerocks/public/debris2_blue.png">Debris</a></td>
<td>1 x 640 x 480 pixels</td>
</tr>
</table>



So one of the tasks to do in the init function is load each of those image files into its corresponding object.

```javascript
function init() {
  background.src = "nebula_blue.f2014.png";
  spaceship.src = "double_ship.png";
  asteroid.src = "asteroid_blue.png";
  splash.src = "splash.png";
  missile.src = "shot2.png";
  explosion.src = "explosion_alpha.png";
  debris.src = "debris2_blue.png";
  ...
}
```

In my initial version of this game, I hard coded my canvas to be the size of the background image. Thanks to doing
Udacity's <a href="https://classroom.udacity.com/courses/ud893/">Responsive Design</a> and its associated
<a href="https://classroom.udacity.com/courses/ud882/">Responsive Images</a> Moocs, I've been enlightened that
you can't assume whoever is playing your webgame is using the same screen as you are. 

A drawback with RiceRocks using the keyboard to maneuver the spaceship is it isn't mobile phone friendly, but since
idea here is to lay the groundwork for more complex games, it's good practice not to make assumptions about the size or
orientation of the screen.

The DOM's window object has two important attributes to help us use all available screen realestate, 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth">window.innerWidth</a> and
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight">window.innerHeight</a>.

Users can change the size of their browsers, triggering a "resize" window event, which we can use to redraw the game to a new scale.
This is an example of how there tend to be more types of events to handle than one can initially envision, ratifying my
belief in "event first" design.

The <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API">canvas</a> object has attributes width and height
which can be set from values read from the window. One of the variables in the state needs to be a float, scale, to keep 
the other images correctly sized.


This involves adding more event handlers to the initial two above:

```javascript
window.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resize);
```



