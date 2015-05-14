/**
 * $len($obj)
 *
 * Return the length of an object
 *
 * For lists, it the number of their items
 * For anything else, it is 1
 */
var Range = require('natural-range');
var Node = require('roole-node');

module.exports = function (list) {
	if (!list) return;

	var length;
	if (list.type === 'range') {
		var range = new Range({
			from: Node.toNumber(list.children[0]),
			to: Node.toNumber(list.children[1]),
			exclusive: list.exclusive
		});
		return range.to - range.from;
	}

	if (list.type === 'string') return list.children[0].length;
	if (list.type !== 'list') return 1;
	if (!list.children.length) return 0;
	return (list.children.length + 1) / 2;
};