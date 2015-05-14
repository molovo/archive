var assert = require('assert');
var Range = require('..');

test("exclusive range", function () {
	var range = new Range({ from: 1, to: 3, exclusive: true });

	assert.equal(range.from, 1);
	assert.equal(range.to, 3);
	assert.equal(range.reversed, false);
});

test("inclusive range", function () {
	var range = new Range({ from: 1, to: 2 });

	assert.equal(range.from, 1);
	assert.equal(range.to, 3);
	assert.equal(range.reversed, false);
});

test("negative exclusive range", function () {
	var range = new Range({ from: -3, to: -1, length: 4, exclusive: true });

	assert.equal(range.from, 1);
	assert.equal(range.to, 3);
	assert.equal(range.reversed, false);
});

test("negative inclusive range", function () {
	var range = new Range({ from: -3, to: -1, length: 4 });

	assert.equal(range.from, 1);
	assert.equal(range.to, 4);
	assert.equal(range.reversed, false);
});

test("reversed exclusive range", function () {
	var range = new Range({ from: 3, to: 1, exclusive: true });

	assert.equal(range.from, 2);
	assert.equal(range.to, 4);
	assert.equal(range.reversed, true);
});

test("reversed inclusive range", function () {
	var range = new Range({ from: 3, to: 1 });

	assert.equal(range.from, 1);
	assert.equal(range.to, 4);
	assert.equal(range.reversed, true);
});

test("reversed negative exclusive range", function () {
	var range = new Range({ from: -1, to: -3, length: 4, exclusive: true });

	assert.equal(range.from, 2);
	assert.equal(range.to, 4);
	assert.equal(range.reversed, true);
});

test("reversed negative inclusive range", function () {
	var range = new Range({ from: -1, to: -3, length: 4 });

	assert.equal(range.from, 1);
	assert.equal(range.to, 4);
	assert.equal(range.reversed, true);
});

test("reversed mixed exclusive range", function () {
	var range = new Range({ from: -1, to: 1, length: 4, exclusive: true });

	assert.equal(range.from, 2);
	assert.equal(range.to, 4);
	assert.equal(range.reversed, true);
});

test("reversed negative exclusive range without length", function () {
	var range = new Range({ from: -1, to: -3, exclusive: true });

	assert.equal(range.from, -2);
	assert.equal(range.to, 0);
	assert.equal(range.reversed, true);
});

test("number", function () {
	var range = new Range({ from: 1 });

	assert.equal(range.from, 1);
	assert.equal(range.to, 2);
	assert.equal(range.reversed, false);
});

test("negative number", function () {
	var range = new Range({ from: -2, length: 4 });

	assert.equal(range.from, 2);
	assert.equal(range.to, 3);
	assert.equal(range.reversed, false);
});