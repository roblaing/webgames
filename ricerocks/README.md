<h1>Game 1: RiceRocks</h1>

<q>Writing interactive games and animations is both instructive and fun. Writing such programs is, however,
often challenging. Interactive programs are complex because the user, not the programmer, is in charge of
the program’s execution: the program itself is often a passive receiver of commands, reacting only when some 
stimulus in the external world (whether a user’s keystroke or the tick of a clock) occurs.</q> &mdash;
<a href="https://world.cs.brown.edu/1/htdw-v1.pdf">How to Design Worlds</a>

My original goal with this game was to create a minimalist HTML5 arcade-style game to learn the basics. I translated a
game I originally encountered many years ago in Rice University's 
<a href="https://www.coursera.org/learn/interactive-python-1">Interactive Python</a> 
Mooc called RiceRocks. This meant the sprites and sounds were all readily available on my PC.

Though translating the game from the original Python to JavaScript wasn't very difficult, it got me thinking on various
<em>philosophical issues</em>, and I kept refactoring until it strayed far from the original.

<h2>Structured Design</h2>

<q>Successful design is based on a principle known since the days of Julius Caesar: Divide and conquer.</q> &mdash; 
<a href="https://www.win.tue.nl/~wstomv/quotes/structured-design.html">Structured Design</a>, 
Edward Yourdon and Larry L. Constantine

To avoid a <a href="https://blog.codinghorror.com/the-big-ball-of-mud-and-other-architectural-disasters/">
big ball of mud</a>, the heart of good design is to compose things out of smaller pieces, which if well
designed can then be re-used in other projects.

In software, each of these <em>design units</em> is a separate file. For this game, I split the design 
into one <em>main</em> script and three modules.

The main script, game1.js, is the file called by index.html, and to use JavaScript's relatively recent (2015) support of
<a href="https://en.wikipedia.org/wiki/Modular_programming">modular programming</a>, it needs
<code>type="module"</code> added:

```html
  <script type="module" src="game1.js"></script>
```

By the way, this only works with served files. If you load an html file statically with a browser, it till complain of 
CORS errors if any of its JavaScript files are <code>type="module"</code>.

I found it confusing that the client that loads modules gets labeled a module, and that the modules themselves
are not listed in the html file, and it took some cursing and frustration to figure this out.

These units are related to unit testing, and one of my goals in this exercise was to learn a JavaScript testing framework, 
and I somewhat arbitrarily settled on <a href="https://jasmine.github.io/">Jasmine</a>, which was initially extremely frustrating.

Two traps lay in wait for me with the game1.js file:

<ol>
  <li>The html file Jasmine loads &mdash; its default name is SpecRunner.html &mdash; is not the same as my index.html
with the canvas object and other elements. This meant Jasmine set canvas to null which broke the rest of the code, and
this couldn't be fixed with mocking, or spying as Jasmine calls it, because it happens before the test code is run. </li>
  <li>The main file starts an infinite loop, which in turn freezes Jasmine.</li>
</ol>

This makes the main file which attaches listeners to html elements and launches the animation loop untestable &mdash; 
at least at my skill level.

But this isn't serious since all the functions which need testing are moved to three modules which the main file
accesses thus:

```javascript
import { resizeListener, clearScene, drawState } from "./image.js";
import { playSound } from "./sound.js";
import { initState, updateState, uiListener } from "./state-loop.js";
```

The decision of what to put in each module Constantine termed 
<a href="https://www.win.tue.nl/~wstomv/quotes/structured-design.html#7">cohesion</a>. To me, it seemed natural to
hide all the horrors of the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API">Web Audio API</a>
in one file, exposed to the client as just one function, and similarly the horrors of the
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial">canvas</a> in another.

The guts of the application in game1.js consists of this infinite loop:

```javascript
function animationLoop() {
  clearScene();
  drawState();
  playSound();
  updateState();
  window.requestAnimationFrame(animationLoop);
}
```

Note none of these functions have any arguments. This is due to using what Constantine termed
<a href="https://en.wikipedia.org/wiki/Coupling_(computer_programming)#Module_coupling">global coupling</a>.

I did this project to refresh my JavaScript knowledge after teaching myself Erlang where functions are
not <em>rewritable</em> (or mutable in computer jargon). Erlang uses recursive infinite loops a lot, and these
typically have a compound data structure conventionally called <em>state</em> which gets replaced each
recursion.

From my <a href="https://github.com/roblaing/erlang_mooc/tree/master/doc">notes</a>, a loop which most Erlang
programmers would not write themselves, but use the one provided by the OTP framework, looks something like this:

