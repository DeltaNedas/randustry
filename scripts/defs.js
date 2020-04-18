const names = require("names");
const util = require("util");
const registered = this.global.randustry.registered;

const masks = {
	item: 7,
	liquid: 1,
	// Blocks have their own masks
};

const defs = {
	item: type => {
		return {
    		load() {
				this.colorize(this.color, "randustry-" + type + "_" + util.random(1, masks[type]), "region", this.name);
			},

			icon(cicon) {
				return this.region;
			},

			/* Process a mask texture. Added to all classes.
				region: name of region variable to set
				name: name of atlas location */
			process(maskname, funcs, region, name) {
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
					print("Posting...")
					this[region || "region"] = Core.atlas.addRegion(name || this.name, new TextureRegion(new Texture(pixmap)));
					print("Nope")
				}));
			},

			colorize(c, maskname, region, name) {
				this.process(maskname, [
					pixel => {
						if (pixel.a > 0) {
							pixel.r *= c.r;
							pixel.g *= c.g;
							pixel.b *= c.b;
							pixel.a *= c.a;
						}
					}
				], region, name);
			}
		};
	},

	block: {}
};

module.exports = defs;
