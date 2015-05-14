assert = require './assert'

suite 'prefix'

test "box-sizing", ->
	assert.compileTo '''
		body {
			box-sizing: border-box;
		}
	''', '''
		body {
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
		}
	'''

test "linear-gradient()", ->
	assert.compileTo '''
		body {
			background: linear-gradient(#000000, #ffffff);
		}
	''', '''
		body {
			background: -webkit-linear-gradient(#000000, #ffffff);
			background: -moz-linear-gradient(#000000, #ffffff);
			background: -o-linear-gradient(#000000, #ffffff);
			background: linear-gradient(#000000, #ffffff);
		}
	'''

test "linear-gradient() with starting position", ->
	assert.compileTo '''
		body {
			background: linear-gradient(to bottom, #000000, #ffffff);
		}
	''', '''
		body {
			background: -webkit-linear-gradient(top, #000000, #ffffff);
			background: -moz-linear-gradient(top, #000000, #ffffff);
			background: -o-linear-gradient(top, #000000, #ffffff);
			background: linear-gradient(to bottom, #000000, #ffffff);
		}
	'''

test "linear-gradient() with starting position consisting of two identifiers", ->
	assert.compileTo '''
		body {
			background: linear-gradient(to top left, #000000, #ffffff);
		}
	''', '''
		body {
			background: -webkit-linear-gradient(bottom right, #000000, #ffffff);
			background: -moz-linear-gradient(bottom right, #000000, #ffffff);
			background: -o-linear-gradient(bottom right, #000000, #ffffff);
			background: linear-gradient(to top left, #000000, #ffffff);
		}
	'''

test "multiple linear-gradient()", ->
	assert.compileTo '''
		body {
			background: linear-gradient(#000, #fff), linear-gradient(#111, #eee);
		}
	''', '''
		body {
			background: -webkit-linear-gradient(#000, #fff), -webkit-linear-gradient(#111, #eee);
			background: -moz-linear-gradient(#000, #fff), -moz-linear-gradient(#111, #eee);
			background: -o-linear-gradient(#000, #fff), -o-linear-gradient(#111, #eee);
			background: linear-gradient(#000, #fff), linear-gradient(#111, #eee);
		}
	'''

test "background with regular value", ->
	assert.compileTo '''
		body {
			background: #ffffff;
		}
	''', '''
		body {
			background: #ffffff;
		}
	'''

test "@keyframes", ->
	assert.compileTo '''
		@keyframes name {
			0% {}
		}
	''', '''
		@-webkit-keyframes name {
			0% {}
		}

		@-moz-keyframes name {
			0% {}
		}

		@-o-keyframes name {
			0% {}
		}

		@keyframes name {
			0% {}
		}
	'''

test "@keyframes contains property needs to be prefixed", ->
	assert.compileTo '''
		@keyframes name {
			from {
				border-radius: 0;
			}
		}
	''', '''
		@-webkit-keyframes name {
			from {
				-webkit-border-radius: 0;
				border-radius: 0;
			}
		}

		@-moz-keyframes name {
			from {
				-moz-border-radius: 0;
				border-radius: 0;
			}
		}

		@-o-keyframes name {
			from {
				border-radius: 0;
			}
		}

		@keyframes name {
			from {
				border-radius: 0;
			}
		}
	'''

test "@keyframes doesn't change prefixes of subsequent rules", ->
	assert.compileTo '''
		@keyframes name {
			0% {}
		}

		body {
			box-sizing: border-box;
		}
	''', '''
		@-webkit-keyframes name {
			0% {}
		}

		@-moz-keyframes name {
			0% {}
		}

		@-o-keyframes name {
			0% {}
		}

		@keyframes name {
			0% {}
		}

		body {
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
		}
	'''

test "skip prefixed property", ->
	assert.compileTo {
		skipPrefixed: true
	}, '''
		body {
			-moz-box-sizing: padding-box;
			box-sizing: border-box;
		}
	''', '''
		body {
			-moz-box-sizing: padding-box;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
		}
	'''
