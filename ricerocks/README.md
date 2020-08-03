<h1>Game 1: RiceRocks</h1>

My original goal with this game was to create a minimalist HTML5 arcade-style game to learn the basics. I translated a
game I originally encountered many years in Rice University's 
<a href="https://www.coursera.org/learn/interactive-python-1">Interactive Python</a> 
Mooc called RiceRocks. This meant the sprites and sounds were all readily available on my PC.

Though translating the game from the original Python to JavaScript wasn't very difficult, it got me thinking on various
<em>philosophical issues</em>, and I kept refactoring until it strayed far from the original.

The original Python version of RiceRocks was used to teach 
<a href="https://en.wikipedia.org/wiki/Object-oriented_programming">OOP</a>,
a style I've become disenchanted with. A lot of OOP's key selling points boil down to 
<a href="https://en.wikipedia.org/wiki/Modular_programming">modular programming</a>.

<h2>Modularisation</h2>

JavaScript only recently started supporting this, and a few things tripped me up.

Firstly, to get modules to work, the html needs to be modified:

```html
  <script type="module" src="main.js"></script>
```

What I found confusing is the module files don't need to be declared here, but the <em>main.js</em> file that imports
stuff from modules needs the <code>type="module"</code> attribute added.

The gotcha with 
<a href="https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export">
export</a> is it needs to be declard at the bottom of the module in a curly bracketed, comma separated list.
There's no arity declaration, and parameters are not included. The <em>export</em> declaration creates a
<em>wish list</em> which would initially be made of stubs, a key part of systematic software design.

A gotcha with
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import">import</a>,
which goes at the top of the file is the module file needs a path, ie <code>./module.js</code> if it is a sibling
of the main file.

<h2>Event-oriented programming</h2>

Neither OOP nor <a href="https://en.wikipedia.org/wiki/Functional_programming">FP</a> comfortably support what
Erlang's late founder Joe Armstrong termed 
<a href="https://erlang.org/download/armstrong_thesis_2003.pdf">concurreny-oriented programming</a>, specifically
<a href="https://en.wikipedia.org/wiki/Event-driven_programming">event-driven programming</a>.

<q>This nomenclature is a bit confusing, and has its origin in early operating-systems research. It refers to how communication is done between multiple concurrent processes. In a thread-based system, communication is done through a synchronized resource such as shared memory. In an event-based system, processes generally communicate through a queue where they post items that describe what they have done or what they want done, which is maintained by our single thread of execution. Since these items generally describe desired or past actions, they are referred to as 'events'</q> &mdash; 
<a href="http://aosabook.org/en/500L/an-event-driven-web-framework.html">An Event-Driven Web Framework</a>, Leo Zovic

Event-driven programming can broadly be split into three steps:

<ol>
  <li>Listeners: In JavaScript, these are created with <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener">
target.addEventListener(type, listener [, options]);</a> where
<a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">target</a> is Window, Document, or other HTML element,
and <a href="https://developer.mozilla.org/en-US/docs/Web/Events">type</a> is something like "keyup", "keydown", or "click".
</li>
  <li>Handlers: This is addEventListener's second argument, a <a href="">callback</a> called <em>listener</em> 
     in the documentation.</li>
  <li>A <a href="https://en.wikipedia.org/wiki/Event_loop">listening loop</a> &mdash; the body of a concurrent system.</li>
</ol>

<h2>Step 1: Attaching listeners to <em>targets</em></h2>

My adaption from the Python original, which assumed the game
was going to be played on a PC with a keyboard, involved adding touch input for mobile phones. After initially experimenting
with the <a href="https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent">Touch Events API</a>, using
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event">touchstart</a> and 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/touchend_event">touchend</a> attached the canvas,
I switched to including buttons in my HTML and then using 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events">Pointer Events</a> 
which make a mouse and a finger touch on a mobile phone identical. The buttons also provide a visual clue to website
visitors with keyboards which keys will work.

I'll maybe use what I learned about touch events for mobile specific designs in future.

The user interface was created by attaching event listeners to the DOM as follows:

