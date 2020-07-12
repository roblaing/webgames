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



https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame


