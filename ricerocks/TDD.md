<h1>Notes on Test-Driven Development</h1>

https://www.udemy.com/course/unit-testing-your-javascript-with-jasmine/learn/lecture/6574968#overview


https://www.udemy.com/course/unit-testing-your-javascript-with-jasmine/

https://support.udemy.com/hc/en-us/articles/229231067-I-Can-t-Find-my-Course

https://support.udemy.com/hc/en-us/requests/new?ticket_form_id=360000073074

<p><a href="https://twitter.com/RobertLaing6">Robert Laing</a></p>

```bash
npm install -g jasmine
```

<h2>jasmine init</h2>

This created spec/support/jasmine.json

```json
{
    "spec_dir": "spec",
    "spec_files": [
        "**/*[sS]pec.js"
    ],
    "helpers": [
        "helpers/**/*.js"
    ],
    "stopSpecOnExpectationFailure": false,
    "random": true
}
```

<h2>jasmine examples</h2>

This created lib/jasmine_examples/Player.js

```javascript
function Player() {
}
Player.prototype.play = function(song) {
  this.currentlyPlayingSong = song;
  this.isPlaying = true;
};

Player.prototype.pause = function() {
  this.isPlaying = false;
};

Player.prototype.resume = function() {
  if (this.isPlaying) {
    throw new Error("song is already playing");
  }

  this.isPlaying = true;
};

Player.prototype.makeFavorite = function() {
  this.currentlyPlayingSong.persistFavoriteStatus(true);
};

module.exports = Player;
```
