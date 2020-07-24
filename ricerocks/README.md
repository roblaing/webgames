<h1>Game 1: RiceRocks</h1>

<q>Learning coding is like playing cards — you learn the rules, then you play, then you go back and learn the rules again, 
then you play again.</q> &mdash; From Mozilla's
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API">Web audio concepts and usage</a> guide.

<h2><a href="https://developer.mozilla.org/en-US/docs/Web/API">Web APIs</a></h2>

Frontend web development boils down to familiarisation with the bewildering choice of Web APIs available, and
the goal of this first game was to learn a minimal subset to get animation, sound, and user interaction working.

Invariably there are at least four ways of doing anything with JavaScript, and guessing the correct one
involves knowing whether it is old or new, good or bad, functional or object-oriented,
synchronous or asynchronous, block or function scope... 

Achieving a desired goal requires an encyclopaedic knowledge of many objects and their properties, 
events and their handlers, and methods and their parameters &mdash; mercifully <a href="https://developer.mozilla.org/en-US/">
MDN</a> is an excellent reference.

These are the ones I've settled on for now.

I've attempted to draw a hierarchy of the objects I've used, though in JavaScript that's not easy. 
For instance, though Document is a child of Window, and CanvasRenderingContext2D of HTMLCanvasElement etc, 
coding convention is to treat each as a separate object.
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

A big adaption of the original game was making the game <em>mobile friendly</em> by making the screen size <em>responsive</em>
and figuring out touch events, which I'll cover below.

<h4>Where to start?</h4>

Conventional, sequential programs tend to have block called <em>main</em> or a function called <em>init()</em>, <em>start()</em>,
or <em>setup()</em> as the entry point to the programme.

The equivalent with JavaScript web applications is an event attached to the root, window object. As with most things JavaScript,
there's a confusing choice between <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event">load</a> or
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event">DOMContentLoaded</a>, which I've somewhat
arbitrarily picked.

The entry point of my programme introduced me two notorious horrors of Javascript: the 
<a href="https://javascript.info/callbacks#pyramid-of-doom">Pyramid of Doom</a> (also known as <q>Callback Hell</q>); 
and the <q>White Screen of Death</q>, neither problem I've entirely solved.

