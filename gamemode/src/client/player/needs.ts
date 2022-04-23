import { Game } from "@wdesgardin/fivem-js";
import { ItemId } from "../../shared/config/items";
import { Environnment } from "../../shared/utils/environnment";
import { LocalEvents } from "../../shared/utils/localEvents";
import { Delay } from "../../shared/utils/utils";
import { Admin } from "../core/admin";
import { Animations } from "../utils/animations";
import { Nui } from "../utils/nui";
import { Streaming } from "../utils/streaming";
import { Character } from "./character";

export abstract class Needs {
	private static ready = false;
	private static drunk = false;

	private static feedAnim = {
		bt_eau: ["prop_ld_flow_bottle", "mp_player_intdrink", "loop_bottle"],
		bgt_pain: ["prop_cs_burger_01", "mp_player_inteat@burger", "mp_player_int_eat_burger"],
		beer: ["prop_beer_jakey", "mp_player_intdrink", "loop_bottle"],
		weed: ["", "WORLD_HUMAN_SMOKING_POT", ""],
	};

	public static async initialize() {
		LocalEvents.on("gm:character:spawned", this.onSpawned.bind(this));
		onNet("gm:needs:feed", this.feed.bind(this));
		if (!Environnment.IsDev) setInterval(this.updateNeeds.bind(this), 30000);
	}

	private static onSpawned() {
		this.ready = true;
		this.updateHud();
		setInterval(this.drunkInterval.bind(this), 20000);
	}

	private static updateNeeds() {
		if (!this.ready || Admin.isAdminModeEnable) return;

		const character = Character.getCurrent();
		if (!character || Game.PlayerPed.isDead()) return;

		character.needs = {
			thirst: Math.max(0, character.needs?.thirst - Math.randomRange(0.5, 1)),
			hunger: Math.max(0, character.needs?.hunger - Math.randomRange(0.5, 1)),
			weed: Math.max(0, (character.needs?.weed || 0) - 1.66),
			alcool: Math.max(0, (character.needs?.alcool || 0) - 1.66),
		};

		if (character.needs.hunger <= 0 || character.needs.thirst <= 0) {
			Game.PlayerPed.kill();
		}

		this.updateHud();
	}

	public static reset() {
		const character = Character.getCurrent();
		if (!character) return;

		character.needs = { thirst: 20, hunger: 20, weed: 0, alcool: 0 };
		this.updateHud();
	}

	private static updateHud() {
		Nui.SendMessage({ type: "needs", data: Character.getCurrent()?.needs });
	}

	private static async feed(itemId: ItemId, effect: { thirst?: number; hunger?: number; alcool?: number; weed?: number }) {
		const character = Character.getCurrent();
		if (!character || Game.PlayerPed.isDead()) return;

		//@ts-ignore
		const [model, animDicOrScenario, anim] = this.feedAnim[itemId] || ["", "mp_player_intdrink", "loop_bottle"];

		await Streaming.RequestModelAsync(model);
		const prop = CreateObjectNoOffset(GetHashKey(model), 0, 0, 0, true, false, false);
		SetModelAsNoLongerNeeded(GetHashKey(model));

		AttachEntityToEntity(
			prop,
			Game.PlayerPed.Handle,
			GetPedBoneIndex(Game.PlayerPed.Handle, 60309),
			0.0,
			0.0,
			0.0,
			0.0,
			0.0,
			0.0,
			true,
			true,
			false,
			true,
			1,
			true
		);

		if (!!animDicOrScenario && !!anim) {
			await Animations.PlaySimple(animDicOrScenario, anim, 1000, 0);
			await Animations.PlaySimple(animDicOrScenario, anim, 1000, 0);
			await Animations.PlaySimple(animDicOrScenario, anim, 1000, 0);
		} else if (!!animDicOrScenario) {
			TaskStartScenarioInPlace(PlayerPedId(), animDicOrScenario, 0, true);
			await Delay(5000);
			ClearPedTasksImmediately(Game.PlayerPed.Handle);
		}

		DeleteEntity(prop);

		if (Game.PlayerPed.isDead()) return;

		if (!!effect?.thirst) character.needs.thirst = Math.min(100, character.needs.thirst + effect.thirst);
		if (!!effect?.hunger) character.needs.hunger = Math.min(100, character.needs.hunger + effect.hunger);
		if (!!effect.alcool) character.needs.alcool = (character.needs.alcool || 0) + effect.alcool;
		if (!!effect.weed) character.needs.weed = (character.needs.weed || 0) + effect.weed;

		if ((!!character.needs.weed && character.needs.weed > 100) || (!!character.needs.alcool && character.needs.alcool > 100)) {
			Game.PlayerPed.kill();
		}

		this.updateHud();
	}

	private static async drunkInterval() {
		const character = Character.getCurrent();
		if (!character || Game.PlayerPed.isDead()) return;

		const drunkLevel = (character.needs.weed || 0) + (character.needs.alcool || 0);

		if (drunkLevel > 50) {
			ShakeGameplayCam("DRUNK_SHAKE", Math.round(drunkLevel / 50));
			if (!this.drunk) {
				this.drunk = true;
				await Streaming.RequestClipsetAsync("move_m@drunk@verydrunk");
				SetPedMovementClipset(Game.PlayerPed.Handle, "move_m@drunk@verydrunk", 1);
				SetPedIsDrunk(Game.PlayerPed.Handle, true);
			}
		} else if (this.drunk) {
			this.drunk = false;
			ShakeGameplayCam("", 0);
			SetPedIsDrunk(Game.PlayerPed.Handle, false);
			ResetPedMovementClipset(Game.PlayerPed.Handle, 0);
		}
	}
}
