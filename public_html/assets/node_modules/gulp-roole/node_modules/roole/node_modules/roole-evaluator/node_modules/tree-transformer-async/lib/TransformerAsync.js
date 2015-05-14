var Transformer = require('tree-transformer');
var VisitorAsync = require('tree-visitor-async');
var _visitNode = VisitorAsync.prototype._visitNode;

module.exports = TransformerAsync;

function TransformerAsync() {}

TransformerAsync.prototype = new VisitorAsync();

TransformerAsync.prototype._visitNodes = function (nodes) {
	var self = this;
	return visitNodesFrom(0);

	function visitNodesFrom(i) {
		var promise = _visitNode.call(self);

		if (i >= nodes.length) return promise.then(function () { return nodes });
		return promise.then(function () {
			return _visitNode.call(this, nodes[i]);
		}).then(function (ret) {
			i = Transformer.replaceNode(ret, i, nodes);
			return visitNodesFrom(i);
		});
	}
};

TransformerAsync.prototype._visitNode = function (node) {
	return VisitorAsync.prototype._visitNode.call(this, node).then(function (ret) {
		return ret === undefined ? node : ret;
	});
};