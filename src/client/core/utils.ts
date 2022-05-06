export function CheckTbl(tbl: any, value: any) {
	let status = false;

	tbl.forEach((v: any) => {
		if (value == v) {
			status = true;
		}
	});

	return status;
}

import { Game, Player, Vector3 } from "@wdesgardin/fivem-js";
import { Environnment } from "../../shared/utils/environnment";
import { Delay } from "../../shared/utils/utils";

export function DrawAdvancedText(
	x: number,
	y: number,
	w: number,
	h: number,
	sc: number,
	text: string,
	r: number,
	g: number,
	b: number,
	a: number,
	font: number,
	jus: number
) {
	SetTextFont(font);
	SetTextProportional(false);
	SetTextScale(sc, sc);
	N_0x4e096588b13ffeca(jus);
	SetTextColour(r, g, b, a);
	SetTextDropShadow();
	SetTextEdge(1, 0, 0, 0, 255);
	SetTextDropShadow();
	SetTextOutline();
	SetTextEntry("STRING");
	AddTextComponentString(text);
	DrawText(x - 0.1 + w, y - 0.02 + h);
}

export function Draw2DText(text: string, x: number, y: number) {
	SetTextFont(4);
	SetTextScale(0.45, 0.45);
	SetTextColour(255, 255, 255, 255);
	SetTextDropshadow(0, 0, 0, 0, 255);
	SetTextDropShadow();
	SetTextOutline();
	BeginTextCommandDisplayText("STRING");
	AddTextComponentSubstringPlayerName(text);
	EndTextCommandDisplayText(x, y);
}

export function GetClosestPlayer() {
	let pPed = PlayerPedId();
	let players = GetActivePlayers();
	let [xC, yC, zC] = GetEntityCoords(pPed, false);
	let pCloset: number = -1;
	let pClosetPos: [number, number, number];
	let pClosetDst: number = 0;

	players.forEach((v: number) => {
		if (GetPlayerPed(v) !== pPed) {
			let oPed = GetPlayerPed(v);
			let [x, y, z] = GetEntityCoords(oPed, false);
			let dst = GetDistanceBetweenCoords(x, y, z, xC, yC, zC, true);

			if (dst < 5) {
				if (pCloset == -1) {
					pCloset = GetPlayerServerId(v);
					pClosetPos = [x, y, z];
					pClosetDst = dst;
				} else {
					if (dst < pClosetDst) {
						pCloset = GetPlayerServerId(v);
						pClosetPos = [x, y, z];
						pClosetDst = dst;
					}
				}
			}
		}
	});

	return [pCloset, pClosetDst];
}

export function GetNearbyPlayers(distance = 5) {
	const players = GetActivePlayers() as number[];
	return players
		.map(p => new Player(p))
		.filter(p => p.Handle != Game.Player.Handle && Game.PlayerPed.Position.distance(p.Character.Position) <= distance);
}

export const getVehicleInDirection = (coordsFrom: number[], coordsTo: number[]) => {
	const rayHandle = CastRayPointToPoint(
		coordsFrom[0],
		coordsFrom[1],
		coordsFrom[2],
		coordsTo[0],
		coordsTo[1],
		coordsTo[2],
		10,
		PlayerPedId(),
		0
	);
	const [a, b, c, d, vehicle] = GetRaycastResult(rayHandle);
	return vehicle;
};

export const RequestWaitModel = (model: string | number, timeout = 5000) => {
	const modelHash = typeof model === "string" ? GetHashKey(model) : model;

	return new Promise(r => {
		if (!IsModelInCdimage(modelHash)) {
			r(false);
		}

		if (HasModelLoaded(modelHash) === true) {
			r(true);
		}

		RequestModel(modelHash);
		const t = GetGameTimer();

		const interval = setInterval(() => {
			const hasModelLoaded = HasModelLoaded(modelHash) == true;

			if (hasModelLoaded || GetGameTimer() - t > timeout) {
				clearInterval(interval);
				r(hasModelLoaded);
			}
		}, 200);
	});
};

