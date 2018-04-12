_A set of utilities for building UIs with React_

[Demo at https://roman01la.github.io/0ui/](https://roman01la.github.io/0ui/)

v1.2.0

```
npm i 0ui
```

See an example of how everything is used together in `example/src/index.js`

## UMD build

```html
<script src="https://unpkg.com/0ui/dist/0ui.umd.js"></script>
```

## core lib

`lib/core.js`

_Random utilities_

### Stupid pattern matching

_More like a shorthand for `switch/case`_

```js
import { match } from "0ui/lib/core";

match("loading")({
  loading: () => console.log("Loading"),
  error: () => console.log("Error"),
  else: () => console.log("no matching clause")
});
// "Error"
```

_Why? Because switch/case is too verbose 🤷‍_

## imtbl

Immutable style data manipulation for plain JavaScript objects, see [imtbl](https://github.com/roman01la/imtbl) lib.

_Why? Read the [readme](https://github.com/roman01la/imtbl)_

## State

`lib/state.js`

### State object

_Independent state object_

```js
import State from "0ui/lib/state";

const state = State.create(0);

state.addWatch("key", (key, state, prevVal, nextVal) => {
  console.log(prevVal, nextVal);
});

state.swap(val => val + 1); // 0 1
```

_Why? Because explicit reactive state is useful everywhere, not just in React_

## Derived state

`lib/derived-state.js`

_Derives state -> state' with a function and propagates updates from state -> state'_

```js
import State from "0ui/lib/state";
import DerivedState from "0ui/lib/derived-state";

const bucket = State.create({
  items: [
    {
      price: 104.5
    },
    {
      price: 78.2
    }
  ]
});

const bucketPrice = DerivedState.create(bucket, ({ items }) =>
  items.reduce((sum, { price }) => sum + price, 0)
);

bucketPrice.state; // 182.7

bucket.swap(removeFirstItem);

bucketPrice.state; // 178.2
```

_Why? Because sometimes you want reactive materialized views_

## Multimethod

`lib/multimethod.js`

> Multiple dispatch or multimethods is a feature of some programming languages in which a function or method can be dynamically dispatched based on the run-time (dynamic) type or, in the more general case some other attribute, of more than one of its arguments. [Wikipedia](https://en.wikipedia.org/wiki/Multiple_dispatch)

```js
import MultiMethod from "0ui/lib/multimethod";

const toJSON = MultiMethod.create(v => {
  if (Array.isArray(v)) {
    return "array";
  } else {
    return typeof v;
  }
});

// called if there's no match for dispatched value
toJSON.addMethod("default", v => JSON.stringify(v));

toJSON.addMethod("string", v => JSON.stringify(v));

toJSON.addMethod("number", v => v.toString());

toJSON.addMethod("array", arr => {
  const jsonArr = arr.map(v => toJSON.dispatch(v)).join(", ");
  return `[${jsonArr}]`;
});

toJSON.addMethod("object", o => {
  const jsonObj = Object.entries(o)
    .map(([k, v]) => toJSON.dispatch(k) + ":" + toJSON.dispatch(v))
    .join(", ");
  return `{${jsonObj}}`;
});

toJSON.dispatch({
  items: [1, "two"]
});
// {"items":[1, "two"]}
```

_Why? Because it's a better abstraction and less annoying than switch/case_

## UI

`lib/ui.js`

_React Component API wrapper. Subscribes to multiple State objects._

```js
import { createComponent } from "0ui/lib/ui";
import State from "0ui/lib/state";

const Counter = createComponent({
  states: {
    count: State.create(0) // local state
  },
  render(states, props) {
    const { count } = states;

    return (
      <div>
        <button onClick={() => count.swap(v => v - 1)}>-</button>
        <span>{count.state}</span>
        <button onClick={() => count.swap(v => v + 1)}>+</button>
      </div>
    );
  }
});
```

_Why? Because I hate JS classes and like having multiple decoupled states in a component_
