import { ItemsConfig } from "./items";

//rate must be an int
export const Tiers = [
	{ name: "Common", rate: 50 },
	{ name: "Rare", rate: 40 },
	{ name: "Epic", rate: 15 },
	{ name: "Unique", rate: 6 },
	{ name: "Legendary", rate: 1 },
];

//make sure to have at least one item per tier
export const Loots = [
	{ money: 2000, tier: 0 },
	{ item: ItemsConfig["bt_eau"].item, tier: 0 },
	{ item: ItemsConfig["bgt_pain"].item, tier: 0 },
	{ money: 4000, tier: 1 },
	{ money: 6000, tier: 2 },
	{ money: 10000, tier: 3 },
	{ money: 50000, tier: 4 },
];
