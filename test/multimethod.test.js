const { MultiMethod } = require("../dist/0ui.umd");

test("MultiMethod dispatch", () => {
  const say = MultiMethod.create(who => who);

  expect(say instanceof MultiMethod).toEqual(true);

  say.addMethod("default", () => "GTFO!");
  say.addMethod("dog", () => "Woof!");

  expect(say.dispatch("dog")).toEqual("Woof!");
  expect(say.dispatch("cat")).toEqual("GTFO!");
});

test("MultiMethod dispatch w/o default method", () => {
  const say = MultiMethod.create(who => who);

  expect(() => {
    say.dispatch("cat");
  }).toThrow();
});