```javascript
document.addEventListener("keydown", (event) => uiListener(inputStates, event));
document.addEventListener("keyup", (event) => uiListener(inputStates, event));
document.querySelector("#upButton").addEventListener("pointerdown", (event) => uiListener(inputStates, event));
document.querySelector("#upButton").addEventListener("pointerup", (event) => uiListener(inputStates, event));
document.querySelector("#leftButton").addEventListener("pointerdown", (event) => uiListener(inputStates, event));
document.querySelector("#leftButton").addEventListener("pointerup", (event) => uiListener(inputStates, event));
document.querySelector("#rightButton").addEventListener("pointerdown", (event) => uiListener(inputStates, event));
document.querySelector("#rightButton").addEventListener("pointerup", (event) => uiListener(inputStates, event));
document.querySelector("#spaceBar").addEventListener("pointerdown", (event) => uiListener(inputStates, event));
document.querySelector("#spaceBar").addEventListener("pointerup", (event) => uiListener(inputStates, event));
```

I initially used the shorter <code>document.addEventListener("keydown", uiListener);</code> format &mdash; like many other
programming languages, JavaScript lets you just use the function name with no arguments when invoking it as a
<em>first-class citizen</em>, ie a paramater in another function, if the only argument is one generated, 
which magically reappears, usually as the final argument.

The reason I converted it to pass <code>inputStates</code> as an argument even though it's a global constant is it's a
discipline enforced by testing framework Jasmine.

Besides user input events, there are other types of events which weren't immediately obvious to me. These include the many
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Window#Events">Window events</a> which tell us when to initialise
the program because a browser has opened the page, stop things like sound loops when the user closes the tab, and also
react to events like the browser window getting resized or the orientation of a mobile phone getting changed.

A snag I initiallyl hit was JavaScript's dreaded "white screen of death" caused by the background image not loading by the time
the page was rendered. My initial attempt to fix this worsened the problem by introducing more JavaScript horrors,
a "pyramid of doom" along with an async-await blockage.

``` javascript
window.addEventListener("DOMContentLoaded", async function(event1) {
  await backgroundImage.addEventListener("load", function (event2) {
    ...
  });
});
```

I taught myself JavaScript testing framework Jasmine concurrently while doing this project, and an important lesson was 
the value of keeping things separate and independent. All I wanted from the image was two numbers, which could easily 
be supplied as parameters, thereby solving the mystery of the "white screen of death".

```javascript
const BASE_WIDTH = 800;
const BASE_HEIGHT = 600;
...
window.addEventListener("DOMContentLoaded", (event) => setup(BASE_WIDTH, BASE_HEIGHT, event));
window.addEventListener("unload", cleanup);
window.addEventListener("resize", resizeListener);
```

An even less obvious type of event are those required to write concurrent JavaScript, which I'll digress into briefly here.

<h3>The Medium is the Message</h3>

Among the nice things about learning to program by developing games is it brings concurrency to life.

Multithreading has been added to JavaScript via 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API">Web Workers</a>,
and distributed computing via 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications">
WebSockets</a> and <a href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API">Service Workers</a>.

These are all triggered by an event type called "message", adding a style of programming known as the
<a href="https://en.wikipedia.org/wiki/Actor_model">actor model</a>, which though fairly easy once you go "Aha!",
involves quite a learning curve for anyone schooled in only OOP and FP.

Alan Kay, who coined the term object-oriented programming, saw messaging as a core part of the concept, which sadly
got completely forgotten by the currently top-of-the-pops OOP languages.

<q>Smalltalk's design — and existence — is due to the insight that everything we can describe can be represented by the recursive composition of a single kind of behavioral building block that hides its combination of state and process inside itself and can be dealt with only through the exchange of messages.</q> &mdash; <a href="http://worrydream.com/EarlyHistoryOfSmalltalk/">The Early History Of Smalltalk</a>, Alan Kay

