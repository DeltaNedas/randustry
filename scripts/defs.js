const names = require("names");
const util = require("util");
const registered = this.global.randustry.registered;

const masks = {
	item: 11,
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
					block.health += random(40, 90);
				}
				if (name.includes("Dense")) {
					block.health *= 1.5;
					block.speed /= 2;
				}
				if (name.includes("Strength")) block.health *= 3;
				if (name.includes("makeshift")) block.health *= 0.6;
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
				return block.layers(this);
			}
		};
	}
};

module.exports = defs;
