import { Delay } from "../../shared/utils/utils";
import { Character } from "./character";
import { Money } from "./money";

export class Billing {
	public static async initialize() {
		console.log("[GM][Framework] | [Module] - Billing Initialized");

		onNet("gm:player:updateBillings", (type: number, sender: string, name: string, amount: number, desc: string) => {
			type == 1 ? this.add(sender, name, amount, desc) : this.remove(sender);
		});
	}

	public static add(sender: string, name: string, amount: number, desc: string) {
		// let billings = Character.getCurrent()?.infos?.billing;
		// billings.push([sender, name, amount, desc]);
		// Character.updatePlayer({
		// 	caracter: {
		// 		billings: billings,
		// 	},
		// });
	}

	public static remove(sender: string) {
		// 	let billings = Character.getCurrent()?.infos?.billing;
		// 	billings = billings.filter((x: any) => x[0] != sender);
		// 	Character.updatePlayer({
		// 		caracter: {
		// 			billings: billings,
		// 		},
		// 	});
	}

	public static async pay(sender: string, method: number) {
		// let billings = Character.getCurrent()?.infos?.billing;
		// const index = billings.findIndex((e: any) => e[0] == sender) || 0;
		// const amount = billings[index][2];
		// Money.manage(method, 2, amount);
		// await Delay(1500);
		// billings = billings.filter((x: any) => x[0] != sender);
		// Character.updatePlayer({
		// 	caracter: {
		// 		billings: billings,
		// 	},
		// });
	}

	public static get() {
		// return Character.getCurrent()?.infos?.billing;
	}
}
