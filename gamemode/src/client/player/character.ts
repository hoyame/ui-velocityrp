import { TriggerServerCallbackAsync } from "../core/utils";
import { CharacterCreator } from "../modules/player/character/charactercreator";
import { Clothes } from "./clothes";
import { Lodaout } from "./lodaout";
import { Skin } from "./skin";
import { Tatoos } from "./tatoos";
import { ICharacterInfos } from "../../shared/player/character";
import { Environnment } from "../../shared/utils/environnment";
import { CheckTbl, Delay } from "../../shared/utils/utils";
import { Utils } from "../utils/utils";
import { Health } from "./health";
import { OpenIdentityCreator } from "../modules/player/character/menu";
import Config from "../../shared/config/client.json";
import { LocalEvents } from "../../shared/utils/localEvents";
import { Game } from "@wdesgardin/fivem-js";
import { Notifications } from "./notifications";

export class Character {
	private static current?: ICharacterInfos = undefined;
	public static Busy = false;
	public static id: number;
	public static ped: any;
	private static alreadySpawned = false;

	public static async initialize() {
		onNet("gm:new:antitroll", () => {
			Notifications.ShowWarning("Mode antitroll activée temporairement");
			console.log("Mode antitroll activée temporairement");

			const tick = setTick(() => {
				DisableControlAction(2, 37, true);
				DisablePlayerFiring(PlayerPedId(), true);
				DisableControlAction(0, 106, true);
				DisableControlAction(0, 140, true);

				const timeout = setTimeout(() => {
					clearTick(tick);
					clearTimeout(timeout);
				}, Config["antiTrollDelay"] * 60000);
			});
		});

		const character = (await TriggerServerCallbackAsync("gm:character:getInfos")) as ICharacterInfos;
		exports.spawnmanager.setAutoSpawnCallback(() => {
			const spawnPos = character?.position || [-125.99, -641.13, 167.82];
			exports.spawnmanager.spawnPlayer(
				{
					x: spawnPos[0],
					y: spawnPos[1],
					z: spawnPos[2],
					model: character?.skin?.[0] == 1 ? "mp_f_freemode_01" : "mp_m_freemode_01",
					skipFadeIn: true,
				},
				async () => {
					if (!!character) {
						await this.spawn(character);
					} else {
						await CharacterCreator.start();
					}
					DoScreenFadeIn(1000);
				}
			);
		});
		exports.spawnmanager.setAutoSpawn(true);
		exports.spawnmanager.forceRespawn();

		onNet("gm:player:update", (infos: ICharacterInfos) => (this.current = infos));

		setInterval(
			() => {
				if (!!this.current && !Character.Busy) {
					Character.save();
					Lodaout.updateLodaout();
					console.log("[GM] | [Player] - Player saved");
				}
			},
			Environnment.IsDev ? 10000 : 120000
		);

		RegisterCommand(
			"forcePlayerSave",
			() => {
				Character.save();
				console.log("[GM] | [Player] - Player saved");
			},
			false
		);

		RegisterCommand(
			"carkill",
			() => {
				const d = [133987706, -1553120962];
				const cd = GetPedCauseOfDeath(PlayerPedId());

				if (CheckTbl(d, cd)) {
					// revive
					Health.Resurect();
				}
			},

			false
		);

		onNet("gm:character:abovePedText", Utils.onShareDisplay.bind(Utils));

		onNet("gm:character:identiy:reset", OpenIdentityCreator);

		onNet("gm:character:licensesChanged", (licenses: ICharacterInfos["licenses"]) => {
			if (!!this.current) this.current.licenses = licenses;
		});

		const t = setTick(() => {
			N_0x4757f00bc6323cfe(GetHashKey("WEAPON_UNARMED"), 0.1);
		});
	}

	public static toggleBusy() {
		this.Busy = !this.Busy;
	}

	public static setHurt() {
		RequestAnimSet("move_m@injured");
		SetPedMovementClipset(PlayerPedId(), "move_m@injured", 1);
	}

	public static setNotHurt() {
		ResetPedMovementClipset(PlayerPedId(), 0);
		ResetPedWeaponMovementClipset(PlayerPedId());
		ResetPedStrafeClipset(PlayerPedId());
	}

	public static async spawn(character: ICharacterInfos) {
		this.current = character;

		await Skin.setSkin(PlayerPedId(), this.current.skin);
		await Delay(10);
		await Clothes.putClothes();
		await Delay(10);
		await Tatoos.set();
		await Delay(10);

		if (!this.alreadySpawned) {
			LocalEvents.emit("gm:character:spawned");
			emit("gm:character:loadphone");
			this.alreadySpawned = true;
		}
	}

	public static update(update: Partial<ICharacterInfos>) {
		if (!this.current) return;
		for (const [key, value] of Object.entries(update)) {
			if (!!value) {
				//@ts-ignore
				this.current[key] = value;
			}
		}
	}

	public static save() {
		if (!this.current || this.Busy) return;
		this.current.position = GetEntityCoords(PlayerPedId(), false);
		this.current.variations = Clothes.getVariations();
		this.current.props = Clothes.getProps();
		this.current.alive = Game.PlayerPed.isAlive();
		emitNet("gm:character:updateInfos", this.current);
	}

	public static getCurrent() {
		return this.current;
	}

	public static isFemale() {
		return this.current?.sex == "1";
	}

	public static dropPlayer() {
		this.current && this.save();
	}
}
