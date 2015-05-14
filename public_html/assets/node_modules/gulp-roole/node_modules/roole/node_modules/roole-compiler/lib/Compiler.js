var Transformer = require('tree-transformer');

module.exports = Compiler;

function Compiler(options) {
	if (!options) options = {};
	if (!options.indent) options.indent = '\t';
	if (!options.precision) options.precision = 5;

	this.options = options;
	this.level = 0;
	this.indent = '';
}

Compiler.prototype = new Transformer();

Compiler.prototype.compile = function(node) {
	return this.visit(node);
};

Compiler.prototype.setLevel = function (offset) {
	if (!offset) return;
	this.level += offset;
	this.indent = new Array(this.level + 1).join(this.options.indent);
};

Compiler.prototype.comments = function(node) {
	var comments = node.comments;
	if (!comments || !comments.length) return '';

	var indent = this.indent;
	var newline = '\n' + indent;

	return indent + comments.map(function (comment) {
		return comment.replace(/\n/g, newline);
	}, this).join(newline) + '\n';
};

Compiler.prototype.visit_node = function (node) {
	return this.visit(node.children).join('');
};

Compiler.prototype.visit_stylesheet = function (stylesheet) {
	var rules = stylesheet.children;
	var css = '';

	for (var i = 0, len = rules.length; i < len; ++i) {
		var rule = rules[i];
		if (i) {
			css += '\n';
			// top-level rules should separated by double newlines
			if (!rule.level) css += '\n';
		}
		css += this.visit(rule);
	}

	var comments = this.comments(stylesheet);
	if (!css) comments = comments.slice(0, -1);
	return comments + css;
};

Compiler.prototype.visit_ruleset = function(ruleset) {
	this.setLevel(ruleset.level)

	var indent = this.indent;
	var comments = this.comments(ruleset);
	var selList = this.visit(ruleset.children[0]);
	var ruleList = this.visit(ruleset.children[1]);

	this.setLevel(-ruleset.level)

	return comments + indent + selList + ' ' + ruleList;
};

Compiler.prototype.visit_selectorList =
Compiler.prototype.visit_keyframeSelectorList = function(node) {
	return this.visit(node.children).join(',\n' + this.indent);
};

Compiler.prototype.visit_classSelector = function(sel) {
	return '.' + this.visit(sel.children[0]);
};

Compiler.prototype.visit_hashSelector = function(sel) {
	return '#' + this.visit(sel.children[0]);
};

Compiler.prototype.visit_attributeSelector = function(sel) {
	var attr = this.visit(sel.children).join(sel.operator);
	return '[' + attr + ']';
};

Compiler.prototype.visit_pseudoSelector = function(sel) {
	var colon = sel.doubleColon ? '::' : ':';
	var name = this.visit(sel.children[0]);
	var args = this.visit(sel.children[1]) || '';
	if (args) args = '(' + args + ')';
	return colon + name + args;
};

Compiler.prototype.visit_negationSelector = function(sel) {
	return ':not(' + this.visit(sel.children[0]) + ')';
};

Compiler.prototype.visit_universalSelector = function() {
	return '*';
};

Compiler.prototype.visit_combinator = function(comb) {
	var val = comb.children[0];
	if (val !== ' ') val = ' ' + val + ' ';
	return val;
};

Compiler.prototype.visit_ruleList = function(ruleList) {
	this.setLevel(1);
	var rules = this.visit(ruleList.children).join('\n');
	this.setLevel(-1);

	if (!rules) return '{}';
	return '{\n' + rules + '\n' + this.indent + '}';
};

Compiler.prototype.visit_property = function(prop) {
	var name = this.visit(prop.children[0]);
	var value = this.visit(prop.children[1]);
	var priority = prop.priority;
	if (priority) priority = ' ' + priority;
	var comments = this.comments(prop);
	return comments + this.indent + name + ': ' +  value + priority + ';';
};

Compiler.prototype.visit_number = function(num) {
	num = +num.children[0].toFixed(this.options.precision);
	return num.toString();
};

Compiler.prototype.visit_percentage = function(percent) {
	var num = +percent.children[0].toFixed(this.options.precision);
	return num + '%';
};

Compiler.prototype.visit_dimension = function(dimen) {
	var num = +dimen.children[0].toFixed(this.options.precision);
	var unit = dimen.children[1];
	return num + unit;
};

