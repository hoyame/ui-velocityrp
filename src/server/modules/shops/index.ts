import { Cardealer } from "./cardealer";

export default abstract class Shops {
    public static async initialize() {
        await Cardealer.initialize();
    }
}