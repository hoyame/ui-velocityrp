import { AnimConfig } from "../../../../shared/config/animations";
import { Delay } from "../../../../shared/utils/utils";
import { CoraUI } from "../../../core/coraui";
import { GetClosestPlayer } from "../../../core/utils";
import { Notifications } from "../../../player/notifications";

export abstract class Animations {
	public static Props: number[] = [];
	public static AnimationDuration = -1;
	public static PlayerHasProp = false;
	public static InAnimation = false;
	public static AttachWait = 0;

	public static async initialize() {
		RegisterCommand("anim", this.openMenu, false);
		RegisterKeyMapping("anim", "Menu Animation", "keyboard", "F3");

		onNet("gm:animation:cl:sync:playEmoteSource", this.playEmoteSourceSync.bind(this));
		onNet("gm:animation:cl:sync:playEmote", this.playEmoteSync.bind(this));
		onNet("gm:animation:cl:sendRequest", this.sendRequest.bind(this));
	}

	private static sendRequest(name: number, type: string) {
		let remote: any;
		console.log("emoteRequest", name, type);
		const [pCloset, pClosetDst] = GetClosestPlayer();

		if (type == "dances") {
			remote = AnimConfig.Dances[name];
		} else {
			remote = AnimConfig.Shared[name];
		}

		PlaySound(-1, "NAV", "HUD_AMMO_SHOP_SOUNDSET", false, 0, true);
		Notifications.Show("~y~Y~w~ pour accepter, ~r~L~w~ pour refuser (~g~" + remote + "~w~)");

		const tick = setTick(() => {
			console.log("tick");
			if (IsControlJustPressed(0, 246)) {
				emitNet("gm:animation:sv:playEmote", pCloset, type, name);
				console.log("playEmote");
				clearTick(tick);
			} else if (IsControlJustPressed(0, 182)) {
				Notifications.Show("~r~Vous avez refusée");
				console.log("playEmote refusée");
				clearTick(tick);
			}
		});
	}

	private static async playEmoteSync(emote: any) {
		this.emoteCancel();
		await Delay(300);

		if (AnimConfig.Shared[emote]) {
			await this.playEmote(AnimConfig.Shared[emote]);
			console.log("ogneoingoegni 1");
		} else if (AnimConfig.Dances[emote]) {
			await this.playEmote(AnimConfig.Dances[emote]);
			console.log("ogneoingoegni 2");
		}
	}

	private static async playEmoteSourceSync(emote: string | number) {
		const [pCloset, pClosetDst] = GetClosestPlayer();
		if (!pCloset) return;
		const pedInFront = GetPlayerPed(pCloset);
		const heading = GetEntityHeading(pedInFront);

		//let coords = GetOffsetFromEntityInWorldCoords(pedInFront, 0.0, 1.0, 0.0);

		//if (AnimConfig.Shared[emote] && AnimConfig.Shared[emote][5]) {
		//	const syncOffsetFront = AnimConfig.Shared[emote].AnimationOptions.SyncOffsetFront;
		//	coords = GetOffsetFromEntityInWorldCoords(pedInFront, 0.0, syncOffsetFront, 0.0);
		//}

		//SetEntityHeading(PlayerPedId(), heading - 180.1);
		//SetEntityCoordsNoOffset(PlayerPedId(), coords[0], coords[1], coords[2], false, false, false);

		this.emoteCancel();
		await Delay(300);

		if (AnimConfig.Shared[emote]) {
			await this.playEmote(AnimConfig.Shared[emote]);
			console.log("ogneoingoegni 3");
		} else if (AnimConfig.Dances[emote]) {
			await this.playEmote(AnimConfig.Dances[emote]);
			console.log("ogneoingoegni 4");
		}
	}

	private static emoteCancel() {
		ClearPedTasksImmediately(PlayerPedId());
		ClearPedTasks(GetPlayerPed(-1));
		this.destroyAllProps();
		this.InAnimation = false;
	}

	private static destroyAllProps() {
		this.Props.forEach(prop => {
			DeleteEntity(prop);
		});
	}

	private static getGender() {
		const hashSkinMale = GetHashKey("mp_m_freemode_01");
		const hashSkinFemale = GetHashKey("mp_f_freemode_01");

		if (GetEntityModel(PlayerPedId()) == hashSkinMale) {
			return "male";
		} else if (GetEntityModel(PlayerPedId()) == hashSkinFemale) {
			return "female";
		}
	}

	public static async launchEmote(name: number, type: string) {
		if (type == "dances") {
			if (AnimConfig.Dances[name] != null) {
				await this.playEmote(AnimConfig.Dances[name]);
			}
		} else if (type == "props") {
			if (AnimConfig[name] != null) {
				await this.playEmote(AnimConfig.PropEmotes[name]);
			}
		} else if (type == "emotes") {
			if (AnimConfig.Emotes[name] != null) {
				await this.playEmote(AnimConfig.Emotes[name]);
			}
		} else if (type == "expression") {
			if (AnimConfig.Expressions[name] != null) {
				await this.playEmote(AnimConfig.Expressions[name]);
			}
		}

		await Delay(5000);
	}

