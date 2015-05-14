/**
 * $list($obj, [$sep])
 *
 * Convert an object into a list.
 *
 * If `$sep` is passed, items in the list are separated by it.
 */
var intersperse = require('intersperse');
var Node = require('roole-node');

module.exports = function (list, sep) {
	if (!list) return { type: 'list', children: [] };

	list = Node.toListNode(list);
	if (!sep) return list;

	if (sep.type !== 'string') return list;
	switch(sep.children[0]) {
	case ' ':
	case '/':
	case ',':
		sep = {
			type: 'separator',
			children: [sep.children[0]],
			loc: sep.loc
		};
		break;
	default:
		return list;
	}
	var items = Node.toArray(list);
	return {
		type: 'list',
		children: intersperse(items, sep)
	};
};