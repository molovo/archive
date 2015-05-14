var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

module.exports = Promise;

function Promise() {
	this.state = PENDING;
	this.callbacks = [];
}

Promise.prototype.then = function(cb, eb) {
	if (!cb && !eb) return this;

	var promise = new Promise();
	var callback = this.createCallback(cb, eb, promise);

	if (this.state) this.runCallback(callback);
	else this.callbacks.push(callback);

	return promise;
};

Promise.prototype.done = function (cb, eb) {
	this.then(cb, eb).then(null, function (reason) {
		// throw asynchronously
		// so it won't be turned into a rejection
		setTimeout(function () {
			throw reason;
		}, 0)
	});
};

Promise.prototype.fulfill = function (value, context) {
	if (this.state) return this;

	this.state = FULFILLED;
	this.arg = value;
	this.context = context;

	this.runCallbacks();

	return this;
};

Promise.prototype.reject = function (reason, context) {
	if (this.state) return this;

	this.state = REJECTED;
	this.arg = reason;
	this.context = context;

	this.runCallbacks();

	return this;
};

Promise.prototype.runCallback = function (callback) {
	callback();
};

Promise.prototype.runCallbacks = function () {
	for (var i = 0, len = this.callbacks.length; i < len; ++i) {
		this.callbacks[i]();
	}
	this.callbacks = null;
};

Promise.prototype.createCallback = function (cb, eb, promise) {
	var self = this;

	return function () {
		var state = self.state;
		var arg = self.arg;
		var context = self.context;
		var fn;

		if (state === FULFILLED) {
			if (typeof cb !== 'function') return promise.fulfill(arg, context);
			fn = cb;
		} else {
			if (typeof eb !== 'function') return promise.reject(arg, context);
			fn = eb;
		}

		try {
			arg = fn.call(context, arg);
		} catch (err) {
			return promise.reject(err, context);
		}

		if (!arg || typeof arg.then !== 'function') {
			return promise.fulfill(arg, context);
		}

		// returned a promise
		arg.then(function (value) {
			promise.fulfill(value, context);
		}, function (reason) {
			promise.reject(reason, context);
		});
	};
};