/**
 * $push($list, ...$items)
 *
 * Push items to the list
 */
var RooleError = require('roole-error');
var Node = require('roole-node');

module.exports = function (list, first) {
	if (!list) return;
	if (!first) return list;

	if (list.type !== 'list') throw new RooleError(list.type + ' is not a list', list);

	var args = [].slice.call(arguments, 1);
	var items = list.children;
	var sep;

	if (items.length) {
		sep = Node.getJoinSeparator(list, first);
		items.push(sep);
	}
	items.push(first);

	for (var i = 1, len = args.length; i < len; ++i) {
		var arg = args[i];
		sep = Node.getJoinSeparator(list, arg);
		items.push(sep, arg)
	}

	return list;
};