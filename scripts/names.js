// Names get exponentially slower to find
// TODO: make a "garbage collector" that removes fully used words
const names = {
	item: {
		odds: [1, 0.5, 0.1, 0.9, 0.3],
		lists: [
			[
				"Lum", "Tef", "Ben", "Eg",
				"Rud", "Tit", "Ik", "Ebon",
				"San", "Car", "Jan", "Flor",
				"Ord", "Men", "Sol", "Sul",

				"Tris", "Quan", "Rout", "Deb", // Debium
				"Hydr", "Pand", "Ion", "Mio", // Ion-ite/Mio-nite
				"Con", "Mal", "Ger", "Op", // Op-or-/e
				"Bo", "Pol", "Arc", "Lan",
				"Xyl", "Par"
			], [
				"in", "d", "er", "stat",
				"lan", "ox", "or", "ach",
				"yb", "b",
			], [
				"in", "ch"
			], [
				"ium", "ite", "ate", "in",
				"ine", "e", "alt", "num",
				"ide"
			],
			[
				" Paste", " Compound", " Mix", " Alloy",
				" Fibres"
			]
		]
	},
	// TODO: make liquid names not awful
	liquid: {
		odds: [1, 1, 1],
		lists: [
			["Ch", "Dra", "M", "Ra", "Ran", "B", "Ra", "Slu"],
			["inst", "ra", "end", "ees", "wi"],
			["re", "e", "ne", "s", "nd", "in", "es", ""]
		]
	},
	block: {
		odds: [0.5, 1, 1, 0.05],
		lists: [
			[
				"Combat ", "Supply ", "Router ", "Mining ",
				"Super ", "Turbo ", "Speedy ", "Quantum ",
				"Unit ", "Magic ", "Light ", "Glowing ",
				"Dense ", "Impossible ", "Deadly ", "Durable ",
				"Mighty ", "Sluggish ", "Cursed ", "Reinforced ",
				"Industrial "
			], [
				"<itemname> ", "weaponised <itemname> ", "makeshift ", ""
			], [
				"<blockname>"
			], [
				" of Valor",
				" of Pestilence",
				" of Strength",
				" of Souls"
			]
		]
	}
};

for (var n in names) {
	var name = names[n];
	name.volume = 1;
	var lists = name.lists;
	for (var i in lists) {
		name.volume *= lists[i].length * name.odds[i];
	}
}

module.exports = names;
