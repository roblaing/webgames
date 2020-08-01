describe("game1.js", function() {
  window.canvas = {width: 800, height: 600};
  window.spaceshipImage = {};
  window.scale = 1.0;

  it("should create spaceship", function() {
    expect(createSpaceship()).toEqual(
      { type: "spaceship"
      , image: {}
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

  it("should be 112.5 pixels apart", function() {
    const [x, y] = random_distance(createSpaceship(), 40, 1.5);
    expect(Math.hypot(x - 400, y - 300)).toBeGreaterThanOrEqual(112.5);
  });

});
