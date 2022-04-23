export interface IItem {
	item: string;
	name: string;
	weight: number;
	onuse?: {
		clientEvent?: string;
		serverEvent?: string;
		remove?: boolean;
		effect?: { hunger?: number; thirst?: number; alcool?: number; weed?: number };
		closeInventory?: boolean;
	};
	sellPrice?: { min: number; max?: number };
	buyPrice?: number;
	vehicleLimit?: number;
}

export type ItemId = keyof typeof ItemsConfig;

export const ItemsConfig: { [key: string]: IItem } = {
	// Argent - phone - lottery
	lottery: {
		item: "lottery",
		name: "Lotterie",
		weight: 0,
		onuse: {
			clientEvent: "gm:lottery:show",
		},
		buyPrice: 500,
	},
	money: {
		item: "money",
		name: "Argent",
		weight: 0,
	},
	saleMoney: {
		item: "saleMoney",
		name: "Argent Sale",
		weight: 0,
		vehicleLimit: 10000,
	},
	phone: {
		item: "phone",
		name: "Téléphone",
		weight: 1,
		buyPrice: 200,
	},

	// Nouriture

	bgt_pain: {
		item: "bgt_pain",
		name: "Baguette de pain",
		weight: 1,
		onuse: { remove: true, effect: { hunger: 40 } },
		buyPrice: 5,
	},
	sandwish: {
		item: "sandwish",
		name: "Sandwish xxx",
		weight: 1,
		onuse: { remove: true, effect: { hunger: 40 } },
		buyPrice: 5,
	},
	burger_shot: {
		item: "burger_shot",
		name: "Burger xxx",
		weight: 1,
		onuse: { remove: true, effect: { hunger: 40 } },
		buyPrice: 5,
	},
	pizza: {
		item: "pizza",
		name: "Pizza xxx",
		weight: 1,
		onuse: { remove: true, effect: { hunger: 40 } },
		buyPrice: 5,
	},
	pates: {
		item: "pates",
		name: "Pates xxx",
		weight: 1,
		onuse: { remove: true, effect: { hunger: 40 } },
		buyPrice: 5,
	},

	// Fruits

	orange: {
		item: "orange",
		name: "Orange",
		weight: 1,
		onuse: { remove: true, effect: { hunger: 40 } },
		buyPrice: 5,
	},
	grappe_raisin: {
		item: "grappe_raisin",
		name: "Grappe de raisin",
		weight: 1,
		onuse: { remove: true, effect: { hunger: 40 } },
		buyPrice: 5,
	},
	pomme: {
		item: "pomme",
		name: "Pomme",
		weight: 1,
		onuse: { remove: true, effect: { hunger: 40 } },
		buyPrice: 5,
	},
	banane: {
		item: "banane",
		name: "Banane",
		weight: 1,
		onuse: { remove: true, effect: { hunger: 40 } },
		buyPrice: 5,
	},

	// Boissons

	bt_eau: {
		item: "bt_eau",
		name: "Bouteille d'eau",
		weight: 1,
		onuse: { remove: true, effect: { thirst: 20 } },
		buyPrice: 5,
	},
	caprisun: {
		item: "caprisun",
		name: "Capri-Sun",
		weight: 1,
		onuse: { remove: true, effect: { thirst: 20 } },
		buyPrice: 5,
	},
	cocacola: {
		item: "cocacola",
		name: "Coca Cola",
		weight: 1,
		onuse: { remove: true, effect: { thirst: 20 } },
		buyPrice: 5,
	},
	fanta: {
		item: "fanta",
		name: "Fanta",
		weight: 1,
		onuse: { remove: true, effect: { thirst: 20 } },
		buyPrice: 5,
	},
	sprite: {
		item: "sprite",
		name: "Sprite",
		weight: 1,
		onuse: { remove: true, effect: { thirst: 20 } },
		buyPrice: 5,
	},
	shake: {
		item: "shake",
		name: "Shake protéiné",
		weight: 1,
		onuse: { remove: true, effect: { thirst: 20 } },
		buyPrice: 5,
	},
	milk: {
		item: "milk",
		name: "Bouteille de lait",
		weight: 1,
		onuse: { remove: true, effect: { thirst: 20 } },
		buyPrice: 5,
	},
	icetea: {
		item: "icetea",
		name: "Ice-Tea",
		weight: 1,
		onuse: { remove: true, effect: { thirst: 20 } },
		buyPrice: 5,
	},
	coffee: {
		item: "coffee",
		name: "Café",
		weight: 1,
		onuse: { remove: true, effect: { thirst: 20 } },
		buyPrice: 5,
	},
	redbull: {
		item: "redbull",
		name: "Redbull",
		weight: 1,
		onuse: { remove: true, effect: { thirst: 20 } },
		buyPrice: 5,
	},
	mojito: {
		item: "mojito",
		name: "Mojito",
		weight: 1,
		onuse: { remove: true, effect: { thirst: 20 } },
		buyPrice: 5,
	},
	jusfruit: {
		item: "jusfruit",
		name: "Jus de Fruit",
		weight: 1,
		onuse: { remove: true, effect: { thirst: 20 } },
		buyPrice: 5,
	},
	jus_raisin: {
		item: "jus_raisin",
		name: "Jus de raisin",
		weight: 1,
		onuse: { remove: true, effect: { thirst: 20 } },
		buyPrice: 5,
	},

	//Snacks

	lays_classic: {
		item: "lays_classic",
		name: "Lays classic ",
		weight: 1,
		onuse: { remove: true, effect: { hunger: 10 } },
		buyPrice: 5,
	},
	lays_barbecue: {
		item: "lays_barbecue",
		name: "Lays Barbecue ",
		weight: 1,
		onuse: { remove: true, effect: { hunger: 10 } },
		buyPrice: 5,
	},
	lays_cream: {
		item: "lays_cream",
		name: "Lays onion ",
		weight: 1,
		onuse: { remove: true, effect: { hunger: 10 } },
		buyPrice: 5,
	},
	lays_wavy: {
		item: "lays_wavy",
		name: "Lays Wavy ",
		weight: 1,
		onuse: { remove: true, effect: { hunger: 10 } },
		buyPrice: 5,
	},

	// Alcool

	beer: {
		item: "beer",
		name: "Bière",
		weight: 0.5,
		onuse: { remove: true, effect: { alcool: 20 } },
		buyPrice: 20,
	},
	vin_blanc: {
		item: "vin_blanc",
		name: "Vin blanc",
		weight: 0.5,
		onuse: { remove: true, effect: { alcool: 20 } },
		buyPrice: 20,
	},
	vin_rouge: {
		item: "vin_rouge",
		name: "Vin rouge",
		weight: 0.5,
		onuse: { remove: true, effect: { alcool: 20 } },
		buyPrice: 20,
	},
	tequila: {
		item: "tequila",
		name: "Tequila",
		weight: 0.5,
		onuse: { remove: true, effect: { alcool: 20 } },
		buyPrice: 20,
	},
	whisky: {
		item: "whisky",
		name: "Whisky",
		weight: 0.5,
		onuse: { remove: true, effect: { alcool: 20 } },
		buyPrice: 20,
	},
	champagne: {
		item: "champagne",
		name: "Champagne",
		weight: 0.5,
		onuse: { remove: true, effect: { alcool: 20 } },
		buyPrice: 20,
	},

	// Drogues

	weed: {
		item: "weed",
		name: "Cannabis",
		weight: 1,
		onuse: { remove: true, effect: { weed: 20 } },
	},
	cocaine: {
		item: "cocaine",
		name: "Cocaïne",
		weight: 1,
		onuse: { remove: true, effect: { weed: 20 } }, // rajouter les autres drogues
	},
	meth: {
		item: "meth",
		name: "Méthamphétamine",
		weight: 1,
		onuse: { remove: true, effect: { weed: 20 } },
	},
	lsd: {
		item: "lsd",
		name: "LSD",
		weight: 1,
		onuse: { remove: true, effect: { weed: 20 } },
	},

	// Pêche

	fishbait: {
		item: "fishbait",
		name: "Appât à poisson",
		weight: 0.5,
		onuse: { remove: true, clientEvent: "gm:fishing:fishbait" },
	},
	fish: {
		item: "fish",
		name: "Poisson",
		weight: 0.5,
		sellPrice: {
			min: 20,
			max: 100,
		},
	},

	fishingrod: {
		item: "fishingrod",
		name: "Canne à pêche",
		weight: 2,
		onuse: { clientEvent: "gm:fishing:rod" },
	},
	shark: {
		item: "shark",
		name: "Requin",
		weight: 4,
		sellPrice: {
			min: 2000,
			max: 2500,
		},
	},
	turtle: {
		item: "turtle",
		name: "Tortue",
		weight: 3,
		sellPrice: {
			min: 800,
			max: 1200,
		},
	},
	turtlebait: {
		item: "turtlebait",
		name: "Appât à tortue",
		weight: 0.5,
		onuse: { remove: true, clientEvent: "gm:fishing:turtlebait" },
	},

	// Chasse

	deerMeat: {
		item: "deerMeat",
		name: "Viande de Cerf",
		weight: 2,
		sellPrice: {
			min: 100,
			max: 160,
		},
	},
	rabbitMeat: {
		item: "rabbitMeat",
		name: "Viande de Lapin",
		weight: 1,
		sellPrice: {
			min: 20,
			max: 60,
		},
	},
	boarMeet: {
		item: "boarMeet",
		name: "Viande de Sanglier",
		weight: 2,
		sellPrice: {
			min: 80,
			max: 140,
		},
	},
	coyoteMeat: {
		item: "coyoteMeat",
		name: "Viande de Coyote",
		weight: 1.5,
		sellPrice: {
			min: 180,
			max: 240,
		},
	},
	mtlionMeat: {
		item: "mtlionMeat",
		name: "Viande de Puma",
		weight: 1.5,
		sellPrice: {
			min: 180,
			max: 240,
		},
	},
	chickenhawkMeat: {
		item: "chickenhawkMeat",
		name: "Viande de Faucon",
		weight: 1,
		sellPrice: {
			min: 220,
			max: 260,
		},
	},

	// Documents

	certif_medic: {
		item: "certif_medic",
		name: "Certificat Medical",
		weight: 0,
	},

	// Boutiques

	lootbox: {
		item: "lootbox",
		name: "Caisse mystère",
		weight: 0,
		onuse: { serverEvent: "gm:lootboxes:open", closeInventory: true }, //item is removed in event handler
	},

	// Braquages

	fleecaCard: {
		item: "fleecaCard",
		name: "Carte 1",
		weight: 0.2,
	},
	fleecaCard2: {
		item: "fleecaCard2",
		name: "Carte 2",
		weight: 0.2,
	},

	// Vêtements

	top: {
		item: "top",
		name: "Haut",
		weight: 0.5,
	},
	trouser: {
		item: "trouser",
		name: "Pantalon",
		weight: 0.5,
	},
	shoes: {
		item: "shoes",
		name: "Chaussures",
		weight: 0.5,
	},
	tenue: {
		item: "tenue",
		name: "Tenue",
		weight: 1,
	},
	bag: {
		item: "bag",
		name: "Sac",
		weight: 1,
	},
	ear: {
		item: "ear",
		name: "Boucles d'oreilles",
		weight: 0.2,
	},
	bracelet: {
		item: "bracelet",
		name: "Bracelet",
		weight: 0.2,
	},
	glass: {
		item: "glass",
		name: "Lunettes",
		weight: 0.2,
	},
	hat: {
		item: "hat",
		name: "Chapeau",
		weight: 0.4,
	},
	watch: {
		item: "watch",
		name: "Montre",
		weight: 0.2,
	},
	mask: {
		item: "mask",
		name: "Masque",
		weight: 0.2,
	},
	malette: {
		item: "malette",
		name: "Malette",
		weight: 1,
	},
};
