_A set of utilities for building UIs with React_

See an example of how everything is used together in `example/src/index.js`

## core lib

`lib/core.js`

_Random utilities_

### Stupid pattern matching

_More like a shorthand for `switch/case`_

```js
import { match } from "0ui/lib/core";

match("loading")({
  loading: () => console.log("Loading"),
  error: () => console.log("Error")
});
// "Error"
```

## imtbl

Immutable style data manipulation for plain JavaScript objects, see [imtbl](https://github.com/roman01la/imtbl) lib.

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
