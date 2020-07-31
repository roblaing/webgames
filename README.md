<h1>Simple HTML5 web games</h1>

<p><a href="https://twitter.com/RobertLaing6">Robert Laing</a></p>

<q>Writing interactive games and animations is both instructive and fun. Writing such programs is, however,
often challenging. Interactive programs are complex because the user, not the programmer, is in charge of
the program’s execution: the program itself is often a passive receiver of commands, reacting only when some 
stimulus in the external world (whether a user’s keystroke or the tick of a clock) occurs.</q> &mdash;
<a href="https://world.cs.brown.edu/1/htdw-v1.pdf">How to Design Worlds</a>

The textbook intro quoted above is from a companion volume to my favourite introduction to programming, the free online 
<a href="https://htdp.org">How to Design Programs</a>. It teaches a Lisp-dialect, Racket, coupled to an application,
DrRacket, which provides <q>everything in a box</q> a beginner needs to get going (ie a text editor, repl, 
test framework, ...).

JavaScript suffers very much from <em>tool overabundance syndrome</em>. 
For instance, of the many testing frameworks available, I picked <a href="https://jasmine.github.io/">Jasmine</a>,
partly because there's a
<a href="https://www.udemy.com/course/unit-testing-your-javascript-with-jasmine/">Udemy</a> course which I found very
helpful in getting me going, but it digressed in a bewildering number of add-on packages whose purpose I don't fully grasp.

I like Jasmine in that &mdash; assuming you only want to write tests for client-side scripts as I do &mdash; it simply involves
copying some files into a project subdirectory I call <code>./test</code>, which Jasmine by defaul calls <code>./spec</code>,
revealing a common misconception <a href="https://www.agilealliance.org/agile101/">Agile</a> pundits have about
specifications.

Leslie Lamport &mdash; a Turing-award winner who created a specification language called
<a href="https://lamport.azurewebsites.net/tla/tla.html">TLA+</a> &mdash; explained the difference in an article called
<a href="https://cacm.acm.org/magazines/2015/4/184705-who-builds-a-house-without-drawing-blueprints/fulltext">
Who Builds a House Without Drawing Blueprints?</a>

<q>Programmers who advocate writing tests before writing code often believe those tests can serve as a specification. 
Writing tests does force us to think, and anything that gets us to think before coding is helpful. However, writing 
tests in code does not get us thinking above the code level. We can write a specification as a list of high-level 
descriptions of tests the program should pass essentially a list of properties the program should satisfy. 
But that is usually not a good way to write a specification, because it is very difficult to deduce from it what 
the program should or should not do in every situation.</q>

Broadly following the <a href="https://htdp.org/2020-5-6/Book/part_preface.html#%28part._sec~3asystematic-design%29">
6 step design recipe</a> advocated by HTDP, I'd call step 1 &mdash;  <q>From Problem Analysis to Data Definitions</q>
&mdash; specification.

<h2>1. Specification</h2>

The first half of the HTDP design recipe is focused on answering the question <em>What?</em> is the program going
to do, leaving aside <em>How?</em> for the second half. (Both these questions should be preceeded by <em>Why?</em>,
for which the answer here is creating HTML5 games is fun and educational).

Specification languages are a kind of <a href="https://en.wikipedia.org/wiki/Metalanguage">metalanguage</a>,
which usually are not the same as the <em>object language</em> they describe. For instance, Lamport's TLA+ is a
design language independent from whatever programing language the design is ultimately implemented in.

I returned to JavaScript after learning Erlang which comes with its own specification language and tools. Writing
specifications is optional and uses different syntax to Erlang code, but that it can be applied to developing
Erlang code makes it more practical than TLA+ if you're doing both the designing and coding.

In the enormous jungle of npm packages there are bound to be JavaScript specification languages and type checking tools, 
but I'm simply going to use <a href="https://jsdoc.app/">JSDoc</a>,
specifically <a href="https://jsdoc.app/tags-typedef.html">@typedef</a> with 
<a href="https://jsdoc.app/tags-property.html">@property</a> to <em>declare</em> my compound data structures,
and <a href="https://jsdoc.app/tags-function.html">@function</a> with
<a href="https://jsdoc.app/tags-param.html">@param</a> and 
<a href="https://jsdoc.app/tags-returns.html">@return</a> out of which the automated documentation system creates
what HTDP would call a <em>signature</em>.

My rule about designing specifications is <em>don't</em>: rather do some research and stand on the shoulders of giants.

The internet is a great example of the power of <em>specification-first programing</em>, with a standards body,
<a href="https://tools.ietf.org/">IETF</a>, making freely available APIs (one of the many jargon terms for
specifications) for anyone who wants to make their programs interoperable.

There's <a href="https://tools.ietf.org/html/rfc2360">Guide for Internet Standards Writers</a>, an RFC on RFCs,
which jumps ahead to step 4 of the HTDP recipe, templating.

JavaScript, similarly, is a product of <em>specification-first programing</em>, with
<a href="https://www.ecma-international.org/">ECMA</a> making its API freely available, the latest being
<a href="https://www.ecma-international.org/ecma-262/11.0/index.html">ECMAScript 2020</a>.

Corporate drones like to recite Andy Tanenbaum's quip <q>The nice thing about standards is that you have so 
many to choose from; furthermore, if you do not like any of them, you can just wait for next year's model.</q>

For all their faults, open standards are far better than proprietary protocols. I've personally wasted several hours
making software interoperable with Facebook only to learn the hard way that if an API's documentation mainly consists 
of marketing waffle and legalese, run away. I've never used React, and never will.

<a href="http://aosabook.org/en/index.html">The Architecture of Open Source Applications</a> contains a nice
collection of writings by open-source developers on the decicions they made, and one of its lessons is good
coders tend to be good writers.

Back to web games. Video games and graphics consists of a lot of jargon which is unfamiliar to me, and here the documentation
along with Racket's <a href="https://docs.racket-lang.org/teachpack/2htdpimage.html">image</a> and
<a href="https://docs.racket-lang.org/teachpack/2htdpuniverse.html#%28part._world-example%29">
universe</a> packages a great help, creating a base-specification for my JavaScript modules.

The specification stage is about thinking in what mathematicians call sets and programmers call types or classes.
Here, HTDP's <a href="https://htdp.org/2020-5-6/Book/part_one.html#%28part._sec~3aarith-images%29">
The Arithmetic of Images</a> is a great aid.


