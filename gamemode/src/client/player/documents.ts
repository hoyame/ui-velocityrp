import { ICharacterInfos } from "../../shared/player/character";
import { Delay } from "../../shared/utils/utils";
import { DrawText2, GetNearbyPlayers } from "../core/utils";
import { PedUtils } from "../utils/ped";
import { Streaming } from "../utils/streaming";
import { Character } from "./character";
import { Notifications } from "./notifications";

export abstract class Documents {
	private static currentTick = 0;
	private static currentTimeout: NodeJS.Timeout | undefined = undefined;
	private static shot = 0;

	public static Initialize() {
		onNet("gm:showIdTarget", (name: string, player: number, document: "idcard" | "hunting" | "firearms" | "hospital") => {
			this.ShowIdCard(name, GetPlayerPed(GetPlayerFromServerId(player)), document);
		});

		onNet("gm:showDrivingTarget", (name: string, player: number, licenses: ICharacterInfos["licenses"]) => {
			this.showDriving(name, GetPlayerPed(GetPlayerFromServerId(player)), licenses);
		});

		onNet("gm:showCertificatTarget", (name: string, doctor: string) => {
			this.showCertificat(name, doctor);
		});

		onNet("gm:showPoliceTarget", (name: string, player: number) => {
			this.showPolice(name, player);
		});
	}

	public static async ShowToNearbyPlayers(
		document: "idcard" | "hunting" | "firearms" | "hospital" | "driving" | "certificat" | "police",
		medicName = ""
	) {
		const character = Character.getCurrent();
		if (!character) return;

		const nearbyPlayers = GetNearbyPlayers();
		if (nearbyPlayers.length == 0) {
			Notifications.ShowError("Rapprochez vous de la cible");
			return;
		}
		const nearbyServerIds = nearbyPlayers.map(p => GetPlayerServerId(p.Handle));

		if (document == "driving") {
			emitNet("gm:documents:showDriving", nearbyServerIds, character.name, character.licenses);
		} else if (document == "certificat") {
			emitNet("gm:documents:showCertificat", nearbyServerIds, character.name, medicName);
		} else if (document == "police") {
			emitNet("gm:documents:showPolice", nearbyServerIds, character.name);
		} else {
			emitNet("gm:showId", nearbyServerIds, character.name, document);
		}

		this.DisplayDocumentForMe(document, medicName);
	}

	public static async DisplayDocumentForMe(
		document: "idcard" | "hunting" | "firearms" | "hospital" | "driving" | "certificat" | "police",
		medicName = ""
	) {
		const character = Character.getCurrent();
		if (!character) return;

		const [x, y, z] = GetEntityCoords(PlayerPedId(), false);
		const prop = CreateObject(GetHashKey("prop_fib_badge"), x, y, z + 0.2, true, true, true);
		const boneIndex = GetPedBoneIndex(PlayerPedId(), 28422);

		AttachEntityToEntity(prop, PlayerPedId(), boneIndex, 0.065, 0.029, -0.035, 80.0, -1.9, 75.0, true, true, false, true, 1, true);
		RequestAnimDict("paper_1_rcm_alt1-9");
		TaskPlayAnim(PlayerPedId(), "paper_1_rcm_alt1-9", "player_one_dual-9", 8.0, -8, 10.0, 49, 0, false, false, false);

		if (document == "driving") {
			await Documents.showDriving(character.name, PlayerPedId(), character.licenses);
		} else if (document == "certificat") {
			await Documents.showCertificat(character.name, medicName);
		} else if (document == "police") {
			await Documents.showPolice(character.name, PlayerPedId());
		} else {
			await Documents.ShowIdCard(character.name, PlayerPedId(), document);
		}

		await Delay(7500);
		ClearPedSecondaryTask(PlayerPedId());
		DeleteObject(prop);
	}

