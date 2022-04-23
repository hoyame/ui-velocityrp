import { Environnment } from "../../shared/utils/environnment";
import Config from "../../shared/config/client.json";

export abstract class RichPresence {
	private static playerCount = 0;
	private static serverId = 0;

	public static async initialize() {
		this.serverId = GetPlayerServerId(PlayerId());

		SetDiscordAppId(Config.richPresence.appId);

		onNet("gm:richPresence:update", this.PlayerCountUpdate.bind(this));
	}

	private static PlayerCountUpdate(count: number) {
		this.playerCount = count;
		AddTextEntry(
			"FE_THDR_GTAO",
			`~b~${Config.serverName}~w~ | Joueurs: ${this.playerCount}/${Config.richPresence.maxPlayers} | ID: ~b~${this.serverId}`
		);

		if (Environnment.IsDev) return;
		SetDiscordRichPresenceAsset(Config.richPresence.asset);
		SetDiscordRichPresenceAssetText(Config.richPresence.assetText);

		SetDiscordRichPresenceAssetSmall(Config.richPresence.assetSmall);
		SetDiscordRichPresenceAssetSmallText(Config.richPresence.assetSmallText);

		SetRichPresence(`${this.serverId} - ${this.playerCount}/${Config.richPresence.maxPlayers} en ligne`);
		SetDiscordRichPresenceAction(0, Config.serverName, Config.richPresence.link);
		SetDiscordRichPresenceAction(1, Config.serverName, Config.richPresence.fivem);
	}
}
