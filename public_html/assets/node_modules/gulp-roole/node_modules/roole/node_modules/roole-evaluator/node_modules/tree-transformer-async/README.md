# Tree Transformer Async

Transform nodes in the tree asynchronously and sequentially.

Asynchronous version of [Tree Transformer](https://github.com/curvedmark/tree-transformer). Actions can return a promise and `.visit()` returns a promise.

## Example

```javascript
var fs = require('fs');
var Q = require('q');
var TransformerAsync = require('tree-transformer-async');
var nodes = [
	{ type: 'import', value: 'path/to/file1' },
	{ type: 'import', value: 'path/to/file2' },
];

function MyVisitorAsync() {}
MyVisitorAsync.prototype = new VisitorAsync();

MyVisitorAsync.prototype.visit_import = function (importNode) {
	var deferred = Q.defer();
	fs.readFile(importNode.value, 'utf8', deferred.makeNodeResolver());
	return deferred.promise.then(function (content) {
		return content;
	});
};

new MyVisitorAsync().visit(nodes).then(function (result) {
	console.log(result); // [content of file1, content of file2]
});
```