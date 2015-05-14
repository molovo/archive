/**
 * PropertyNamePrefixer
 *
 * Prefix property names
 */
var intersect = require('intersect');
var Node = require('roole-node');
var Transformer = require('tree-transformer');

module.exports = PropertyNamePrefixer;

function PropertyNamePrefixer(options) {
	this.prefixes = options.prefixes;
	this.properties = options.properties;
}

PropertyNamePrefixer.prototype = new Transformer();

PropertyNamePrefixer.prototype.prefix = function(name) {
	return this.visit(name);
};

PropertyNamePrefixer.prototype.visit_node = function (node) {
	if (node.children) this.visit(node.children);
};

PropertyNamePrefixer.prototype.visit_identifier = function(ident) {
	var name = ident.children[0];
	var names = [];
	var prefixes = this.prefixes;

	switch (name) {
	case 'text-overflow':
		prefixes = intersect(prefixes, ['o']);
		break;
	case 'box-sizing':
	case 'box-shadow':
	case 'border-radius':
		prefixes = intersect(prefixes, ['webkit', 'moz']);
		break;
	case 'user-select':
		prefixes = intersect(prefixes, ['webkit', 'moz', 'ms']);
		break;
	case 'transition-duration':
	case 'transition-property':
	case 'transition':
		prefixes = intersect(prefixes, ['webkit', 'moz', 'o']);
		break;
	case 'transform':
		break;
	default:
		return names;
	}
	prefixes.forEach(function(prefix) {
		var prefixed = '-' + prefix + '-' + name;
		if (this.properties) {
			var exists = this.properties.some(function(prop) {
				var ident = prop.children[0];
				var name = ident.children[0];
				return prefixed === name;
			});
			if (exists) return;
		}
		var clone = Node.clone(ident);
		clone.children[0] = prefixed;
		names.push(clone);
	}, this);
	return names;
};