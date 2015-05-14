var assert = require('assert');
var Promise = require('..');
require("mocha-as-promised")();

describe('synchronous promise', function () {
	it("should accept asynchronous promise", function () {
		var result = [];
		var promise = new Promise().fulfill();

		return promise.then(function () {
			var p = new Promise;
			setTimeout(function () {
				result.push(1);
				p.fulfill();
			}, 0);
			return p;
		}).then(function () {
			result.push(2);
			assert.deepEqual(result, [1, 2]);
		});
	});

	it("should allow context to be set", function () {
		var promise = new Promise().fulfill({}, 1);

		return promise.then(function () {
			assert.equal(this, 1)
		});
	});

	it("should allow context to be set on child promise", function () {
		var promise = new Promise().fulfill({}, 1);

		return promise.then().then(function () {
			assert.equal(this, 1);
		});
	});
});