```erlang
loop(Module, State0) ->
  receive
    {call, Pid, Ref, Request} ->
      {reply, Reply, State1} = Module:handle_call(Request, {Pid, Ref}, State0),
      Pid ! {reply, Ref, Reply},
      loop(Module, State1);
    {cast, Request} -> 
      {noreply, State1} = Module:handle_cast(Request, State0),
      loop(Module, State1);
    stop -> Module:terminate(normal, State0);
    Unknown ->
      {noreply, State1} = Module:handle_info(Unknown, State0),
      loop(Module, State1)
  end.  
```

A reason data is immutable in Erlang is because various processes are running in different cores or other computers,
so they don't share memory.

JavaScript's <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers">Web Workers</a>
are Erlangish in that they communicate via <em>message coupling</em>.

Influenced by Erlang, I initially wrote state-loop.js as a web worker, and hit the snag that I couldn't see a way for the
web worker to communicate directly with the animation loop. While the animation loop could post messages to the web worker, 
JavaScript doesn't appear to have Erlang's <em>return address</em> mechanism. The animation loop could possibly be made the
web worker's callback function, but I'm not sure how.

Instead of gaining any efficiency from moving stuff to a separate thread, the animation got more jerky because of all the 
work involved in 
<a href="https://en.wikipedia.org/wiki/Coupling_(computer_programming)#Performance_issues">bouncing messages</a>
back and forth 60 times a second instead of simply sharing a reference pointer to
a complex data type representing state. Furthermore, the order of the received messages was shuffled, leading to the 
mystery of the vanishing missiles.

So here I gained this insight:

<h3>In JavaScript, never create when you can mutate</h3>

<q>Since map builds a new array, using it when you aren't using the returned array is an anti-pattern; 
use forEach or for-of instead.</q> 
&mdash; <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map">
MDN's Array.prototype.map()</a> page.

Due to my prejudice against global variables, my initial design was to have the modules share data via function
arguments (This may fall under the jargon term <em>semantic coupling</em>, but as is inevitable in the IT industry,
what was originally a nice, simple concept has been transformed into an unintelligible swamp of BS by consultants). 

The canvas object created by image.js was imported by game1.js and accessed by other modules via a function argument. 
The <em>state</em> compound data structure which just about every function in every module needs was similarly shared 
from state-loop.js with other modules via function arguments.

Ultimately, I came to accept that by attaching the canvas and state objects to
<a href="https://javascript.info/global-object">window</a> &mdash; the root, global object in a browser which everything
except a web worker can access &mdash; I saved a lot of typing and potential bugs from forgotten function arguments.

<h2>Testability</h2>

<q>Testing such programs appears even harder because without the interaction there appears to be no program to speak of,
but automating the testing of interactive programs is especially challenging. Developing clean, well-tested interactive 
programs therefore seems especially daunting to beginners.</q> &mdash;
<a href="https://world.cs.brown.edu/1/htdw-v1.pdf">How to Design Worlds</a>

