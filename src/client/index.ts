import "../shared/extensions";
import { Delay } from "../shared/utils/utils";
import { Context } from "./modules/misc/context";
import { Notification } from "./modules/misc/notifications";
import { Overlay } from "./modules/misc/overlay";
import { Shops } from "./modules/shops";
import { Speedometer } from "./modules/misc/speedometer";
import { Player } from "./modules/player";
import { Interaction } from "./modules/misc/interaction";
import { Ped } from "./modules/misc/ped";
import { Character } from "./modules/character";
import { Menu } from "./modules/menu";

class Gamemode {
	public static async initialize() {
		await Delay(1000);

		await Speedometer.initialize();
		await Context.initialize();
		await Notification.initialize();
		await Overlay.initialize();
		await Character.initialize();

		await Shops.initialize();
		await Player.initialize();

		await Interaction.initialize();
		await Ped.initialize();
		await Menu.initialize();

		exports("openMainMenu", (args: any) => {
			emit("hoyame:openMainMenu", args);
		});

		exports("createContextMenu", (args: any) => {
			emit("hoyame:createContextMenu", args);
		});

		exports("createCharacter", (args: any) => {
			emit("hoyame:createCharacter", args);
		});

		exports("openMenuDirectly", (args: any) => {
			emit("hoyame:openMenuDirectly", args);
		});

		exports("closeContextMenu", (args: any) => {
			emit("hoyame:closeContextMenu", args);
		});

		exports("backMenu", (args: any) => {
			emit("hoyame:backMenu", args);
		});

		exports("showNotification", (args: any) => {
			emit("hoyame:showNotification", args);
		});

		exports("showAdvancedNotification", (args: any) => {
			emit("hoyame:showAdvancedNotification", args);
		});

		exports("showOverlay", (args: any) => {
			emit("hoyame:updateOverlay", args);
		});

		console.log("GAMEMODE INITIALIZED");
	}
}

Gamemode.initialize();
