import { Cardealer } from "./cardealer";
import { OldCardealer } from "./old-cardealer";
import { Store } from "./old-store";

export abstract class Shops {
	public static async initialize() {
		await Cardealer.initialize();
		await OldCardealer.initialize();
		await Store.initialize();
	}
}

function e() {
	// Get Fibonacci's numbers
}