Though it's not really necessary for the few sprites in RiceRocks, for the sake of education, I'm going to move the relatively
maths heavy job of iterating through a list of sprites to update their positions, check for collissions, and filter out 
<em>dead</em> sprites by what in Erlang terminology would be called spawning a process, and JavaScript calls instantiating a
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Worker">Worker</a>. Then I'm going to attach a message listener
to this worker:

```javascript
// Near top of file
const spritesUpdate = new Worker("sprites-update.js");
...

// Near bottom of file
spritesUpdate.addEventListener("message", spritesUpdateListener);
```

The main script would then communicate with <code>spritesUpdate.postMessage(request)</code> where <em>request</em>
acts as arguments which callback function <em>spritesUpdateListener(event)</em> which would receive the result from
in <em>event.data</em>

The <em>sprites-updates.js</em> file would follow this template:

```javascript
this.addEventListener("message", function(event) {
  reply = ... do something with event.data
  this.postMessage(reply);
});
```

One of the advantages of this is encourages modularisation. Another is it makes better use of modern hardware. With even
cellphones today being multicore computers, it frees the main thread to do animation while other processors do trigonometry etc.

<h2>Step 2. Writing Handlers</h2>

<h3>Testing events</h3>

I started this project before learning test framework Jasmine, which turned into a lesson of the importance of test-first
development.

Putting a block like this near the top of the file

```javascript
const BASE_WIDTH = 800;
const BASE_HEIGHT = 600;
const THRUST_SPEED = 0.1;
const RECOIL = -0.05;
const ROTATE_RATE = 60;
const MISSILE_SPEED = 4;
```

is known as <em>single point of control</em>, a good design principle. A bad habit I got into, however, was then
using these constants within functions, hitting a snag with Jasmine that it refuses to see globally defined constants 
or variables, unless they've been attached to the window object.

Though it got me cursing at first, I realised this was an important lesson on modularity: making assumptions about things
outside a function's local scope is dangerous.


While there are a lot of <em>addEventListeners</em> attached to various targets, the number of handlers is fairly small.

I managed to abstract all the user interface handlers down to 
<a href="http://www.seatavern.co.za/doc/global.html#uiListener">uiListener(event)</a>. I treat the event object as a pattern
to be matched with a responding action, making its template what HTDP would call an
<a href="https://htdp.org/2020-8-1/Book/part_one.html#%28part._sec~3aenums%29">enumeration</a>.

For this I used JavaScript's <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch">
switch</a> block &mdash; of which I ended up using two in uiListener: the first matches the type of event &mdash;
key or ponter up or down &mdash; and if it was a left, right, up or space button, which for pointer events 
requires id of the target. Whether it's left, right, up or space is then matched in the second switch block.

From an Erlang perspective, JavaScript <em>pattern -> action</em> code looks very long winded, requiring several
switch blocks as in <em>addEventListeners</em> for stuff that Erlang's more sophisticated pattern matching and guards
could do in one.

I've seen some JavaScript stylists advocating avoiding switch statements in
favour of lots of <code>if (predicate1) {...} else if (predicate2) {...} else if...</code>, which I personally find
uglier and more prone to bugs.

A gotcha in JavaScript is its switch statements are <em>fall through</em>, which means that unless you end a
<code>case</code> stanza with <code>break;</code> or <code>return;</code>, it continues to check if it matches further
patterns.

The first <code>switch</code> block in <em>uiListener</em> uses break since I want to continue to the second block. There
I can use return since that pattern has been actioned.

A JSDoc gotcha that tripped me was to try and tag uiListener as <code>@callback</code> instead of <code>@function</code>, which
resulted in it getting ommited from the documentation. Presumably <code>@callback</code> is an alternative to
<code>@param</code> to only be used when the argument is a callback.

While I had little difficulty in getting the four user input keys to work, pressing any keys not listened to caused the programme
to freeze until I discovered that, counter-intuitively, the <code>default</code> statement should be 
<code>event.preventDefault();</code>.

