var Prefixer = require('./Prefixer');

exports.prefix = function (ast, options) {
	return new Prefixer(options).prefix(ast);
};