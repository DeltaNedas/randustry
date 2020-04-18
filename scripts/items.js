const core = require("core");

const count = 200;

if (count > core.names.item.volume) {
	throw "Only " + core.names.item.volume + " item names are possible, not enough for " + count;
}

const old = Time.time();
for (var i = 0; i < count; i++) core.addItem();
print("Took " + (Time.time() - old) + " seconds to create " + count + " items.");

// Check for easter eggs, F8 to see
const egg = eggs => {
	for (var e in eggs) {
		if (core.get(eggs[e])) print(eggs[e] + "!");
	}
};

egg(["Debium", "Sand", "Mionite", "Ionite", "Opore"]);
