assert = require './assert'

suite 'comment'

test "ignore single-line comment", ->
	assert.compileTo '''
		// foo
	''', ''

test "preserve multi-line comment", ->
	assert.compileTo '''
		/* foo */
	''', '''
		/* foo */
	'''

test "preserve multiple multi-line comments", ->
	assert.compileTo '''
		/* foo */
		/* bar */
	''', '''
		/* foo */
		/* bar */
	'''

test "preserve comment before ruleset", ->
	assert.compileTo '''
		body {}
		/* foo */
		div {}
	''', '''
		body {}

		/* foo */
		div {}
	'''

test "preserve multiple comments before ruleset", ->
	assert.compileTo '''
		body {}
		/* foo */
		/* bar */
		div {}
	''', '''
		body {}

		/* foo */
		/* bar */
		div {}
	'''

test "preserve comment before property", ->
	assert.compileTo '''
		body {}
		div {
			/* foo */
			margin: 0;
		}
	''', '''
		body {}

		div {
			/* foo */
			margin: 0;
		}
	'''

test "reindent multi-line comment before property", ->
	assert.compileTo '''
		body {}
		div {
			/*
			 * foo
			 */
			margin: 0;
		}
	''', '''
		body {}

		div {
			/*
			 * foo
			 */
			margin: 0;
		}
	'''

test "preserve comment before @media", ->
	assert.compileTo '''
		body {}
		/* foo */
		@media screen {}
	''', '''
		body {}

		/* foo */
		@media screen {}
	'''

test "preserve comment before @keyframes", ->
	assert.compileTo '''
		body {}
		/* foo */
		@keyframes name {}
	''', '''
		body {}

		/* foo */
		@keyframes name {}
	'''

test "preserve comment before keyframe", ->
	assert.compileTo '''
		body {}
		@keyframes name {
			/* foo */
			from {}
		}
	''', '''
		body {}

		@keyframes name {
			/* foo */
			from {}
		}
	'''

test "preserve comment before @charset", ->
	assert.compileTo '''
		/* foo */
		@charset 'UTF-8';
	''', '''
		/* foo */
		@charset 'UTF-8';
	'''

test "preserve comment before @font-face", ->
	assert.compileTo '''
		body {}
		/* foo */
		@font-face {}
	''', '''
		body {}

		/* foo */
		@font-face {}
	'''

test "preserve comment before @page", ->
	assert.compileTo '''
		body {}
		/* foo */
		@page {}
	''', '''
		body {}

		/* foo */
		@page {}
	'''

test "preserve comment before @import", ->
	assert.compileTo '''
		body {}
		/* foo */
		@import url(http://exmaple.com/);
	''', '''
		body {}

		/* foo */
		@import url(http://exmaple.com/);
	'''

test "discard comment at the end of ruleset", ->
	assert.compileTo '''
		body {
			/* foo */
		}
	''', '''
		body {}
	'''

test "discard comment at the end of file", ->
	assert.compileTo '''
		body {}
		/* foo */
	''', '''
		body {}
	'''