const { ui, State, react } = require("../dist/0ui.umd");

test("ui", () => {
  const count = State.create(0);

  const propTypes = {};
  const defaultProps = {};

  const onWillMount = jest.fn();
  const onDidMount = jest.fn();
  const onWillUnmount = jest.fn();
  const onAfterRender = jest.fn();

  const customMethod = jest.fn();

  const render = (states, { keyProp }) => {
    expect(states.count).toEqual(count);
    expect(keyProp).toEqual("keyProp");
    return 1;
  };

  const c = ui.createComponent({
    displayName: "test/component",
    states: {
      count
    },
    propTypes,
    defaultProps,
    onWillMount,
    onDidMount,
    onWillUnmount,
    onAfterRender,
    customMethod,
    render
  });

  expect(c.propTypes).toEqual(propTypes);
  expect(c.defaultProps).toEqual(defaultProps);
  expect(c.displayName).toEqual("test/component");

  const ci = new c();

  expect(ci.customMethod).toEqual(customMethod);

  ci.componentWillMount();
  expect(onWillMount.mock.calls.length).toEqual(1);

  ci.componentDidMount();
  expect(onDidMount.mock.calls.length).toEqual(1);

  ci.componentWillUnmount();
  expect(onWillUnmount.mock.calls.length).toEqual(1);

  ci.componentDidUpdate();
  expect(onAfterRender.mock.calls.length).toEqual(2);

  ci.customMethod();
  expect(customMethod.mock.calls.length).toEqual(1);

  const cri1 = react.createElement(c, { keyProp: "keyProp" });

  expect(cri1.props.keyProp).toEqual("keyProp");

  expect(cri1.type.prototype.render.call(cri1)).toEqual(1);

  const cri2 = react.createElement(c, { keyProp: "keyProp" });

  cri1.type.prototype.componentDidMount.call(cri1);

  expect(count.watchers.hasOwnProperty("count")).toEqual(true);

  cri1.type.prototype.componentWillUnmount.call(cri1);

  expect(count.watchers.hasOwnProperty("count")).toEqual(false);

  cri1.forceUpdate = jest.fn();

  cri1.type.prototype.componentDidMount.call(cri1);

  count.reset(1);

  expect(cri1.forceUpdate.mock.calls.length).toBe(1);
});
