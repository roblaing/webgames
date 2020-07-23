<h1>Game 1: RiceRocks</h1>

<h2><a href="https://developer.mozilla.org/en-US/docs/Web/API">Web APIs</a></h2>

Frontend web development boils down to familiarisation with the bewildering choice of Web APIs available, and
the goal of this first game was to learn a minimal subset to get animation, sound, and user interaction working.

Invariably there are at least four ways of doing anything with JavaScript, and guessing the correct one
involves knowing whether it is old or new, good or bad, functional or object-oriented,
synchronous or asynchronous, block or function scope... 

These are the ones I've settled on for now.

Achieving a desired goal requires an encyclopaedic knowledge of many objects and their properties, 
events and their handlers, and methods and their parameters &mdash; mercifully <a href="https://developer.mozilla.org/en-US/">
MDN</a> is an excellent reference.

I've attempted to draw a hierarchy of these objects, though in JavaScript that's not easy. Though Document is a child of Window,
CanvasRenderingContext2D of HTMLCanvasElement etc, coding convention is to treat each as a separate object.
<code>AudioContext</code> is initially addressed as a child of Window since it's the global, root object.

<code><pre>
├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model">DOM</a>
│   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window">Window</a>
│   │   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window#Events">Properties</a>
│   │   │   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth">innerWidth</a>
│   │   │   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight">innerHeight</a>
│   │   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window#Events">Events</a>
│   │   │   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event">DOMContentLoaded</a>
│   │   │   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event">unload</a>
│   │   │   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event">resize</a>
│   │   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window#Methods">Methods</a>
│   │   .   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame">requestAnimationFrame()</a>
│   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document">Document</a>
│   .   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document#Events">Events</a>
│   .   │   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event">keydown</a>
│   .   │   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/keyup_event">keyup</a>
│   .   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document#Methods">Methods</a>
│   .   .   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector">querySelector()</a>
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
├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement">HTMLImageElement</a>
│   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement#Constructor">Constructor</a>
│   │   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image">Image()</a>
│   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement#Properties">Properties</a>
│   .   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/width">width</a>
│   .   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/height">height</a>
│   .   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/src">src</a>
├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext">BaseAudioContext</a>
│   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/AudioContext#Constructor">Constructor</a>
│   │   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/AudioContext">AudioContext()</a>
│   └── Properties
│       └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/destination">destination</a>
└── <a href="https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode">AudioBufferSourceNode</a>
.   ├── Constructor/Instantiator
.   │   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createBufferSource">BaseAudioContext.createBufferSource()</a>
.   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode#Properties">Properties</a>
.   │   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/buffer">buffer</a>
.   │   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/loop">loop</a>
.   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode#Methods">Methods</a>
.   .   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/AudioNode/connect">connect()</a>
.   .   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/start">start()</a>
.   .   └── stop()
</pre></code>

<h2><a href="https://jsdoc.app/">JSDoc</a></h2>

Along with getting to grips with the language, I also used developing some games as a way to learn JavaScript's documentation and testing tools.

I haven't got far with the testing tools yet, but found JSDoc's tags a handy way to "think above the code" in trying to abstract RiceRocks into a general game framework.

I've also tried to follow the <a href="https://google.github.io/styleguide/jsguide.html">Google JavaScript Style Guide</a>,
with the exception of ignoring its views of trailing commans since I find leading commas far better.

Like most automated documentation systems, JSDoc lists things alphabetically, which is good for reference, but not great for explaining
<a href="https://en.wikipedia.org/wiki/Control_flow">control flow</a>, which I'll attempt in this 
<a href="https://jsdoc.app/about-including-readme.html">README.md</a> which JSDoc uses for the home page.

<h2><a href="https://en.wikipedia.org/wiki/Event-driven_programming">Event-driven programming</a></h2>

In the fog of the religious war underway between <a href="https://en.wikipedia.org/wiki/Functional_programming">FP</a> vs
<a href="https://en.wikipedia.org/wiki/Object-oriented_programming">OOP</a>, event-driven programming seems to have been
forgotten. To me, it seems the most natural approach for writing any kind of GUI application, including games.

Event-driven programming broadly involves three types of things:

<ol>
  <li>Listeners: In JavaScript, these are created with <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener">