Another challenge was getting the browser to open a debugging console with F12 &mdash; which stopped working after keyboard
events were <em>captured</em> by my own function. The trick here was to write a case statement forwarding this key event
back to the document. To be fancy, I wrote <code>event.target.dispatchEvent(event);</code> rather than
<code>document.dispatchEvent(event);</code> just to test what the event.target property holds.

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


<h2>Testing</h2>

<q>Testing such programs appears even harder because without the interaction there appears to be no program to speak of,
but automating the testing of interactive programs is especially challenging. Developing clean, well-tested interactive 
programs therefore seems especially daunting to beginners.</q> &mdash;
<a href="https://world.cs.brown.edu/1/htdw-v1.pdf">How to Design Worlds</a>

Since I did writing tests last instead of first, I'm currently refactoring my code since Jasmine refuses to let functions
it tests see variables which weren't passed to them as arguments, and I used a lot of global variables.

Step 1 is to download the latest <a href="https://github.com/jasmine/jasmine/releases">release</a>. Unziping
it produces something like:

<code><pre>
./
├── lib/
│   ├── jasmine-3.6.0/jasmine_favicon.png
│   ├── jasmine-3.6.0/jasmine.js
│   ├── jasmine-3.6.0/jasmine-html.js
│   ├── jasmine-3.6.0/jasmine.css
│   └── jasmine-3.6.0/boot.js
├── SpecRunner.html
├── src/
│   ├── Player.js
│   └── Song.js
└── spec/
.   ├── PlayerSpec.js
.   └── SpecHelper.js
</pre></code>

Though I probably should have a lib subdirectory (modularising <a href="http://www.seatavern.co.za/game1.js">game1.js</a>
to separate and abstract the generic parts is on my todo list), I've decided to put all the necessary testing files into
one subdirectory, <code>./test</code>. I don't like the Jasmine convention of using <code>./spec</code> since I feel
<a href="https://lamport.azurewebsites.net/tla/tla.html">specification</a> and testing are not the same thing.

I've copied all the files in <code>lib/jasmine-3.6.0/</code> to <code>./test</code>, along with <code>SpecRunner.html</code>
which I've renamed <code>index.html</code> to make the report accessible by pointing the browser to the game's URL +
<code>/test</code>.

A thing that tripped me up was following the standard way of declaring canvas

```javascript
const canvas = document.querySelector("#board");
```

resulted in a global constant Jasmine refused to either let functions it was testing see or get replaced. The solution
was to attach all HTML elements I wanted to make global to the <em>window</em> object

```javascript
window.canvas = document.querySelector("#board");
```

which could then be mocked in Jasemin tests with <code>window.canvas = {width: 800, height: 600};</code>

<h2>Documenting</h2>

<q>Most languages come with a large collection of abstractions. Some are contributions by the language design team; 
others are added by programmers who use the language. To enable effective reuse of these abstractions, their creators 
must supply the appropriate pieces of documentation — a <em>purpose statement</em>, a <em>signature</em>, and 
<em>good examples</em> — and programmers use them to apply abstractions.</q>

After testing, the next hardest part fro me has been getting to grips with <a href="https://jsdoc.app/">JSDoc</a>.

I've also tried to follow the <a href="https://google.github.io/styleguide/jsguide.html">Google JavaScript Style Guide</a>,
with the exception of ignoring its views of trailing commas since I find leading commas far better.

<h2>Coding</h2>

<q>Learning coding is like playing cards — you learn the rules, then you play, then you go back and learn the rules again, 
then you play again.</q> &mdash; From Mozilla's
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API">Web audio concepts and usage</a> guide.

<h3><a href="https://developer.mozilla.org/en-US/docs/Web/API">Web APIs</a></h3>

Frontend web development boils down to familiarisation with the bewildering choice of Web APIs available, and
the goal of this first game was to learn a minimal subset to get animation, sound, and user interaction working.

Invariably there are at least four ways of doing anything with JavaScript, and guessing the correct one
involves knowing whether it is old or new, good or bad, functional or object-oriented,
synchronous or asynchronous, block or function scope... 