Step 1 is to download the latest <a href="https://github.com/jasmine/jasmine/releases">release</a>. Unziping
it unpacks ./SpecRunner.html along with various files in ./lib/jasmine-&lt;version>/* which I copied into a
subdirectory called ./test. It also unpacks examples in subdirectories called src and spec which don't need to be
copied.

I edited SpecRunner.html, renamed ./test/index.html, to look like this:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Jasmine Spec Runner v3.6.0</title>

  <link rel="shortcut icon" type="image/png" href="jasmine_favicon.png">
  <link rel="stylesheet" href="jasmine.css">

  <script src="jasmine.js"></script>
  <script src="jasmine-html.js"></script>
  <script src="boot.js"></script>

  <script type="module" src="unitTests.js"></script>
</head>

<body>
  <canvas id="board"></canvas>
</body>
</html>
```

The reason I added canvas to the body is that <code>document.querySelector("#board")</code> in image.js will otherwise
return null, breaking all the ctx... statements. My unitTests.js file started like this:

```javascript
import { resizeListener } from "../image.js";

describe("image.js", function() {

  beforeEach(function() {
    window.state = { "sprites": []
                   , "missiles": []
                   , "lives": 3
                   , "score": 0
                   , "scale": 1.0
                   , "noise": null
                   };
  });

  afterAll(function() {
    document.body.removeChild(document.querySelector("#board"));
  });

  it ("800x600 screen should set scale to 1.0", function() {
    spyOnProperty(window, "innerWidth").and.returnValue(800);
    spyOnProperty(window, "innerHeight").and.returnValue(600);
    resizeListener(800, 600, null);
    expect(window.state.scale).toBe(1.0);
  });
});
```

In the afterAll stanza, I remove the canvas so it doesn't mess up the screen Jasmine writes its repot on.
The window size needs to be <em>mocked</em> to known values, else resizeListener will set scale by whatever
the actual values of window.innerWidth and window.innerHeight happen to be.

resizeListener uses and auxiliary function, getScale, which isn't exported. During development, I start by writing
tests for the auxiliary functions, and subsequently <em>hide</em> then and redo the tests with the exposed functions
as above. This is possibly considered cheating by unit test purists, but works for me.

A reason I don't like Jasmine's convention of call the subdirectory holding the unit tests ./spec and giving calling
its examples PlayerSpec.js and SpecHelper.js is that thinking unit tests are specifications seems to be a common
misconception amongst the Agile crowd.

<q>Programmers who advocate writing tests before writing code often believe those tests can serve as a specification. 
Writing tests does force us to think, and anything that gets us to think before coding is helpful. However, writing 
tests in code does not get us thinking above the code level. We can write a specification as a list of high-level 
descriptions of tests the program should pass essentially a list of properties the program should satisfy. 
But that is usually not a good way to write a specification, because it is very difficult to deduce from it what 
the program should or should not do in every situation.</q> &mdash; 
<a href="https://cacm.acm.org/magazines/2015/4/184705-who-builds-a-house-without-drawing-blueprints/fulltext">
Who Builds a House Without Drawing Blueprints?</a>, Leslie Lamport

<h2>Patterns</h2>

I've never studied the <a href="https://en.wikipedia.org/wiki/Design_Patterns">Gang of Four's</a> 23 design patterns,
but influenced by Robert Nystrom's <a href="http://gameprogrammingpatterns.com/contents.html">Game Programming Patterns</a> 
I decided to refactor my code.

<h3>Object Literal Pattern</h3>

This is not one of the GoF's <a href="https://en.wikipedia.org/wiki/Design_Patterns">23 classics</a>,
but is one I use a lot.

<a href="http://rmurphey.com/blog/2009/10/15/using-objects-to-organize-your-code">
Object Literals</a> are comma separated key-value pairs between curly brackets which differ from
traditional OOP classes in that they don't require instantiation using the <em>new</em> operator. 

A quirk of mine &mdash; which result in warnings
from <a href="https://www.jslint.com/">jslint</a> and <a href="https://jshint.com/">jshint</a> is addressing
values stored in object literals as <code>images["missile"]</code> rather than <code>images.missile</code>. This is
because <code>images[Variable]</code> is legal and <code>images.Variable</code> isn't, and remembering different conventions
to achieve exactly the same thing is a waste of memory.

Another reason I like using double quoted keys is it helps the declarations of object literals double as legal JSON. Another
quirk of mine is using leading commas, a habit I picked up from reading SQL code. Using leading commas makes it 
easier to balance parenthesis in deeply nested data structures &mdash; which mercifully I don't have any of in this example.

Refactoring to the six GoF design patterns Nystrom devoted chapters to resulted in more of my code getting moved into 
object literals.

<h3>Command Pattern</h3>

<q>Encapsulate a request as an object, thereby letting users parameterize clients with different requests, 
queue or log requests, and support undoable operations.</q> &mdash; GoF

This classified a a behvioural pattern, meaning it deals with communication between objects.

I originally wrote the dispatcher which translated the patterns of user input events as switch blocks with case statements
in JavaScript.

After reading the chapter on command patterns in <a href="http://gameprogrammingpatterns.com/command.html">Nystrom</a>
and Addy Osmani's <a href="https://addyosmani.com/resources/essentialjsdesignpatterns/book/#commandpatternjavascript">
Learning JavaScript Design Patterns</a>, I decided a more elegant way would be to write the pattern to be matched as 
```javascript
command["keydown"]["ArrowLeft"]
```
where "keydown" is the value of event.type and "ArrowLeft"
the value of event.key of the <a href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent">KeyboardEvent</a>
object, so in theory this just meant calling a required action with 
```javascript
command[event.type][event.code]
```

In practice, the spacebar event.code " " had to be translated to "Spacebar" since it has to be a valid function name,
for touch events the event.code needed to be obtained from event.target.id, plus command needed to be guarded from
F12 and "non-game" keys, so uiListener still ended up filled with conditionals.

Furthermore, implementing this required me to learn about JavaScript's
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get">getter</a> syntax
which I hadn't used before. But ultimately, it led to more elegant code than my original two switch blocks, with
the first having cases for event.type and the second for event.key. It also disciplined me to write action functions
for different user commands instead of putting the statements in case blocks, resulting in an overly long dispatcher.

So conforming to the <a href="https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern">chain of command</a>
pattern (at least my interpretation of it), resulted in this nice template for future games:

```javascript
const command = { "keydown": { get ArrowLeft() {return turnLeft(true)}
                             , get ArrowRight() {return turnRight(true)}
                             , get ArrowUp() {return burnRocket(true)}
                             , get Spacebar() {return fireMissile(true)}
                             }
                , "keyup":   { get ArrowLeft() {return turnLeft(false)}
                             , get ArrowRight() {return turnRight(false)}
                             , get ArrowUp() {return burnRocket(false)}
                             , get Spacebar() {return fireMissile(false)}
                             }
                };
```

<a href="https://en.wikipedia.org/wiki/Command_pattern">Wikipedia's</a> description lists four requirements:

<dl>
  <dt>command</dt><dd>eg "ArrowLeft"</dd>
  <dt>receiver</dt><dd>eg <code>turnLeft(true)</code> &mdash; it executes the work requested by command</dd>
  <dt>invoker</dt><dd>eg "keydown"</dd>
  <dt>client</dt><dd>In this game, that's always the spaceship. But if there were more than one
 <a href="http://gameprogrammingpatterns.com/command.html#directions-for-actors">player controlled sprite</a>, 
something like <code>command["spaceship"]["keydown"]["ArrowLeft"]</code> would be needed</dd>
</dl>

Besides simply <a href="http://gameprogrammingpatterns.com/command.html#configuring-input">configuring input</a>,
which is all I've used the command object for here, Nystrom suggests also using it for 
<a href="http://gameprogrammingpatterns.com/command.html#undo-and-redo">undo and redo</a>, which ties into
Jakob Nielsen's <a href="https://www.nngroup.com/articles/ten-usability-heuristics/">usability top 10</a>.

<h3>Flyweight Pattern</h3>

<q>The pattern was first conceived by Paul Calder and Mark Linton in 1990 and was named after the boxing weight class that 
includes fighters weighing less than 112lb. The name Flyweight itself is derived from this weight classification as it 
refers to the small weight (memory footprint) the pattern aims to help us achieve.</q>
&mdash; <a href="https://addyosmani.com/resources/essentialjsdesignpatterns/book/#detailflyweight">
Learning JavaScript Design Patterns</a>, Addy Osmani

This is the only <em>structural</em> design pattern listed here. Structural means it deals with object composition.

While RiceRocks has a dozen asteroids spinning at any given time, they all share the same blob of binary data
stored in image.js as:

```javascript
const images = { "background": new Image()
               , "debris": new Image()
               , "spaceship": new Image()
               , "asteroid": new Image()
               , "explosion": new Image()
               , "missile": new Image()
               };
```

I initially stored pointers to these binary blobs in each sprite as an attribute called image, but thanks to my experiment 
with web workers where references can't be shared and JavaScript wisely refuses to clone big blobs of binary, I realise
all the sprite needed was a string corresponding to a key in the image dictionary.

The same applies to sound.

I discovered I'd already unwittingly implemented the flyweight pattern by not duplicating blobs read from png or ogg files,
storing them once in dictionaries and refencing them via short string names.

<h3>Observer Pattern</h3>

<q>One or more observers are interested in the state of a subject and register their interest with the subject by 
attaching themselves. When something changes in our subject that the observer may be interested in, a notify message 
is sent which calls the update method in each observer. When the observer is no longer interested in the subject's state, 
they can simply detach themselves.</q> &mdash; GoF

This is a behavioral pattern, dealing with communication between objects.

There's quite a lot of overlap between the GoF terminology here and 
<a href="https://en.wikipedia.org/wiki/Event-driven_programming">event-driven programming</a> or
<a href="https://developers.redhat.com/blog/2017/06/30/5-things-to-know-about-reactive-programming/">
reactive programming</a>.

In GoF terminology, observers can <em>attach</em> themselves &mdash; done in JavaScript with
<a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener">
target.addEventListener(type, listener)</a> which I've used a lot &mdash; or <em>detach</em> using
<a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener">
target.removeEventListener(type, listener)</a> which I've found no need for yet. 

```javascript
window.addEventListener("DOMContentLoaded", setup);
window.addEventListener("unload", cleanup);
window.addEventListener("resize", (event) => resizeListener(BASE_WIDTH, BASE_HEIGHT, event));
document.addEventListener("keydown", uiListener);
document.addEventListener("keyup", uiListener);
document.querySelector("#upButton").addEventListener("pointerdown", uiListener);
document.querySelector("#upButton").addEventListener("pointerup", uiListener);
document.querySelector("#leftButton").addEventListener("pointerdown", uiListener);
document.querySelector("#leftButton").addEventListener("pointerup", uiListener);
document.querySelector("#rightButton").addEventListener("pointerdown", uiListener);
document.querySelector("#rightButton").addEventListener("pointerup", uiListener);
document.querySelector("#spaceBar").addEventListener("pointerdown", uiListener);
document.querySelector("#spaceBar").addEventListener("pointerup", uiListener);
```

In JavaScript, "message" events used for multithreading by 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API">Web Workers</a>,
and distributed computing via 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications">
WebSockets</a> and <a href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API">Service Workers</a>
&mdash; none of which are used in this simple game, but will become important later &mdash; would also fall
under the observer pattern.

<h3>Prototype Pattern</h3>

This is another <em>creational</em> pattern, and fortuitously, before learning this, I called my three functions which
use it <code>createSpaceship()</code>, <code>createAsteroid()</code>, and <code>createMissile()</code>.

These all return an object literal conforming to a template I've called 
<a href="http://www.seatavern.co.za/doc/module-state-loop-Sprite.html">Sprite</a>, 
which is defined by documentation using conventions I've tried to establish with JSDoc rather than any programing code.

There's no <code>createExplosion()</code> because the spaceship and asteroids only temporarily become explosions, and
the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign">
Object.assign(sprite, createAsteroid());</a> statement used to <em>clone</em> a replacement asteroid for one hit
by a missile is possibly closer to the GoF's definition.

<h3>Singleton Pattern</h3>

<q>There must be exactly one instance of a class, and it must be accessible to clients from 
a well-known access point.</q> &mdash; GoF

This is a creational pattern, and I've attached two objects to the <em>window</em> objects so that all functions
in all modules can access their attributes: <a href="http://www.seatavern.co.za/doc/global.html#state">state</a>
and canvas whose width and height is needed in various places &mdash; making them singletons.

Global state is generally considered an anti-pattern, and Nystrom's
<a href="http://gameprogrammingpatterns.com/singleton.html">chapter on singleton</a> is mainly a warning 
to avoid it, if you can.

<q>The goal of removing all global state is admirable, but rarely practical. Most codebases will still have a couple 
of globally available objects, such as a single Game or World object representing the entire game state.</q>
&mdash; <a href="http://gameprogrammingpatterns.com/singleton.html#to-provide-convenient-access-to-an-instance">
Nystrom</a>

So other than renaming state as game or world, there doesn't really seem much alternative to making it global.

<h3>State Pattern</h3>

The GoF clasify this as a behavioural pattern.

Rather than just the singleton holding the state at a given tick, this broader, involving the <em>rules</em> of
the game as in what transitions are legal from a given node.

<h2>Documenting</h2>

<q>Most languages come with a large collection of abstractions. Some are contributions by the language design team; 
others are added by programmers who use the language. To enable effective reuse of these abstractions, their creators 
must supply the appropriate pieces of documentation — a <em>purpose statement</em>, a <em>signature</em>, and 
<em>good examples</em> — and programmers use them to apply abstractions.</q>

After testing, the next hardest part fro me has been getting to grips with <a href="https://jsdoc.app/">JSDoc</a>.

I've also tried to follow the <a href="https://google.github.io/styleguide/jsguide.html">Google JavaScript Style Guide</a>,
with the exception of ignoring its views of trailing commas since I find leading commas far better.

<h3>Audio</h3>

In my first draft of this project when I struggling to understand the myriad
<a href="https://developer.mozilla.org/en-US/docs/Web/API">Web APIs</a>, I kept one hierarchical diagram with links
to documentation on the many objects and their methods, properties and events I was using. The audio part looked like
this.

<code><pre>
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

I'm more of a graphics than sound guy, and I found all the objects required for audio extremely confusing. It's
a bit analogous to graphics in that files containing binary blobs in various formats need to downloaded by the browser
and stored in memory to be referenced by named constants.

A <em>context</em> is needed which is conventionally made a global constant whose methods are used
to make noise when desired.

Thanks to modularisation, I could move all this complexity into a separate file to be access in my main file by

```javascript
import { playSound } from "./sound.js";
```

where sounds is a key-value store of the four sounds used in the game which can be passed to one function as in

```javascript
playSound("missile");
```


<h3>Graphics</h3>

One of the advantages of modularity I discovered here is it that it improves testability, which I find fairly tricky
in a game like this.

Though I couldn't abstract image.js down to just two public names, I similary managed to hide much of this complexity
in a module accessed with a dictionary of key-value pairs and some functions.

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

