var assert = require('assert');
var RooleError = require('..');

test('RooleError', function () {
	var err = new RooleError('msg', { loc: 1 });
	assert.ok(err instanceof RooleError);
	assert.ok(err instanceof Error);
	assert.equal(err.name, 'RooleError');
	assert.equal(err.message, 'msg');
	assert.equal(err.loc, 1);
});