export const LoadScaleform = (scaleform: string) => {
	let text = RequestScaleformMovie(scaleform);

	if (text != 0) {
		const t = GetGameTimer();

		const interval = setInterval(() => {
			const hasModelLoaded = HasScaleformMovieLoaded(text) === true;

			if (hasModelLoaded || GetGameTimer() - t > 500) {
				clearInterval(interval);
			}
		}, 500);
	}
};

export const CreateNamedRenderTargetForModel = (name: string, model: string | number) => {
	let text = 0;

	if (!IsNamedRendertargetRegistered(name)) {
		RegisterNamedRendertarget(name, false);
	}

	if (!IsNamedRendertargetLinked(model)) {
		LinkNamedRendertarget(model);
	}

	if (IsNamedRendertargetRegistered(name)) {
		text = GetNamedRendertargetRenderId(name);
	}

	return text;
};

export async function KeyboardInput(title: string, limit: number = 100, defaultValue: string = ""): Promise<string> {
	return new Promise(async resolve => {
		AddTextEntry("NET_STABLE_RENAME_MOUNT_PROMPT", title); // not yet
		AddTextEntry("NET_STABLE_RENAME_MOUNT_DESC", "Entrez un texte"); // not yet
		DisplayOnscreenKeyboard(0, "NET_STABLE_RENAME_MOUNT_PROMPT", "NET_STABLE_RENAME_MOUNT_DESC", defaultValue, "", "", "", limit);

		while (UpdateOnscreenKeyboard() === 0) {
			await Delay(300);
			if (UpdateOnscreenKeyboard() >= 1) {
				resolve(GetOnscreenKeyboardResult());
			}
		}
	});
}

export const CreateBlip = (name: string, pos: number[], sprite: number, display: number, scale: number, color: number) => {
	let blip = AddBlipForCoord(pos[0], pos[1], pos[2]);
	SetBlipSprite(blip, sprite);
	SetBlipDisplay(blip, display);
	SetBlipScale(blip, scale);
	SetBlipColour(blip, color);
	SetBlipAsShortRange(blip, true);
	BeginTextCommandSetBlipName("STRING");
	AddTextComponentString(name);
	EndTextCommandSetBlipName(blip);
};

export const Distance3d = (coords: number, coords2: number) => {
	return coords - coords2;
};

export function LoadingPrompt(loadingText: string | null, spinnerType: any) {
	if (IsLoadingPromptBeingDisplayed()) {
		RemoveLoadingPrompt();
	}

	if (loadingText == null) {
		BeginTextCommandBusyString("");
	} else {
		BeginTextCommandBusyString("STRING");
		AddTextComponentSubstringPlayerName(loadingText);
	}

	EndTextCommandBusyString(spinnerType || 3);
}

export const getCamDirection = () => {
	const heading = GetGameplayCamRelativeHeading() + GetEntityPhysicsHeading(PlayerPedId());
	const pitch = GetGameplayCamRelativePitch();
	let coords = new Vector3(
		-Math.sin((heading * Math.PI) / 180.0),
		Math.cos((heading * Math.PI) / 180.0),
		Math.sin((pitch * Math.PI) / 180.0)
	);
	const len = Math.sqrt(coords.x * coords.x + coords.y * coords.y + coords.z * coords.z);

	if (len != 0) {
		coords = Vector3.create(coords.divide(len));
	}

	return coords;
};

////

let ServerCallbacks: any[] = [];
let CurrentRequestId = 0;

export const TriggerServerCallback = (name: string, cb: any, a?: any) => {
	ServerCallbacks[CurrentRequestId] = cb;
	emitNet("trigger_server_callback", name, CurrentRequestId, a);
	if (CurrentRequestId < 65535) {
		CurrentRequestId = CurrentRequestId + 1;
	} else {
		CurrentRequestId = 0;
	}
};

export const TriggerServerCallbackAsync = (name: string, args?: any) => {
	if (Environnment.IsDev) console.log(`DEV: callback ${name} triggered`);
	return new Promise<any>(res => TriggerServerCallback(name, res, args));
};

onNet("server_callback", (requestId: any, a?: any) => {
	if (ServerCallbacks[requestId]) {
		ServerCallbacks[requestId](a);
	}
	ServerCallbacks[requestId] = null;
});

