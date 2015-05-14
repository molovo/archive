var assert = require('assert');
var parser = require('roole-parser');
var compiler = require('roole-compiler');
var prefixer = require('..');

exports.compileTo = function(options, input, css) {
	if (arguments.length < 3) {
		css = input;
		input = options;
		options = {};
	}

	var ast = parser.parse(input);
	ast = prefixer.prefix(ast, options);
	var output = compiler.compile(ast);

	if (output === css) return;

	assert.equal(output, css);
};