	private static async playEmote(emoteData: any) {
		console.log(emoteData);
		const InVehicle: boolean = IsPedInAnyVehicle(PlayerPedId(), true);
		if (InVehicle) return;
		if (!DoesEntityExist(PlayerPedId())) return;

		if (IsPedArmed(GetPlayerPed(-1), 7)) {
			SetCurrentPedWeapon(PlayerPedId(), GetHashKey("WEAPON_UNARMED"), true);
		}

		const dict = emoteData[1];
		const animation = emoteData[2];
		const name = emoteData[3];

		this.AnimationDuration = -1;

		if (this.PlayerHasProp) this.destroyAllProps();

		if (dict == "Expression") {
			console.log(62651651161);

			SetFacialIdleAnimOverride(PlayerPedId(), animation, "");
		}

		if (dict == "MaleScenario" || "Scenario") {
			const gender = this.getGender();

			if (dict == "MaleScenario") {
				if (InVehicle) return Notifications.ShowError("Vous ne pouvez pas effectuer cette action dans un vehicule");

				if (gender == "male") {
					ClearPedTasks(GetPlayerPed(-1));
					TaskStartScenarioInPlace(GetPlayerPed(-1), animation, 0, true);
					this.InAnimation = true;
				} else {
					Notifications.ShowError("Animation reservée au male alpha");
				}
			} else if (dict == "ScenarioObject") {
				if (InVehicle) return Notifications.ShowError("Vous ne pouvez pas effectuer cette action dans un vehicule");

				const BehindPlayer = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0.0, 0 - 0.5, -0.5);
				ClearPedTasks(GetPlayerPed(-1));
				TaskStartScenarioAtPosition(
					GetPlayerPed(-1),
					animation,
					BehindPlayer[0],
					BehindPlayer[1],
					BehindPlayer[2],
					GetEntityHeading(PlayerPedId()),
					0,
					true,
					false
				);
				this.InAnimation = true;
			} else if (dict == "Scenario") {
				if (InVehicle) return Notifications.ShowError("Vous ne pouvez pas effectuer cette action dans un vehicule");

				ClearPedTasks(GetPlayerPed(-1));
				TaskStartScenarioInPlace(GetPlayerPed(-1), animation, 0, true);
			}
		}

		RequestAnimDict(dict);

		let MovementType = 0;

		if (emoteData[5]) {
			if (emoteData[5].EmoteLoop) {
				MovementType = 1;
				if (emoteData[5].EmoteMoving) {
					MovementType = 51;
				}
			} else if (emoteData[5].EmoteMoving) {
				MovementType = 51;
			} else if (emoteData[5].EmoteMoving == false) {
				MovementType = 0;
			} else if (emoteData[5].EmoteStuck) {
				MovementType = 50;
			}
		} else {
			MovementType = 0;
		}

		if (InVehicle) {
			MovementType = 51;
		}

		if (emoteData[5]) {
			if (!emoteData[5].EmoteDuration) {
				emoteData[5].EmoteDuration = -1;
				this.AttachWait = 0;
			} else {
				this.AnimationDuration = emoteData[5].EmoteDuration;
				this.AttachWait = emoteData[5].EmoteDuration;
			}
		}

		TaskPlayAnim(PlayerPedId(), dict, animation, 8.0, -8.0, this.AnimationDuration, MovementType, 0, false, false, false);
		this.InAnimation = true;

		if (emoteData[5]) {
			if (emoteData[5].Prop) {
				let PropName = emoteData[5].Prop;
				let PropBone = emoteData[5].PropBone;
				let SecondPropEmote = false;

				if (emoteData[5].SecondProp) {
					let SecondPropName = emoteData[5].SecondProp;
					let SecondPropBone = emoteData[5].SecondPropBone;
					let [SecondPropPl1, SecondPropPl2, SecondPropPl3, SecondPropPl4, SecondPropPl5, SecondPropPl6] =
						emoteData[5].SecondPropPlacement;
					let [PropPl1, PropPl2, PropPl3, PropPl4, PropPl5, PropPl6] = emoteData[5].PropPlacement;

					SecondPropEmote = true;

					this.addPropToPlayer(PropName, PropBone, PropPl1, PropPl2, PropPl3, PropPl4, PropPl5, PropPl6);
					await Delay(this.AttachWait);
					this.addPropToPlayer(
						SecondPropName,
						SecondPropBone,
						SecondPropPl1,
						SecondPropPl2,
						SecondPropPl3,
						SecondPropPl4,
						SecondPropPl5,
						SecondPropPl6
					);
				} else {
					let [PropPl1, PropPl2, PropPl3, PropPl4, PropPl5, PropPl6] = emoteData[5].PropPlacement;
					SecondPropEmote = false;
					this.addPropToPlayer(PropName, PropBone, PropPl1, PropPl2, PropPl3, PropPl4, PropPl5, PropPl6);
				}
			}
		}

