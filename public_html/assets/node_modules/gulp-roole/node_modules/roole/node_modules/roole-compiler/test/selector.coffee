assert = require './assert'

suite 'selector'

test "type selector", ->
	assert.compileTo '''
		body {}
	''', '''
		body {}
	'''

test "class selector", ->
	assert.compileTo '''
		.foo {}
	''', '''
		.foo {}
	'''

test "hash selector", ->
	assert.compileTo '''
		#foo {}
	''', '''
		#foo {}
	'''

test "attribute selector", ->
	assert.compileTo '''
		[attr=val] {}
	''', '''
		[attr=val] {}
	'''

test "quoted attribute selector", ->
	assert.compileTo '''
		[attr='val'] {}
	''', '''
		[attr='val'] {}
	'''

test "attribute selector with dash", ->
	assert.compileTo '''
		[attr|=val] {}
	''', '''
		[attr|=val] {}
	'''

test "attribute selector without value", ->
	assert.compileTo '''
		[attr] {}
	''', '''
		[attr] {}
	'''

test "pseudo selector", ->
	assert.compileTo '''
		:first-child {}
	''', '''
		:first-child {}
	'''

test "pseudo selector with double colons", ->
	assert.compileTo '''
		::before {}
	''', '''
		::before {}
	'''

test "function-like pseudo selector", ->
	assert.compileTo '''
		:nth-child(2n + 2) {}
	''', '''
		:nth-child(2n+2) {}
	'''

test "function-like pseudo selector", ->
	assert.compileTo '''
		:nth-child(2n + 2) {}
	''', '''
		:nth-child(2n+2) {}
	'''

test "function-like pseudo selector", ->
	assert.compileTo '''
		:nth-child(2n + 2) {}
	''', '''
		:nth-child(2n+2) {}
	'''

test "negation selector", ->
	assert.compileTo '''
		:not(body) {}
	''', '''
		:not(body) {}
	'''

test "negation selector negating function-like pseudo selector", ->
	assert.compileTo '''
		:not(:nth-child(2n - 1)) {}
	''', '''
		:not(:nth-child(2n-1)) {}
	'''

test "universal selector", ->
	assert.compileTo '''
		* {}
	''', '''
		* {}
	'''

test "compund selector", ->
	assert.compileTo '''
		li:first-child {}
	''', '''
		li:first-child {}
	'''

test "complex selector", ->
	assert.compileTo '''
		body div {}
	''', '''
		body div {}
	'''

test "complex selector with child selector", ->
	assert.compileTo '''
		body > div {}
	''', '''
		body > div {}
	'''

test "selector list", ->
	assert.compileTo '''
		body,div {}
	''', '''
		body,
		div {}
	'''