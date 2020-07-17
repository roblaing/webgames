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

<h2><a href="https://developer.mozilla.org/en-US/docs/Web/API/Event">Events</a></h2>

As is common with JavaScript, there's a confusion of
<a href="https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Event_handlers">
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

A key point is that in JavaScript, an event is what I like to think of as a compound data structure &mdash;
thereby avoiding the jargon term <em>object</em> and its swamp of buzzwords. I'll make a quick digression
into what I call <q>curly bracketed things</q> since they'll come up a lot.

<h4>Curly bracketed things</h4>

<code>{key1: value1, key2: value2, ... , keyN, valueN}</code>

Python calls them dictionaries, Awk calls them associative arrays, Erlang calls them maps,
and JavaScript calls them objects &mdash; jargon I like since it cuts through a lot of OOP bull by
making it clear it's just another way of expressing and processing sets of key-value pairs.

Another Perlism, <q>If you have a procedure with 10 parameters, you probably missed some</q>, sums up the
main advantage of <em>curly bracketed things</em> in that they let us pass a bag of parameters as one argument
instead of as a bewildering number in a specific order, which besides being hard for users to remember, also makes code hard
to refactor.

Whereas in Python values separated by dots, as in <em>element.attribute</em>, and square brackets, as
in <em>element[attribute]</em> are separate types, in JavaScript they are syntactic sugar for the same
thing. But we can't simply treat JavaScript's <em>curly bracketed things</em> as compound data because of
the complication of deciding whether to process them with functions, eg <code>draw(sprite)</code>, or 
with methods as in <code>sprite.draw()</code>.

I personally don't like the agglutinative horror of OOP or its mishmashing of data and processing.
With JavaScript, I find addressing, say <em>sprite.x</em> within draw(sprite) a lot easier than 
<em>this.x</em> within sprite.draw(), especially since keeping track of what 
<em>this</em> is leads to hacks like <code>let that = this;</code> or appending
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind">bind()</a>
to everything.

To use a browser as our frontend, however, we have to get to grips with the
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model">DOM</a>, so there's no escaping the 
OOP side of JavaScript. But I find the provided system objects confusing enough without creating more, so avoid it in 
my own code.

Back to the event object. It is a compound data type with numerous attributes, which vary according according to type, but 
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
My keyListener falls into the <em>pattern -> action</em> template which, along with events and loops, make up the guts of
concurrent programming. I think the most elegant way to do this in JavaScript is using its
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch">switch</a> statement.

```javascript
const inputStates = {loaded: true, thrust: false}; // global container for mutable key-value pairs

function keyListener(event) {
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
    case "ArrowRight":
      inputStates.right = bool;
      return;
    case "ArrowUp":
      inputStates.up = bool;
      // Rocket thrust sound code was subsequenly added here.
      return;
    case " ":
      inputStates.space = bool;
      // Missile firing sound code was subsequenly added here.
      return;
    case "F12":  
      // Allows toggling to debug screen, needs mouseclick for game to regain keyboard.
      event.target.dispatchEvent(event);
      return;
    default:
      // Counterintuitively, preventDefault seems the best default for keyboard events.
      event.preventDefault();
      return;
  }
}
```

<h4>pattern -> action</h4>

My initial version of keyListener passed the value of <code>bool</code> as a paramter depending on whether it was called
by "keydown" or "keyup", but I rewrote it to get that value from event.type.

Though actually more verbose, having two switch blocks resolved confusion in my mind when to use <code>break;</code> 
and when to use <code>return;</code> to end actions.

A subtlety between programming languages is whether they only find the first matching pattern and 
perform that action, or continue down the list to check if further patterns also match &mdash;which is JavaScript's default. 

So in JavaScript, if we don't want more than one pattern matched, the action needs to be concluded with <em>break;</em> or <em>return;</em>. Since the above code does a <em>side-effect</em> by altering the value of a global variable rather than 
return a value, it doesn't matter. 

<h4>Specific event properties</h4>

In Erlang jargon, the value of the event would be called a <em>message</em>. Unlike Erlang, JavaScript allows
variables to be overwitten, so instead of responding to received messages with responce messages, 
the response to an event can can be communicated to the listening loop by writing to shared variables for it to read.

Even in this small example, I encountered weird bugs in the spaceship appearing to get confused about its current variable
values, so it's not a good programming technique for running a bank.

Something I discovered refactoring my old code is that the keyCode attribute for 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent">keyboad events</a> is deprecated,
which is good because figuring out which numbers go with which keys makes unreadable code. 

