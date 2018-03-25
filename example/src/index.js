import React from "react";
import { render } from "react-dom";

import { assoc } from "imtbl";

import State from "../../lib/state";
import MultiMethod from "../../lib/multimethod";
import { createComponent } from "../../lib/ui";
import { match, withPreventDefault, withStyles } from "../../lib/core";

// global state
const repos = State.create({
  items: [],
  state: "initial",
  error: null
});

// event controller, dispatches on the first argument
const control = MultiMethod.create(event => event);

control.addMethod("fetch-repos", (event, uname) => {
  fetch(`https://api.github.com/users/${uname}/repos`)
    .then(r => {
      if (r.status === 404) {
        throw new Error(404);
      } else {
        return r;
      }
    })
    .then(r => r.json())
    .then(r => control.dispatch("fetch-repos-done", r))
    .catch(err => control.dispatch("fetch-repos-error", err));

  repos.swap(assoc, "state", "loading", "error", null);
});

control.addMethod("fetch-repos-done", (event, items) => {
  repos.swap(assoc, "items", items, "state", "initial");
});

control.addMethod("fetch-repos-error", (event, err) => {
  repos.swap(assoc, "error", err, "state", "error");
});

// CSS
const styles = {
  input: {
    border: "1px solid blue",
    borderRadius: "5px",
    padding: "8px",
    fontSize: "14px",
    outline: "none"
  },
  button: {
    border: "none",
    borderRadius: "5px",
    padding: "8px 16px",
    fontSize: "14px",
    boxShadow: "0 2px 24px rgba(0, 0, 0, 0.1)",
    borderRadius: "16.5px",
    outline: "none",
    width: "100%"
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh"
  }
};

// stateless components
const InputField = ({ value, onChange, autoFocus }) => (
  <div>
    <input
      style={styles.input}
      value={value}
      onChange={e => onChange(e.target.value)}
      autoFocus
    />
  </div>
);

const Button = ({ children, onPress, ...props }) => (
  <div>
    <button style={withStyles(props)(styles.button)} onClick={onPress}>
      {children}
    </button>
  </div>
);

// stateful component
const ReposList = createComponent({
  states: {
    repoName: State.create(""), // subscribe to local state
    repos // subscribe to global state
  },
  renderState({ state, error, items }) {
    return match(state)({
      initial: () => (
        <ul>{items.map(({ name }) => <li key={name}>{name}</li>)}</ul>
      ),
      loading: () => "Loading...",
      error: () => error.message
    });
  },
  render({ repoName, repos }, props) {
    const { items, state, error } = repos.state;
    const uname = repoName.state;

    return (
      <div style={styles.wrapper}>
        <form
          onSubmit={withPreventDefault(() =>
            control.dispatch("fetch-repos", uname)
          )}
        >
          <InputField
            value={uname}
            onChange={value => repoName.reset(value)}
            autoFocus
          />
          <Button my={4}>fetch repos</Button>
        </form>
        {this.renderState({ state, error, items })}
      </div>
    );
  }
});

render(<ReposList />, document.getElementById("root"));
