

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

For this style of programming with JavaScript, our basic building block is 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener">
target.addEventListener(type, listener [, options]);</a> and the first thing to think of is what the user inputs are
going to be.

In RiceRocks, a simple version of the old arcade game Asteroids, the user presses arrow keys to maneuver
and the space bar to shoot. (ArrowDown does nothing). The limited number of events to handle make it a nice introduction.

So the <em>event type</em> whe are interested in are 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event">keydown</a> and
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/keyup_event">keyup</a>.

Something I discovered is that the keyCode attribute for 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent">keyboad events</a> is deprecated,
which is good because figuring out which numbers go with which keys makes unreadable code.

```javascript
    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', function (event) {
      switch (event.key) {
        case "ArrowLeft":
          inputStates.left = true;
          break;
        case "ArrowUp":
          inputStates.up = true;
          break;
        case "ArrowRight":
          inputStates.right = true;
          break;
        case " ":
          inputStates.space = true;
          break;
        default: // do nothing
          return;
      }
    }, false);

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