The current ways is to use 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key">KeyboardEvent.key</a> as above.

It took several frustrating hours to discover the magic incantation to stop other keys from breaking the game,
and the solution was counterintuitively making
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
document.addEventListener("keydown", (event) => keyListener(event));
document.addEventListener("keyup",   (event) => keyListener(event));
```

So we now have a simple framework whereby, if we want to make the game more complex, we can add more case statements to
handle other keys. The number of events that need to be handled tend to proliferate, so using them as the starting point
for the various components makes keeping the overall design clean much simpler.

<h2>Sounds</h2>

Another relatively simple thing about this game is there are only four sounds: missile fire, rocket thruster, explosion
(when a missile hits a rock or a rock hits the spaceship) and constantly looping eerie space background noise.

Two of these sounds are linked to keyboard events: missile fire to the spacebar, and the rocket thruster to the up arrow.
Following my ideology of thinking events first, I decided to move the sounds triggered by key events
out of the listening loop (which invariably gets very cluttered) into keyListener.

I considered making a new <code>keySound(event)</code> listener. One of the reasons JavaScript
introduced <em>addEventListener</em> as an alternative to <em>target.onevent = function ()...</em> was to allow the same
event to trigger several listeners, but decided against this because of the hassle duplicating the code handling
"non-game" keys.

<h3>Audio Basics</h3>

I'm more of a graphics than a sound guy, so found understanding the concepts and jargon here fairly tricky.

As with JavaScript's canvas which needs a <em>context object</em> instantiated (conventionally called <code>ctx</code>), 
there's an <a href="https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext">BaseAudioContext()</a> object
which I've instantiated as <code>audioCtx</code> (keeping to the recommended JavaScripty style of camel rather
than snake case), checking which of the two AudioContexts the browser prefers, as follows:

```javascript
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
```

The audio equivalent of JavaScript's <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image">Image()</a>
object appears to be <a href="https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createBufferSource">
BaseAudioContext.createBufferSource()</a>. For my four sound files, I create the following global constants near the 
top of my script:

```javascript
const soundtrack = audio_ctx.createBufferSource();
const thrust_sound = audio_ctx.createBufferSource();
const missile_sound = audio_ctx.createBufferSource();
const explosion_sound = audio_ctx.createBufferSource();
```

Whereas <code>Image()</code> simplifies graphic file downloads to <code>myImage.src="whatever.jpg"</code>, 
source sound objects need to retrieved, either by the old way of 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest">XMLHttpRequest()</a>,
or the newer, <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises">promises</a>-based
<a href="">fetch</a>.

The method we want to apply the sound file data to similarly has an old and a newer promises-based syntax
<a href="https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData">
Promise<decodedData> baseAudioContext.decodeAudioData(ArrayBuffer);</a>, so chaining things the promises way
cuts this function down to:

```javascript
function loadSound(url, audioNode) {
  fetch(url)
  .then((response) => response.arrayBuffer())
  .then((buffer) => audioCtx.decodeAudioData(buffer))
  .then((decodedData) => audioNode.buffer = decodedData);
}
```

I have to confess the above style of coding looks fairly alien to me, but also pretty promising.

Once loaded with data, the sound source object appears to be transformed into an
<a href="https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode">AudioBufferSourceNode</a>
(I find the documentation extremely confusing).

With the exception of the background noise which plays in a loop, the event-linked sounds need to be copied to
new instances of <em>audioCtx.createBufferSource()</em> every time they are used. For the rocket thruster sound,
this object neads to be stored so that it can later be stopped, so needs a return value:

```javascript
function playSound(audioNode) {
  const sound = audioCtx.createBufferSource();
  sound.buffer = audioNode.buffer;
  sound.connect(audioCtx.destination);
  sound.start();
  return sound;
}
```

<h3>Missile fire</h3>

A game design decision I made was that instead of allowing "automatic" fire whereby the player can simply hold the space
bar down to send up to 60 missiles per second, the spaceship has to <em>reload</em> after each shot by releasing the space
bar. This means firing requires two boolean <code>inputState</code> variables, arrow up and loaded, to be <em>anded</em>.

Somewhat inelegantly, toggling the <em>loaded</em> boolean on and off is split between the event listener and the listening 
loop which updates graphics as explained shortly.

<h3>Rocket noise</h3>

In contrast to "one shot" missile fire, I decided the rocket should keep accelerating while the up arrow is held down.
The original version of the game gave no reason to do this since moving the rocket complicated shooting rocks while avoiding
hitting them a lot. This is why I introduced the recoil action. 

Something I learned the hard way before refactoring the code to make the thrust sound a keyboard event, 
the listening loop created 60 new copies a second, creating an awful cacophony.

<h3>Should explosions be an event?</h3>

Explosions differ from the ambient background noise loop and keyboard triggered shots and rocket fire in that they occur
when the listening loop detects detects collisions. Making them custom events is taking my ideology to extremes, but I 
thought it would be fun and educational to use them to explore JavaScript's custom events, creating code which may
be useful in future.

<a href="https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events">
Creating and triggering events</a>

<a href="https://developer.mozilla.org/en-US/docs/Web/API/Event">Event()</a> or
<a href="https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent">CustomEvent()</a>?

const event = new Event('build');

<a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent">elem.dispatchEvent(event);</a>

<h2>Game State</h2>

<h3>Thinking in tables (rows and columns) rather than objects</h3>

While a video game may not look like a spreadsheet, abstractly it consists of a list of <em>curly bracketed things</em> 
(which we can think of as rows), each of which is a compound data structure whose properties or attributes can be thought of as slotting into columns.

So all the components of our game boil down to a list of <em>curly bracketed things</em>:

<code><pre>
[ {keyA:valA1, keyB:valB1, keyC:valC1, ...}
, {keyA:valA2, keyB:valB2, keyC:valC2, ...} 
, {keyA:valA3, keyB:valB3, keyC:valC3, ...} 
...
]
</pre></code>

<h4>Graphic source parameters</h4>

I'll use <a href="https://en.wikipedia.org/wiki/Sprite_(computer_graphics)">sprite</a> as the generic name for these
<em>curly bracketed things</em>. In RiceRocks there are four types: spaceship, asteroid, missile, and explosion.

In this case, no two sprites use the same image, but I've included a <em>type</em> attribute with a string name
to differentiate sprites by name rather than image object in case this isn't true in future games.

Each of these has an associated image object, some of which are <em>sprite sheets</em> &mdash; tiles of smaller images.
The only animated sprite in this game is 
<a href="https://github.com/roblaing/webgames/blob/master/ricerocks/public/explosion_alpha.png">explosion</a>
which has a row 24 square images of 128 x 128 pixels, providing an animation which requires us to keep track of
<em>rows, columns,</em> and units of time, which I'll call <em>ticks</em>.

The <a href="https://github.com/roblaing/webgames/blob/master/ricerocks/public/double_ship.png">spaceship</a> has
two images of 90 × 90 pixels, not for animation, but to show if it's rocket thruster is on or not.

<a href="https://github.com/roblaing/webgames/blob/master/ricerocks/public/asteroid_blue.png">Asteroids</a> consist of
just one 90 x 90 pixel tile, and <a href="https://github.com/roblaing/webgames/blob/master/ricerocks/public/shot2.png">missiles</a>
of one 10 x 10 pixel tile.

This <em>image source</em> data provides us with the first set of common <em>column names</em> for all our sprites.

A style I picked up from looking at SQL code is to use leading commas, which is especially handy for keeping track of
opening and closing curly and square brackets in nested compound data structures, which mercifully I don't need here.

For an explosion, the <em>curly bracketed thing</em> so far looks like this:

```javascript
{ type: "spaceship"
, image: spaceship
, width: 90
, height: 90
, row: 0
, column: 0
, ...
}
```

This provides us with the first five pieces of information we need for 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage">
ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);</a>, leaving four to go.

<h4>Graphic destination parameters</h4>

Whereas its convenient for each sprite to store image source parameters as expected by <em>drawImage</em>, its
best to think basic physics rather than computer graphics for the destination parameters.

This exercise got me to dust off my <a href="https://en.wikipedia.org/wiki/Classical_mechanics">classical mechanics</a>,
knowledge, a subject I found extremely dull at school, but would have found fascinating if it had been combined with video games.

The term <a href="https://en.wikipedia.org/wiki/Physics_engine">physics engine</a> is used interchangeably with
<a href="https://en.wikipedia.org/wiki/Game_engine">game engine</a>, and its good jargon since it brings otherwise 
dry subjects such as trigonometry and vectors to life.

One of the core ideas of classical mechanics is we abstract a moving thing as a single point, called its centre of mass or gravity,
which I'm going to call <em>x_centre</em> and <em>y_centre</em>. So we store the co-ordinates of the centre of the sprite rather
than the top left co-ordinates called <code>dx</code> and <code>dy</code> by <em>drawImage</em>.

```javascript
{ ...
, x_centre: canvas.width/2
, y_centre: canvas.height/2
, radius: 35
, ...
}
```

The co-ordinate conventions for computer screens aren't quite the same as a
<a href="https://en.wikipedia.org/wiki/Cartesian_coordinate_system">Cartesian plane</a> in that the (0,0) centre is in the
top left corner and down is positive for y. To get the centre of the playing area, we use (canvas.width/2, canvas.height/2).

By scaling <code>sWidth</code> to <code>dWidth</code> and <code>sHeight</code> to <code>dHeight</code>
&mdash; which in this game is done by sizing the canvas by <code>window.innerWidth</code> and
<code>window.innerHeight</code>, but in a 3d game could also involve making closer objects look bigger,
or in a 2d game getting different sized sprites to look bigger or smaller...  &mdash;
and then using <code>dWidth</code> and <code>dHeight</code> to move from the centre to
the top left corner, we've not got the last four required parameters for <em>drawImage</em>.

For collision calculations, all sprites in this game are treated as circles of various radii to keep things simple.

<h4>Motion</h4>

Back to <em>classical mechanics</em>, we want to give our sprites linear and angular velocity. Velocity is defined
as the change distance divided by the change in time.

Luckily, we can simplify the algebra by setting the change in time to one, but need to remember what one unit of time is:
of the confusing choices, I'm going with
<a href="https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame">Window.requestAnimationFrame(callback)</a>
to set my loop speed to about one-sixtieth of a second irrespective of the hardware. I'm going to call my unit of time a
<em>tick</em> which equates to 1/60 second.

To take 2d direction into account, I can either store how far each sprite moves per tick in polar co-ordinates 
(velocity, direction) or Cartesian co-ordinates (x_delta, y_delta) where 
<code>x_delta = velocity * Math.cos(direction)</code> and <code>y_delta = velocity * Math.sin(direction)</code>.

Alternatively, <code>velocity = Math.sqrt(Math.pow(x_delta, 2) + Math.pow(y_delta, 2));</code> 
(we will see the Pythagorean theorem again in collision detection)
and <code>direction = Math.atan(y_delta/x_delta);</code>. I find polar co-ordinates easier to visualise, so am
naming these <em>columns</em> &mdash; or attributes, properties, key names... &mdash; velocity and direction.

The spaceship starts stationary, so its velocity is 0, making its direction academic. 
Asteroids get initialised with random velocities and directions:

```javascript
{ ...
, velocity: scale * (Math.random() - 0.5)
, direction: Math.random() * 2 * Math.PI
, ...
}
```

<h4>Spin</h4>

Something that tripped me up initially was I made the spaceship's movement direction and where it was pointing the same variable,
causing bugs when I mutated it to an explosion and back to a spaceship. Getting sprites to point in a
given direction requires calling
<a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/translate">ctx.translate(x, y);</a>
and then <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate">ctx.rotate(angle);</a>
before drawing.

Another thing that tripped me up is that <em>up</em> in computer graphics is <code>-Math.PI/2</code> because the vertical signs 
are flipped from a Cartesian plane.

The spaceship starts pointing up, and then turns clockwise while the right key is held down and anti-clockwise when the
left key is held down. This is setting <em>angular_velocity</em> to plus or minus <code>Math.PI/60</code> where the 60 is
kinda arbitrary and playing around with it tweaks the feal of the game nicely.

Using the centre of the spaceship sprite as the point it rotates when you press the right or left arrows looks a bit 
unrealistic to me, but as far as I recall, the original Asteroids game worked like that.

Though the asteroids aren't animated per se, to make them look interesting we get them to spin either clockwise
or anti-clockwise at random rates.

```javascript
{ ...
, angle: -Math.PI/2
, angular_velocity: Math.PI/60
, ...
}
```

<h4>Time</h4>

Explosions and missiles are ephemeral, so I need to give them a <em>lifespan</em> of N ticks, keeping count of how long
they have been in existence with a variable called <em>tick</em>. Though the spaceship and asteroids don't have a fixed
lifespan, simply setting <code>tick = lifespan</code> simplifies adding them to the kill list during that phase of the loop.

Putting this all together, my <em>curly-bracketed thing</em> for a sprite, using the spaceship as an example, looks like so:

```javascript
{ type: "spaceship"
, image: spaceship
, width: 90
, height: 90
, row: 0
, column: 0
, x_centre: canvas.width/2
, y_centre: canvas.height/2
, radius: 35
, velocity: 0
, direction: 0
, angle: -Math.PI/2
, angular_velocity: 0
, tick: 0
, lifespan: Infinity
}
```

<h3>Factory or Constructor?</h3>

What should be easy &mdash; initialising our <em>curly-bracketed things</em> &mdash; turns into a religious argument
in Javascript over whether this should be done by a <em>factory function</em> (which is just a normal function whose
return type is an object which in turn will be handled by normal functions such as <code>draw(sprite)</code>) or a 
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor">constructor</a>
for those who like <em>classy</em> code with <code>sprite.draw()</code>:

```javascript
class Sprite {
  
