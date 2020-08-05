<h2>Game 2: RiceRocks2</h2>

In RiceRocks1 I made state-loop.js a worker, which though an interesting learning experience, showed JavaScript is not
Erlang and passing messages back and forth 60 ticks a second plus ui messages created a very slow and buggy game.

So in RiceRocks2 I've converted state-loop.js into a plain vanilla module which shares the state object by attaching it
to the root window object.


