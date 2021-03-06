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

HTDP's motivation for using a somewhat obscure programming language is well explained in the preface's
<a href="https://htdp.org/2020-5-6/Book/part_preface.html#%28part._drtl%29">DrRacket and the Teaching Languages</a>
section:

<q>Learning to program in a currently fashionable programming language often sets up students for eventual failure. 
Fashion in this world is extremely short lived. A typical “quick programming in X” book or course fails to teach principles 
that transfer to the next fashion language. Worse, the language itself often distracts from the acquisition of 
transferable skills, at the level of both expressing solutions and dealing with programming mistakes.</q>

My favourite taxonomy of programming languages is this 
<a href="https://www.famicol.in/language_checklist.html">joke checklist</a> which despite its long list of
buzzwords, leaves many out.

Among the things I like about HTDP is the vocabulary it provides to generally describe important programming concepts, 
thereby distilling down all the jargon different programming languages use which are essentially synonymous.

<h2>Why JavaScript?</h2>

A big advantage JavaScript has over Racket is it runs in any web browser, and just about everything today has a web
browser.

Web hosting accounts are cheap, and the first HTML5 game I wrote, RiceRocks which I originally 
encountered many years ago in Rice University's 
<a href="https://www.coursera.org/learn/interactive-python-1">Interactive Python</a> Mooc, I simply
uploaded to <a href="http://www.seatavern.co.za/">www.seatavern.co.za</a> &mdash; no distribution hassles in
getting it out there.

The internet is a great example of the power of <em>specification-first programing</em>, with a standards body,
<a href="https://tools.ietf.org/">IETF</a>, making freely available APIs (one of the many jargon terms for
specifications) for anyone who wants to make their programs interoperable.

There's <a href="https://tools.ietf.org/html/rfc2360">Guide for Internet Standards Writers</a>, an RFC on RFCs,
which besides being really <em>meta</em>, jumps ahead to step 4 of the HTDP recipe, templating.

JavaScript, similarly, is a product of <em>specification-first programing</em>, with
<a href="https://www.ecma-international.org/">ECMA</a> making its API freely available, the latest being
<a href="https://www.ecma-international.org/ecma-262/11.0/index.html">ECMAScript 2020</a>.

Corporate drones like to recite Andy Tanenbaum's quip: <q>The nice thing about standards is that you have so 
many to choose from; furthermore, if you do not like any of them, you can just wait for next year's model.</q>

For all their faults, open standards inevitably kill their proprietary competitors. Corporations are notorious
for their <a href="https://en.wikipedia.org/wiki/Embrace,_extend,_and_extinguish">embrace, extend, and extinguish</a>
defence, which is why I wouldn't waste any time learning Facebook's React, Microsoft's TypeScript, Google's Angular...
or any other corporate crap smeared over ECMAScript.

The other corporate weapon of choice against open standards is
<a href="https://en.wikipedia.org/wiki/Fear,_uncertainty,_and_doubt">fear, uncertainty, and doubt</a>,
and there's predictably a lot of FUD against JavaScript out there.

I've grown to like JavaScript as I've got to know it better, but I wouldn't use it on the server where I can pick anything.

<q>Back in 1995, we knew something that I don't think our competitors understood, and few understand even now: when you're writing software that only has to run on your own servers, you can use any language you want. When you're writing desktop software, there's a strong bias toward writing applications in the same language as the operating system.  Ten years ago, writing applications meant writing applications in C. But with Web-based software, especially when you have the source code of both the language and the operating system, you can use whatever language you want</q> &mdash; <a href="http://www.paulgraham.com/avg.html">Beating the Averages</a>, Paul Graham.

Unlike Graham, I'm not that much of a Lisp-fan that I'd pick it for my server, where I like 
<a href="https://github.com/roblaing/swipl-webapp-howto">Prolog</a>, or better yet, 
<a href="https://github.com/roblaing/erlang-webapp-howto">Erlang</a>.

I returned to learning JavaScript after completing some <a href="https://github.com/roblaing/erlang_mooc">
Erlang Moocs</a>, so my code is a bit Erlangish, and I hope to make it more so be learning JavaScript's
Web Workers API.

