assert = require './assert'

suite 'value'

test "number", ->
	assert.compileTo '''
		body { margin: 0 }
	''', '''
		body {
			margin: 0;
		}
	'''

test "fraction number", ->
	assert.compileTo '''
		body { margin: 0.2 }
	''', '''
		body {
			margin: 0.2;
		}
	'''

test "fraction number without whole part", ->
	assert.compileTo '''
		body { margin: .2 }
	''', '''
		body {
			margin: 0.2;
		}
	'''

test "fraction number that are to be rounded", ->
	assert.compileTo '''
		body { margin: 0.6666666 }
	''', '''
		body {
			margin: 0.66667;
		}
	'''

test "percentage", ->
	assert.compileTo '''
		body { margin: 0% }
	''', '''
		body {
			margin: 0%;
		}
	'''

test "dimension", ->
	assert.compileTo '''
		body { margin: .2em }
	''', '''
		body {
			margin: 0.2em;
		}
	'''

test "single-quoted string", ->
	assert.compileTo '''
		body {
			content: 'abc';
		}
	''', '''
		body {
			content: 'abc';
		}
	'''

test "single-quoted string with escape", ->
	assert.compileTo '''
		body { content: 'ab\\'c' }
	''', '''
		body {
			content: 'ab\\'c';
		}
	'''

test "double-quoted string", ->
	assert.compileTo '''
		body {
			content: "abc";
		}
	''', '''
		body {
			content: "abc";
		}
	'''

test "double-quoted string with escape", ->
	assert.compileTo '''
		body {
			content: "abc\\"";
		}
	''', '''
		body {
			content: "abc\\"";
		}
	'''

test "double-quoted string with escape", ->
	assert.compileTo '''
		body {
			content: "abc\\"";
		}
	''', '''
		body {
			content: "abc\\"";
		}
	'''

test "color", ->
	assert.compileTo '''
		body {
			content: #ff1122;
		}
	''', '''
		body {
			content: #ff1122;
		}
	'''

test "null", ->
	assert.compileTo '''
		body {
			content: null;
		}
	''', '''
		body {
			content: null;
		}
	'''

test "compilte url", ->
	assert.compileTo '''
		body {
			content: url(http://example.com/);
		}
	''', '''
		body {
			content: url(http://example.com/);
		}
	'''

test "compilte quoted url", ->
	assert.compileTo '''
		body {
			content: url('http://example.com/');
		}
	''', '''
		body {
			content: url('http://example.com/');
		}
	'''

test "space-separated list", ->
	assert.compileTo '''
		body {
			font-family: foo bar baz;
		}
	''', '''
		body {
			font-family: foo bar baz;
		}
	'''

test "comma-separated list", ->
	assert.compileTo '''
		body {
			font-family: foo,bar,baz;
		}
	''', '''
		body {
			font-family: foo, bar, baz;
		}
	'''

test "slash-separated list", ->
	assert.compileTo '''
		body {
			font: 14px/1.2;
		}
	''', '''
		body {
			font: 14px/1.2;
		}
	'''

test "mix-separated list", ->
	assert.compileTo '''
		body {
			font: normal 12px/1.25 font1, font2;
		}
	''', '''
		body {
			font: normal 12px/1.25 font1, font2;
		}
	'''

test "list separated by slashes", ->
	assert.compileTo '''
		body {
			font: 12px/1.25;
		}
	''', '''
		body {
			font: 12px/1.25;
		}
	'''

test "square bracket list", ->
	assert.compileTo '''
		body {
			content: [1, 2];
		}
	''', '''
		body {
			content: 1, 2;
		}
	'''

test "square bracket list containing only one item", ->
	assert.compileTo '''
		body {
			content: [1];
		}
	''', '''
		body {
			content: 1;
		}
	'''

test "empty list", ->
	assert.compileTo '''
		body {
			content: [];
		}
	''', '''
		body {
			content: [];
		}
	'''

test "square bracket list with mixed separators", ->
	assert.compileTo '''
		body {
			content: [1, 2 3 4/5];
		}
	''', '''
		body {
			content: 1, 2 3 4/5;
		}
	'''

test "nested lists", ->
	assert.compileTo '''
		body {
			content: 1, [[1 2, [1/3]]];
		}
	''', '''
		body {
			content: 1, 1 2, 1/3;
		}
	'''

test "call", ->
	assert.compileTo '''
		body {
			content: attr(attr);
		}
	''', '''
		body {
			content: attr(attr);
		}
	'''

test "call with multiple arguments", ->
	assert.compileTo '''
		body {
			background: linear-gradient(#000000, #ffffff);
		}
	''', '''
		body {
			background: linear-gradient(#000000, #ffffff);
		}
	'''

test "calc()", ->
	assert.compileTo '''
		body {
			content: calc((1 + 2) * 3);
		}
	''', '''
		body {
			content: calc((1 + 2) * 3);
		}
	'''

test "calc() complex expression", ->
	assert.compileTo '''
		a {
			content: calc(50% + 10% + calc(20px + 20px) / (3 + 2) * 5);
		}
	''', '''
		a {
			content: calc(50% + 10% + calc(20px + 20px) / (3 + 2) * 5);
		}
	'''