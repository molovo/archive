var intersect = require('intersect');
var Node = require('roole-node');
var Transformer = require('tree-transformer');
var PropertyNamePrefixer = require('./PropertyNamePrefixer');
var LinearGradientPrefixer = require('./LinearGradientPrefixer');

module.exports = Prefixer;

function Prefixer(options) {
	if (!options) options = {};
	if (!options.prefixes) options.prefixes = ['webkit', 'moz', 'ms', 'o'];
	this.prefixes = options.prefixes;

	this.options = options;
}

Prefixer.prototype = new Transformer();

Prefixer.prototype.prefix = function(node) {
	if (!this.prefixes.length) return node;
	return this.visit(node);
};

Prefixer.prototype.visit_stylesheet =
Prefixer.prototype.visit_media =
Prefixer.prototype.visit_keyframeList =
Prefixer.prototype.visit_keyframe =
Prefixer.prototype.visit_ruleList = function (node) {
	this.visit(node.children);
};

Prefixer.prototype.visit_ruleset = function(ruleset) {
	var ruleList = ruleset.children[1];

	if (this.options.skipPrefixed) {
		var properties = this.properties;
		this.properties = ruleList.children;
		this.visit(ruleList.children);
		this.properties = properties;
	} else {
		this.visit(ruleList.children);
	}
};

Prefixer.prototype.visit_property = function(prop) {
	var ident = prop.children[0];
	var val = prop.children[1];
	var name = ident.children[0];
	var props = [];
	var options = { prefixes: this.prefixes };

	switch (name) {
	case 'background':
	case 'background-image':
		var vals = new LinearGradientPrefixer(options).prefix(val);
		vals.forEach(function(val) {
			var clone = Node.clone(prop, false);
			clone.children = [ident, val];
			props.push(clone);
		});
		break;
	default:
		options.properties = this.properties;
		var names = new PropertyNamePrefixer(options).prefix(ident);
		names.forEach(function(name) {
			var clone = Node.clone(prop, false);
			clone.children = [name, val];
			props.push(clone);
		});
	}
	if (!props.length) return;

	props.push(prop);
	return props;
};

Prefixer.prototype.visit_keyframes = function(kfs) {
	var prefix = kfs.prefix;
	if (prefix) return;

	var name = this.visit(kfs.children[0]);
	var ruleList = kfs.children[1];
	var prefixes = intersect(this.prefixes, ['webkit', 'moz', 'o']);
	var kfsNodes = [];

	var origPrefixes = this.prefixes;

	prefixes.forEach(function(prefix) {
		this.prefixes = [prefix];
		var ruleListClone = Node.clone(ruleList);
		this.visit(ruleListClone);

		var kfsClone = Node.clone(kfs, false);
		kfsClone.prefix = prefix;
		kfsClone.children = [name, ruleListClone];

		kfsNodes.push(kfsClone);
	}, this);

	this.prefixes = origPrefixes;

	kfsNodes.push(kfs);

	return kfsNodes;
};