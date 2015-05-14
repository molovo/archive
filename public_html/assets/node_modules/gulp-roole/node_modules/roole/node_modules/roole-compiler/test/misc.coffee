assert = require './assert'

test "empty input", ->
	assert.compileTo '', ''

test "@import", ->
	assert.compileTo '''
		@import url(http://example.com);
	''', '''
		@import url(http://example.com);
	'''

test "@import with media query", ->
	assert.compileTo '''
		@import 'foo' screen;
	''', '''
		@import 'foo' screen;
	'''

test "@font-face", ->
	assert.compileTo '''
		@font-face {}
	''', '''
		@font-face {}
	'''

test "@charset", ->
	assert.compileTo '''
		@charset 'UTF-8';
	''', '''
		@charset 'UTF-8';
	'''

test "@page", ->
	assert.compileTo '''
		@page {}
	''', '''
		@page {}
	'''

test "@page with selector", ->
	assert.compileTo '''
		@page :left {}
	''', '''
		@page :left {}
	'''