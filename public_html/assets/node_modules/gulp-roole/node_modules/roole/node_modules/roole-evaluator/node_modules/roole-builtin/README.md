# roole-builtin

Roole language builtins. Used by roole-evaluator.

## Installation

	npm install roole-builtin

## Example

```javascript
var parser = require('roole-parser');
var evaluator = require('roole-evaluator');
var compiler = require('roole-compiler');

var ast = parser.parse('a { content: $len(0 1) }');
ast = evaluator.evaluate(ast, { scope: [builtin, {}] });
var css = compiler.compile(ast);

console.log(css) // a { content: 2 }
```