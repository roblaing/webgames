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
event-driven programming</a> <q>in which the flow of the program is determined by events such as user actions 
(mouse clicks, key presses)...</q>.

In RiceRocks, a simple version of the old arcade game Asteroids, the user presses arrow keys to maneuver
and the space bar to shoot. The limited number of events to handle make it a nice introduction.

<h2>Events</h2>

As is common with JavaScript, there are <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Event_handlers">
several APIs</a> of various vintages.

<q>Get into a rut early: Do the same processes the same way. Accumulate idioms. Standardize.</q>  &mdash; <a href="http://pu.inf.uni-tuebingen.de/users/klaeren/epigrams.html">Alan J. Perlis</a>.

Following this advice, I'm going to settle on <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener">
target.addEventListener(type, listener [, options]);</a> which itself has <em>old</em> syntax where the third argument was 
usually set to <em>false</em> and <em>new</em> syntax where it's an object which can usually be ignored (as I'll do).

<h3>What is the <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">event target?</a></h3>

In my first iteration, I chose <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window">window</a>
as my <em>target</em> (ie parent element) for keyboard events.

A snag I hit was that while the arrows and space bar worked, pressing any other key
would cause further presses of the arrow and space bar to be ignored. Switching the target to
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document">document</a> didn't fix the bug, but seems
to be the more appropriate choice, since it gets keyboard events, whereas they only "bubble up" to window.

In JavaScript, an <a href="https://developer.mozilla.org/en-US/docs/Web/API/Event">event</a> is an object
with various attributes, which vary according according to type, and 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Event/target">event.target</a> is common to all.

<h3>What is the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Event">event type</a>?</h3>

Another common property is <a href="https://developer.mozilla.org/en-US/docs/Web/API/Event/type">event.type</a>
whereby we can ask an event what it is.

The bewilderingly long <a href="https://developer.mozilla.org/en-US/docs/Web/Events">full list</a> 
is provided by Mozilla, and this is intertwined with our choice of event target above.

For this simple example, we only initially need 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event">keydown</a> and
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/keyup_event">keyup</a>, which are in
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document#Events">document's list</a> of events it handles.

<h3>What is the listener?</h3>

My own convention goes like so:

```javascript
target.addEventListener(type, (event) => my_listener(Arg1, Arg2, ..., event));
```
My key_listener falls into the <em>pattern -> action</em> template which, along with events and loops, make up the guts of
concurrent programming. I think the most elegant way to do this in JavaScript is using its
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch">switch</a> statement.

```javascript
const inputStates = {loaded: true, thrust: false}; // global container for mutable key-value pairs

function key_listener(event) {
  let bool;
  switch (event.type) {
    case "keydown":
      bool = true;
      break;
    case "keyup":
      bool = false;
      break;
  }
  switch (event.key) {
    case "ArrowLeft":
      inputStates.left = bool;
      return;
    case "ArrowUp":
      inputStates.up = bool;
      return;
    case "ArrowRight":
      inputStates.right = bool;
      return;
    case " ":
      inputStates.space = bool;
      return;
    case "F12":  // allows toggling to debug screen, needs mouseclick for game to regain keyboard.
      event.target.dispatchEvent(event);
      return;
    default:
      event.preventDefault();
      return;
  }
}
```

<h4>pattern -> action</h4>

My initial version of key_listener passed the value of <code>bool</code> as a paramter depending on whether it was called
by "keydown" or "keyup", but I rewrote it to get that value from event.type.

Though actually more verbose, having two switch blocks resolved confusion in my mind when to use <code>break;</code> 
and when to use <code>return;</code> to end actions.

A subtlety between programming languages is whether they only find the first matching pattern and 
perform that action, or continue down the list to check if further patterns also match &mdash;which is JavaScript's default. 

So in JavaScript, if we don't want more than one pattern matched, the action needs to be concluded with <em>break;</em> or <em>return;</em>. Since the above code does a <em>side-effect</em> by altering the value of a global variable rather than 
return a value, it doesn't matter. 

<h4>Specific event properties</h4>

Something I discovered refactoring my old code is that the keyCode attribute for 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent">keyboad events</a> is deprecated,
which is good because figuring out which numbers go with which keys makes unreadable code. 

