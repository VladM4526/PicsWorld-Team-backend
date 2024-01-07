const preUpdate = function (next) {
	this.options.new = true;
	this.options.runValidators = true;
	next();
};

export default preUpdate;
