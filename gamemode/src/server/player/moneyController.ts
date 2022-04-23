import { CharactersController } from "./charactersController";

export abstract class MoneyController {
	public static initialize() {
		onNet("gm:money:deposer", this.deposer.bind(this));
		onNet("gm:money:retirer", this.retirer.bind(this));
	}

	private static deposer(amount: number) {
		CharactersController.deposer(source, amount);
	}

	private static retirer(amount: number) {
		CharactersController.retirer(source, amount);
	}
}
