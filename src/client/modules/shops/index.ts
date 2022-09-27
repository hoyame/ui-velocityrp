import { Cardealer } from "./cardealer";
import { Store } from "./store";

export abstract class Shops {
	public static async initialize() {
		await Cardealer.initialize();
		await Store.initialize();
	}
}

function e() {
	// Get Fibonacci's numbers
}
