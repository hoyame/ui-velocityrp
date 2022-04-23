import { ShowHelpNotification, TriggerServerCallbackAsync } from "../../../core/utils";
import { Delay } from "../../../../shared/utils/utils";
import { Vehicules } from "../../../player/vehicules";
import { CoraUI } from "../../../core/coraui";
import { BlipsController } from "../../../misc/blips";
import { BlipColor, BlipSprite } from "@nativewrappers/client";
import { IVehicle } from "../../../../shared/types/vehicules";
import { Garages, GaragesOrg } from "../../../../shared/config/world/garages";
import { IGarage } from "../../../../shared/types/garage";
import { Orgs } from "../../../player/orgs";
import { LocalEvents } from "../../../../shared/utils/localEvents";
import { Keys } from "../vehicles/keys";
import { Notifications } from "../../../player/notifications";

enum GarageTypes {
	"GarageAppart" = 0,
	"GarageQG" = 1,
	"GarageMotard" = 2,
}

export const CheckGarage = (zd: any, zdx: any) => {
	let b = false;

	zd.map((v: any, k: any) => {
		if (v["garageType"] == zdx) {
			b = true;
			return true;
		}
	});

	return b;
};

export class GaragePrivate {
	private static CacheGarage: number = -1;
	private static exit: number;
	private static spawnedInGarage: number[] = [];
	private static isEnteringGarage = false;

	public static Garages = Garages;
	public static GaragesOrg = GaragesOrg;
	public static GaragesTypes: GarageTypes[] = [0, 0];
	public static OwnedGarages: IGarage[] = [];
	public static ExitGarage = [
		[-800.56, 332.9, 85.28, 180.79],
		[-639.8375854492188, 56.22269821166992, 43.34673309326172, 83.44471740722656],
	];

	public static async initialize() {
		LocalEvents.on("gm:character:spawned", async () => {
			this.OwnedGarages = (await TriggerServerCallbackAsync("gm:garage:getGaragesWithId")) as IGarage[];

			this.Garages.map((garage, k) => {
				if (CheckGarage(this.OwnedGarages, k)) {
					BlipsController.CreateBlip({
						name: "Garage personnel",
						coords: { x: garage.pos[0], y: garage.pos[1], z: garage.pos[2] },
						sprite: BlipSprite.Garage,
						color: BlipColor.White,
						scale: 0.8,
					});
				} else {
					BlipsController.CreateBlip({
						name: "Garage à acheter",
						coords: { x: garage.pos[0], y: garage.pos[1], z: garage.pos[2] },
						sprite: BlipSprite.GarageForSale,
						color: BlipColor.Blue,
						scale: 0.8,
					});
				}
			});
		});

		const tick = setTick(() => {
			const [px, py, pz] = GetEntityCoords(PlayerPedId(), false);

			this.Garages.map(async (garage, k) => {
				if (GetVehiclePedIsIn(PlayerPedId(), false)) {
					if (CheckGarage(this.OwnedGarages, k)) {
						if (GetDistanceBetweenCoords(px, py, pz, garage.pos[0], garage.pos[1], garage.pos[2], true) < 5) {
							ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour rentrer votre vehicule dans le garage privée");

							if (IsControlJustPressed(0, 38) && !this.isEnteringGarage) {
								this.isEnteringGarage = true;
								//run checkplate server side ??
								const checkPlate = await TriggerServerCallbackAsync(
									"gm:vehicle:checkPlate",
									Vehicules.getCustoms(GetVehiclePedIsIn(PlayerPedId(), false)).plate
								);

								if (checkPlate) {
									DoScreenFadeOut(500);
									await Vehicules.rangeVehicule(Vehicules.getCustoms(GetVehiclePedIsIn(PlayerPedId(), false)), k);
									this.enterGarage(k);
								}
							}
						}
					}
				} else {
					if (GetDistanceBetweenCoords(px, py, pz, garage.pos[0], garage.pos[1], garage.pos[2], true) < 2.5) {
						ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour interagir avec le garage privée");

						if (IsControlJustPressed(0, 38)) {
							this.openMenuEnter(k);
						}
					}
				}
			});

			// garage orga

			this.GaragesOrg.map(async (garage, k) => {
				if (GetVehiclePedIsIn(PlayerPedId(), false)) {
					if (CheckGarage(this.OwnedGarages, k)) {
						if (GetDistanceBetweenCoords(px, py, pz, garage.pos[0], garage.pos[1], garage.pos[2], true) < 5) {
							ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour rentrer votre vehicule dans le garage de l'organisation");

							if (IsControlJustPressed(0, 38) && !this.isEnteringGarage) {
								this.isEnteringGarage = true;
								//run checkplate server side ??
								const checkPlate = await TriggerServerCallbackAsync(
									"gm:vehicle:checkPlate",
									Vehicules.getCustoms(GetVehiclePedIsIn(PlayerPedId(), false)).plate
								);

								if (checkPlate) {
									DoScreenFadeOut(500);
									await Vehicules.rangeVehicule(Vehicules.getCustoms(GetVehiclePedIsIn(PlayerPedId(), false)), k);
									this.enterGarage(k);
								}
							}
						}
					}
				} else {
					if (GetDistanceBetweenCoords(px, py, pz, garage.pos[0], garage.pos[1], garage.pos[2], true) < 2.5) {
						ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour interagir avec le garage de l'organisation");

						if (IsControlJustPressed(0, 38)) {
							this.openMenuEnter(k);
						}
					}
				}
			});

			if (GetDistanceBetweenCoords(px, py, pz, 227.93817138671875, -1005.9260864257812, -98.9998779296875, true) < 2.5) {
				ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour sortir du garage");

				if (IsControlJustPressed(0, 38) && !this.isEnteringGarage) {
					this.exitGarage();
				}
			}
		});
	}

