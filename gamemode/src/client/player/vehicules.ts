import { IVehiculesCustom } from "../../shared/types/vehicules";
import { RequestWaitModel, TriggerServerCallbackAsync } from "../core/utils";

let LocalVehicles: any = [];

export class Vehicules {
	public static async initialize() {
		console.log("[GM][Framework] | [Module] - Vehicules Initialized");

		onNet("gm:vehicles:spawn", this.spawnVehicle.bind(this));
		onNet("gm:vehicles:delete", () => {
			DeleteVehicle(GetVehiclePedIsIn(PlayerPedId(), false));
		});

		RegisterCommand("setControl1", () => this.setControl(-1), false);
		RegisterCommand("setControl2", () => this.setControl(0), false);
		RegisterCommand("setControl3", () => this.setControl(1), false);
		RegisterCommand("setControl4", () => this.setControl(2), false);

		RegisterKeyMapping("setControl1", "Place conducteur", "keyboard", "1");
		RegisterKeyMapping("setControl2", "Place passager avant", "keyboard", "2");
		RegisterKeyMapping("setControl3", "Place arriere gauche", "keyboard", "3");
		RegisterKeyMapping("setControl4", "Place arriere droite", "keyboard", "4");
	}

	public static setControl(seat: number) {
		if (IsPedSittingInAnyVehicle(PlayerPedId())) {
			const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);

			if (IsVehicleSeatFree(vehicle, seat)) {
				SetPedIntoVehicle(PlayerPedId(), vehicle, seat);
			}
		}
	}

	public static addVehicle(vehiculeName: string, vehiculePlate: string, custom?: IVehiculesCustom) {
		emitNet("gm:vehicle:add", vehiculeName, vehiculePlate, custom);
	}

	public static removeVehicle(vehiculePlate: string) {
		emitNet("gm:vehicle:remove", vehiculePlate);
	}

	public static useVehicule(vehiculePlate: string) {
		emitNet("gm:vehicle:use", vehiculePlate);
	}

	public static useFourriere(vehiculePlate: string) {
		emitNet("gm:vehicle:fourriere", vehiculePlate);
	}
	public static async rangeVehicule(customs: IVehiculesCustom, priv?: number) {
		emitNet("gm:vehicle:range", customs.plate, customs, priv);
	}

	public static async returnVehicles() {
		return await TriggerServerCallbackAsync("gm:vehicle:get");
	}

	public static async spawnVehicle(vehiculeName: string, custom?: IVehiculesCustom, pos?: any, enter?: boolean, isNetwork = true) {
		const [x, y, z, h] = pos || GetEntityCoords(PlayerPedId(), false);
		const vehicule = GetHashKey(vehiculeName);
		await RequestWaitModel(vehicule);
		const e = CreateVehicle(vehicule, x, y, z, h || GetEntityHeading(PlayerPedId()), isNetwork, false);

		if (!pos || enter) {
			SetPedIntoVehicle(PlayerPedId(), e, -1);
		}

		if (custom) {
			this.setCustoms(e, custom);
		}

		return e;
	}

	public static clearLocalVehicles() {
		LocalVehicles((v: number, k: any) => {
			DeleteVehicle(v);
		});
	}

	public static async spawnLocalVehicle(vehiculeName: string, custom?: IVehiculesCustom, pos?: any) {
		const [x, y, z, h] = pos || GetEntityCoords(PlayerPedId(), false);
		const vehicule = GetHashKey(vehiculeName);
		await RequestWaitModel(vehicule);
		const e = CreateVehicle(vehicule, x, y, z, h, false, false);
		LocalVehicles.push(e);

		if (!pos) TaskEnterVehicle(PlayerPedId(), e, 1000, -1, 1.0, 1, 0);

		if (custom) {
			this.setCustoms(e, custom);
		}

		return e;
	}

	public static setCustoms(vehicle: any, customs: Partial<IVehiculesCustom>) {
		const [colorPrimary, colorSecondary] = GetVehicleColours(vehicle);
		const [pearlescentColor, wheelColor] = GetVehicleExtraColours(vehicle);
		SetVehicleModKit(vehicle, 0);

		if (customs.plate) SetVehicleNumberPlateText(vehicle, customs.plate);
		if (customs.plateIndex) SetVehicleNumberPlateTextIndex(vehicle, customs.plateIndex);
		if (customs.bodyHealth) SetVehicleBodyHealth(vehicle, customs.bodyHealth + 0.0);
		if (customs.engineHealth) SetVehicleEngineHealth(vehicle, customs.engineHealth + 0.0);
		if (customs.fuelLevel) SetVehicleFuelLevel(vehicle, customs.fuelLevel + 0.0);
		if (customs.dirtLevel) SetVehicleDirtLevel(vehicle, customs.dirtLevel + 0.0);
		if (customs.pearlescentColor) SetVehicleExtraColours(vehicle, customs.pearlescentColor, wheelColor);
		if (customs.wheels) SetVehicleWheelType(vehicle, customs.wheels);
		if (customs.windowTint) SetVehicleWindowTint(vehicle, customs.windowTint);
		SetVehicleExtraColours(vehicle, customs.pearlescentColor ?? pearlescentColor, customs.wheelColor ?? wheelColor);
		SetVehicleColours(vehicle, customs.color1 ?? colorPrimary, customs.color2 ?? colorSecondary);

		if (!!customs.neonEnabled) {
			for (let i = 0; i < customs.neonEnabled.length; i++) {
				//@ts-ignore
				SetVehicleNeonLightEnabled(vehicle, i, customs.neonEnabled[i]);
			}
		}

		if (!!customs.extras) {
			for (let i = 0; i < customs.extras?.length; i++) {
				SetVehicleExtra(vehicle, i, customs.extras[i]);
			}
		}

		if (!!customs.neonColor) SetVehicleNeonLightsColour(vehicle, customs.neonColor[0], customs.neonColor[1], customs.neonColor[2]);
		if (!!customs.xenonColor) SetVehicleXenonLightsColour(vehicle, customs.xenonColor);
		if (customs.modSmokeEnabled) ToggleVehicleMod(vehicle, 20, true);
		if (!!customs.tyreSmokeColor)
			SetVehicleTyreSmokeColor(vehicle, customs.tyreSmokeColor[0], customs.tyreSmokeColor[1], customs.tyreSmokeColor[2]);
		if (customs.modSpoilers != undefined) SetVehicleMod(vehicle, 0, customs.modSpoilers, false);
		if (customs.modFrontBumper != undefined) SetVehicleMod(vehicle, 1, customs.modFrontBumper, false);
		if (customs.modRearBumper != undefined) SetVehicleMod(vehicle, 2, customs.modRearBumper, false);
		if (customs.modSideSkirt != undefined) SetVehicleMod(vehicle, 3, customs.modSideSkirt, false);
		if (customs.modExhaust != undefined) SetVehicleMod(vehicle, 4, customs.modExhaust, false);
		if (customs.modFrame != undefined) SetVehicleMod(vehicle, 5, customs.modFrame, false);
		if (customs.modGrille != undefined) SetVehicleMod(vehicle, 6, customs.modGrille, false);
		if (customs.modHood != undefined) SetVehicleMod(vehicle, 7, customs.modHood, false);
		if (customs.modFender != undefined) SetVehicleMod(vehicle, 8, customs.modFender, false);
		if (customs.modRightFender != undefined) SetVehicleMod(vehicle, 9, customs.modRightFender, false);
		if (customs.modRoof != undefined) SetVehicleMod(vehicle, 10, customs.modRoof, false);
		if (customs.modEngine != undefined) SetVehicleMod(vehicle, 11, customs.modEngine, false);
		if (customs.modBrakes != undefined) SetVehicleMod(vehicle, 12, customs.modBrakes, false);
		if (customs.modTransmission != undefined) SetVehicleMod(vehicle, 13, customs.modTransmission, false);
		if (customs.modHorns != undefined) SetVehicleMod(vehicle, 14, customs.modHorns, false);

		if (customs.modSuspension != undefined) SetVehicleMod(vehicle, 15, customs.modSuspension, false);
		if (customs.modArmor != undefined) SetVehicleMod(vehicle, 16, customs.modArmor, false);
		//@ts-ignore
		if (customs.modTurbo) ToggleVehicleMod(vehicle, 18, customs.modTurbo);
		//@ts-ignore
		if (customs.modXenon) ToggleVehicleMod(vehicle, 22, customs.modXenon);
		if (customs.modFrontWheels != undefined) SetVehicleMod(vehicle, 23, customs.modFrontWheels, false);
		if (customs.modBackWheels != undefined) SetVehicleMod(vehicle, 24, customs.modBackWheels, false);
		if (customs.modPlateHolder != undefined) SetVehicleMod(vehicle, 25, customs.modPlateHolder, false);
		if (customs.modVanityPlate != undefined) SetVehicleMod(vehicle, 26, customs.modVanityPlate, false);
		if (customs.modTrimA != undefined) SetVehicleMod(vehicle, 27, customs.modTrimA, false);
		if (customs.modOrnaments != undefined) SetVehicleMod(vehicle, 28, customs.modOrnaments, false);
		if (customs.modDashboard != undefined) SetVehicleMod(vehicle, 29, customs.modDashboard, false);
		if (customs.modDial != undefined) SetVehicleMod(vehicle, 30, customs.modDial, false);
		if (customs.modDoorSpeaker != undefined) SetVehicleMod(vehicle, 31, customs.modDoorSpeaker, false);
		if (customs.modSeats != undefined) SetVehicleMod(vehicle, 32, customs.modSeats, false);
		if (customs.modSteeringWheel != undefined) SetVehicleMod(vehicle, 33, customs.modSteeringWheel, false);
		if (customs.modShifterLeavers != undefined) SetVehicleMod(vehicle, 34, customs.modShifterLeavers, false);
		if (customs.modAPlate != undefined) SetVehicleMod(vehicle, 35, customs.modAPlate, false);
		if (customs.modSpeakers != undefined) SetVehicleMod(vehicle, 36, customs.modSpeakers, false);
		if (customs.modTrunk != undefined) SetVehicleMod(vehicle, 37, customs.modTrunk, false);
		if (customs.modHydrolic != undefined) SetVehicleMod(vehicle, 38, customs.modHydrolic, false);
		if (customs.modEngineBlock != undefined) SetVehicleMod(vehicle, 39, customs.modEngineBlock, false);
		if (customs.modAirFilter != undefined) SetVehicleMod(vehicle, 40, customs.modAirFilter, false);
		if (customs.modStruts != undefined) SetVehicleMod(vehicle, 41, customs.modStruts, false);
		if (customs.modArchCover != undefined) SetVehicleMod(vehicle, 42, customs.modArchCover, false);
		if (customs.modAerials != undefined) SetVehicleMod(vehicle, 43, customs.modAerials, false);
		if (customs.modTrimB != undefined) SetVehicleMod(vehicle, 44, customs.modTrimB, false);
		if (customs.modTank != undefined) SetVehicleMod(vehicle, 45, customs.modTank, false);
		if (customs.modWindows != undefined) SetVehicleMod(vehicle, 46, customs.modWindows, false);

		if (!!customs.modLivery) {
			SetVehicleMod(vehicle, 48, customs.modLivery, false);
			SetVehicleLivery(vehicle, customs.modLivery);
		}
	}

	public static getVehicles() {
		let v = [];
	}

	public static getCustoms(vehicle: any): IVehiculesCustom {
		const [colorPrimary, colorSecondary] = GetVehicleColours(vehicle);
		const [pearlescentColor, wheelColor] = GetVehicleExtraColours(vehicle);
		const extras = [];

		for (let id = 0; id < 12; id++) {
			if (DoesExtraExist(vehicle, id)) {
				const state = IsVehicleExtraTurnedOn(vehicle, id) == true;
				extras[id] = state;
			}
		}

		return {
			model: GetEntityModel(vehicle),
			plate: GetVehicleNumberPlateText(vehicle)?.trim(),
			plateIndex: GetVehicleNumberPlateTextIndex(vehicle),
			bodyHealth: Math.round(GetVehicleBodyHealth(vehicle)),
			engineHealth: Math.round(GetVehicleEngineHealth(vehicle)),
			fuelLevel: Math.round(GetVehicleFuelLevel(vehicle)),
			dirtLevel: Math.round(GetVehicleDirtLevel(vehicle)),
			color1: colorPrimary,
			color2: colorSecondary,
			pearlescentColor: pearlescentColor,
			wheelColor: wheelColor,
			wheels: GetVehicleWheelType(vehicle),
			windowTint: GetVehicleWindowTint(vehicle),
			xenonColor: GetVehicleXenonLightsColour(vehicle),
			neonEnabled: [
				//@ts-ignore
				IsVehicleNeonLightEnabled(vehicle, 0),
				//@ts-ignore
				IsVehicleNeonLightEnabled(vehicle, 1),
				//@ts-ignore
				IsVehicleNeonLightEnabled(vehicle, 2),
				//@ts-ignore
				IsVehicleNeonLightEnabled(vehicle, 3),
			],
			neonColor: GetVehicleNeonLightsColour(vehicle),
			extras: extras,
			tyreSmokeColor: GetVehicleTyreSmokeColor(vehicle),
			modSpoilers: GetVehicleMod(vehicle, 0),
			modFrontBumper: GetVehicleMod(vehicle, 1),
			modRearBumper: GetVehicleMod(vehicle, 2),
			modSideSkirt: GetVehicleMod(vehicle, 3),
			modExhaust: GetVehicleMod(vehicle, 4),
			modFrame: GetVehicleMod(vehicle, 5),
			modGrille: GetVehicleMod(vehicle, 6),
			modHood: GetVehicleMod(vehicle, 7),
			modFender: GetVehicleMod(vehicle, 8),
			modRightFender: GetVehicleMod(vehicle, 9),
			modRoof: GetVehicleMod(vehicle, 10),
			modEngine: GetVehicleMod(vehicle, 11),
			modBrakes: GetVehicleMod(vehicle, 12),
			modTransmission: GetVehicleMod(vehicle, 13),
			modHorns: GetVehicleMod(vehicle, 14),
			modSuspension: GetVehicleMod(vehicle, 15),
			modArmor: GetVehicleMod(vehicle, 16),
			//@ts-ignore
			modTurbo: IsToggleModOn(vehicle, 18),
			//@ts-ignore
			modSmokeEnabled: IsToggleModOn(vehicle, 20),
			//@ts-ignore
			modXenon: IsToggleModOn(vehicle, 22),
			modFrontWheels: GetVehicleMod(vehicle, 23),
			modBackWheels: GetVehicleMod(vehicle, 24),
			modPlateHolder: GetVehicleMod(vehicle, 25),
			modVanityPlate: GetVehicleMod(vehicle, 26),
			modTrimA: GetVehicleMod(vehicle, 27),
			modOrnaments: GetVehicleMod(vehicle, 28),
			modDashboard: GetVehicleMod(vehicle, 29),
			modDial: GetVehicleMod(vehicle, 30),
			modDoorSpeaker: GetVehicleMod(vehicle, 31),
			modSeats: GetVehicleMod(vehicle, 32),
			modSteeringWheel: GetVehicleMod(vehicle, 33),
			modShifterLeavers: GetVehicleMod(vehicle, 34),
			modAPlate: GetVehicleMod(vehicle, 35),
			modSpeakers: GetVehicleMod(vehicle, 36),
			modTrunk: GetVehicleMod(vehicle, 37),
			modHydrolic: GetVehicleMod(vehicle, 38),
			modEngineBlock: GetVehicleMod(vehicle, 39),
			modAirFilter: GetVehicleMod(vehicle, 40),
			modStruts: GetVehicleMod(vehicle, 41),
			modArchCover: GetVehicleMod(vehicle, 42),
			modAerials: GetVehicleMod(vehicle, 43),
			modTrimB: GetVehicleMod(vehicle, 44),
			modTank: GetVehicleMod(vehicle, 45),
			modWindows: GetVehicleMod(vehicle, 46),
			modLivery: GetVehicleLivery(vehicle),
		};
	}
}

RegisterCommand(
	"addVehicule",
	() => {
		const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);

		console.log("4551616", Vehicules.getCustoms(vehicle));

		if (typeof Vehicules.getCustoms(vehicle) !== "boolean") {
			Vehicules.addVehicle(
				GetDisplayNameFromVehicleModel(Vehicules.getCustoms(vehicle).model),
				Vehicules.getCustoms(vehicle).plate,
				Vehicules.getCustoms(vehicle)
			);
		}
	},
	false
);
