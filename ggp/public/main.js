"use strict";

let state = [ ["cell", "1", "1", "x"], ["cell", "1", "2", "x"], ["cell", "1", "3", "o"]
            , ["cell", "2", "1", "b"], ["cell", "2", "2", "o"], ["cell", "2", "3", "b"]
            , ["cell", "3", "1", "b"], ["cell", "3", "2", "o"], ["cell", "3", "3", "x"]
            , ["control", "white"]
            ];

const aiPlayer = new WebSocket('ws://localhost:6455');

aiPlayer.addEventListener("open", function (event) {
  aiPlayer.send(JSON.stringify({"state": state}));
});

aiPlayer.addEventListener('message', function (event) {
  state = JSON.parse(event.data);
  console.log(`Message from server ${state[0]}`);
  // console.log(`Message from server ${event.data}`);
});

