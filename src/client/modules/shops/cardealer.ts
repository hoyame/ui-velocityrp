import { CardealerData } from "../../../shared/data/cardealer";
import { Delay } from "../../../shared/utils/utils";
import { Nui } from "../../core/nui";
import { hexToRgb, TriggerServerCallbackAsync } from "../../core/utils";
import Vehicle from "../../core/vehicle";

export abstract class Cardealer {
	private static data: any;
	private static cam: any;
	private static lastVeh: any;
	public static shop: any;
	private static oldPos: any;

	public static async initialize() {
		await this.grabData();

		Nui.RegisterCallback("spawnCar", (data: any) => this.spawnCar(data));
		Nui.RegisterCallback("setColor", (data: any) => this.setColor(data));
		Nui.RegisterCallback("buyVehicle", (data: any) => this.buyVehicle(data));
		Nui.RegisterCallback("grabData", () => this.grabDataNUI());
		Nui.RegisterCallback("backstoreveh", () => this.close());
		
		Nui.RegisterCallback("leave", () => this.disableCam());

		onNet("hoyame:cardealer:close", () => {
			this.disableCam();
		});

		// on("hoyame:cardealer:open", (shop: string) => {
		// 	this.open(shop);
		// 	this.enableCam(shop);
		// });
	}

	public static async tp() {
		// this.oldPos = GetEntityCoords(PlayerPedId(), false);
		// SetEntityVisible(GetPlayerPed(-1), false, false);
		// SetEntityCoords(GetPlayerPed(-1), -56.628, 65.145, 71.949, false, false, false, false);
	}

	public static returnTp() {
		// if (!this.oldPos) return;
		// SetEntityCoords(GetPlayerPed(-1), this.oldPos[0], this.oldPos[1], this.oldPos[2], false, false, false, false);
		// SetEntityVisible(GetPlayerPed(-1), true, true);
		// this.oldPos = null;
	}

	public static async open(shop: string) {
		Nui.SendMessage({ path: "cardealer" });
		Nui.SendMessage({ type: "cardealer", data: this.data, shop: shop });
		this.shop = shop;

		DisplayRadar(false);
		Nui.SetFocus(true, true, false);
	}

	public static close() {
		Nui.SendMessage({ path: "" });
		DisplayRadar(true);
		Nui.SetFocus(false, false, false);
		this.shop = null;

		if (this.oldPos) this.returnTp();
	}

	private static async grabData() {
		const data = CardealerData;
		this.data = data;
	}

	private static async grabDataNUI() {
		const data = CardealerData;
		Nui.SendMessage({ type: "cardealer", data: this.data, shop: this.shop });
		this.data = data;
	}

	public static enableCam(shop: string) {
		// if (shop == "carshop") {
		// 	this.cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", false);
		// 	SetCamActive(this.cam, true);
		// 	SetCamCoord(this.cam, -70.76378, 72.53444, 71.6688);
		// 	SetCamFov(this.cam, 50.0);
		// 	PointCamAtCoord(this.cam, -75.09708, 74.8302, 71.91198);
		// 	RenderScriptCams(true, true, 1500, true, true);
		// 	FreezeEntityPosition(PlayerPedId(), true);
		// 	SetEntityVisible(PlayerPedId(), false, false);

		// 	this.spawnCar(["asbo"]);
		// } else if (shop == "planeshop") {
		// 	this.cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", false);
		// 	SetCamActive(this.cam, true);
		// 	SetCamCoord(this.cam, -967.869, -2975.583, 13.945);
		// 	SetCamFov(this.cam, 50.0);
		// 	PointCamAtCoord(this.cam, -962.527, -2965.897, 13.945);
		// 	RenderScriptCams(true, true, 1500, true, true);
		// 	FreezeEntityPosition(PlayerPedId(), true);
		// 	SetEntityVisible(PlayerPedId(), false, false);

		// 	this.spawnCar(["frogger"]);
		// } else if (shop == "boatshop") {
		// 	this.cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", false);
		// 	SetCamActive(this.cam, true);
		// 	SetCamCoord(this.cam, 568.757, -3136.3957, 2.951);
		// 	SetCamFov(this.cam, 35.0);
		// 	PointCamAtCoord(this.cam, 568.658, -3164.614, 2.951);
		// 	RenderScriptCams(true, true, 1500, true, true);
		// 	FreezeEntityPosition(PlayerPedId(), true);
		// 	SetEntityVisible(PlayerPedId(), false, false);

		// 	this.spawnCar(["seashark"]);
		// } else if (shop == "storeshop") {
		// 	this.cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", false);
		// 	SetCamActive(this.cam, true);
		// 	SetCamCoord(this.cam, -70.76378, 72.53444, 71.6688);
		// 	SetCamFov(this.cam, 50.0);
		// 	PointCamAtCoord(this.cam, -75.09708, 74.8302, 71.91198);
		// 	RenderScriptCams(true, true, 1500, true, true);
		// 	FreezeEntityPosition(PlayerPedId(), true);
		// 	SetEntityVisible(PlayerPedId(), false, false);

		// 	this.spawnCar(["tmaxDX"]);
		// }
	}

	public static disableCam() {
		// if (this.lastVeh) DeleteVehicle(this.lastVeh);

		// RenderScriptCams(false, true, 1500, true, true);
		// DestroyCam(this.cam, true);
		// FreezeEntityPosition(PlayerPedId(), false);
		// SetEntityVisible(PlayerPedId(), true, true);
		// Nui.SendMessage({ path: "" });
		// Nui.SetFocus(false, false, false);
		// DisplayRadar(true);
		// this.shop = null;
	}

	private static s = "";

	private static async spawnCar(vehicle: any) {
		if (this.s == vehicle[0]) return;
		this.s = vehicle[0];
		if (this.lastVeh) DeleteVehicle(this.lastVeh);
		this.shop == "carshop" &&
			(this.lastVeh = await Vehicle.spawnVehicle(vehicle[0], null, [-75.09708, 74.8302, 71.91198, 200.56], false, false, true));
		this.shop == "storeshop" &&
			(this.lastVeh = await Vehicle.spawnVehicle(vehicle[0], null, [-75.09708, 74.8302, 71.91198, 200.56], false, false, true));
		this.shop == "planeshop" &&
			(this.lastVeh = await Vehicle.spawnVehicle(vehicle[0], null, [-962.527, -2965.897, 13.945, 205.77], false, false, true));
		this.shop == "boatshop" &&
			(this.lastVeh = await Vehicle.spawnVehicle(vehicle[0], null, [568.658, -3164.614, 2.951, 285.77], false, false, true));
	}

	private static async setColor(c: any) {
		const color: any = hexToRgb(c);

		if (this.lastVeh) {
			SetVehicleCustomPrimaryColour(this.lastVeh, color.r, color.g, color.b);
		}
	}

	private static async buyVehicle(vehicle: any) {
		emitNet("esx_vehicleshop:buyVehicle", vehicle[0], vehicle.type);
	}
}