	public static async openMenuEnter(id: number) {
		const OwnedGarages = (await TriggerServerCallbackAsync("gm:garage:getGaragesWithId")) as IGarage[];

		CoraUI.openMenu({
			name: "Garage",
			glare: true,
			subtitle: "Menu Interaction",
			onOpen: () => FreezeEntityPosition(PlayerPedId(), true),
			onClose: () => FreezeEntityPosition(PlayerPedId(), false),
			buttons: [
				CheckGarage(OwnedGarages, id)
					? {
							name: "Rentrer",
							onClick: () => {
								this.enterGarage(id);
								CoraUI.closeMenu();
							},
					  }
					: {
							name: "Acheter",
							onClick: () => {
								emitNet("gm:garage:buyGarage", id);
								CoraUI.closeMenu();
							},
					  },
			],
		});
	}

	public static async openMenuEnterOrg(id: number) {
		const OwnedGarages = (await TriggerServerCallbackAsync("gm:garage:getGaragesOrganisations")) as IGarage[];
		const org = Orgs.getOrg()?.rank || 0;

		CoraUI.openMenu({
			name: "Garage Organisation",
			glare: true,
			subtitle: "Menu Interaction",
			onOpen: () => FreezeEntityPosition(PlayerPedId(), true),
			onClose: () => FreezeEntityPosition(PlayerPedId(), false),
			buttons: [
				CheckGarage(OwnedGarages, id)
					? {
							name: "Rentrer dans le garage de l'organisation",
							onClick: () => {
								this.enterGarage(id);
								CoraUI.closeMenu();
							},
					  }
					: {
							name: "Acheter le garage pour l'organisation",
							onClick: () => {
								if (org >= 4) {
									emitNet("gm:garage:buyGarageForOrganisation", id);
									CoraUI.closeMenu();
								} else {
									Notifications.ShowError("Vous n'avez pas les permissions pour effectuer cela");
									CoraUI.closeMenu();
								}
							},
					  },
			],
		});
	}

	public static async enterGarage(id: number) {
		DoScreenFadeOut(200);
		this.isEnteringGarage = true;
		this.CacheGarage = id;
		emitNet("gm:inst:create");

		this.exit = setTick(async () => {
			if (this.CacheGarage == undefined) {
				await Delay(5000);
			} else {
				if (GetEntitySpeed(GetVehiclePedIsIn(PlayerPedId(), false)) > 2 && !this.isEnteringGarage) {
					this.exitGarage(true);
					clearTick(this.exit);
				}
			}
		});

		if (this.GaragesTypes[id] === GarageTypes.GarageAppart) {
			const vehicules = (await TriggerServerCallbackAsync("gm:vehicle:get")) as IVehicle[];
			const vehiclesInGarage = vehicules.filter(v => !v.isOut && v.privateGarageId == id);
			let f = -1005.0;

			SetEntityCoords(PlayerPedId(), 228.26, -986.57, -99.96, true, false, false, true);

			for (let i = 0; i < Math.min(6, vehiclesInGarage.length); i++) {
				f = f + 4.0;
				this.spawnedInGarage.push(
					await Vehicules.spawnVehicle(
						vehiclesInGarage[i].name,
						vehiclesInGarage[i].customs,
						[222.82, f, -99.43, 238.84],
						false,
						false
					)
				);
			}

			for (let i = 6; i < Math.min(12, vehiclesInGarage.length); i++) {
				this.spawnedInGarage.push(
					await Vehicules.spawnVehicle(
						vehiclesInGarage[i].name,
						vehiclesInGarage[i].customs,
						[233.85, f, -99.67, 128.74],
						false,
						false
					)
				);
				f = f - 4.0;
			}
		}

		DoScreenFadeIn(500);
		this.isEnteringGarage = false;
	}

	public static async exitGarage(vehicle?: boolean) {
		const plate = GetVehicleNumberPlateText(GetVehiclePedIsIn(PlayerPedId(), false))?.trim();

		DoScreenFadeOut(200);
		await Delay(250);

		for (const spawnedVehicle of this.spawnedInGarage) {
			DeleteEntity(spawnedVehicle);
		}
		this.spawnedInGarage = [];

		emitNet("gm:inst:leave");
		await Delay(2000);

		if (vehicle) {
			emitNet("gm:vehicle:use", plate, this.ExitGarage[this.CacheGarage]);
			Keys.giveKey(plate);
			await Delay(1000);
		} else {
			const coords = this.Garages[this.CacheGarage]?.pos || [0, 0, 0];
			SetEntityCoords(PlayerPedId(), coords[0], coords[1], coords[2], true, false, false, true);
			clearTick(this.exit);
		}

		this.CacheGarage = -1;
		DoScreenFadeIn(500);
	}

	public static buyGarage() {}
}