The current ways is to use 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key">KeyboardEvent.key</a> as above.

It took several frustrating hours to discover the magic incantation to stop other keys from breaking the game,
and the solution was counter-intuitively making
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault">Event.preventDefault()</a>
the default for switch.

A snag this introduced was breaking pressing F12 to get the browser's debugging screen up, and the code
above kinda fixes that (if you ignore the error messages and that a mouse click is needed for focus to return
from the debug console to the game).

<h3>What are the options?</h3>

A common gripe against JavaScript is, that if like me you only revisit it every few years, everything
changed from last time. 

When I first wrote this code, addEventListener had three arguments, and the third was usually set to <code>false</code>.

At time of writing, this now equates to <code>addEventListener(type, listener, {passive: false});</code>
where <em>{passive: false}</em> is the default, so could be ommitted.

I initially tried to fix the bug of browser no longer listening to the keyboard if a "wrong key" is pressed 
by playing with <em>{capture: true}</em> or <em>{capture: false}</em>, but that got me nowhere.

Truth is, I don't really know what setting these various options does, and Googling just led down a rabbit hole of waffle,
so just left this third parameter out

To recap, my two event listeners so far look like this:

```javascript
document.addEventListener('keydown', (event) => key_listener(event));
document.addEventListener('keyup',   (event) => key_listener(event));
```

So we now have a simple framework whereby, if we want to make the game more complex, we can add more case statements to
handle other keys. The number of events that need to be handled tend to proliferate, so using them as the starting point
for the various components makes keeping the overall design clean much simpler.

<h2>The game loop</h2>

Video games are a great way of learning concurrent programming because seeing lots of things happening on a screen simultaniously
makes otherwise dry and abstract theory easy to visualise.

JavaScript has started supporting parallelism via <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API">
workers</a>, but browser support at time of writing seems limited, so here concurrency is largely an optical illusion created by looping through sequential steps over-and-over very rapidly.

Again, JavaScript has <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations"> several
ways</a> to make something that should be easy confusing, so I'm settling on 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame">Window.requestAnimationFrame(callback)</a>
to set the loop speed to 60/second irrespective of the hardware.

We use it to create an infinite game loop along the lines of this basic template:

```javascript
function loop() {
  ...
  window.requestAnimationFrame(loop); % recursive call creating an infinite loop.
}

function init() {
  ...
  window.requestAnimationFrame(loop); % start infinite loop.
}

window.addEventListener("DOMContentLoaded", init);
```

<h2>Initialising the game state and starting the loop</h2>

The template above introduces a new event, <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event">DOMContentLoaded</a>, which is triggered once index.html and its associated css, JavaScript etc
files have been loaded by the browser.

Here I'm not bothering with <code>(event) => init(event)</code> since this event has no properties to read. 
It's a common idiom in "concurrency-oriented programming" language Erlang to call the function that 
sets up the initial state and starts the listening loop <code>init()</code>, so I'll stick with it here.

Much of my thinking on concurreny programming has been shaped by learning Erlang, where the <em>state</em> is kept as
an argument in the loop function, with its new value passed when it recursively calls itself at the end of each loop cycle. 
This is because Erlang doesn't allow variables to be overwritten with new values &mdash; making parallelism easier &mdash; 
whereas with Javascript its easiest to think of the state as global variables.

Keyboard, mouse, whatever events change the state by overwriting global variables, 
and the loop reads whatever the current value is during each pass. (Global variables are usually frowned on, 
and having different parts of concurrent systems altering the values of shared variables equates to untestable code 
where no two runs produce the same results, but since this is only a small game, hopefully none of that matters).

<h2>Thinking in tables (rows and columns) rather than objects</h2>

While a video game may not look like a spreadsheet, abstractly it consists of a list of <em>things</em> 
(which we can think of as rows), each of which is a compound data structure whose properties or attributes can be thought of as slotting into columns.

All the components of our game boil down to 

<code><pre>
[ {keyA:valA1, keyB:valB1, keyC:valC1, ...}
, {keyA:valA2, keyB:valB2, keyC:valC2, ...} 
, {keyA:valA3, keyB:valB3, keyC:valC3, ...} 
...
]
</pre></code>

