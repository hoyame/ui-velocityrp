import { Tiers, Loots } from "../../../shared/config/lootboxes";
import { CharactersController } from "../../player/charactersController";

export abstract class Lootboxes {
	private static maxRnd = 0;
	private static rates: number[] = [];
	private static lootByTiers: { [tier: number]: typeof Loots[number][] } = {};

	public static async initialize() {
		for (const tier of Tiers) {
			this.rates.push(this.maxRnd);
			this.maxRnd += tier.rate;
		}
		this.rates.push(this.maxRnd);

		for (const loot of Loots) {
			if (!this.lootByTiers[loot.tier]) this.lootByTiers[loot.tier] = [];
			this.lootByTiers[loot.tier].push(loot);
		}

		on("gm:lootboxes:open", this.openLootbox.bind(this));
	}

	private static openLootbox(source: string) {
		const character = CharactersController.getCharacter(source);
		if (!character || !character.removeItem("lootbox", 1)) return;

		const rnd = Math.randomRange(0, this.maxRnd);
		//@ts-ignore
		const tier = this.rates.findIndex(n => rnd < n) - 1;
		const lootIndex = Math.randomRange(0, this.lootByTiers[tier].length - 1);
		const loot = this.lootByTiers[tier][lootIndex];

		if (!!loot.money) character.giveMoney(loot.money);
		if (!!loot.item) character.additem(loot.item, 1, true);

		emitNet("gm:lootboxes:animation", source, lootIndex);
	}
}