let clientCallbacks: any[] = [];

onNet("trigger_client_callback", (name: string, requestId: number, a?: any) => {
	console.log("hello");
	const _source = (global as any).source;
	TriggerClientCallback(
		name,
		requestId,
		_source,
		(a: string) => {
			emitNet("client_callback", requestId, a);
		},
		a
	);
});

export const RegisterClientCallback = (name: typeof cb, cb: any) => {
	clientCallbacks[name] = cb;
};

function TriggerClientCallback(name: typeof cb, requestId: any, source: number, cb: any, a?: any) {
	if (clientCallbacks[name] != null) {
		clientCallbacks[name](cb, a);
	}
}
export const DrawText2 = (content: string, x: number, y: number, scale: number, font: number, color: any, intAlign: any, wrap: number) => {
	SetTextFont(font);
	SetTextScale(scale, scale);

	if (intAlign === true) {
		SetTextCentre(true);
	} else {
		SetTextJustification(Number(intAlign) || 1);
		if (intAlign == 2) {
			SetTextWrap(0.0, wrap || x);
		}
	}

	SetTextEntry("STRING");
	SetTextColour(color[0], color[1], color[2], color[3]);
	AddTextComponentString(content);
	DrawText(x, y);
};

export const RenderSprite = (
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
) => {
	var [Xe, Ye] = GetScreenResolution();
	X: X || 0 / Xe;
	Y: Y || 0 / Ye;
	Width: Width || 0 / Xe;
	Height: Height || 0 / Ye;
	if (!HasStreamedTextureDictLoaded(TextureDictionary)) {
		RequestStreamedTextureDict(TextureDictionary, true);
	}
	DrawSprite(TextureDictionary, TextureName, X + Width * 0.5, Y + Height * 0.5, Width, Height, Heading || 0, R, G, B, A);
};

export const DrawRectg = (x: any, y: any, w: any, h: any, color: any) => {
	DrawRect(x + w / 2, y + h / 2, w, h, color[0], color[1], color[2], color[3]);
};

export const calc = (n: any) => {
	return 100 / n;
};

export const GetTextWidth = (txt: string, font: number, scale: number) => {
	BeginTextCommandGetWidth("CELL_EMAIL_BCON");
	SetTextFont(font);
	SetTextScale(scale, scale);
	AddTextComponentSubstringPlayerName(txt);
	let width = EndTextCommandGetWidth(true);
	return width;
};

function clamp(min: any, max: any) {
	return Math.min(Math.max(0, min), max);
}

function StringToArray(str: string) {
	let charcount = str.length;
	let strCount = Math.ceil(charcount / 99);
	let strings = [];

	for (let i = 1; strCount; i++) {
		let start = (i - 1) * 99 + 1;
		let clamp2 = clamp(str.substring(start), 99);
		let finish = ((i != 1 && start - 1) || 0) + clamp2;

		strings[i] = str.substring(start, finish);
	}

	return strings;
}

function AddText(str: string) {
	let charCount = str.length;
	if (charCount < 100) {
		AddTextComponentSubstringPlayerName(str);
	} else {
		let strings = StringToArray(str);
		for (let s = 1; strings.length; s++) {
			AddTextComponentSubstringPlayerName(strings[s]);
		}
	}
}

export const breakString = (str: string, limit: number) => {
	let brokenString = "";
	for (let i = 0, count = 0; i < str.length; i++) {
		if (count >= limit && str[i] === " ") {
			count = 0;
			brokenString += "\n";
		} else {
			count++;
			brokenString += str[i];
		}
	}
	return brokenString;
};

export const GetLineCount = (Text: string, X: number, Y: number) => {
	var [Xe, Ye] = GetScreenResolution();
	var x = X / Xe;
	var y = Y / Ye;
	BeginTextCommandLineCount("CELL_EMAIL_BCON");
	AddText(Text);
	return GetTextScreenLineCount(x, y);
};


export function hexToRgb(hex: string) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
	  r: parseInt(result[1], 16),
	  g: parseInt(result[2], 16),
	  b: parseInt(result[3], 16)
	} : null;
}