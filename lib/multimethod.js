class MultiMethod {
  constructor(dispatchFn) {
    this.dispatchFn = dispatchFn;
    this.vtable = new Map();
  }
  addMethod(dispatchVal, method) {
    this.vtable.set(dispatchVal, method);
  }
  dispatch(...args) {
    const dv = this.dispatchFn(...args);
    const method = this.vtable.get(dv);

    if (method) {
      return method(...args);
    } else {
      throw new ReferenceError(dv);
    }
  }
}

MultiMethod.create = df => new MultiMethod(df);

export default MultiMethod;
