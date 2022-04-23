import { Vector3 } from "@wdesgardin/fivem-js";
import { Vec3 } from "@wdesgardin/fivem-js/lib/utils/Vector3";

export abstract class Utils {
	public static draw3dText(coords: [number, number, number], text: string) {
		const cfg = {
			color: { r: 230, g: 230, b: 230, a: 255 },
			font: 0,
			time: 5000,
			scale: 0.5,
			dist: 250,
		};

		const camCoords = GetGameplayCamCoord();
		const cd = new Vector3(camCoords[0], camCoords[1], camCoords[2]);
		const fh = new Vector3(coords[0], coords[1], coords[2]);

		const dist = cd.distance(fh);
		const scale = 200 / (GetGameplayCamFov() * dist);

		SetTextColour(cfg.color.r, cfg.color.g, cfg.color.b, cfg.color.a);
		SetTextScale(0.0, cfg.scale * scale);
		SetTextFont(cfg.font);
		SetTextDropshadow(0, 0, 0, 0, 55);
		SetTextDropShadow();
		SetTextCentre(true);
		BeginTextCommandDisplayText("STRING");
		AddTextComponentSubstringPlayerName(text);
		SetDrawOrigin(coords[0], coords[1], coords[2], 0);
		EndTextCommandDisplayText(0.0, 0.0);
		ClearDrawOrigin();
	}

	public static displayAbovePedText(ped: number, text: string) {
		const cfg = {
			color: { r: 230, g: 230, b: 230, a: 255 },
			font: 0,
			time: 5000,
			scale: 0.5,
			dist: 250,
		};

		const playerPed = PlayerPedId();
		const [x, y, z] = GetEntityCoords(playerPed, false);
		const playerPos = new Vector3(x, y, z);

		const [a, b, c] = GetEntityCoords(ped, false);
		const targetPos = new Vector3(a, b, c);

		const dist = playerPos.distance(targetPos);
		const los = HasEntityClearLosToEntity(playerPed, ped, 17);

		let peds: any[] = [];

		if (dist <= cfg.dist && los) {
			const exists = peds[ped] != null;

			peds[ped] = {
				time: GetGameTimer() + cfg.time,
				text: text,
			};

			if (!exists) {
				const interval = setInterval(() => {
					const pos = GetOffsetFromEntityInWorldCoords(ped, 0.0, 0.0, 1.0);
					this.draw3dText([pos[0], pos[1], pos[2]], peds[ped].text);

					if (GetGameTimer() > peds[ped].time) {
						clearInterval(interval);
						peds[ped] = null;
					}
				}, 1);
			}
		}
	}

	public static onShareDisplay(text: string, target: number) {
		const player = GetPlayerFromServerId(target);

		if (player != -1 || target == GetPlayerServerId(PlayerId())) {
			const ped = GetPlayerPed(player);
			this.displayAbovePedText(ped, text);
		}
	}

	public static DrawText2(content: string, x: number, y: number, scale: number, font: number, color: any, intAlign: any, wrap: number) {
		SetTextFont(font);
		SetTextScale(scale, scale);

		if (intAlign) {
			SetTextCentre(true);
		} else {
			SetTextJustification(intAlign || 1);
			if (intAlign == 2) {
				SetTextWrap(0.0, wrap || x);
			}
		}

		SetTextEntry("STRING");
		SetTextColour(color[0], color[1], color[2], color[3]);
		AddTextComponentString(content);
		DrawText(x, y);
	}

	public static random(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	public static SpawnObject(name: string) {
		const [x, y, z] = GetEntityCoords(PlayerPedId(), true);
		const heading = GetEntityHeading(PlayerPedId());

		RequestModel(name);

		const obj = CreateObject(GetHashKey(name), x, y, z - 1.9, true, true, true);
		PlaceObjectOnGroundProperly(obj);
		SetEntityHeading(obj, heading);
		FreezeEntityPosition(obj, true);
	}

	public static CheckWeapon(ped: number) {
		const weapons = [
			"WEAPON_PISTOL",
			"WEAPON_COMBATPISTOL",
			"WEAPON_APPISTOL",
			"WEAPON_PISTOL50",
			"WEAPON_SNSPISTOL",
			"WEAPON_HEAVYPISTOL",
			"WEAPON_VINTAGEPISTOL",
			"WEAPON_MARKSMANPISTOL",
			"WEAPON_MACHINEPISTOL",
			"WEAPON_VINTAGEPISTOL",
			"WEAPON_PISTOL_MK2",
			"WEAPON_SNSPISTOL_MK2",
			"WEAPON_FLAREGUN",
			"WEAPON_STUNGUN",
			"WEAPON_REVOLVER",
		];

		if (IsEntityDead(ped)) {
			return false;
		} else {
			let s = false;
			weapons.map((v, k) => {
				if (GetHashKey(v) == GetSelectedPedWeapon(PlayerPedId())) {
					s = true;
				}
			});
			return s;
		}
	}

	public static GenerateUUID() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
			const r = (Math.random() * 16) | 0,
				v = c == "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	public static RenderSprite(
		TextureDictionary: string,
		TextureName: string,
		X: number,
		Y: number,
		Width: number,
		Height: number,
		Heading: number,
		R: number,
		G: number,
		B: number,
		A: number
	) {
		X: X || 0 / 1920;
		Y: Y || 0 / 1080;
		Width: Width || 0 / 1920;
		Height: Height || 0 / 1080;

		if (!HasStreamedTextureDictLoaded(TextureDictionary)) {
			RequestStreamedTextureDict(TextureDictionary, true);
		}

		DrawSprite(TextureDictionary, TextureName, X + Width * 0.5, Y + Height * 0.5, Width, Height, Heading || 0, R, G, B, A);
	}

	public static DisableControlForDuration(control: number, ms: number) {
		return new Promise(() => {
			const handle = setTick(() => {
				DisableControlAction(0, control, true);
			});
			setTimeout(() => {
				clearTick(handle);
			}, ms);
		});
	}

	public static Round(x: number, decimalPlaces: number) {
		return Number(Math.round(Number(x + "e" + decimalPlaces)) + "e-" + decimalPlaces);
	}

	//https://web.archive.org/web/20161108113341/https://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	public static IsPointInPolygon(point: Vec3, polygon: { x: number; y: number }[]) {
		let i;
		let j;
		let result = false;
		for (i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
			if (
				polygon[i].y > point.y != polygon[j].y > point.y &&
				point.x < ((polygon[j].x - polygon[i].x) * (point.y - polygon[i].y)) / (polygon[j].y - polygon[i].y) + polygon[i].x
			) {
				result = !result;
			}
		}
		return result;
	}
}
