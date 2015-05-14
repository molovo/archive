/**
 * LinearGradientPrefixer
 *
 * Visit property value nodes to prefix linear-gradient()
 */
var intersect = require('intersect');
var Node = require('roole-node');
var Transformer = require('tree-transformer');
var stop = {};

module.exports = LinearGradientPrefixer;

function LinearGradientPrefixer(options) {
	this.prefixes = options.prefixes;
}

LinearGradientPrefixer.prototype = new Transformer();

LinearGradientPrefixer.prototype.prefix = function(val) {
	var prefixes = intersect(this.prefixes, ['webkit', 'moz', 'o']);
	var vals = [];

	this.hasLinearGradient = false;
	try {
		this.visit(val);
	} catch (error) {
		if (error !== stop) throw error;
	}
	if (!this.hasLinearGradient) return vals;

	prefixes.forEach(function(prefix) {
		this.currentPrefix = prefix;
		var clone = Node.clone(val);
		vals.push(this.visit(clone));
	}, this);

	return vals;
};


LinearGradientPrefixer.prototype.visit_node = function (node) {
	if (node.children) this.visit(node.children);
};

LinearGradientPrefixer.prototype.visit_call = function(call) {
	var ident = call.children[0];
	var name = ident.children[0];
	if (name.toLowerCase() !== 'linear-gradient') return;

	if (!this.hasLinearGradient) {
		this.hasLinearGradient = true;
		throw stop;
	}
	call.children[0] = '-' + this.currentPrefix + '-' + name;

	var argList = call.children[1];
	var firstArg = argList.children[0];
	if (firstArg.type !== 'list') return;

	var item = firstArg.children[0];
	if (item.type !== 'identifier' || item.children[0] !== 'to') return;

	var pos = firstArg.children.slice(2);
	firstArg.children = pos.map(Node.toOppositeNode);
};