  constructor(tp, im, w, h, row, col, x, y, rad, v, d, a, av, t, l) { 
    this.type = tp;
    this.image = im;
    this.width = w;
    this.height = h;
    this.row = row;
    this.column = col;
    this.x_centre = x;
    this.y_centre = y;
    this.radius = rad;
    this.velocity = v;
    this.direction = d;
    this.angle = a;
    this.angular_velocity = av;
    this.tick = t;
    this.lifespan = l;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x_centre, this.y_centre);
    ctx.rotate(this.angle);
    ctx.drawImage(this.image, this.column * this.width, this.row * this.height, 
      this.width, this.height, 
      -(scale * this.width)/2, -(scale * this.height)/2, 
      scale * this.width, scale * this.height);
    ctx.restore();
  }

  // update() would go here...
}

sprites.push(new Sprite("spaceship", spaceship, 90, 90, 0, 0, canvas.width/2, canvas.height/2, 
  35, 0, 0, -Math.PI/2, 0, 0, Infinity));
```

Possibly influenced by originally doing this game in Python, in a very OOP biased course, I made everything
in my original version a class.

I've subsequently learned that among the reasons the OOP style is bad is that it burries <em>draw, update, ...</em> 
inside the Sprite class, making them hard to re-use more generally. 

```javascript
function create(tp, im, w, h, rw, col, x, y, rad, v, d, a, av, t, l) { 
  return { type: tp
         , image: im
         , width: w
         , height: h
         , row: rw
         , column: col
         , x_centre: x
         , y_centre: y
         , radius: rad
         , velocity: v
         , direction: d
         , angle: a
         , angular_velocity: av
         , tick: t
         , lifespan: l
         };
}

