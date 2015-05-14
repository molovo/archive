var Compiler = require('./Compiler');

exports.compile = function (node, options) {
	return new Compiler(options).compile(node);
};

exports.Compiler = Compiler;