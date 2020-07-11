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
HTML5 Part 2</a> whose second week is titled "Game Programming with HTML5" which I've used to structure my notes on.

<h2>Events</h2>

The first thing to think of is user interaction. 

In RiceRocks, a simple version of the old arcade game Asteroids, the user presses arrow keys to maneuver
and the space bar to shoot. The limited number of events to handle make it a nice introduction.

A common frustration with JavaScript is, that if like me you only revisit it every few years, everything
keeps changing from last time. This applies to our basic building block, 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener">
target.addEventListener(type, listener [, options]);</a>.

When I first wrote this code, addEventListener had three arguments, and the third was usually set to <code>false</code>.

At time of writing, this now equates to <code>addEventListener(type, listener, {passive: false});</code>
where <em>{passive: false}</em> is the default, so could be ommitted.

This game only involves responding to four keys (arrows except for down, and space), and in my original code
I used several <em>if...</em> statements for my pattern-action expressions, which worked fine, but I decided 
switch would be prettier, which broke everything if a key other than the four with case statements was selected.


So the <em>event type</em> whe are interested in are 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event">keydown</a> and
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/keyup_event">keyup</a>.

Something I discovered is that the keyCode attribute for 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent">keyboad events</a> is deprecated,
which is good because figuring out which numbers go with which keys makes unreadable code.

This code dates back to when addEventListener was required to have a third argument, which was usually false.
Now this is an optional parameter <code>useCapture</code> which defaults to false. Including the paramater
<code>capture</code> would set it to true.

New code looks like 

Check if setting to true fixes bug in switch?

capture or noneCapture

passive or nonePassive

https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault


```javascript
    function keylistener(Bool, event) {
      if (event.key === "ArrowLeft") {
        inputStates.left = Bool;
      }
      if (event.key === "ArrowUp") {
        inputStates.up = Bool;
      }
      if (event.key === "ArrowRight") {
        inputStates.right = Bool;
      }
      if (event.key === " ") {
        inputStates.space = Bool;
      }
    }
    
    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', keylistener(true));

    //if the key will be released, change the states object
    window.addEventListener('keyup', function (event) {
      switch (event.key) {
        case "ArrowLeft":
          inputStates.left = false;
          break;
        case "ArrowUp":
          inputStates.up = false;
          break;
        case "ArrowRight":
          inputStates.right = false;
          break;
        case " ":
          inputStates.space = false;
          break;
        default: // do nothing
          return;
      }
    }, false);
```


https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame


