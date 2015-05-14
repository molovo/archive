/**
 * $img-size($path)
 *
 * Return width and height of an image.
 */
var RooleError = require('roole-error');
var Promise = require('promise-now');

module.exports = function (url) {
	if (!url) return;

	if (url.type !== 'string' && url.type !== 'identifier') return;

	var filename = url.children[0];
	var imgPath = this.resolvePath(filename)

	var promise = new Promise();
	var img = new Image();
	img.onload = function () {
		var width = this.width + 'px';
		var height = this.height + 'px';
		promise.fulfill(width + ' ' + height);
	};
	img.onerror = function () {
		promise.reject(new RooleError("Cannot load image: '" + filename + "'"));
	};
	img.src = imgPath;

	return promise;
};