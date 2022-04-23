import { Streaming } from "../utils/streaming";
import BlipsConfig from "../../shared/config/world/blips.json";
import { Vector3 } from "@wdesgardin/fivem-js";
import { Blip } from "../core/blips";
import { BlipColor, BlipSprite } from "../core/enums/blips";
import { Vec3 } from "@wdesgardin/fivem-js/lib/utils/Vector3";
import { Delay } from "../../shared/utils/utils";

export interface IBlipInfos {
	header: {
		texture: string;
		textureDictionnary: string;
	};
	details: {
		title: string;
		details?: string;
		separatorBefore?: boolean;
	}[];
}

export interface IBlip {
	name: string;
	coords: Vec3;
	sprite: BlipSprite;
	color: any;
	infos?: IBlipInfos;
	scale?: number;
}

export abstract class BlipsController {
	private static currentBlip?: Blip;
	private static entry = 0;
	private static infosIndex = 0;
	private static blipInfos: { [handle: number]: IBlipInfos } = {};
	private static blipNames: { [handle: number]: string } = {};

	public static async initialize() {
		this.CreateBlipsFromConfig();

		setTick(async () => {
			if (!IsFrontendReadyForControl()) {
				await Delay(500);
				return;
			}

			if (!IsHoveringOverMissionCreatorBlip()) {
				if (!!this.currentBlip) {
					this.SetColumnState(1, false);
					this.currentBlip = undefined;
				}
				return;
			}

			const blip = new Blip(DisableBlipNameForVar());
			if (blip.Handle == this.currentBlip?.Handle || !blip.exists()) return;

			this.currentBlip = blip;

			const infos = this.blipInfos[blip.Handle];
			if (!infos) {
				this.SetColumnState(1, false);
				return;
			}

			TakeControlOfFrontend();
			this.ClearDisplay();

			await this.SetHeader(this.blipNames[blip.Handle] || "", infos.header.textureDictionnary, infos.header.texture);

			for (const detail of infos.details) {
				//@ts-ignore
				if (!!detail.separatorBefore) this.AddInfo("", "", 4);
				this.AddInfo(detail.title, detail.details, !!detail.details ? 1 : 5);
			}

			this.SetColumnState(1, true);
			this.UpdateDisplay();

			ReleaseControlOfFrontend();
		});
	}

	private static CreateBlipsFromConfig() {
		for (const blipConfig of BlipsConfig.blips) {
			this.CreateBlip(blipConfig);
		}
	}

	public static CreateBlip(blip: IBlip) {
		const newBlip = Blip.create(Vector3.create(blip.coords));

		newBlip.Sprite = blip.sprite;
		newBlip.Color = blip.color;
		newBlip.Name = blip.name;
		newBlip.IsShortRange = true;

		if (blip.scale) {
			newBlip.Scale = blip.scale;
		} else {
			newBlip.Scale = 0.7;
		}

		if (!!blip.infos) {
			newBlip.IsMissionCreatorBlip = true;
			this.blipInfos[newBlip.Handle] = blip.infos;
			this.blipNames[newBlip.Handle] = blip.name;
		}
	}

	private static ClearDisplay() {
		this.infosIndex = 0;

		if (PushScaleformMovieFunctionN("SET_DATA_SLOT_EMPTY")) {
			PushScaleformMovieFunctionParameterInt(1);
		}
		PopScaleformMovieFunctionVoid();
	}

	private static async SetHeader(title: string, textureDict: string = "", texture: string = "") {
		if (PushScaleformMovieFunctionN("SET_COLUMN_TITLE")) {
			PushScaleformMovieFunctionParameterInt(1);

			this.ScaleFormText("");
			this.ScaleFormText(title);

			PushScaleformMovieFunctionParameterInt(0);
			if (!!textureDict) await Streaming.RequestTextureDictionnaryAsync(textureDict);
			PushScaleformMovieFunctionParameterString(textureDict);
			PushScaleformMovieFunctionParameterString(texture);
			PushScaleformMovieFunctionParameterInt(0);
			PushScaleformMovieFunctionParameterInt(0);
			PushScaleformMovieFunctionParameterBool(false);
			PushScaleformMovieFunctionParameterBool(false);
			PopScaleformMovieFunctionVoid();
		}
	}

	private static AddInfo(title: string, details: string = "", textType: number) {
		if (PushScaleformMovieFunctionN("SET_DATA_SLOT")) {
			console.log("ADTT");
			PushScaleformMovieFunctionParameterInt(1);
			PushScaleformMovieFunctionParameterInt(this.infosIndex++);
			PushScaleformMovieFunctionParameterInt(65);
			PushScaleformMovieFunctionParameterInt(3);
			PushScaleformMovieFunctionParameterInt(textType);
			PushScaleformMovieFunctionParameterInt(0);
			PushScaleformMovieFunctionParameterInt(0);
			this.ScaleFormText(title);
			this.ScaleFormText(details);
			PopScaleformMovieFunctionVoid();
		}
	}

	private static ScaleFormText(text: string) {
		const entryKey = "ENTRY" + this.entry++;
		if (!!text) AddTextEntry(entryKey, text);
		BeginTextCommandScaleformString(entryKey);
		EndTextCommandScaleformString();
	}

	private static SetColumnState(column: number, state: boolean) {
		if (PushScaleformMovieFunctionN("SHOW_COLUMN")) {
			PushScaleformMovieMethodParameterInt(column);
			PushScaleformMovieMethodParameterBool(state);
			PopScaleformMovieFunctionVoid();
		}
	}

	private static UpdateDisplay() {
		if (PushScaleformMovieFunctionN("DISPLAY_DATA_SLOT")) {
			PushScaleformMovieFunctionParameterInt(1);
			PopScaleformMovieFunctionVoid();
		}
	}
}

/*
		{
			"name": "Exemple",
			"coords": { "x": 220, "y": -580, "z": 30 },
			"sprite": 72,
			"color": 1,
			"infos": {
				"header": {
					"texture": "thumbnail_fleeca_com",
					"textureDictionnary": "thumbnail_fleeca_com"
				},
				"details": [
					{ "title": "Catégorie", "details": "détails..." },
					{ "title": "Prix", "details": "3000 $" },
					{
						"title": "Une très très longue description, une très très longue description, une très très longue description...",
						"separatorBefore": true
					}
				]
			}
		},
		{
			"name": "Exemple2",
			"coords": { "x": 210, "y": -500, "z": 30 },
			"sprite": 374,
			"color": 20,
			"infos": {
				"header": {
					"texture": "ttshot6",
					"textureDictionnary": "pm_tt_6"
				},
				"details": [
					{ "title": "Catégorie", "details": "détails..." },
					{ "title": "Prix", "details": "3000 $" },
					{ "title": "Prix", "details": "3000 $", "separatorBefore": true },
					{ "title": "Prix", "details": "3000 $" },
					{ "title": "Prix", "details": "3000 $" },
					{
						"title": "Une très très longue description, une très très longue description, une très très longue description...",
						"separatorBefore": true
					}
				]
			}
		},
*/