Achieving a desired goal requires an encyclopaedic knowledge of many objects and their properties, 
events and their handlers, and methods and their parameters &mdash; mercifully <a href="https://developer.mozilla.org/en-US/">
MDN</a> is an excellent reference.

These are the ones I've settled on for now. Making the game mobile friendly involved learning yet another Web API,
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Touch_events">Touch Events</a>, which I decided not
to add the diagram below since it was too crowded already.

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
│   .   │   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/keyup_event">keyup</a>
│   .   │   ├── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/pointerdown_event">pointerdown</a>
│   .   │   └── <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/pointerup_event">pointerup</a>
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




<h4>State</h4>

In Erlang, the recursive loop would have an argument &mdash; usually a compound data structure containing the various
things commonly called a <em>state</em> &mdash; which the body of the loop would alter according to messages sent to
it by handlers and then call itself with the new value.

Here, instead of what Erlang calls a <em>mailbox</em> and the C-family would call a <em>message queue</em>, messaging is 
done by the handlers mutating global variables which the loop reads each iteration.

<a href="http://www.seatavern.co.za/doc/inputStates.html">inputStates</a> is the core messaging mechanism the handlers 
use to communicate to the game loop.
All the propertis of inputStates (with the exception of a sound buffer) are booleans, and I've followed Google's style of using a
<a href="https://google.github.io/styleguide/jsguide.html#naming-method-names">isFoo</a> convention. For some, I've gotten
into the habit of using <a href="https://en.wikipedia.org/wiki/Snake_case">snake case</a>, so find the JavaScript convention
of camelCase and PascalCase a bit alien, but am getting the hang of it.

Another core state variable is <a href="http://www.seatavern.co.za/doc/global.html#sprites">sprites</a>, a list (or
array as JavaScript calls lists) of <a href="http://www.seatavern.co.za/doc/Sprite.html">sprite</a> elements. In
this game, I've made a convention that the spaceship sprite (which somethimes mutates briefly into an explosion
when it collides with an asteroid) can be accessed as <code>sprites[0]</code>.

<h4>List processing</h4>

A really powerful idea from <em>functional programming</em> (FP to its friends) is breaking problems down iterating over
lists, applying the same function to each element depending on which of three categories the task at hand falls into:

<ol>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map">map</a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter">filter</a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce">reduce</a></li>
</ol>

Map and filter can be built out of reduce, which in pure functional programming languages is usually called <em>foldr</em>
(JavaScript has <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/ReduceRight">
for purists).

Since mutation is taboo in FP, the above traditional list processors all produce a new list. If we don't want a new list
(which for traditional functional programming languages would be for printing data from each list element on a screen), we
can use
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach">
forEach</a>, which makes all the whizing stuff on the screen with this one line of code:

```javascript
  sprites.forEach(function (sprite) {draw(sprite); nextTick(sprite);});
```

<a href="http://www.seatavern.co.za/doc/global.html#draw">draw(sprite)</a> obviously belongs in <em>forEach</em>
since it does the GUI equivalent of a print statement, but putting 
<a href="http://www.seatavern.co.za/doc/global.html#nextTick">nextTick(sprite)</a> there would be frowned on by
FP purists since the position and other values of each sprite get changed. Since JavaScript encourages mutations
and changing the properties of objects referenced in the array rather than removing and appending new ones is a lot
less work for the programmer and computer, I've gone that route.

<h4>Drawing and updating</h4>

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

Writing nextTick got me to dust off the trigonometry and physics I learned way back in the last century. While my goal
was to keep the game as simple as possible so as to focus on learning JavaScript and its related tools, I couldn't
help making the spaceship recoil a bit when it fires a missile to force the player to use the thruster... I was also
tempted to make the asteroids bounce off each other like billiard balls, but I'll save that for a future version.

In conclusion, writing this game taught me a lot. Besides encountering many of the problems with JavaScript and hopefully
finding ways to overcome them &mdash; a neverending quest I suspect. 

this document will already make most readers say tl;dr so I'll rather proceed to my next project, creating a dungeon crawler
specifically designed for mobile phones, with only touch user intput.

