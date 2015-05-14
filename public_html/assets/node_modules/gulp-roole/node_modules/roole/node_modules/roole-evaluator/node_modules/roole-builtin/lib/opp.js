/**
 * $opp($val)
 *
 * Return the opposite value of a string or an identifier denoting a position
 *
 * right <-> left
 * top <-> bottom
 *
 * Other values stay the same
 */
var Node = require('roole-node');

module.exports = function (list) {
	if (list) return Node.toOppositeNode(list);
};