	public static async showDriving(name: string, ped: number, licenses: ICharacterInfos["licenses"]) {
		await this.InitDrawing();

		const [width, height] = GetScreenActiveResolution();

		const [bgWidth, bgHeight] = GetTextureResolution("documents", "driving");
		const bgScreenWidth = bgWidth / width;
		const bgScreenHeight = bgHeight / height;
		const bgScreenX = 0.5;
		const bgScreenY = 1 - 0.015 - bgScreenHeight / 2;

		this.shot = await PedUtils.GetPedHeadshotAsync(ped);

		const headTexture = GetPedheadshotTxdString(this.shot);
		const headScreenWidth = 150 / width;
		const headScreenHeight = 166 / height;
		const headScreenX = bgScreenX - 180 / width;
		const headScreenY = bgScreenY + 25.5 / height;

		const textScrenX = bgScreenX - 88 / width;
		const textScrenY = bgScreenY - 64 / height;
		const textScale = (0.265 * 2160) / height;

		const vehicleScreenY = bgScreenY + 20 / height;
		const vehicleTextScale = (0.15 * 2160) / height;
		const vehicleText = !!licenses.car ? `CLASS B` : "CLASS B: X";
		const vehicleColor = !!licenses.car ? [0, 100, 0, 255] : [150, 0, 0, 255];

		const cycleScreenY = bgScreenY + 44 / height;
		const cycleText = !!licenses.motorCycle ? `CLASS A` : "CLASS A: X";
		const cycleColor = !!licenses.motorCycle ? [0, 100, 0, 255] : [150, 0, 0, 255];

		const truckScreenY = bgScreenY + 68 / height;
		const truckText = !!licenses.truck ? `CLASS C` : "CLASS C: X";
		const truckColor = !!licenses.truck ? [0, 100, 0, 255] : [150, 0, 0, 255];

		const text2ScrenX = bgScreenX + 106 / width;

		const busText = !!licenses.bus ? "CLASS D" : "CLASS D: X";
		const busColor = !!licenses.bus ? [0, 100, 0, 255] : [150, 0, 0, 255];

		const agriText = !!licenses.agriculturalVehicle ? "CLASS G" : "CLASS G: X";
		const agriColor = !!licenses.agriculturalVehicle ? [0, 100, 0, 255] : [150, 0, 0, 255];

		this.currentTick = setTick(() => {
			DrawSprite("documents", "driving", bgScreenX, bgScreenY, bgScreenWidth, bgScreenHeight, 0, 255, 255, 255, 255);
			DrawRect(headScreenX, headScreenY, headScreenWidth, headScreenHeight, 220, 220, 220, 255);
			DrawSprite(headTexture, headTexture, headScreenX, headScreenY, headScreenWidth, headScreenHeight, 0.0, 255, 255, 255, 255);
			DrawText2(name, textScrenX, textScrenY, textScale, 0, [0, 0, 0, 255], false, 2);
			DrawText2(vehicleText, textScrenX, vehicleScreenY, vehicleTextScale, 0, vehicleColor, false, 2);
			DrawText2(cycleText, textScrenX, cycleScreenY, vehicleTextScale, 0, cycleColor, false, 2);
			DrawText2(truckText, textScrenX, truckScreenY, vehicleTextScale, 0, truckColor, false, 2);
			DrawText2(busText, text2ScrenX, vehicleScreenY, vehicleTextScale, 0, busColor, false, 2);
			DrawText2(agriText, text2ScrenX, cycleScreenY, vehicleTextScale, 0, agriColor, false, 2);
		});

		this.StopDrawing();
	}

	private static async showPolice(name: string, ped: number) {
		await this.InitDrawing();

		const [width, height] = GetScreenActiveResolution();

		const [bgWidth, bgHeight] = GetTextureResolution("documents", "lspd");
		const bgScreenWidth = bgWidth / width;
		const bgScreenHeight = bgHeight / height;
		const bgScreenX = 0.5;
		const bgScreenY = 1 - 0.015 - bgScreenHeight / 2;

		this.shot = await PedUtils.GetPedHeadshotAsync(ped);

		const headTexture = GetPedheadshotTxdString(this.shot);
		const headScreenWidth = 150 / width;
		const headScreenHeight = 166 / height;
		const headScreenX = bgScreenX + 38 / width;
		const headScreenY = bgScreenY - 132 / height;

		const textScrenX = bgScreenX - 34 / width;
		const textScrenY = bgScreenY - 280 / height;
		const textScale = (0.265 * 2160) / height;

		this.currentTick = setTick(() => {
			DrawSprite("documents", "lspd", bgScreenX, bgScreenY, bgScreenWidth, bgScreenHeight, 0, 255, 255, 255, 255);
			DrawRect(headScreenX, headScreenY, headScreenWidth, headScreenHeight, 220, 220, 220, 255);
			DrawSprite(headTexture, headTexture, headScreenX, headScreenY, headScreenWidth, headScreenHeight, 0.0, 255, 255, 255, 255);
			DrawText2(name, textScrenX, textScrenY, textScale, 0, [0, 0, 0, 255], false, 2);
		});

		this.StopDrawing();
	}

