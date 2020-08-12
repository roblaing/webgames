describe("JSON general game player tests", function() {
  const state = [ 
            ["cell", 1, 1, "x"], ["cell", 1, 2, "x"], ["cell", 1, 3, "o"]
          , ["cell", 2, 1, "b"], ["cell", 2, 2, "o"], ["cell", 2, 3, "b"]
          , ["cell", 3, 1, "b"], ["cell", 3, 2, "o"], ["cell", 3, 3, "x"]
          , ["control", "white"]
          ];

  it('matchRule(["cell", "?x", "?y", "b"], ["cell", 2, 1, "b"]) should be true', function() {
    expect(matchRule(["cell", "?x", "?y", "b"], ["cell", 2, 1, "b"])).toBe(true);
  });

  it('matchRule(["cell", "?x", "?y", "b"], ["cell", 1, 1, "x"]) should be false', function() {
    expect(matchRule(["cell", "?x", "?y", "b"], ["cell", 1, 1, "x"])).toBe(false);
  });

  it('matchRule(["cell", "?x", "?y", "b"], ["control", "white"]) should be false', function() {
    expect(matchRule(["cell", "?x", "?y", "b"], ["control", "white"])).toBe(false);
  });

  it('matchRule(["control", "?w"], ["control", "white"]) should be true', function() {
    expect(matchRule(["control", "?w"], ["control", "white"])).toBe(true);
  });

  it('getVariables(state, ["cell", "?x", "?y", "b"])', function() {
    expect(getVariables(state, ["cell", "?x", "?y", "b"]))
    .toEqual([{"?x": 2, "?y": 1}, ["cell", 2, 3, "b"], ["cell", 3, 1, "b"]]);
  });

  it('getVariables(state, ["control", "black"])', function() {
    expect(getVariables(state, ["control", "black"])).toEqual([]);
  });

  it('getVariables(state, ["control", "white"])', function() {
    expect(getVariables(state, ["control", "white"])).toEqual([["control", "white"]]);
  });

});