target.addEventListener(type, listener [, options]);</a> where
<a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">target</a> is Window, Document, or other HTML element,
and <a href="https://developer.mozilla.org/en-US/docs/Web/Events">type</a> is something like "keyup", "keydown", or "click".
</li>
  <li>Handlers: This is addEventListener's second argument, a <a href="">callback</a> called listener in the documentation.</li>
  <li>A <a href="https://en.wikipedia.org/wiki/Event_loop">listening loop</a>.</li>
</ol>

<h3>1. Listeners</h3>

RiceRocks is a game I originally encountered in Rice University's <a href="https://www.coursera.org/learn/interactive-python-1">Interactive Python</a> Mooc which I've translated to JavaScript. It makes a good 
introductory example because its user input only involves four keys &mdash; the spacebar to fire missiles, 
the left arrow to rotate counter-clockwise, the right arrow to rotate clockwise, and the up arrow to move in the 
direction the spaceship is currently pointed.

In JavaScript, this translates to attaching two listeners to the document object which can share a callback 
I've named keyListener:

```javascript
document.addEventListener("keydown", keyListener);
document.addEventListener("keyup",   keyListener);
```

I initially made <em>window</em> rather than <em>document</em> my target, and it doesn't make much difference. JavaScript events are said to
<a href="https://javascript.info/bubbling-and-capturing">bubble</a> through the DOM, arriving at the Window if nothing has captured them before then.
It's generally good practice to make the target as close to the event as possible.

The original game had a splash screen which was removed by clicking on the canvas with a mouse, but I left it out since it doesn't add much.

A less obvious event is <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event">DOMContentLoaded</a> &mdash;
which I'm actually not sure is the better choice than <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event">load</a>.

Getting this to work introduced me to two notorious horrors of Javascript: the <a href="https://javascript.info/callbacks#pyramid-of-doom">
Pyramid of Doom</a> (also known as <q>Callback Hell</q>); and the <q>White Screen of Death</q>.

