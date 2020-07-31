<h1>Flight Lander</h1>

This is the first exercise from <a href="https://world.cs.brown.edu/1/htdw-v1.pdf">How to Design Worlds</a>,
a companion volume to <a href="https://htdp.org/">How to Design Programs</a>.

<h2>kebab-case to camelCase</h2>

<pre>Today we have naming of parts. Yesterday,
We had daily cleaning. And tomorrow morning,
We shall have what to do after firing. But to-day,
Today we have naming of parts. Japonica
Glistens like coral in all of the neighbouring gardens,
And today we have naming of parts. &mdash; <a href="https://www.poetrybyheart.org.uk/poems/naming-of-parts/">Naming of Parts</a>, Henry Reed</pre>

Something I find tricky is thinking of good function and variable names, so stealing existing ones created by leading
educators makes life easier, and also follows their recommendation of using existing templates.

One difference with the original <a href="https://docs.racket-lang.org/teachpack/2htdpuniverse.html#%28part._world-example%29">
universe</a> library is the Lisp convention is to use <a href="https://en.wiktionary.org/wiki/kebab_case">kebab case</a>,
whereas the JavaScript convention &mdash; at least as recommended by the
<a href="https://google.github.io/styleguide/jsguide.html">Google JavaScript Style Guide</a> &mdash; is to use
<a href="https://www.urbandictionary.com/define.php?term=dromedary%20case">dromedaryCase</a>, except for classes which use
<a href="https://techterms.com/definition/pascalcase">PascalCase</a>.

Lisp has the nice convention of ending <em>predicates</em> (ie functions which return true or false) with question marks, which
doesn't work with JavaScript since the only non-alphanumerical character allowed in a variable name is an underscore.
Following the Google style-guide, I'll use <em>isFoo()</em>.

A general rule is to use verbs as a prefix for functions &mdash; eg get, set, calculate, ... &mdash; to make them self-descriptive.

<h2>Modularisation</h2>

In the current fashion swing from <a href="https://en.wikipedia.org/wiki/Object-oriented_programming">OOP</a> to
<a href="https://en.wikipedia.org/wiki/Functional_programming">FP</a>, it's becoming clear many of OOP's selling points
boil down to <a href="https://en.wikipedia.org/wiki/Modular_programming">modular programming</a>, which can be done
more elegantly with FP.

JavaScript's <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules">modules</a>,
are a relatively new addition (circa 2015), and something I've never used, so one of my key learning goals in this project.

There's quite a lot of overlap between objects and inheritance, and modules and dependencies. In this case, I'm going to
create a module based on Racket's <a href="https://docs.racket-lang.org/teachpack/2htdpimage.html">image</a> package which
universe.js is dependent on.

<h3>Interface</h3>

In JavaScript, this is an <a href="https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export">
export</a> statement which goes at the bottom of the module file, followed by a comma separated list of names 
between curly braces which client scripts can 
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import">import</a> with a
statement at the top of their files.

<h2>Specification</h2>

<q>Programmers who advocate writing tests before writing code often believe those tests can serve as a specification. Writing tests does force us to think, and anything that gets us to think before coding is helpful. However, writing tests in code does not get us thinking above the code level. We can write a specification as a list of high-level descriptions of tests the program should pass essentially a list of properties the program should satisfy. But that is usually not a good way to write a specification, because it is very difficult to deduce from it what the program should or should not do in every situation.</q>

<a href="https://cacm.acm.org/magazines/2015/4/184705-who-builds-a-house-without-drawing-blueprints/fulltext">
Who Builds a House Without Drawing Blueprints?</a>, Leslie Lamport

<h2>WorldState</h2>

<h3>Global Conundrum</h3>

Either a bug or a feature of Jasmine is that functions it tests don't see values which have been set globally in their 
home files. So if you define something like <code>const canvas = document.querySelector("#board");<\code> 
near the top of your script &mdash; as nearly all canvas tutorials tell you to do &mdash; Jasmine neither allows a 
function to see this unless it's passed as a parameter, nor allows you to create a mock <code>window.canvas = {}</code> as could be
done if canvas hadn't been defined in the script as a global value.

Those who subscribe to the <a href="https://dl.acm.org/doi/10.1145/953353.953355">Global variable considered harmful</a>
school would see this as a feature, encouraging good function composition which does not assume anything about the outside
world.


