import { Notification } from "@nativewrappers/client";
import { ItemsConfig } from "../../../../shared/config/items";
import { Loots } from "../../../../shared/config/lootboxes";
import { Notifications } from "../../../player/notifications";
import { Nui } from "../../../utils/nui";

export abstract class Lootboxes {
	public static animationPlaying = false;

	public static async initialize() {
		onNet("gm:lootboxes:animation", this.showUi.bind(this));
	}

	private static showUi(lootIndex: number) {
		this.animationPlaying = true;
		Nui.SendMessage({ path: "lootbox/" + lootIndex });

		const loot = Loots[lootIndex];
		//@ts-ignore
		const lootName = !!loot.money ? loot.money + "$" : ItemsConfig[Loots[lootIndex].item].name;
		setTimeout(() => {
			Notifications.ShowSuccess("Vous avez gagné ~g~" + lootName);
			this.animationPlaying = false;
		}, 10000);
	}
}