<a href="http://aosabook.org/en/index.html">The Architecture of Open Source Applications</a> contains a nice
collection of writings by open-source developers on the decicions they made, and one of its lessons is good
coders tend to be good writers.

I'm broadly following HTDP's <a href="https://htdp.org/2020-5-6/Book/part_preface.html#%28part._sec~3asystematic-design%29">
6 step design recipe</a>. The first half is focused on answering the question <em>What?</em> is the program supposed
to do, leaving aside <em>How?</em> for the second half. (Both these questions should be preceeded by <em>Why?</em>,
for which the answer here is creating HTML5 games is fun and educational).

<h2>1. From Problem Analysis to Data Definitions</h2>

This stage is about thinking in what mathematicians call sets and programmers call types or classes.

Before proceeding to step 2 which focuses on
<a href="https://htdp.org/2020-5-6/Book/part_one.html#%28part._ch~3ahtdp%29">How to Design Programs</a> and their building
blocks by <a href="https://htdp.org/2020-5-6/Book/part_one.html#%28part._sec~3adesign-func%29">Designing Functions</a>,
we need to define our data. 

JavaScript is a dynamically-typed language, so unlike, say statically-typed SQL where someone trying to decipher the
code can look at the <code>CREATE TABLE...</code> blocks, there's no clue if the types haven't been properly
documented.

Here I'm going to use <a href="https://jsdoc.app/">JSDoc</a>, and at this stage
specifically <a href="https://jsdoc.app/tags-typedef.html">@typedef</a> with 
<a href="https://jsdoc.app/tags-property.html">@property</a> to <em>declare</em> my compound data structures 
&mdash; of which many are needed to describe images, sounds and motion in game programming.

I've expanded step 1 to include specification, though this overlapps somewhat with HTDP's <em>signatures</em> in step 2.

Specification languages are a kind of <a href="https://en.wikipedia.org/wiki/Metalanguage">metalanguage</a>,
which usually are not the same as the <em>object language</em> they describe. For instance, Lamport's TLA+ is a
design language independent of whatever programing language the design is ultimately implemented in.

My rule about designing specifications is <em>don't</em>: rather do some research and stand on the shoulders of giants.

For the types required for a computer game,
HTDP's <a href="https://htdp.org/2020-5-6/Book/part_one.html#%28part._sec~3aarith-images%29">
The Arithmetic of Images</a> is a great aid.

Computer games and graphics consists of a lot of jargon which is unfamiliar to me, and here the documentation
along with Racket's <a href="https://docs.racket-lang.org/teachpack/2htdpimage.html">image</a> and
<a href="https://docs.racket-lang.org/teachpack/2htdpuniverse.html#%28part._world-example%29">
universe</a> packages a great help, creating a base-specification for my JavaScript modules.



<h2>2. Signature, Purpose Statement, Header</h2>


For step 2, I'll rely on JSDoc's <a href="https://jsdoc.app/tags-function.html">@function</a> with
<a href="https://jsdoc.app/tags-param.html">@param</a> and 
<a href="https://jsdoc.app/tags-returns.html">@return</a> out of which the automated documentation system creates
what HTDP would call a <em>signature</em>.


<h2>Testing</h2>

Whereas I got claustrophobic in DrRacket's boxed-in environment, JavaScript's <em>tool overabundance syndrome</em>
moves to the other end of the anxiety spectrum.
 
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

An initial frustration that I hit with Jasmine is that the html file it uses to build its DOM isn't the one the code it is
testing will use, but what it calls <em>SpecRunner.html</em> (which I rename index.html and put in a subdirectory called 
test since I don't like calling unit tests specifications).

What this means is code like <code>const canvas = document.querySelector("#board");</code> sets canvas to null because 
there's no <code>&lt;canvas id="board">&lt;/canvas></code> in the test environment's html file, which in turn breaks
<code>const ctx = canvas.getContext("2d");</code>, which in turn breaks all the graphics related functions.

My hack to work around this was to put the html code of elements I accessed in my JavaScript file in Jasmine's html file,
which would then be rendered at the top of the file unless I removed them

