# roole-prefixer

Prefix rules in CSS AST with vendor names;

## Example

```javascript
var parser = require('roole-parser');
var compiler = require('roole-compiler');
var prefixer = require('roole-prefixer');

var ast = parser.parse('body { box-sizing: border-box }');
ast = prefixer.prefix(ast);
var css = compiler.compile(ast);

console.log(css);
```

### API

```javascript
var ast = prefixer.prefix(ast, [options]);
```

* `ast` - CSS AST
* `options` - an object literal supports these options:
	* `prefixes` (default: `['webkit', 'moz', 'ms', 'o']`) - An array of strings containing vendor names to be prefixed. The order determines the order of prefixing.