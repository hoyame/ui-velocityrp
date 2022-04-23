import { Game, Vector3 } from "@nativewrappers/client";
import Config from "../../../../shared/config/activity/scubadiving.json";
import { Delay } from "../../../../shared/utils/utils";
import { CoraUI } from "../../../core/coraui";
import { TriggerServerCallbackAsync } from "../../../core/utils";
import { BlipsController } from "../../../misc/blips";
import { InteractionPoints } from "../../../misc/interaction-points";
import { Character } from "../../../player/character";
import { Clothes, maleDefaultVariations } from "../../../player/clothes";
import { Streaming } from "../../../utils/streaming";
import { Utils } from "../../../utils/utils";

const screen = {
	baseX: 0.918,
	baseY: 0.984,
	offsetX: 0.018,
	offsetY: -0.0165,
	timerBarWidth: 0.165,
	timerBarHeight: 0.035,
};

export abstract class ScubaDiving {
	private static scubaEnable = false;

	public static async initialize() {
		for (const position of Config.positions) {
			BlipsController.CreateBlip({
				coords: position,
				...Config.blip,
			});

			InteractionPoints.createPoint({
				helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ouvrir le menu",
				marker: true,
				position: Vector3.create(position),
				action: this.openMenu.bind(this),
			});
		}

		setTick(this.scubaTick.bind(this));
	}

	private static openMenu() {
		CoraUI.openMenu({
			name: "Plongée",
			subtitle: "Location",
			buttons: [
				{
					name: "Emprunter une tenue",
					rightText: "~g~400$",
					onClick: this.rentTenue.bind(this),
				},
				{
					name: "Rendre une tenue",
					onClick: this.returnTenue.bind(this),
				},
			],
		});
	}

	private static async returnTenue() {
		if (await TriggerServerCallbackAsync("gm:scubadiving:return")) {
			Clothes.addVariations(maleDefaultVariations);
		}
	}

	private static async rentTenue() {
		if (await TriggerServerCallbackAsync("gm:scubadiving:rent")) {
			Clothes.addVariations(Config.maleVariations);
		}
	}

	private static async scubaTick() {
		if (!IsPedSwimming(Game.PlayerPed.Handle) && !IsPedSwimmingUnderWater(Game.PlayerPed.Handle)) {
			await Delay(1000);
			return;
		}

		const isWearingScuba = Clothes.hasVariations(Character.isFemale() ? Config.femaleVariations : Config.maleVariations);
		if (this.scubaEnable && !isWearingScuba) {
			SetEnableScuba(Game.PlayerPed.Handle, false);
			SetPedMaxTimeUnderwater(Game.PlayerPed.Handle, 20);
			this.scubaEnable = false;
			SetStreamedTextureDictAsNoLongerNeeded("timerbars");
		} else if (!this.scubaEnable && isWearingScuba) {
			SetEnableScuba(Game.PlayerPed.Handle, true);
			SetPedMaxTimeUnderwater(Game.PlayerPed.Handle, 15 * 60);
			this.scubaEnable = true;
			await Streaming.RequestTextureDictionnaryAsync("timerbars");
		}

		if (this.scubaEnable) {
			const safeZone = GetSafeZoneSize();
			const safeZoneX = (1.0 - safeZone) * 0.5;
			const safeZoneY = (1.0 - safeZone) * 0.5;

			DrawSprite(
				"timerbars",
				"all_black_bg",
				screen.baseX - safeZoneX,
				screen.baseY - safeZoneY,
				screen.timerBarWidth,
				screen.timerBarHeight,
				0.0,
				255,
				255,
				255,
				160
			);

			const remaining = GetPlayerUnderwaterTimeRemaining(Game.Player.Handle);
			Utils.DrawText2(
				`Temps restant: ${Math.floor(remaining / 60)}:${Math.floor(remaining % 60)
					.toString()
					.padStart(2, "0")}`,
				screen.baseX - safeZoneX + screen.offsetX,
				screen.baseY - safeZoneY + screen.offsetY,
				0.425,
				0,
				[255, 255, 255, 255],
				2,
				0
			);
		}
	}
}