ie, one set of square brackets containing an arbitrary number of curly bracketed <em>things</em> 
&mdash; Python calls them dictionaries, Awk calls them associative arrays, Erlang calls them maps,
and JavaScript calls them objects (jargon I like since it cuts through a lot of the OOP bull) &mdash; 
which in turn contain any number of key-value pairs.

Some key-value pairs will only be needed by certain types of sprites, but we can generalise them enough for
all to use the same draw and update functions.

```javascript
let sprites = []; // global list of sprites, has to be let (not const) for concatenation and filter

function loop() {
  ...
  sprites.forEach(sprite => { draw(sprite); update(sprite); });
  ...
}
```

<h3>Drawing sprites</h3>

Here our key API is <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D">
CanvasRenderingContext2D</a>, going through these five steps:

<ol>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save">ctx.save();</a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/translate">ctx.translate(x, y);</a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate">ctx.rotate(angle);</a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage">
ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);</a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/restore">ctx.restore();</a></li>
</ol>

A thing to note is that whereas it's easier to think of the position of sprites as their centre, the draw functions work
from the top left corner. To get rotation right, we need to move the origin to the centre of the sprite with
<code>ctx.translate(x_centre, y_centre);</code>, then rotate in radians where clockwise is positive.

```javascript
function draw(sprite) {
  ctx.save();
  ctx.translate(sprite.x_centre, sprite.y_centre);
  ctx.rotate(sprite.angle);
  ctx.drawImage(sprite.image, sprite.column * sprite.width, sprite.row * sprite.height, 
    sprite.width, sprite.height, 
    -(scale * sprite.width)/2, -(scale * sprite.height)/2, 
    scale * sprite.width, scale * sprite.height);
  ctx.restore();
}
```
A bewildering number of parameters are required to get which part of the source image file we want &mdash; the only
proper sprite sheet in this game is for explosions which run through 24 pictures &mdash; and then where, at which angle
and what size, we want to place it on the canvas.

In this game I'm assuming all images get scaled the same amount &mdash; using a global variable <em>scale</em> which
I'll explain shortly &mdash; but in future games I'll probably want to add an additional attribute to sprite to size for
perspective or whatever. 

<h3>Updating sprites</h3>

Game engines are often called <a href="https://en.wikipedia.org/wiki/Physics_engine">physics engines</a>, which is a good
name since it brings otherwise dry subjects such as trigonometry and vectors to life. 
My goal with this game was to stick to the bare bones of the original teaching example, but I found it hard not to tinker, 
and the potential for variations is endless.

One of the basic decisions of a video game is will the world be toroidal as I've done here &mdash; things that move off the side
reapear on the other side &mdash; or should there be walls. Moving things that are about to move off the edge to the other side
is general to all sprites, so I've put code to do that to whatever sprite at the top. But the rest is a dispatcher which
gives each type of sprite its own update function so each can be moved or transformed in a unique way.

I recall the original game had friction in space in that the spaceship would gradually come to a standstill if the burner
was switched off, which I found unrealistic. Keeping the burner on causes spaceship.x_velocity and spaceship.y_velocity
to keep increasing, demonstrating acceleration whereby the spaceship soon overtakes its own missiles. I haven't checked
for collissions between the spaceship and the shots it fires, so that's another avenue of experimentation.

Something I didn't like about the original was there wasn't really a reason to use the up arrow, so I decided
missiles in space should cause recoil, causing the spaceship to move back forcing the player to try keep still with
the burner.

<h2>Size and resize are events too</h2>

In my initial version of this game, I hard coded my canvas to be the size of the background image. Thanks to doing
Udacity's <a href="https://classroom.udacity.com/courses/ud893/">Responsive Design</a> and its associated
<a href="https://classroom.udacity.com/courses/ud882/">Responsive Images</a> Moocs, I've been enlightened that
you can't assume whoever is playing your webgame is using the same screen as you are. 

Among the drawbacks of RiceRocks using the keyboard to maneuver the spaceship is it isn't mobile phone friendly, but since
idea here is to lay the groundwork for more complex games, it's good practice not to make assumptions about the size or
orientation of the screen.

