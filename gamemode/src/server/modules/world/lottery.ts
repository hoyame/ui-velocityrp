import { CharactersController } from "../../player/charactersController";

export abstract class Lottery {
	public static async initialize() {
		onNet("gm:lottery:useLottery", this.useLottery.bind(this));
	}

	public static async useLottery(id: number) {
		const src = source;
		const array = [750, 640, 510, 0, 50, 300, 600, 1, 2, 10, 25, 90, 60, 65, 3, 290, 345, 691, 81, 329, 70, 20, 4, 5, 465, 470];
		const random = array[Math.floor(Math.random() * array.length)];
		const char = CharactersController.getCharacter(src);

		if (!char.hasItem("lottery")) return;

		char.giveMoney(random);
		char.removeItem("lottery", 1);
	}
}
