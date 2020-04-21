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
		colors: [0, 1, 1],
		init(block) {
			block.size = util.random(2, 3);
			block.craftTime = util.random(10, 200);
			block.outputItem = new ItemStack(item, util.random(1, 3));
			// todo: liquid
			// todo: inputs
		},
		load(block) {
			this.region = Core.atlas.find("randustry-crafter-base_" + block.size + "_" + util.random(1, this.masks[block.size]));
			this.colorRegion = Core.atlad.find("randustry-crafter-color_" + block.size + "_" + util.random(1, this.colors[block.size]));
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
		category: "distribution",
		masks: [1],
		colors: [0]
	},
	{
		name: "router",
		block: Router,
		category: "distribution",
		init(block) {},
		load(block) {
			print("Initial " + block)
			block.region = Core.atlas.find("router");
			block.colorRegion = Core.atlas.find("randustry-router");
		},
		draw(block, tile) {
			Draw.color(block.color);
			Draw.rect(block.colorRegion, tile.drawx(), tile.drawy());
			Draw.color();
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

// Make a localizedName kebab-cass
const fixname = name => name.toLowerCase().replace(/\s/g, "-");

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
	print("Using item " + item)
	const type = blocks[3]; /* util.rand(blocks); */
	print("Block is " + type.block)
	const name = core.name("block").replace("<itemname>", item.localizedName).replace("<blockname>", type.name);
	print("Name is " + name)
	const block = extendContent(type.block || Block, fixname(name), defs.block(type));

	block.localizedName = name;
	block.color = item.color;
	block.requirements(Category.production, ItemStack.with(item, util.random(5, 100)));
	block.buildVisibility = buildVisibility.sandboxOnly;
	registered[name] = block;
	return block;
}

core.get = name => registered[name];

module.exports = core;
