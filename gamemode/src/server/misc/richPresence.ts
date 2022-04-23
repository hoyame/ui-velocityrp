export abstract class RichPresence {
	public static async initialize() {
		setInterval(this.sendPlayerCount.bind(this), 60000);
	}

	private static sendPlayerCount() {
		emitNet("gm:richPresence:update", -1, getPlayers().length);
	}
}
