export abstract class Animation {
	public static async initialize() {
		onNet("gm:animation:sv:emoteRequest", this.emoteRequest.bind(this));
		onNet("gm:animation:sv:playEmote", this.playEmote.bind(this));
	}

	private static emoteRequest(target: number, emoteName: number, emoteType: string) {
		const src = source;
		console.log("emoteRequest", target, emoteName, emoteType);
		return emitNet("gm:animation:cl:sendRequest", target, emoteName, emoteType);
	}

	private static playEmote(target: number, requestEmote: number, otherEmote: number) {
		console.log("playEmote", source, target, otherEmote);
		emitNet("gm:animation:cl:sync:playEmote", source, otherEmote);
		emitNet("gm:animation:cl:sync:playEmoteSource", target, otherEmote);
	}
}
