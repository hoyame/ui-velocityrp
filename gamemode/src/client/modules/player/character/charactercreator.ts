import { ICharacterInfos, INewCharacter } from "../../../../shared/player/character";
import { Delay } from "../../../../shared/utils/utils";
import { TriggerServerCallbackAsync } from "../../../core/utils";
import { OpenIdentityCreator, OpenCharacterCreatorMenu } from "./menu";
import { Character } from "../../../player/character";
import { Skin } from "../../../player/skin";

export class CharacterCreator {
	private static open: boolean = false;

	public static get IsOpen() {
		return this.open;
	}

	public static async start() {
		this.open = true;

		emitNet("gm:inst:create");

		const control = this.startControlTick();
		await this.initIdentity();

		OpenIdentityCreator(async identity => {
			await this.initSkin();

			OpenCharacterCreatorMenu(async char => {
				await this.createCharacter({ ...identity, ...char });
				clearTick(control);
				this.open = false;
			});
		});
	}

	public static zoomCamOnFace() {
		SetCamFov(GetRenderingCam(), 20);
		PointCamAtEntity(GetRenderingCam(), PlayerPedId(), 0.8, -10, 2, true);
	}

	public static resetCamZooom() {
		SetCamFov(GetRenderingCam(), 70);
		PointCamAtEntity(GetRenderingCam(), PlayerPedId(), 0, 0, 0, true);
	}

	private static async createCharacter(newChar: INewCharacter) {
		const character: ICharacterInfos = await TriggerServerCallbackAsync("gm:character:create", newChar);

		DoScreenFadeOut(1000);
		await Delay(1100);

		DestroyAllCams(true);
		RenderScriptCams(false, false, 500, true, true);

		EnableAllControlActions(0);
		SetEntityCoords(PlayerPedId(), 246.496, -882.7, 30.5, false, false, false, false);

		Character.spawn(character);
		emitNet("gm:inst:leave");

		await Delay(2500);
		DoScreenFadeIn(500);
	}

	private static async initIdentity() {
		FreezeEntityPosition(PlayerPedId(), false);
		ClearPedTasks(PlayerPedId());
		SetEntityCoords(PlayerPedId(), -125.99, -641.13, 167.82, false, false, false, false);
		SetEntityHeading(PlayerPedId(), 106.14);
		await Delay(1000);

		const identityCam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", -125.99, -639.31, 169.42, 0, 0, 0, 70.0, false, 0);
		SetCamActive(identityCam, true);
		const [x, y, z] = GetEntityCoords(PlayerPedId(), false);
		RenderScriptCams(true, true, 0, true, true);
		PointCamAtCoord(identityCam, x, y, z);
		PointCamAtEntity(identityCam, PlayerPedId(), 0, 0, 0, true);
	}

	private static async initSkin() {
		DoScreenFadeOut(1000);
		await Delay(1100);

		SetEntityCoords(PlayerPedId(), -132.61, -634.21, 167.82, false, false, false, false);
		SetEntityHeading(PlayerPedId(), 282.92);
		await Delay(500);

		const skinCam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", -131.31, -633.83, 169.3, 0, 0, 0, 70.0, false, 0); // VESTIARE
		SetCamActive(skinCam, true);
		RenderScriptCams(true, true, 0, true, true);
		PointCamAtEntity(skinCam, PlayerPedId(), 0, 0, 0, true);

		await Skin.setPed("mp_m_freemode_01");
		DoScreenFadeIn(500);
		await Delay(500);
	}

	private static startControlTick() {
		return setTick(() => {
			DisableControlAction(2, 30, true);
			DisableControlAction(2, 31, true);
			DisableControlAction(2, 32, true);
			DisableControlAction(2, 33, true);
			DisableControlAction(2, 34, true);
			DisableControlAction(2, 35, true);
			DisableControlAction(2, 322, true);
			DisableControlAction(0, 25, true);
			DisableControlAction(0, 24, true);
			DisableControlAction(0, 1, true);
			DisableControlAction(0, 2, true);
			DisableControlAction(0, 257, true);
			DisableControlAction(0, 263, true);
			DisableControlAction(0, 45, true);
			DisableControlAction(0, 44, true);
			DisableControlAction(0, 37, true);
			DisableControlAction(0, 23, true);
			DisableControlAction(0, 73, true);
			DisableControlAction(2, 199, true);
			DisableControlAction(0, 288, true);
			DisableControlAction(0, 289, true);
			DisableControlAction(0, 170, true);
			DisableControlAction(0, 167, true);
			DisableControlAction(0, 327, true);
			DisableControlAction(0, 318, true);
			DisableControlAction(0, 0, true);
			DisableControlAction(0, 26, true);
			DisableControlAction(0, 73, true);
			DisableControlAction(2, 199, true);
			DisableControlAction(0, 59, true);
			DisableControlAction(0, 71, true);
			DisableControlAction(0, 72, true);
			DisableControlAction(2, 36, true);
			DisableControlAction(0, 47, true);
			DisableControlAction(0, 264, true);
			DisableControlAction(0, 257, true);
			DisableControlAction(0, 140, true);
			DisableControlAction(0, 141, true);
			DisableControlAction(0, 142, true);
			DisableControlAction(0, 143, true);
			DisableControlAction(0, 75, true);
			DisableControlAction(27, 75, true);
		});
	}
}
