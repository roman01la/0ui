const { State } = require("../dist/0ui.umd");

test("State", () => {
  const count = State.create(0);

  expect(count instanceof State).toEqual(true);

  expect(count.state).toEqual(0);

  count.reset(1);

  expect(count.state).toEqual(1);

  count.swap(n => n + 1);

  expect(count.state).toEqual(2);

  const watchFn = (key, ref, prevVal, nextVal) => {
    expect(prevVal).toEqual(2);
    expect(nextVal).toEqual(3);
    expect(ref).toEqual(count);
    expect(key).toEqual("track");
  };

  count.addWatch("track", watchFn);

  expect(count.watchers["track"]).toEqual(watchFn);

  count.swap(n => n + 1);

  count.removeWatch("track");

  expect(count.watchers["track"]).toEqual(undefined);

  count.swap((n1, n2) => {
    expect(n2).toEqual(10);
    return n1 + 1;
  }, 10);
});
