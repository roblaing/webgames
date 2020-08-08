import { resizeListener } from "../image.js";

describe("image.js", function() {

  beforeEach(function() {
    window.state = { "sprites": []
                   , "missiles": []
                   , "lives": 3
                   , "score": 0
                   , "scale": 1.0
                   , "noise": null
                   };
  });

  afterAll(function() {
    document.body.removeChild(document.querySelector("#board"));
  });

  it ("800x600 screen should set scale to 1.0", function() {
    spyOnProperty(window, "innerWidth").and.returnValue(800);
    spyOnProperty(window, "innerHeight").and.returnValue(600);
    resizeListener(800, 600, null);
    expect(window.state.scale).toBe(1.0);
  });

  it ("600x800 screen should set scale to 0.75", function() {
    spyOnProperty(window, "innerWidth").and.returnValue(600);
    spyOnProperty(window, "innerHeight").and.returnValue(800);
    resizeListener(800, 600, null);
    expect(window.state.scale).toBe(0.75);
  });

  it("360×640 screen should set scale to 0.45", function() {
    spyOnProperty(window, "innerWidth").and.returnValue(360);
    spyOnProperty(window, "innerHeight").and.returnValue(640);
    resizeListener(800, 600, null);
    expect(window.state.scale).toBe(0.45);
  });

  it("640×360 screen should set scale to 0.45", function() {
    spyOnProperty(window, "innerWidth").and.returnValue(640);
    spyOnProperty(window, "innerHeight").and.returnValue(360);
    resizeListener(800, 600, null);
    expect(window.state.scale).toBe(0.6);
  });

});
