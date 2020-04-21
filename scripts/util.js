const util = {
	random: (min, max) => Math.round(Mathf.random(min, max)),
	randomf: () => Mathf.random(1.0)
};

util.rand = (arr) => arr[util.random(0, arr.length - 1)];

/* Process a mask texture.
	* maskname: name of mask texture to process
	* funcs: array of functions to run, pixel => {}
	* name: atlas key to push with
*/
util.process = (maskname, funcs, name) => {
	const mask = Core.atlas.getPixmap(maskname);
	const pixel = new Color();
	var x, y;
	const pixmap = new Pixmap(32, 32);

	for (x = 0; x < 32; x++) {
		for (y = 0; y < 32; y++) {
			pixel.set(mask.getPixel(x, y));
			for (var i in funcs) {
				funcs[i](pixel);
			}
			pixmap.draw(x, y, pixel);
		}
	}

	// Set it on main thread
	Core.app.post(run(() => {
		Core.atlas.addRegion(name, new TextureRegion(new Texture(pixmap)));
	}));
};

util.colorize = (c, maskname, name) => {
	util.process(maskname, [
		pixel => {
			if (pixel.a > 0) {
				pixel.r *= c.r;
				pixel.g *= c.g;
				pixel.b *= c.b;
				pixel.a *= c.a;
			}
		}
	], name);
};

module.exports = util;
