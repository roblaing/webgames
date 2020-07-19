<h1>Some simple html5 games</h1>

<q>Learning coding is like playing cards — you learn the rules, then you play, then you go back and learn the rules again, 
then you play again.<q> &mdash; From Mozilla's
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API">Web audio concepts and usage</a>.

<h2>Style Guide</h2>

<a href="https://google.github.io/styleguide/jsguide.html">Google JavaScript Style Guide</a>

I'm generally following this, except for trailing commas. It took me a while to like leading commas, but now I do.

Quoted keys

Booleans: isUp

<h2><a href="https://jsdoc.app/">Jsdoc</a></h2>

<dl>
<dt><a href="https://jsdoc.app/tags-description.html">@description Add two numbers.</a></dt>
<dd>If you describe a symbol at the very beginning of a JSDoc comment, before using any block tags, 
  you may omit the @description tag.</dd>
<dt><a href="https://jsdoc.app/tags-param.html">@param {string} somebody - Somebody's name.</a></dt>
<dd>Name, type, and description, with a hyphen before the description</dd>
<dt><a href="https://jsdoc.app/tags-returns.html">@returns {number} Sum of a and b</a></dt>
<dd>For multiple return types, <code>@returns {(number|Array)} Sum ...</code></dd>
<dt><a href="https://jsdoc.app/tags-typedef.html"></a>@typedef {Object} Sprite</dt>
<dd>The @typedef tag is useful for documenting custom types, particularly if you wish to refer to them repeatedly. 
These types can then be used within other tags expecting a type, such as @type or @param.</dd>
<dt><a href="https://jsdoc.app/tags-property.html">@property {number} players - The default number of players.</a></dt>
<dd>A type definition with required and optional property<code>@property {string} [nickName]</code></dd>
<dt><a href="https://jsdoc.app/tags-listens.html">@listens document#mousedown</a></dt>
<dd>Use <a href="https://jsdoc.app/tags-event.html"><className>#[event:]<eventName></a></dd>
</dl>


```javascript
/**
* @callback Requester~requestCallback
* @param {number} responseCode

*/
```


<h2>Game 1: RiceRocks</h2>


https://github.com/fredsa/gritsgame



