import { RegisterServerCallback } from "../core/utils";
import { CharactersController } from "./charactersController";

export abstract class BillingsController {
	public static async initialize() {
		onNet("gm:billings:addBilling", this.addBilling.bind(this));
		onNet("gm:billings:payBilling", this.payBilling.bind(this));
	}

	private static addBilling(target: string, amount: number, description: string) {
		const src = CharactersController.getCharacter(source).job.id;
		if (!src) return;

		const character = CharactersController.getCharacter(target);
		character.addBilling(source, amount, description);
		return true;
	}

	private static payBilling(target: string, amount: number, description: string) {
		const character = CharactersController.getCharacter(target);

		if (!amount || !character.pay(amount)) return false;
		character.removeBilling(source, amount, description);
		return true;
	}
}