		return true;
	}

	public static addPropToPlayer(
		prop1: string,
		bone: number,
		off1: number,
		off2: number,
		off3: number,
		rot1: number,
		rot2: number,
		rot3: number
	) {
		const [x, y, z] = GetEntityCoords(PlayerPedId(), false);

		if (!HasModelLoaded(prop1)) {
			RequestModel(GetHashKey(prop1));
		}

		const prop = CreateObject(GetHashKey(prop1), x, y, z + 0.2, true, true, true);
		AttachEntityToEntity(
			prop,
			PlayerPedId(),
			GetPedBoneIndex(PlayerPedId(), bone),
			off1,
			off2,
			off3,
			rot1,
			rot2,
			rot3,
			true,
			true,
			false,
			true,
			1,
			true
		);
		this.Props.push(prop);
		SetModelAsNoLongerNeeded(prop1);
		this.PlayerHasProp = true;
	}

	private static walkStart(arg: string) {
		RequestAnimSet(arg);
		SetPedMovementClipset(PlayerPedId(), arg, 0.2);
		RemoveAnimSet(arg);
	}

	private static walkReset() {
		ResetPedMovementClipset(PlayerPedId(), 0);
	}

	private static emoteStart() {}

	private static emoteReset() {
		ClearPedTasksImmediately(PlayerPedId());
		ClearPedTasks(GetPlayerPed(-1));
		this.destroyAllProps();
	}

	public static openMenu() {
		let Expressions: any = [];
		let Walks: any = [];
		let Shared: any = [];
		let Dances: any = [];
		let Emotes: any = [];
		let PropEmotes: any = [];

		AnimConfig["Expressions"].map((element: any, k: number) => {
			Expressions.push({
				name: element[0],
				onClick: async () => {
					await Animations.launchEmote(k, "expression");
				},
			});
		});

		AnimConfig["Walks"].map((element: any, k: number) => {
			Walks.push({
				name: element[0],
				onClick: async () => {
					await Animations.launchEmote(k, "expression");
				},
			});
		});

		AnimConfig["Dances"].map((element: any, k: number) => {
			Dances.push({
				name: element[0],
				onClick: async () => {
					await Animations.launchEmote(k, "dances");
				},
			});
		});

		AnimConfig["Emotes"].map((element: any, k: number) => {
			Emotes.push({
				name: element[0],
				onClick: async () => {
					await Animations.launchEmote(k, "emotes");
				},
			});
		});

		AnimConfig["Shared"].map((element: any, k: number) => {
			Shared.push({
				name: element[0],
				onClick: async () => {
					const [target, distance] = GetClosestPlayer();
					console.log(15615615616511);
					//if (!target) return Notifications.Show('Aucune personne a proximité');
					emitNet("gm:animation:sv:emoteRequest", target, k, "dances");
					Notifications.Show("Demande envoyée");
					await Delay(1000);
				},
			});
		});

		CoraUI.openMenu({
			name: "Animations",
			subtitle: "Menu Personnel",
			glare: true,
			buttons: [
				{
					name: "Expressions",
					onClick: () =>
						CoraUI.openMenu({
							name: "Animations",
							subtitle: "Menu Personnel",
							glare: true,
							buttons: Expressions,
						}),
				},
				{
					name: "Demarches",
					onClick: () =>
						CoraUI.openMenu({
							name: "Animations",
							subtitle: "Menu Personnel",
							glare: true,
							buttons: Walks,
						}),
				},
				{
					name: "Dances",
					onClick: () =>
						CoraUI.openMenu({
							name: "Animations",
							subtitle: "Menu Personnel",
							glare: true,
							buttons: Dances,
						}),
				},
				{
					name: "Emotes",
					onClick: () =>
						CoraUI.openMenu({
							name: "Animations",
							subtitle: "Menu Personnel",
							glare: true,
							buttons: Emotes,
						}),
				},
				{
					name: "Dances Partagées",
					onClick: () =>
						CoraUI.openMenu({
							name: "Animations",
							subtitle: "Menu Personnel",
							glare: true,
							buttons: Shared,
						}),
				},
				/*
				{
					name: "Animations partagées",
					onClick: () => CoraUI.openMenu({
						name: "Animations",
						subtitle: "Menu Personnel",
						glare: true,
						buttons: Shared
					})
				},
				*/
			],
		});
	}
}
