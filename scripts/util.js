const util = {
	random: (min, max) => Math.round(Mathf.random(min, max)),
	randomf: () => Mathf.random(1.0)
};

util.rand = (arr) => arr[util.random(0, arr.length - 1)];

module.exports = util;
