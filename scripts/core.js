var core = {
	defs: require("defs"),
	names: require("names"),
	util: require("util")
};
const defs = core.defs;
const names = core.names;
const util = core.util;

const registered = this.global.randustry.registered;
const itemList = [];

// It's an array for easy util.random access
const blocks = [
	{
		name: "crafter",
		block: GenericCrafter,
		category: "production",
		// masks[size] = no of masks available
		// colors[size] = no of colour masks
		masks: [0, 1, 1],
		colors: [0, 0, 0],
		init(block) {
			block.size = util.random(2, 3);
			block.craftTime = util.random(10, 200);
			block.outputItem = new ItemStack(item, util.random(1, 3));
			// todo: liquid
			// todo: inputs
		},
		load(block) {
			block.region = Core.atlas.find("randustry-mask-crafter-base_" + block.size + "_" + util.random(1, this.masks[block.size]));
			block.colorRegion = Core.atlas.find("randustry-mask-crafter-color_" + block.size + "_" + util.random(1, this.colors[block.size]));
		},
		draw(block, tile) {
			Draw.color(block.color);
			Draw.rect(block.colorRegion, tile.drawx(), tile.drawy());
			Draw.color();
		}
	},
	{
		name: "smelter",
		block: GenericSmelter,
		category: "production",
		masks: [0, 1, 1],
		colors: [0, 0, 0],
		init(block) {
			block.flameColor = block.color;
			blocks[1].init(block);
		}
	},
	{
		name: "conveyor",
		block: Conveyor,
		category: "distribution",
		masks: [1],
		colors: [0]
	},
	{
		name: "router",
		block: Router,
		category: "distribution",
		min: 1, max: 5,
		init(block) {
			const name = block.localizedName;
			const random = util.random;
			if (name.includes("Industrial")) {
				block.itemCapacity = random(2, 4);
			}

			if (name.match("Turbo|Speedy")) {
				block.speed = random(10, 20);
			} else {
				block.speed = random(6, 10);
			}
		},
		load(block) {
			block.region = Core.atlas.find("router");
			util.colorize(block.color, "randustry-madk-router", block.name + "-color");
			Core.app.post(run(() => {
				block.colorRegion = Core.atlas.find(block.name + "-color");
			}));
		},
		draw(block, tile) {
			Draw.rect(block.colorRegion, tile.drawx(), tile.drawy());
		},
		// Called before load, cant use colorRegion
		// Not called on main thread (?), cant generate it here
		layers: ["router"]
	},
	{
		name: "ore",
		block: OreBlock,
		masks: [3],

		init(block) {
			block.name = "ore-" + block.item.name;
			block.localizedName = block.item.localizedName + " Ore";
			block.itemDrop = block.item;
		},

		load(block) {
			const texture = "randustry-ore_" + random(1, this.masks[block.size]);
			const item = block.item;

			for (var i = 1; i <= block.variants; i++) {
				util.colorize(item.color, texture + "_" + variant, item.name + variant)
			}
		}
	}
];

const propChances = {
	radioactivity: 0.3,
	explosiveness: 0.4,
	flammability: 0.5,
	temperature: 0.8,
	heatCapacity: 0.5,
	viscocity: 0.75
};

const setprop = (item, prop) => {
	if (Mathf.chance(propChances[prop])) {
		item[prop] = util.randomf() * 2;
	}
};

// Make a localizedName kebab-case
const fixname = name => name.toLowerCase().replace(/\s/g, "-");

// Generate a name for a content type
core.name = (type, extra) => {
	const name = names[type];
	while (true) {
		var attempt = "";
		for (var i in name.lists) {
			if (Mathf.chance(name.odds[i])) attempt += util.rand(name.lists[i]);
		}

		if (extra) attempt = extra(attempt);
		// Set registered afterwards
		if (registered[attempt] === undefined) {
			return attempt;
		}
	}
};

core.addItem = () => {
	const name = core.name("item");
	const item = extendContent(Item, fixname(name), defs.item("item"));

	item.localizedName = name;
	item.color.rand();
	if (Mathf.chance(0.5)) {
		item.type = ItemType.material;
	}
	setprop(item, "radioactivity");
	setprop(item, "explosiveness");
	setprop(item, "flammability");

	itemList.push(item);
	registered[name] = item;
	return item;
};

core.addLiquid = () => {
	const name = core.name("liquid");
	const liquid = extendContent(Liquid, fixname(name), defs.item("liquid"));

	liquid.localizedName = name;
	liquid.color.rand();
	setprop(liquid, "flammability");
	setprop(liquid, "temperature");
	setprop(liquid, "heatCapacity");
	setprop(liquid, "viscocity");
	setprop(liquid, "explosiveness");
	// TODO: status effect

	registered[name] = liquid;
	return liquid;
};

core.addBlock = () => {
	const item = util.rand(itemList);
	const type = blocks[3]; /* util.rand(blocks); */
	const name = core.name("block", attempt => attempt.replace("<itemname>", item.localizedName).replace("<blockname>", type.name));
	const block = extendContent(type.block || Block, fixname(name), defs.block(type));

	block.localizedName = name;
	block.color = item.color;
	block.requirements(Category[type.category], ItemStack.with(item, util.random(type.min, type.max)));
	block.item = item

	registered[name] = block;
	return block;
}

core.get = name => registered[name];

module.exports = core;