Compiler.prototype.visit_string = function(str) {
	return str.quote + str.children[0] + str.quote;
};

Compiler.prototype.visit_color = function(color) {
	return '#' + color.children[0];
};

Compiler.prototype.visit_null = function() {
	return 'null';
};

Compiler.prototype.visit_list = function (list) {
	if (!list.children.length) return '[]';
	return this.visit(list.children).join('');
};

Compiler.prototype.visit_separator = function(sep) {
	sep = sep.children[0];
	if (sep === ',') sep += ' ';
	return sep;
};

Compiler.prototype.visit_url = function(url) {
	url = this.visit(url.children[0]);
	return 'url(' + url + ')';
};

Compiler.prototype.visit_call = function(call) {
	var name = this.visit(call.children[0]);
	var args = this.visit(call.children[1]);
	return name + '(' + args + ')';
};

Compiler.prototype.visit_argumentList = function (argList) {
	return this.visit(argList.children).join(', ');
};

Compiler.prototype.visit_binaryExpression = function (binExpr) {
	var left = binExpr.children[0];
	var right = binExpr.children[1];
	var leftCss = this.visit(left);
	var rightCss = this.visit(right);
	var op = ' '  + binExpr.operator + ' ';

	switch (binExpr.operator) {
	case '*':
	case '/':
		if (left.type === 'binaryExpression') {
			switch (left.operator) {
			case '+':
			case '-':
				leftCss = '(' + leftCss + ')';
			}
		}
		if (right.type === 'binaryExpression') {
			switch (right.operator) {
			case '+':
			case '-':
				rightCss = '(' + rightCss + ')';
			}
		}
	}

	return leftCss + op + rightCss;
};

Compiler.prototype.visit_media = function(media) {
	this.setLevel(media.level)

	var comments = this.comments(media);
	var indent = this.indent;
	var mqList = this.visit(media.children[0]);
	var ruleList = this.visit(media.children[1]);

	this.setLevel(-media.level)

	return comments + indent + '@media ' + mqList + ' ' + ruleList;
};

Compiler.prototype.visit_mediaQueryList = function(mqList) {
	return this.visit(mqList.children).join(', ');
};


Compiler.prototype.visit_mediaQuery = function(mq) {
	return this.visit(mq.children).join(' and ');
};

Compiler.prototype.visit_mediaType = function(mt) {
	var modifier = mt.modifier;
	if (modifier) modifier += ' ';
	var name = this.visit(mt.children[0]);
	return modifier + name;
};

Compiler.prototype.visit_mediaFeature = function(mf) {
	var name = this.visit(mf.children[0]);
	var value = this.visit(mf.children[1]) || '';
	if (value) value = ': ' + value;
	return '(' + name + value + ')';
};

Compiler.prototype.visit_import = function(importNode) {
	var comments = this.comments(importNode);
	var url = this.visit(importNode.children[0]);
	var mq = importNode.children[1];
	if (mq) mq = ' ' + this.visit(mq.children).join(', ')
	else mq = '';
	return comments + '@import ' + url + mq + ';';
};

Compiler.prototype.visit_keyframes = function(kfs) {
	var comments = this.comments(kfs);
	var prefix = kfs.prefix;
	if (prefix) prefix = '-' + prefix + '-';
	var name = this.visit(kfs.children[0]);
	var ruleList = this.visit(kfs.children[1]);
	return comments + '@' + prefix + 'keyframes ' + name + ' ' + ruleList;
};

Compiler.prototype.visit_keyframe = function(kf) {
	var comments = this.comments(kf);
	var indent = this.indent;
	var selList = this.visit(kf.children[0]);
	var ruleList = this.visit(kf.children[1]);
	return comments + indent + selList + ' ' + ruleList;
};

Compiler.prototype.visit_fontFace = function(ff) {
	var comments = this.comments(ff);
	var ruleList = this.visit(ff.children[0]);
	return comments + '@font-face '+ ruleList;
};

Compiler.prototype.visit_charset = function(charset) {
	var comments = this.comments(charset);
	var value = this.visit(charset.children[0]);
	return comments + '@charset ' + value + ';';
};

Compiler.prototype.visit_page = function(page) {
	var comments = this.comments(page);
	var name = this.visit(page.children[0]) || '';
	if (name) name = ' :' + name;
	var ruleList = this.visit(page.children[1]);
	return comments + '@page' + name + ' ' + ruleList;
};