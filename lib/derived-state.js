import State from "./state";

let sid = 0;

class DerivedState extends State {
  constructor(ref, fn) {
    super(fn(ref.state));
    ref.addWatch(++sid, (k, r, o, n) => {
      const oval = fn(o);
      const nval = fn(n);

      if (nval !== oval) {
        this.reset(nval);
      }
    });
  }
}

DerivedState.create = (ref, fn) => new DerivedState(ref, fn);

export default DerivedState;