I toyed with putting the code below into a function called <em>init()</em>, but decided to simply leave it in the body of
the script because making it a separate function didn't <a href="https://en.wikipedia.org/wiki/Don%27t_repeat_yourself">DRY</a> 
or <a href="https://en.wikipedia.org/wiki/KISS_principle">KISS</a> anything. Furthermore, placing initialisation steps in a
block starting with <code>window.addEventListener("DOMContentLoaded", ...</code> seems more in keeping with
<em>event-driven programming</em> than creating an extraneous function.

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

A problem the above code addresses is I want my website to have <a href="https://developers.google.com/search/mobile-sites/mobile-seo/responsive-design">
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

Mercifully, the initial <q>window then background image loaded before launchign the loop</q> chain only involves two steps, 
so its pyramid of doom isn't very high. Preventing a <q>white screen of death</q>, however, involved the additional step of 
invoking JavaScript's <a href="https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await">async function (...) {... await ...}</a> combination to avoid the loop getting started before <code>scale</code> was set correctly.

A fourth event, <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event">resize</a>, is attached to the window so the user
can make the board bigger or smaller by adjusting the size of their browser, or changing the orientation of their phone.

<h4>How to stop?</h4>

Frameworks which have an <em>init()</em> or <em>setup()</em> starting point tend to have a <em>stop(), terminate(),</em> or
<em>cleanup()</em> function to call at the end. I discovered I needed something like that after testing my site on a mobile phone 
and discovering that when I closed a window but didn't shut down the browser, the sound continued. I attempted to fix
this with yet another event handler.

Again, in keeping with my home brewed <em>event-driven programming</em> style, everything goes into a main body code stanza 
starting 
with <code>window.addEventListener("unload",...</code> rather than a function.

```javascript
window.addEventListener("unload", function (event) {
  backgroundSound.stop();
  thrustSound.stop();
  missileSound.stop();
  explosionSound.stop();
});
```

<h3>Adapting for mobile part 1</h3>

I naively thought it would be easy to adapt <em>keydown</em> into
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event">touchstart</a> and <em>keyup</em> into 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/touchend_event">touchend</a>, but it turned out
Javascript's <a href="https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent">Touch Events</a> are a whole new API.

At this stage, expanding the game to handle touch screens simply involves attaching these two events to the <code>canvas</code> 
object in the <em>init</em> part of my code. I picked <em>canvas</em> rather than <em>document</em> in accordance with
the JavaScript rule of thumb to avoid bubbling as much as possible.

```javascript
window.addEventListener("DOMContentLoaded", async function (event1) {
  await backgroundImage.addEventListener("load", function (event2) {
    ...
    canvas.addEventListener("touchstart", touchListener);
    canvas.addEventListener("touchend",   touchListener);
    window.requestAnimationFrame(loop);
  });
});
```

I've left the keyboard listeners attached to the docoment in the body of the script, though for the sake of neatness
I probably should but them with the touch listeners to keep user input code together.

<h3>2. Handlers</h3>

I refreshed my JavaScript knowledge doing this exercise after completing an Erlang course, which has made my JavaScript code fairly Erlangish.

Among JavaScript's <em>newish</em> APIs are 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers">Web Workers</a> which follow
Erlang's approach of creating separate processes which communicate via messages. I'd like to explore this in future, but 
for now am not sure how to apply this here where the listening loop doubles as an animation loop (ie doesn't iterate every time it receives a new message, but every 1/60 second to redraw the board). I'm also confused about browser support
for web workers, so will leave learning it for later.

Instead of messages, the handlers and listening loop communicate via shared memory &mdash; which works easily in a single thread
(the default for JavaScript web applications at time of writing), but would be complicated if done in parallel using the 
multicores of modern hardware.

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

There's also <a href="http://www.seatavern.co.za/doc/global.html#resizeListener">resizeListener</a> which
has a <a href="https://developer.mozilla.org/en-US/docs/Web/API/UIEvent">UIEvent</a> passed to it by
<code>window.addEventListener("resize", resizeListener)</code>. But since I also use this as a normal function to initially
set <code>scale</code> after the window has loaded and don't use any UIEvent properties, it doesn't have any paramters.

<h3>Adapting for mobile part 2</h3>

<a href="https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Using_Touch_Events">Using Touch Events</a> is more
complicated than keyboard events, partly because the event objects returned by
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event">touchstart</a> and 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/touchend_event">touchend</a> are not symmetric.

Among their properies are
<a href="https://developer.mozilla.org/en-US/docs/Web/API/TouchList">Touch Lists</a> containing
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Touch">Touch Objects</a>.

Of these, <a href="https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches">changedTouches</a> is
common to both <em>touchstart</em> and <em>touchend</em>. Every touch creates its own event, so there doesn't appear to
be a need to go through the list of objects in a given touch event to handle games with several fingers.

Using <a href="http://www.seatavern.co.za/doc/global.html#keyListener">keyListener(event)</a> as my template,
I made touching or "untouching" the left side of the screen equivalent to pressing or releasing the left arrow, the right
side equivalent to the right arrow, the top of the screen the up arrow, and the bottom the space bar.

```javascript
function touchListener(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.changedTouches[0].clientX - rect.left;
  const y = event.changedTouches[0].clientY - rect.top;
  const h3rd = canvas.width/3;
  const v3rd = canvas.height/3;
  let key = " ";
  if (y < v3rd) {
    key = "ArrowUp";
  }
  if (x < h3rd) {
    key = "ArrowLeft";
  }
  if (x > 2 * h3rd) {
    key = "ArrowRight";
  }
  ...
```

Adding touch events proved tougher than I initially thought. But after untangling this part of JavaScript's yarn, I
think it shows how <q>event-driven programming</q> makes it relatively easy to add features to an application, often
without having to do anything except adding listeners and handlers, as in this case.

<h3>3. The main/game/listening loop</h3>

This is a function that calls itself recursively &mdash; so it never returns anything since it's an infinite loop. In
Erlang, it would have a parameter called state which it would update and pass back to itself.

In JavaScript, the loop is initially called and then repeatedly recursively called via 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame">Window.requestAnimationFrame(callback)</a>
to set the rate the canvas is redrawn for animation to 60/second irrespective of the hardware (thereby avoiding a problem
old video games have of running unplayably quickly because processor speeds have increased).

```javascript
function loop() {
  ...
  window.requestAnimationFrame(loop);
}
```
As Mozilla's <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations">Basic Animations</a>
guide explains, the <code>...</code> above expands into broadly three steps:

<ol>
<li>Clear the canvas with <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect">ctx.clearRect()</a> and create a fresh background.</li>
<li>Iteratively draw each sprite in these steps:
  <ol>
    <li>Save the canvas state with <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save">ctx.save();</a></li>
    <li>Move to centre of rotation <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/translate">ctx.translate(x, y);</a></li>
    <li>Swivel image <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate">ctx.rotate(angle);</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage">
      ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);</a></li>
    <li>Restore the canvas state with <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/restore">ctx.restore();</a></li>
  </ol>
</li>
<li>Update the position of each sprite before they're drawn again to make them move.</li>
</ol>

The loop <a href="http://www.seatavern.co.za/doc/global.html#loop">code</a> can be viewed via the documentation.

An important part is this list iteration in which each sprite is processed by 
<a href="http://www.seatavern.co.za/doc/global.html#draw">draw(sprite)</a> and then 
<a href="http://www.seatavern.co.za/doc/global.html#nextTick">nextTick(sprite)</a>:

```javascript
  sprites.forEach(function (sprite) {draw(sprite); nextTick(sprite);});
```

