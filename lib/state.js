class State {
  constructor(initVal) {
    this.state = initVal;
    this.watchers = {};
  }
  addWatch(key, fn) {
    this.watchers[key] = fn;
    return this;
  }
  removeWatch(key) {
    delete this.watchers[key];
    return this;
  }
  reset(nextVal) {
    const prevVal = this.state;
    this.state = nextVal;
    this.notify(prevVal, nextVal);
    return this.state;
  }
  swap(fn, ...args) {
    return this.reset(fn(this.state, ...args));
  }
  notify(prevVal, nextVal) {
    Object.entries(this.watchers).forEach(([key, fn]) => {
      fn(key, this, prevVal, nextVal);
    });
  }
}

State.create = iv => new State(iv);

export default State;
