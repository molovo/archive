/**
 * $unit($val, [$str])
 *
 * Return a string representing the unit of a value
 *
 * If $str is passed, set the value with unit denoted by a string or an identifier
 */
var Node = require('roole-node');

module.exports = function (num, unit) {
	if (num === undefined) return;

	var val = Node.toNumber(num);
	if (val === undefined) return;

	if (!unit) {
		switch (num.type) {
		case 'number':
			return '""';
		case 'percentage':
			return '"%"';
		case 'dimension':
			return num.children[1];
		}
	}

	switch (unit.type) {
	case 'number':
	case 'null':
		return val;
	case 'percentage':
		return val + '%';
	case 'dimension':
		return val + unit.children[1];
	case 'identifier':
		return val + unit.children[0];
	case 'string':
		var unitVal = unit.children[0];

		if (!unitVal) return val;
		if (unitVal === '%') return val + '%';
		return val + unitVal;
	}
};