	private static async showCertificat(name: string, doctorName: string) {
		await this.InitDrawing();

		const [width, height] = GetScreenActiveResolution();

		const [bgWidth, bgHeight] = GetTextureResolution("documents", "certificat");
		const bgScreenWidth = bgWidth / width;
		const bgScreenHeight = bgHeight / height;
		const bgScreenX = 0.5;
		const bgScreenY = 1 - 0.015 - bgScreenHeight / 2;

		const textScale = (0.22 * 2160) / height;

		const nameScreenX = bgScreenX - 36 / width;
		const nameScreenY = bgScreenY - 60 / height;

		const drNameScreenX = bgScreenX - 120 / width;
		const drNameScreenY = bgScreenY - 136 / height;

		this.currentTick = setTick(() => {
			DrawSprite("documents", "certificat", bgScreenX, bgScreenY, bgScreenWidth, bgScreenHeight, 0, 255, 255, 255, 255);
			DrawText2(doctorName, drNameScreenX, drNameScreenY, textScale, 0, [0, 0, 0, 255], false, 2);
			DrawText2(name, nameScreenX, nameScreenY, textScale, 0, [0, 0, 0, 255], false, 2);
		});

		this.StopDrawing();
	}

	public static async ShowIdCard(name: string, ped: number, document: "idcard" | "hunting" | "firearms" | "hospital") {
		await this.InitDrawing();

		const [width, height] = GetScreenActiveResolution();

		const [bgWidth, bgHeight] = GetTextureResolution("documents", document);
		const bgScreenWidth = bgWidth / width;
		const bgScreenHeight = bgHeight / height;
		const bgScreenX = 0.5;
		const bgScreenY = 1 - 0.015 - bgScreenHeight / 2;

		this.shot = await PedUtils.GetPedHeadshotAsync(ped);

		const headTexture = GetPedheadshotTxdString(this.shot);
		const headScreenWidth = 150 / width;
		const headScreenHeight = 166 / height;
		const headScreenX = bgScreenX - 180 / width;
		const headScreenY = bgScreenY + 25.5 / height;

		const textScrenX = bgScreenX - 88 / width;
		const textScrenY = bgScreenY - 64 / height;
		const textScale = (0.265 * 2160) / height;

		this.currentTick = setTick(() => {
			DrawSprite("documents", document, bgScreenX, bgScreenY, bgScreenWidth, bgScreenHeight, 0, 255, 255, 255, 255);
			DrawRect(headScreenX, headScreenY, headScreenWidth, headScreenHeight, 220, 220, 220, 255);
			DrawSprite(headTexture, headTexture, headScreenX, headScreenY, headScreenWidth, headScreenHeight, 0.0, 255, 255, 255, 255);
			DrawText2(name, textScrenX, textScrenY, textScale, 0, [0, 0, 0, 255], false, 2);
		});

		this.StopDrawing();
	}

	private static clearDrawing() {
		if (!!this.currentTick) {
			clearTick(this.currentTick);
			this.currentTick = 0;
		}

		if (!!this.currentTimeout) {
			clearTimeout(this.currentTimeout);
			this.currentTimeout = undefined;
		}

		if (!!this.shot) {
			UnregisterPedheadshot(this.shot);
			this.shot = 0;
		}
	}

	private static async InitDrawing() {
		this.clearDrawing();
		await Streaming.RequestTextureDictionnaryAsync("documents");
	}

	private static StopDrawing() {
		this.currentTimeout = setTimeout(() => {
			this.clearDrawing();
			SetStreamedTextureDictAsNoLongerNeeded("documents");
		}, 5000);
	}
}