The DOM's window object has two important attributes to help us use all available screen realestate, 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth">window.innerWidth</a> and
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight">window.innerHeight</a>.

I wrote the following function to get a scale for my images, constrained by the width or height of the window.

```javascript
function get_scale() {
  if (window.innerWidth/window.innerHeight < background.width/background.height) {
    return 0.98 * (window.innerWidth/background.width);
  } else {
    return 0.98 * (window.innerHeight/background.height);
  }
}
```

The scale is made slightly smaller (98%) than the window size to avoid scroll bars appearing.

Calling this function before <code>background.src = "nebula_blue.f2014.png";</code> has completed loading the png file
caused me to trip over a common problem in concurrent programming known as a
<a href="https://en.wikipedia.org/wiki/Race_condition">race condition</a> caused by the code getting processed
sequentially, using garbage values for <code>background.width</code> and <code>background.height</code>.

The solution is again thinking <em>events</em>, which for image objects is usually written this way:

```javascript
  background.onload = function() {
    ...
  }
```

The <code>Image.onload</code> property is shorthand, syntactic sugar, for <code>background.addEventListener("load", callback);</code>
which though more verbose, I find keeps my code style more consistent, easier to read, and part of my dogmatic adherence to
event-driven programming.

Within this callback, I've created yet another event listener <code>window.addEventListener("resize", resize);</code> with
an associated function which sets a global variable, <code>scale</code>, and resets the canvas size.

```javascript
function resize() {
  scale = get_scale();
  canvas.width = scale * background.width;
  canvas.height = scale * background.height;
}
```

Users can change the size of their browsers, triggering a "resize" window event, which we can use to redraw the game to a new scale.
This is an example of how one tends to encounter ever more events to handle, ratifying my belief in event-oriented programming.

<h2>Audio</h2>

https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API

https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/AudioContext


var thrust_sound = audio_ctx.createBufferSource();

    if (typeof sound !== "undefined") {
        this.current_sound = audio_ctx.createBufferSource();
        this.current_sound.buffer = sound.buffer;
        this.current_sound.connect(audio_ctx.destination);
        this.current_sound.start();
    }

    if (on && typeof this.current_thrust_sound === "undefined") {
        this.current_thrust_sound = audio_ctx.createBufferSource();
        this.current_thrust_sound.buffer = thrust_sound.buffer;
        this.current_thrust_sound.connect(audio_ctx.destination);
        this.current_thrust_sound.start();
    }
    if (!on && typeof this.current_thrust_sound !== "undefined") {
        this.current_thrust_sound.stop();
        this.current_thrust_sound = undefined;
    }



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

https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events

https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial

My first version, written in Python, had lots of classes &mdash; board, pieces, game... everything was an object &mdash; 
leading to very verbose, hard to read or change code. I've found getting to grips with JavaScript's 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model">DOM</a> provided by browsers confusing
enough without cluttering it up further with home-made objects.

Broadly, I've based my JavaScript on the W3C's <a href="https://courses.edx.org/courses/course-v1:W3Cx+HTML5.2x+4T2015/course/">
HTML5 Part 2</a> Mooc whose second week is titled "Game Programming with HTML5" which I've used to structure my notes on.


<q>If you have a procedure with 10 parameters, you probably missed some.</q> &mdash; <a href="http://pu.inf.uni-tuebingen.de/users/klaeren/epigrams.html">Alan J. Perlis</a>.

In RiceRocks and most other video games, the size of the sprite list is constantly changing as the spaceship fires missiles and asteroids explode and regenerate.


Curly bracketed key-value sets are called different things in different programming languages 

Whatever you want to call them, thinking in terms of rows (ie elements in a list) containing columns (or relations in SQL jargon)
lets us simplify the guts of our loop to a simple list iteration:

```javascript
function loop() {
  ...
  sprite_list.forEach(sprite => {
    draw_sprite(sprite); 
    update_sprite(sprite);
  });
  ...
}
```

At the start of each loop, <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect">
ctx.clearRect(0, 0, canvas.width, canvas.height);</a> creates a blank slate to redraw the background and sprites on.

