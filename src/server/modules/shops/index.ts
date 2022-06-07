import { Cardealer } from "./cardealer";
import { Store } from "./store";

export default abstract class Shops {
    public static async initialize() {
        await Cardealer.initialize();
        await Store.initialize();
    }
}