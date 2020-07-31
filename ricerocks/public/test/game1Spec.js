describe("game1.js", function() {
  window.canvas = {width: 800, height: 600};
  window.spaceshipImage = {};

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

  it("pythagorean x = 3, y = 4 should be 5", function() {
    expect(distance(0, 0, 3, 4)).toBe(5);
  });

  xit("should be 112.5 pixels apart", function() {
    // refuses to see global variable scale
    const [x, y] = random_distance(createSpaceship(), 40, 1.5);
    expect(distance(x, y, 400, 300)).toBeGreaterThanOrEqual(112.5);
  });

});
