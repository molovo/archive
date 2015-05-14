assert = require './assert'

suite '@keyframes'

test "@keyframes", ->
	assert.compileTo '''
		@keyframes name {}
	''', '''
		@keyframes name {}
	'''

test "from selector", ->
	assert.compileTo '''
		@keyframes name {
			from {}
		}
	''', '''
		@keyframes name {
			from {}
		}
	'''

test "percentage selector", ->
	assert.compileTo '''
		@keyframes name {
			0% {}
		}
	''', '''
		@keyframes name {
			0% {}
		}
	'''

test "selector list", ->
	assert.compileTo '''
		@keyframes name {
			0%, to {}
		}
	''', '''
		@keyframes name {
			0%,
			to {}
		}
	'''

test "prefixed @keyframes", ->
	assert.compileTo '''
		@-webkit-keyframes name {}
	''', '''
		@-webkit-keyframes name {}
	'''