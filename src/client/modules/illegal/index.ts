import { IllegalInviteManager } from "./invite";

export abstract class Illegal {
    public static async initialize() {
        await IllegalInviteManager.initialize()
    }
}