import { TriggerServerCallbackAsync } from "../core/utils";
import { Notifications } from "./notifications";

export class Money {
	public static async initialize() {
		exports("getMoney", async () => await this.getMoney());
		exports("pay", async (amount: number) => await this.pay(amount));
		console.log("[GM][Framework] | [Module] - Money Initialized");
	}

	public static async pay(amount: number) {
		const hasPay = !!(await TriggerServerCallbackAsync("gm:pay", amount));
		if (!hasPay) Notifications.ShowError("Vous n'avez pas assez d'argent", "money");

		Notifications.ShowSuccess(`Vous avez payé ~g~${amount}$`, "money");
		return hasPay;
	}

	public static async getMoney(): Promise<number | undefined> {
		return await TriggerServerCallbackAsync("gm:character:getMoney");
	}

	public static retrait(amount: number) {
		emitNet("gm:money:retirer", amount);
	}

	public static deposer(amount: number) {
		emitNet("gm:money:deposer", amount);
	}

	public static manage(type: number, meth: number, amount: number) {}
}
