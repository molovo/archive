module.exports = Range;

function Range(opts) {
	var from = opts.from;
	var to, ex;
	if (opts.to == null) {
		to = from + 1;
		ex = true;
	} else {
		to = opts.to;
		ex = opts.exclusive;
	}
	var len = opts.length;

	if (len != null) {
		if (from < 0) from += len;
		if (to < 0) to += len;
	}

	if (!ex) {
		if (from <= to) ++to;
		else --to;
	}

	var reversed = from > to;
	if (reversed) {
		var tmp = from;
		from = to + 1;
		to = tmp + 1;
	}

	this.from = from;
	this.to = to;
	this.reversed = reversed;
}