module.exports = RooleError;

function RooleError(msg, node) {
	this.message = msg;
	if (node) this.loc = node.loc;
}

RooleError.prototype = Object.create(Error.prototype);
RooleError.prototype.constructor = RooleError;
RooleError.prototype.name = 'RooleError';