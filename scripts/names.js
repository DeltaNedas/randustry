// Names get exponentially slower to find
// TODO: make a "garbage collector" that removes fully used words
const names = {
	item: {
		lists: [
			[
				"Lum", "Tef", "Ben", "Eg",
				"Rud", "Tit", "Ik", "Ebon",
				"San", "Car", "Jan", "Flor",
				"Ord", "Men", "Sol", "Sul",

				"Tris", "Quan", "Rout", "Deb", // Debium
				"Hydr", "Pand", "Ion", "Mio", // Ion-ite/Mio-nite
				"Con", "Mal", "Ger", "Op", // Op-or-/e
				"Bo", "Pol"
			], [
				"in", "d", "er", "stat",
				"lan", "ox", "or", "ach",
				"", "", "", "",
				"", "" // Prefer no middle
			], [
				"ium", "ite", "ate", "in",
				"ine", "e", "alt", ""
			]
		]
	},
	// TODO: make liquid names not awful
	liquid: {
		lists: [
			["Ch", "Dra", "M", "Ra", "Ran", "B", "Ra", "Slu"],
			["inst", "ra", "end", "ees", "wi"],
			["re", "e", "ne", "s", "nd", "in", "es", ""]
		]
	},
	block: {
		lists: [
			[
				"Combat ", "Supply ", "Router ", "Mining ",
				"Super ", "Turbo ", "Speedy ", "Quantum ",
				"Unit ", "Magic ", "Light ", "Glowing ",
				"Dense ", "Impossible ", "Deadly ",
				"", "", "", ""
			], [
				"<itemname> ", "weapons ", ""
			], [
				"<blockname>", "<blockname> of DEATH"
			]
		]
	}
};

for (var n in names) {
	var name = names[n];
	name.volume = 1;
	var lists = name.lists;
	for (var i in lists) {
		name.volume *= lists[i].length;
	}
}

module.exports = names;
