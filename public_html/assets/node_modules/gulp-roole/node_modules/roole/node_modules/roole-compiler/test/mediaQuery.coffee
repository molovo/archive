assert = require './assert'

suite 'media query'

test "media type", ->
	assert.compileTo '''
		@media screen {}
	''', '''
		@media screen {}
	'''

test "media type with modifier", ->
	assert.compileTo '''
		@media not screen {}
	''', '''
		@media not screen {}
	'''

test "media feature", ->
	assert.compileTo '''
		@media (orientation: portrait) {}
	''', '''
		@media (orientation: portrait) {}
	'''

test "media feature without value", ->
	assert.compileTo '''
		@media (color) {}
	''', '''
		@media (color) {}
	'''

test "complex media query", ->
	assert.compileTo '''
		@media all and (min-width: 500px) {}
	''', '''
		@media all and (min-width: 500px) {}
	'''

test "media query list", ->
	assert.compileTo '''
		@media all, not screen {}
	''', '''
		@media all, not screen {}
	'''