sprites.push(create("spaceship", spaceship, 90, 90, 0, 0, canvas.width/2, canvas.height/2, 
  35, 0, 0, -Math.PI/2, 0, 0, Infinity));
```

No <em>class, this, new</em>, extraneous dots... much simpler, easier to understand code.

<h4>Ticking up sprites</h4>

JavaScript objects are <em>mutable</em>, which means we can update <code>x_centre</code> with 
<code>x_centre + velocity * Math.cos(direction)</code>, <code>y_centre</code> with
<code>y_centre + velocity * Math.sin(direction)</code>, <code>angle</code> with
<code>angle + angle_velocity</code>

```javascript 
function update(sprite) {
  sprite.x_centre += sprite.velocity * Math.cos(sprite.direction);
  sprite.y_centre += sprite.velocity * Math.sin(sprite.direction);
  sprite.angle += sprite.angular_velocity;
  sprite.tick++;
}
```


<h3>List processing</h3>

One of my goals here was to keep things minimalistic to focus on JavaScript's basic functions, but the temptation to tinker around
with fictional physics proved too strong &mdash; and the nice thing about keeping things simple is that small tweeks to a
a few parameters change the way sprites move and react to player input a lot.







The centre of the screen 

The angle for up is -Math.PI/2... along with counting from zero, these
are historical bad decisions we are now stuck with.






<h3>forEach or map?</h3>

```javascript
let sprites = []; // global list of sprites, has to be let (not const) for concatenation and filter

function loop() {
  ...
  sprites.forEach( function (sprite) { draw(sprite); update(sprite); });
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

<table>
<tr>
<td><a href="https://github.com/roblaing/webgames/blob/master/ricerocks/public/nebula_blue.f2014.png">Background</a></td>
<td>1 x 800 × 600 pixels</td>
</tr>
<tr>
<td><a href="https://github.com/roblaing/webgames/blob/master/ricerocks/public/splash.png">Splash</a></td>
<td>1 x 400 x 300 pixels</td>
</tr>
<tr>
<td><a href="https://github.com/roblaing/webgames/blob/master/ricerocks/public/debris2_blue.png">Debris</a></td>
<td>1 x 640 x 480 pixels</td>
</tr>
</table>



