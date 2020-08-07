import { resizeListener } from "../image.js";

describe("image.js", function() {

  beforeEach(function() {

  });

  afterAll(function() {
    document.body.removeChild(document.querySelector("#board"));
  });

  it ("should resize state.scale", function() {
    spyOnProperty(window, "innerWidth");
    spyOnProperty(window, "innerHeight");
    let state = {scale: 1.0, sprites: [], missiles: []};
    resizeListener(state, 800, 600, null);
    expect(state.scale).toBe(0.98);
  });

/*
  it ("should set scale to about 1.0 if window and bases sizes the same", function() {
    let scale = getScale(800, 600, 800, 600);
    console.log(scale);
    expect(scale).toBe(0.98);
  });
*/

/*
  it("should create spaceship", function() {
    expect(createSpaceship()).toEqual(
      { type: "spaceship"
      , width: 90
      , height: 90
      , row: 0
      , column: 0
      , xCentre: 400
      , yCentre: 300
      , xDelta: 0
      , yDelta: 0
      , radius: 35
      , angle: -Math.PI/2
      , angleDelta: 0
      , tick: 0
      , lifespan: Infinity
      });
  });
*/

/*
  it("should be 112.5 pixels apart", function() {
    const [x, y] = random_distance(createSpaceship(), 40, 1.5);
    expect(Math.hypot(x - 400, y - 300)).toBeGreaterThanOrEqual(112.5);
  });
*/

});
