# promise-now

Barebone [Promise/A+](http://promisesaplus.com/) implementation.

## Features

- Extremely small (~ 1kb minified), [extremely fast](http://jsperf.com/wqfwewefewrw/18)

- `.then()` being asynchronous is optional.

- Passing the [Promises/A+ Compliance Test Suite](https://github.com/promises-aplus/promises-tests)

## Installation

	npm install promise-now

## Example

```javascript
var Promise = require('promise-now');
var promise = new Promise();

promise.then(addOne).then(addOne).then(function(num) {
	console.log(num); // 3
});
promise.fulfill(1);

function addOne(num) {
	return num + 1;
}
```

## API


### promise.then([fulfillCallack], [rejectCallback]);

Call `fulfillCallack(value)` if `promise` is fulfilled with `value`.

Or call `rejectCallback(reason)` if `promise` is rejected with `reason`.

Return a new promise.

### promise.fulfill(value, [context]);

Fulfill `promise` with `value`. `this` keyword equals to `context` in callbacks if provided.

Return original `promise`.

### promise.reject(reason, [context]);

Reject `promise` with `reason`. `this` keyword equals to `context` in callbacks if provided.

Return original `promise`.

### promise.done([fulfillCallack], [rejectCallback]);

Like `.then()`, but throw with reason (asynchronously) if promise is rejected. Should be called at the end of `.then()` chain.

Return `undefined`.

## .then() being asynchronous

If you can be sure that you will never write code like:

```javascript
var promise = new Promise().fulfill();

promise.then(function() {
	console.log(2);
});
console.log(1);
```

In other words, you will not put synchronous code after asynchronous function calls, then it doesn't make a difference if `.then()` is asynchronous or not.

By default, promise-now use synchronous `.then()`. If you need the asynchronous version, simply patch promise-now (see `test/promise.js` on how it's done).