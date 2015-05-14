# natural-range

Convert any range to an exclusive range in natural order.

## Installation

	npm install natural-range

## Example

```javascript
var assert = require('assert');
var Range = require('natural-range');

var range = new Range({ from: 3, to: 1 });

assert.equal(range.from, 1);
assert.equal(range.to, 4);
assert.equal(range.reversed, true);
```

See `test/test.js` for more examples.

## API

```javascript
var range = new Range(options);
```

* `options` - an object literal supports these options:
	* `from` - the start number
	* `to` - the end number
	* `exclusive` - a boolean denoting if the range is exclusive
	* `length` - if `from` or `to` is negative, and this option is provided, the negative number means backwards indexing and is relative to `length`

* `range` - the range object in natural order containing these properties:
	* `from` - the start number
	* `to` - the end number
	* `reversed` - a boolean denoting if the original range is in reversed order