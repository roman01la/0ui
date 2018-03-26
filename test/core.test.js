const { core } = require("../dist/0ui.umd");

test("core/match", () => {
  const mockCallback1 = jest.fn();
  const mockCallback2 = jest.fn();

  core.match("loading")({
    loading: mockCallback1
  });

  core.match("some")({
    loading: mockCallback1,
    else: mockCallback2
  });

  expect(mockCallback1.mock.calls.length).toBe(1);
  expect(mockCallback2.mock.calls.length).toBe(1);

  expect(() => {
    core.match("some")({
      loading: mockCallback1
    });
  }).toThrow();
});
