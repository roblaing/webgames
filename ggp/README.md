<h1>GDL -> JSON</h1>

I started writing a JSONic Prolog in JavaScript, but decided it would be way easier to focus on neatening up
messaging between a JavaScript <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket">websocket</a>
and a SWI-Prolog <a href="https://www.swi-prolog.org/pldoc/man?section=websocket">websocket</a>.

My gameserver.pl script starts with

```prolog
:- use_module(library(http/websocket)).
:- use_module(library(http/http_unix_daemon)).

:- initialization http_daemon.
```

The <a href="https://github.com/SWI-Prolog/packages-http/blob/master/http_unix_daemon.pl">http_unix_daemon</a> library
lets me fire up by server with something like

```bash
swipl gameserver.pl --port=6455 --pidfile=http.pid --workers=4
```
I picked port number 6455 in honour of the protocol's <a href="https://tools.ietf.org/html/rfc6455">RFC</a>.
It has to be a different port number to 80 or whatever the http server uses.

The <em>workers</em> option automatically tells the server to allocate requests to however many cores are available.

A handler &mdash; part of the <a href="https://github.com/SWI-Prolog/packages-http/blob/master/http_dispatch.pl">http_dispatch</a>
library loaded by ttp_unix_daemon &mdash;which I've called loop, is created like so:

```prolog
:- http_handler(root(.), http_upgrade_to_websocket(loop, []), [spawn([])]).

loop(Request) :-
  ...
  loop(Request).
```

On the JavaScript side, we create a websocket like so:

```javascript
const aiPlayer = new WebSocket('ws://localhost:6455');
```

[cell(1,1,x),cell(1,2,x),cell(1,3,o),cell(2,1,b),cell(2,2,o),cell(2,3,b),cell(3,1,b),cell(3,2,o),cell(3,3,x),control(white)]

The <em>lingua franca</em> is JSON, translated from the
<a href="http://ggp.stanford.edu/">General Game Playing</a> game description language's
Lisp-style <em>kif</em> format used by its
<a href="http://ggp.stanford.edu/gamemaster/gamemaster/showgames.php">many games</a> available.

Starting with a simple 
<a href="http://ggp.stanford.edu/gamemaster/games/tictactoe3/tictactoe3.kif">tic-tac-toe</a> 
board in which the moves are obvious to start figuring out the translation of the rules to JSON and writing a
JavaScript player.

<h2>Lists > Objects</h2>

A mistake I made in my original design was to translate

```lisp
(init (cell 1 1 x))
(init (cell 1 2 x))
(init (cell 1 3 o))
(init (cell 2 1 b))
(init (cell 2 2 o))
(init (cell 2 3 b))
(init (cell 3 1 b))
(init (cell 3 2 o))
(init (cell 3 3 x))
(init (control white))
```

into a JSON object tree with "cell" and "control" as dictionary keys. A better way to do it is:


```json
{
  "init": [ ["cell", 1, 1, "x"], ["cell", 1, 2, "x"], ["cell", 1, 3, "o"]
          , ["cell", 2, 1, "b"], ["cell", 2, 2, "o"], ["cell", 2, 3, "b"]
          , ["cell", 3, 1, "b"], ["cell", 3, 2, "o"], ["cell", 3, 3, "x"]
          , ["control", "white"]
          ]
}
```

strlist_terms([ ["cell", 1, 1, "x"], ["cell", 1, 2, "x"], ["cell", 1, 3, "o"]
          , ["cell", 2, 1, "b"], ["cell", 2, 2, "o"], ["cell", 2, 3, "b"]
          , ["cell", 3, 1, "b"], ["cell", 3, 2, "o"], ["cell", 3, 3, "x"]
          , ["control", "white"]
          ], State),
findlegals(ttt3, State, Legals),
legals_strlist(Legals, StringList).


Advantages of this is that Prolog's <code>=..</code> operator makes coversion simple (though
the double quotes JSON insists on would need to be removed first

```prolog
?- maplist(term_string, L, ["cell", "1", "1", "x"]), T =.. L.
L = [cell, 1, 1, x],
T = cell(1, 1, x).
```

The <code>=..</code> is bidirectional, so getting terms back to lists can be done with

```prolog
?- cell(1, 1, x) =.. L.
L = [cell, 1, 1, x].
```
and then each element needs to be double quoted to make JSON happy (quoting numbers as well keeps things simpler).

This makes the json_terms.pl script I taught myself DSL's with fairly unecessary.

<h2>IndexedDB</h2>

Though I intend using Postgres in the production version, I thought this would be a fun way to learn the IndexedDB API.

https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

```javascript
var request = window.indexedDB.open("MyTestDatabase", 3); // created database if it doesn't exist

request.onerror = function(event) {
  // Do something with request.errorCode!
};
request.onsuccess = function(event) {
  // Do something with request.result!
};
```
