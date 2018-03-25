import { Component } from "react";

export const createComponent = ({
  displayName,
  states,
  render,
  onWillMount,
  onDidMount,
  onWillUnmount,
  onAfterRender,
  propTypes,
  defaultProps,
  ...methods
}) => {
  const cls = class extends Component {
    constructor() {
      super();
      Object.entries(methods).forEach(([name, fn]) => {
        this[name] = fn;
      });
    }
    componentWillMount() {
      if (onWillMount) {
        onWillMount.call(this);
      }
    }
    componentDidMount() {
      Object.entries(states).forEach(([key, ref]) => {
        ref.addWatch(key, (k, r, o, n) => {
          if (n !== o) {
            this.forceUpdate();
          }
        });
      });

      if (onDidMount) {
        onDidMount.call(this);
      }
      if (onAfterRender) {
        onAfterRender.call(this);
      }
    }
    componentWillUnmount() {
      Object.entries(states).forEach(([key, ref]) => {
        ref.removeWatch(key);
      });

      if (onWillUnmount) {
        onWillUnmount.call(this);
      }
    }
    componentDidUpdate() {
      if (onAfterRender) {
        onAfterRender.call(this);
      }
    }
    render() {
      return render.call(this, states, this.props);
    }
  };
  cls.propTypes = propTypes;
  cls.defaultProps = defaultProps;
  cls.displayName = displayName;
  return cls;
};