My solution (which I'm not sure fixes these problems adequately) looks like this:

```javascript
window.addEventListener("DOMContentLoaded", async function (event1) {
  await backgroundImage.addEventListener("load", function (event2) {
    resize();
    sprites[0] = createSpaceship();
    for (let rock = 1; rock <= 13; rock++) { 
      sprites[rock] = createAsteroid();
    }
    window.addEventListener("resize", resize);
    window.requestAnimationFrame(loop);
  });
});
```

The problem the above code addresses is I want my website to have <a href="https://developers.google.com/search/mobile-sites/mobile-seo/responsive-design">
responsive design</a> in that the <em>board</em> (ie canvas object) should use all the available screen real estate. To calculate this, the programme needs
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth">window.innerWidth</a> and 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight">window.innerHeight</a>, which if used before the window has completed
loading, will be <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined">undefined</a>.

The base size (ie scale = 1.0) is provided by the width and height of the background image, which if read before the graphic file has finished downloading
will be <em>undefined</em>.

A pitfall most novices will fall into is that, without care, JavaScript will produce a garbage value for <code>scale</code> using <em>undefined</em> 
for its calculation which canvas won't draw, leading to the dreaded <q>White Screen of Death</q> with no error messages or clues on the console. 

Before unravelling the above code, lets look at the <em>new way</em>, 
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises">promises</a>, using 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API">fetch</a> which I've written the function to download sound files with:

```javascript
function loadSound(url, audioNode) {
  fetch(url)
  .then((response) => response.arrayBuffer())
  .then((buffer) => audioCtx.decodeAudioData(buffer))
  .then((decodedData) => audioNode.buffer = decodedData);
}
```

Three asynchronous processes which are contingent on each other &mdash; the buffer property of the audio node needs data
decoded by the audio context, which in turn depends on a sound file that has to have finished downloading. 
The <code>.then(...)</code> syntax lets us chain these three steps together in <em>sequential</em> steps, hiding the mind-bending concurrency.

The <em>old way</em> of doing this was to nest each subsequent asynchronous step in the callback of its predecessor, which for many contingent steps
would lead to very deeply nested, ugly code &mdash; the <q>Pyramid of Death</q>.

Mercifully, the <q>window then background image loaded</q> chain only involves two steps, so its pyramid of doom isn't very high. 
Preventing a <q>white screen of death</q>, however, involved the additional step of 
invoking JavaScript's <a href="https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await">async function (...) {... await ...}</a>
combination to avoid the loop getting started before <code>scale</code> was set correctly.

A fourth event, <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event">resize</a>, is attached to the window so the user
can make the board bigger or smaller by adjusting the size of their browser, or changing the orientation of their phone. A problem with keyboard
user inputs is the game isn't mobile friendly, so adding <a href="https://developer.mozilla.org/en-US/docs/Web/API/Touch_events">Touch Events</a>
is in the todo list.

Among the advantages of <em>event-driven programming</em> is adding user interactions simply involves writing new listeners and handlers without effecting existing code.

A problem I encountered testing my site on a mobile phone was if I closed the window, the sound continued. I attempted to fix
this with yet another event handler:

```javascript
window.addEventListener("unload", function (event) {
  backgroundSound.stop();
  thrustSound.stop();
  missileSound.stop();
  explosionSound.stop();
});
```

<h3>2. Handlers</h3>

I refreshed my JavaScript knowledge doing this exercise after completing an Erlang course, which has made my JavaScript code fairly Erlangish.

Among JavaScript's <em>newish</em> APIs are 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers">Web Workers</a> which follow
Erlang's approach of creating separate processes which communicate via messages. I'd like to explore this in future, but 
for now am not sure how to apply this here where the listening loop doubles as an animation loop (ie doesn't iterate every time it receives a new message, but every 1/60 second to redraw the board). I'm also confused about browser support
for web workers, so will leave learning it for later.

Instead of messages, the handlers and listening loop communicate via shared memory &mdash; which works in a single thread
(the default for JavaScript web applications at time of writing), but wouldn't work in parallel using the multicores of 
modern hardware.

This makes a data structure, <a href="http://www.seatavern.co.za/doc/inputStates.html">inputStates</a>, stored as a global
constant, vital since it is the core messaging mechanism between the handlers and the game loop.
All the propertis of inputStates (with the exception of a sound buffer which should maybe be moved into the spaceship
<a href="http://www.seatavern.co.za/doc/Sprite.html">sprite</a>) 
are booleans, and I've followed Google's style of using a
<a href="https://google.github.io/styleguide/jsguide.html#naming-method-names">isFoo</a> convention. For some, I've gotten
into the habit of using <a href="https://en.wikipedia.org/wiki/Snake_case">snake case</a>, so find the JavaScript convention
of camelCase and PascalCase a bit alien, but am getting the hang of it.

The guts of Erlang programmes follow a <code>pattern -> action</code> template, which emulating in JavaScript involves its
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch">switch</a> statement. 
A gotcha in JavaScript is that its switch statements are <q>Fall Through</q>, meaning that unlike Erlang's case statements
which do one action for the first matching pattern, JavaScript will attempt to match further patterns unless the relevant
<code>case</code> is terminated with <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/break">
break</a> or <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return">return</a>.

I found the choice confusing until I wrote <a href="http://www.seatavern.co.za/doc/global.html#keyListener">keyListener(event)</a>
which has an initial switch block to find if the event type is "keydown" or "keyup", terminated with <code>break;</code> because
I want to continue to the second switch block to find what key was pressed or released. These cases are terminated with
<code>return;</code> since that's the listeners job done, even though it doesn't return anything.

A JSDoc gotcha that tripped me was to try and tag keyListener as <code>@callback</code> instead of <code>@function</code>, which
resulted in it getting ommited from the documentation.

While I had little difficulty in getting the four user input keys to work, pressing any keys not listened to caused the programme
to freeze until I discovered that, counter-intuitively, the <code>default</code> statement should be 
<code>event.preventDefault();</code>.

Another challenge was getting the browser to open a debugging console with F12 &mdash; which stopped working after keyboard
events were <em>captured</em> by my own function. The trick here was to write a case statement forwarding this key event
back to the document. To be fancy, I wrote <code>event.target.dispatchEvent(event);</code> rather than
<code>document.dispatchEvent(event);</code> just to test what the event.target property holds.

The only other listener is <a href="http://www.seatavern.co.za/doc/global.html#resizeListener">resizeListener</a> which
has a <a href="https://developer.mozilla.org/en-US/docs/Web/API/UIEvent">UIEvent</a> passed to it by
<code>window.addEventListener("resize", resizeListener)</code>. But since I also use this as a normal function to initially
set <code>scale</code> after the window has loaded and don't use any UIEvent properties, it doesn't have any paramters.



Instead
of sending the listening loop a message according to whatever case, here the handler writes to a global variable which the
listening loop reads



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

A bit alien at first, using a <code>.then</code> chain makes asynchronous steps look sequential, sidestepping
the common exasperation of using <code>async function() {...}</code> combined with <code>await</code> to throw 
away all of JavaScript's concurrency when things don't work.

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


<h3>Vectors</h3>

<h4>Computer gaphics vs Cartesian plane</h4>

```javascript
function polar(sprite, speed) {
  let dir;
  const x_vel = (sprite.velocity * Math.cos(sprite.direction) + 
    (scale * speed * Math.cos(sprite.angle)));
  const y_vel = (sprite.velocity * Math.sin(sprite.direction) + 
    (scale * speed * Math.sin(sprite.angle)));
  const vel = Math.sqrt(Math.pow(x_vel, 2) + Math.pow(y_vel, 2));
  if (x_vel >= 0) {
    dir = Math.asin(y_vel/vel);   // quadrant 1 & 4
  }
  if (x_vel < 0 && y_vel < 0) {
    dir = Math.atan(y_vel/x_vel) - Math.PI;  // quadrant 2
  }
  if (x_vel < 0 && y_vel > 0) {
    dir = Math.acos(x_vel/vel);  // quadrant 3
  }
  return [vel, dir];
}
```

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
<code>x_delta = velocity * Math.cos(direction)</code> and <code>y_delta = velocity * Math.sin(direction)</code>
and <code>direction = Math.atan(x_delta/y_delta)</code>. I decided polar co-ordinates made more sense, which forced
me to revise my trigonometry on getting the correct quadrant. For a Cartesian plane, it's

<ol>
  <li>All</li>
  <li>Sine</li>
  <li>Tangent</li>
  <li>Cosine</li>
</ol>

For computer graphics, we need to remember y is flipped, so it becomes

<ol>
  <li>Cosine</li>
  <li>Tangent</li>
  <li>Sine</li>
  <li>All</li>
</ol>

The spaceship starts stationary, so its velocity is 0, making its direction academic. 
Asteroids get initialised with random velocities and directions:

```javascript
{ ...
, velocity: scale * (Math.random() - 0.5)
, direction: Math.random() * 2 * Math.PI
, ...
}
```



I decided to go for polar co-ordiantes, forcing me to dust-off my high-school trigonometry to figure out how
the spaceship thrust or recoil from missile fire would change its velocity and direction. Mercifully, I could
just put this in an <em>impure</em> function with the side-effect of mutating a <em>curly-bracketed thing's</em> 
values rather than return anything.

```javascript
function acceleration(sprite, speed) {
  const x_vel = (sprite.velocity * Math.cos(sprite.direction) + (scale * speed * Mat.cos(sprite.angle)));
  const y_vel = (sprite.velocity * Math.sin(sprite.direction) + (scale * speed * Mat.sin(sprite.angle)));
  sprite.velocity = Math.sqrt(Math.pow(x_vel, 2) + Math.pow(y_vel, 2));
  sprite.direction = Math.atan(x_vel/y_vel);
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

<h3>FP or OOP?</h3>

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

<h3>Ticking up sprites</h3>

JavaScript objects are <em>mutable</em>, which means we can update the sprite after it's drawn in
its new position before its drawn again the next tick:

```javascript 
function update(sprite) {
  ...
  sprite.x_centre += sprite.velocity * Math.cos(sprite.direction);
  sprite.y_centre += sprite.velocity * Math.sin(sprite.direction);
  sprite.angle += sprite.angular_velocity;
  ...
}
```

The gameboard is toroidal, so all sprites also have their position toggled if they move over an edge.

Certain updates are specific for types. For instance <em>ephemeral</em> missiles and explosions need to count ticks to reach
their lifespans:

```javascript
  ...
  sprite.tick++;
  ...
```

Explosion is the only animated sprite in this game, and its column needs to be incremented to animate through its
24 frames before ending its lifespan (so the value given to lifespan sets the animation speed).

```javascript
  ...
  sprite.column = Math.floor((sprite.tick/sprite.lifespan) * 24);
  ...
```

The spaceship is more complex in that it updates its attributes depending on the values in inputStates. It also creates
missiles which are in this step put into a separate list to be concatenated to sprites after it has completed the 
iteration in progress. Changing the length of a list itself while it is being iterated is a recipe for bugs, which
is why I've made filtering dead sprites and concatenating new sprites separate steps in loop().

```javascript
THRUST = 0.1;
RECOIL = 0.05;
ROTATE_RATE = 60;

  ...
  if (inputStates.up) {
    sprite.column = 1;
    vectorMove(sprite, THRUST_SPEED);
  } else {
    sprite.column = 0;
  }
  if (inputStates.right) {
    sprite.angular_velocity = Math.PI/ROTATE_RATE;
  } else {
    sprite.angular_velocity = 0;
  }
  if (inputStates.left) {
    sprite.angular_velocity = -Math.PI/ROTATE_RATE;
  } else {
    sprite.angular_velocity = 0;
  }
  if (inputStates.space && inputStates.loaded) {
    new_sprites.push(create_missile(sprite));
    vectorMove(sprite, RECOIL);
    inputStates.loaded = false;
  }
  ...
```

<h3>Collision detection</h3>

In this game, rock beats spaceship, missile beats rock. Rocks colliding don't do anything to each other
(though it would be fun to expand the game physics to have the asteroids cause each other to bounce around 
like billiard balls), and the spaceship is immune from its own missiles (though again, it might be fun to change
that so missed shots are fatal in a toroid).

Each tick, the spaceship needs to check if it's been hit by an asteroid, and an asteroid needs to check if it has been
hit by a missile.


```javascript
function collisions(sprite1, type) {
  return sprites.filter((sprite2) => sprite2.type === type &&
    Math.sqrt(Math.pow(sprite2.x_centre - sprite1.x_centre, 2) + 
              Math.pow(sprite2.y_centre - sprite2.y_centre, 2)) 
    <= scale * (sprite1.radius + sprite2.radius);
  );
}

  // for spaceship
  const hitlist = collisions(sprite, "asteroid");

  // for asteroid
  const hitlist = collisions(sprite, "missile");
```

<h4>Explosions</h4>

When the spaceship and one or more asteroids collide, they all explode (I learned the need to also destroy the asteroid
the hardway when the resurected spaceship kept up exploding again because the asteroid was still there).

When an asteroid gets hit by a missile, it explodes. 

Explosions differ from other sprites because instead of creating a new <em>curly bracketed thing</em>, an
existing sprite mutates into an explosion for given number of ticks. I find it looks coos if the explosion
"inherits" the moment of whatever it was. (My physics knowledge isn't sufficient to know how this should
really work, and learning more would be another fun education project for a later date).

When it reaches its lifespan, the explosion either mutates back into the spaceship, or dies and spawns a replacement
asteroid. For the explosion to know what its type was in a past life, I tag on a new attribute <em>was</em>.


```javascript

  // for spaceship hit by one or more asteroid
  if (hitlist.length > 0) {
    if (inputStates.thrust === true) {
      inputStates.thrust_sound.stop();
      inputStates.thrust = false;
    }
    playSound(explosion_sound);
    lives--;
    sprite.was = "spaceship";
    sprite.type = "explosion";
    sprite.image = explosion";
    sprite.tick = 0;  // reset starting clock to zero
    sprite.lifespan = 30; // half a second, rocket fuel is vicious
    hitlist.forEach(function (asteroid) {
      asteroid.was = "asteroid";
      asteroid.type = "explosion";
      asteroid.image = explosion";
      asteroid.tick = 0;
      asteroid.lifespan = 120; // rocks hit by spacecraft disintegrate very slowly
    sprite.lifespan = 30; // half a second, rocket fuel is vicious
    });
  }

  // for asteroid hit by a missile 
  if (hitlist.length > 0) {
    playSound(explosion_sound);
    score++;
    hitlist[0].tick = hitlist[0].lifespan; // only the first missile kills and gets killed
    sprite.x_centre = hitlist[0].x_centre; // decided it looks cooler if the explosion 
    sprite.y_centre = hitlist[0].y_centre; // epicentre is where it was hit
    sprite.was = "asteroid";
    sprite.type = "explosion";
    sprite.image = explosion";
    sprite.tick = 0;  // reset starting clock to zero
    sprite.lifespan = 60; // Asteroids are destroyed faster by missiles than spaceship collisions
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



