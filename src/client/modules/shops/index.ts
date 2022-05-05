import { Cardealer } from "./cardealer";

export abstract class Shops {
    public static async initialize() {
        await Cardealer.initialize();
    }
}