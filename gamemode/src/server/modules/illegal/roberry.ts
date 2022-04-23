import { RegisterServerCallback } from "../../core/utils";
import { CharactersController } from "../../player/charactersController";

export class Roberry {
	public static Cache: boolean = false;

	public static All: string[] = [];
	public static LTD: any[] = [];
	public static Jewelry: any[] = [];
	public static Bank: any[] = [];

	public static async initialize() {
		console.log("[GM] | [Module] - Roberry Initialized");

		onNet("gm:robbery:launch", (source: any, args: any) => {
			return this.launchRobbery(args[0], args[1]);
		});

		onNet("gm:roberry:ltd", this.payRobbery.bind(this));
	}

	public static payRobbery() {
		const character = CharactersController.getCharacter(source);
		character.giveSaleMoney(300);
	}

	public static launchRobbery(type: string, idb: number) {
		const id = parseInt(source) || idb;

		let error = false;

		switch (type) {
			case "ltd":
				if (this.LTD[id] !== true) {
					this.LTD[id] = true;
				} else {
					error = true;
				}
				break;
			case "jewerly":
				if (this.Jewelry[id] !== true) {
					this.Jewelry[id] = true;
				} else {
					error = true;
				}
				break;
			case "bank":
				if (this.Bank[id] !== true) {
					this.Bank[id] = true;
				} else {
					error = true;
				}
				break;

			default:
				break;
		}

		return error;
	}
}
