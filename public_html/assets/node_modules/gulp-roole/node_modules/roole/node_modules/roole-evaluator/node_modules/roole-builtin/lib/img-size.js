/**
 * $img-size($path)
 *
 * Return width and height of an image.
 */
var RooleError = require('roole-error');
var sizeOf = require('image-size');
var Promise = require('promise-now');

module.exports = function (url) {
	if (!url) return;

	if (url.type !== 'string' && url.type !== 'identifier') return;

	var filename = url.children[0];
	var imgPath = this.resolvePath(filename);

	var promise = new Promise();
	sizeOf(imgPath, function (err, size) {
		if (err) return promise.reject(new RooleError("Cannot load image: '" + filename + "'"));

		var width = size.width + 'px';
		var height = size.height + 'px';
		promise.fulfill(width + ' ' + height);
	});

	return promise;
};