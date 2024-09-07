class CustomPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = null;
    this.reason = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    this.onFinallyCallbacks = [];

    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(value) {
    if (this.state === 'pending') {
      this.state = 'fulfilled';
      this.value = value;
      this.onFulfilledCallbacks.forEach(callback => callback(this.value));
      this.onFinallyCallbacks.forEach(callback => callback());
    }
  }

  reject(reason) {
    if (this.state === 'pending') {
      this.state = 'rejected';
      this.reason = reason;
      this.onRejectedCallbacks.forEach(callback => callback(this.reason));
      this.onFinallyCallbacks.forEach(callback => callback());
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === 'fulfilled') {
      if (onFulfilled) {
        onFulfilled(this.value);
      }
    } else if (this.state === 'rejected') {
      if (onRejected) {
        onRejected(this.reason);
      }
    } else {
      if (onFulfilled) {
        this.onFulfilledCallbacks.push(onFulfilled);
      }
      if (onRejected) {
        this.onRejectedCallbacks.push(onRejected);
      }
    }
    return this;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    if (this.state !== 'pending') {
      onFinally();
    } else {
      this.onFinallyCallbacks.push(onFinally);
    }
    return this;
  }
}

window.CustomPromise = CustomPromise;