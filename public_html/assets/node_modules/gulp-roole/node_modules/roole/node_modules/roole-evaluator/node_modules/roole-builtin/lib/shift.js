/**
 * $shift($list)
 *
 * Shift an item from the list
 */
var RooleError = require('roole-error');

module.exports = function (list) {
	if (!list) return;

	if (list.type !== 'list') throw new RooleError(list.type + ' is not a list', list);

	if (!list.children.length) return;
	if (list.children.length === 1) return list.children.shift();

	var item = list.children.shift();
	// remove separator;
	list.children.shift()

	return item;
};