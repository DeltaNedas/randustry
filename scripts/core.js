var core = {
	defs: require("defs"),
	names: require("names"),
	util: require("util")
};
const defs = core.defs;
const names = core.names;
const util = core.util;

const registered = this.global.randustry.registered;

// It's an array for easy util.random access
const blocks = [
	{
		name: "crafter",
		block: GenericCrafter,
		// masks[size] = no of masks available
		// colors[size] = no of colour masks
		masks: [0, 1, 1],
		colors: [0, 0, 0],
		init(block) {
			block.craftTime = util.random(10, 200);
			block.outputItem = new ItemStack(item, util.random(1, 3));
			// todo: liquid
			block.cons.add
		}
	},
	{
		name: "smelter",
		block: GenericSmelter,
		masks: [0, 2, 1],
		colors: [0, 0, 0],
		init(block) {
			block.flameColor = block.color;
			blocks[1].init(block);
		}
	},
	{
		name: "conveyor",
		block: Conveyor,
		masks: [1],
		colors: [0]
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

// Generate a name for a content type
core.name = type => {
	const name = names[type];
	while (true) {
		var attempt = "";
		for (var i in name.lists) {
			attempt += util.rand(name.lists[i]);
		}

		// Set registered afterwards
		if (registered[attempt] === undefined) {
			return attempt;
		}
	}
};

core.addItem = () => {
	const name = core.name("item");
	const item = extendContent(Item, name.toLowerCase(), defs.item("item"));
	item.localizedName = name;
	if (Mathf.chance(0.5)) {
		item.type = ItemType.material;
	}
	setprop(item, "radioactivity");
	setprop(item, "explosiveness");
	setprop(item, "flammability");
	item.color.rand();
	registered[name] = item;
	return item;
};

core.addLiquid = () => {
	const name = core.name("liquid");
	const liquid = extendContent(Liquid, name.toLowerCase(), defs.item("liquid"));
	liquid.localizedName = name;
	setprop(liquid, "flammability");
	setprop(liquid, "temperature");
	setprop(liquid, "heatCapacity");
	setprop(liquid, "viscocity");
	setprop(liquid, "explosiveness");
	// TODO: status effect
	liquid.color.rand();
	return liquid;
};

core.addBlock = () => {
	throw "WIP";
}

core.get = name => registered[name];

module.exports = core;
