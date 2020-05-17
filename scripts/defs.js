const names = require("names");
const util = require("util");
const registered = this.global.randustry.registered;

const masks = {
	item: 14,
	liquid: 1,
	// Blocks have their own masks
};

const defs = {
	item(type) {
		return {
    		load() {
				util.colorize(this.color, "randustry-" + type + "_" + util.random(1, masks[type]), this.name);
			}
		};
	},

	block(block) {
		return {
			init() {
				block.init(this);
				this.super$init();

				const name = this.localizedName;
				const random = util.random;
				if (name.match("Durable|Reinforced")) {
					this.health += random(40, 90);
				}
				if (name.includes("Dense")) {
					this.health *= 1.5;
					this.speed /= 2;
				}
				if (name.includes("Strength")) this.health *= 3;
				if (name.includes("makeshift")) this.health *= 0.6;
			},

			load() {
				this.super$load();
				block.load(this);
			},

			draw(tile) {
				this.super$draw(tile);
				block.draw(this, tile);
			},

			generateIcons() {
				var arr = block.layers;
				for (var i in arr) {
					arr[i] = Core.atlas.find(i);
				}
				return arr;
			}
		};
	}
};

module.exports = defs;
