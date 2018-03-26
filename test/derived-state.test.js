const { State, DerivedState } = require("../dist/0ui.umd");

test("DerivedState", () => {
  const items = State.create([1]);
  const firstItem = DerivedState.create(items, items => items[0]);

  expect(firstItem instanceof DerivedState).toEqual(true);

  expect(firstItem.state).toEqual(1);

  items.reset([2]);

  expect(firstItem.state).toEqual(2);

  const mockCallback1 = jest.fn();

  firstItem.addWatch("watch", mockCallback1);

  items.reset([3]);
  items.reset([3]);
  items.reset([3, 1]);

  expect(mockCallback1.mock.calls.length).toBe(1);
});
