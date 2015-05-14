var assert = require('assert');
var Promise = require('promise-now');
var TransformerAsync = require('../TransformerAsync');
require("mocha-as-promised")();

describe("TransformerAsync", function () {
	describe("transform a single node", function () {
		it("should return method's returning value", function () {
			var node = { type: 'number', value: 1 };

			function MyTransformerAsync() {}
			MyTransformerAsync.prototype = new TransformerAsync();

			MyTransformerAsync.prototype.visit_number = function () {
				return 1;
			};

			return new MyTransformerAsync().visit(node).then(function (ret) {
				assert.equal(ret, 1);
			});
		});

		it("should return null", function () {
			var node = { type: 'number', value: 1 };

			function MyTransformerAsync() {}
			MyTransformerAsync.prototype = new TransformerAsync();

			MyTransformerAsync.prototype.visit_number = function () {
				return null;
			};

			return new MyTransformerAsync().visit(node).then(function (ret) {
				assert.strictEqual(ret, null);
			});
		});

		it("should ignore undefined", function () {
			var node = { type: 'number', value: 1 };

			function MyTransformerAsync() {}
			MyTransformerAsync.prototype = new TransformerAsync();

			MyTransformerAsync.prototype.visit_node = function () {};

			return new MyTransformerAsync().visit(node).then(function (ret) {
				assert.equal(ret, node);
			});
		});

		it("should ignore undefined contained in promise", function () {
			var node = { type: 'number', value: 1 };

			function MyTransformerAsync() {}
			MyTransformerAsync.prototype = new TransformerAsync();

			MyTransformerAsync.prototype.visit_node = function () {
				return new Promise().fulfill();
			};

			return new MyTransformerAsync().visit(node).then(function (ret) {
				assert.equal(ret, node);
			});
		});
	});

	describe("transform an array of nodes", function () {
		it("should replace node", function () {
			var nodes = [
				{ type: 'number', value: 1 },
				{ type: 'string', value: 'abc' }
			];

			function MyTransformerAsync() {}
			MyTransformerAsync.prototype = new TransformerAsync();

			MyTransformerAsync.prototype.visit_node = function (node) {
				return node.value;
			};

			return new MyTransformerAsync().visit(nodes).then(function (ret) {
				assert.deepEqual(ret, [1, 'abc']);
			});
		});

		it("should flatten result array", function () {
			var nodes = [
				{ type: 'number', value: 1 },
				{ type: 'number', value: 3 }
			];

			function MyTransformerAsync() {}
			MyTransformerAsync.prototype = new TransformerAsync();

			MyTransformerAsync.prototype.visit_number = function (number) {
				return [number.value, number.value + 1];
			};

			return new MyTransformerAsync().visit(nodes).then(function (ret) {
				assert.deepEqual(ret, [1, 2, 3, 4]);
			});
		});

		it("should remove node if method returned null", function () {
			var nodes = [
				{ type: 'number', value: 1 },
				{ type: 'string', value: 'abc' }
			];

			function MyTransformerAsync() {}
			MyTransformerAsync.prototype = new TransformerAsync();

			MyTransformerAsync.prototype.visit_number = function (number) {
				return null;
			};

			return new MyTransformerAsync().visit(nodes).then(function (ret) {
				assert.deepEqual(ret, [{ type: 'string', value: 'abc' }]);
			});
		});

		it("should ignore node if method returned undefined", function () {
			var nodes = [
				{ type: 'number', value: 1 },
				{ type: 'string', value: 'abc' }
			];

			function MyTransformerAsync() {}
			MyTransformerAsync.prototype = new TransformerAsync();

			MyTransformerAsync.prototype.visit_number = function (number) {};

			return new MyTransformerAsync().visit(nodes).then(function (ret) {
				assert.deepEqual(ret, [
					{ type: 'number', value: 1 },
					{ type: 'string', value: 'abc' }
				]);
			});
		});
	});
});