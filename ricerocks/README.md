

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

For this style of programming, our basic building block is 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener">
target.addEventListener(type, listener [, options]);</a>

```javascript
    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', function (event) {
        if (event.keyCode === 37) { // left
            inputStates.left = true;
        } else if (event.keyCode === 38) { // up
            inputStates.up = true;
        } else if (event.keyCode === 39) { // right
            inputStates.right = true;
        } else if (event.keyCode === 32) { // space
            inputStates.space = true;
        }
    }, false);
```

