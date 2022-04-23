/* laisse le stp 


import { ILicenses } from "../../../../shared/player/character";
import { Delay } from "../../../../shared/utils/utils";
import { CoraUI } from "../../../core/coraui";
import { ShowHelpNotification } from "../../../core/utils";
import Prices from "../../../../shared/config/prices.json";
import { Money } from "../../../player/money";
import { BlipColor, Vector3 } from "@wdesgardin/fivem-js";
import { BlipsController } from "../../../misc/blips";
import { InteractionPoints } from "../../../misc/interaction-points";
import { Notifications } from "../../../player/notifications";

const CheckPoints = [
	{
		Pos: { x: 216.204, y: 370.29, z: 106.323 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Allons sur la route, tournez à gauche, vitesse limitée à ~w~b~80km/h");
			DriverSchool.CurrentZoneType = 2;
		},
	},

	{
		Pos: { x: 236.32, y: 346.78, z: 105.57 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Continuez tout droit");
		},
	},

	{
		Pos: { x: 403.16, y: 300.05, z: 103.0 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Attentions au feu");
		},
	},

	{
		Pos: { x: 548.0, y: 247.555, z: 103.09 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Attentions au feu");
		},
	},

	{
		Pos: { x: 658.73, y: 213.41, z: 95.93 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Tournez à droite, n'oubliez pas vos clignotants");
		},
	},

	{
		Pos: { x: 670.106, y: 194.68, z: 93.19 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Vous entrez dans une zone résidentielle, limite ~b~50km/h");
			DriverSchool.CurrentZoneType = 1;
		},
	},

	{
		Pos: { x: 625.11, y: 69.87, z: 90.11 },
		Action: (playerPed: any, setCurrentZoneType: (arg0: ZoneType) => void) => {
			Notifications.Show("Prenez à droite, vitesse limite ~b~80km/h");
			DriverSchool.CurrentZoneType = 2;
		},
	},

	{
		Pos: { x: 534.88, y: 75.044, z: 96.37 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Tournez à gauche quand le feu est vert");
			DriverSchool.CurrentZoneType = 3;
		},
	},

	{
		Pos: { x: 484.05, y: 39.68, z: 92.18 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Allez vers le prochain passage");
		},
	},

	{
		Pos: { x: 401.702, y: -108.51, z: 65.19 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Laissez passer le pieton.");
		},
	},
	{
		Pos: { x: 358.86, y: -245.34, z: 53.97 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Attention au feu.");
		},
	},

	{
		Pos: { x: 317.28, y: -362.89, z: 45.25 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Attention au feu.");
		},
	},

	{
		Pos: { x: 294.85, y: -456.19, z: 43.28 },
		Action: (playerPed: any, setCurrentZoneType: (arg0: ZoneType) => void) => {
			Notifications.Show("Tournez à droite, vitesse limitée à~b~ 120km/h.");
			DriverSchool.CurrentZoneType = 3;
		},
	},

	{
		Pos: { x: 68.52, y: -479.7, z: 34.06 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Continuez tout droit.");
		},
	},

	{
		Pos: { x: -138.31, y: -494.899, z: 29.42 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Continuez tout droit.");
		},
	},

	{
		Pos: { x: -688.59, y: -497.28, z: 25.19 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Continuez tout droit.");
		},
	},

	{
		Pos: { x: -989.1, y: -546.41, z: 18.35 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Ralentissez.");
		},
	},

	{
		Pos: { x: -1157.47, y: -638.79, z: 22.72 },
		Action: (playerPed: any, setCurrentZoneType: (arg0: ZoneType) => void) => {
			Notifications.Show("Tournez à gauche vitesse limite ~b~80km/h.");
			DriverSchool.CurrentZoneType = 2;
		},
	},

	{
		Pos: { x: -1142.446, y: -691.37, z: 21.63 },
		Action: (playerPed: any, setCurrentZoneType: (arg0: ZoneType) => void) => {
			Notifications.Show("Tournez à gauche, attention au feu.");
		},
	},

	{
		Pos: { x: -1016.85, y: -616.55, z: 18.26 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Continuez tout droit, vitesse limite ~b~120km/h.");
			DriverSchool.CurrentZoneType = 3;
		},
	},

	{
		Pos: { x: -849.54, y: -541.89, z: 22.83 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Continuez tout droit.");
		},
	},

	{
		Pos: { x: -490.5, y: -530.48, z: 25.33 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Continuez tout droit.");
		},
	},

	{
		Pos: { x: -26.3, y: -527.42, z: 33.25 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Continuez tout droit, préparez vous à tournez à droite et ralentissez.");
		},
	},

	{
		Pos: { x: 91.53, y: -544.01, z: 33.84 },
		Action: (playerPed: any, setCurrentZoneType: (arg0: ZoneType) => void) => {
			Notifications.Show("Continuez tout droit, vitesse limitée à ~b~80km/h.");
			DriverSchool.CurrentZoneType = 2;
		},
	},

	{
		Pos: { x: 252.99, y: -543.6, z: 43.21 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Tournez à gauche, attention au feu.");
		},
	},
	{
		Pos: { x: 306.79, y: -459.09, z: 43.32 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Continuez tout droit.");
		},
	},

	{
		Pos: { x: 318.32, y: -410.1, z: 45.12 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Attention au feu, continuez tout droit.");
		},
	},

	{
		Pos: { x: 351.15, y: -293.01, z: 53.88 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Attention au feu, continuez tout droit.");
		},
	},

	{
		Pos: { x: 400.48, y: -149.67, z: 64.69 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Attention au feu, continuez tout droit.");
		},
	},

	{
		Pos: { x: 508.28, y: 56.62, z: 95.8 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Attention au feu, continuez tout droit.");
		},
	},

	{
		Pos: { x: 563.84, y: 228.76, z: 103.04 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Attention au feu, tournez à gauche.");
		},
	},

	{
		Pos: { x: 437.77, y: 293.12, z: 102.99 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Attention au feu, continuez tout droit.");
		},
	},

	{
		Pos: { x: 275.69, y: 337.76, z: 105.51 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Attention au feu, continuez tout droit.");
		},
	},

	{
		Pos: { x: 223.73, y: 356.74, z: 105.85 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			Notifications.Show("Tournez à droite.");
		},
	},

	{
		Pos: { x: 213.72, y: 389.25, z: 106.84 },
		Action: (playerPed: any, setCurrentZoneType: any) => {
			if (DriverSchool.Errors < 5) {
				DriverSchool.stopDriveTest(true);
			} else {
				DriverSchool.stopDriveTest(false);
			}
		},
	},
];

enum Drive {
	car = 1,
	bike = 2,
	truck = 3,
}

enum ZoneType {
	residence = 1,
	ville = 2,
	ottoroute = 3,
}

export abstract class DriverSchool {
	public static Status: boolean = false;
	public static Tick: number;

	public static Vehicule: number;
	public static Errors: number = 0;
	public static Succes: boolean;
	public static Licencies: Drive;
	public static AboveSpeedLimit: boolean;
	public static LastCheckPoint: number = -1;
	public static VehicleHealth: number;
	public static Ped: number;

	public static SpeedLimit = [50.0, 80.0, 120.0];

	public static CurrentCheckPoint: number = 0;
	public static CurrentBlip: number;
	public static CurrentZoneType: ZoneType = 0;

	public static async initialize() {
		RegisterCommand("driveTest", () => {
			
			let licensies: any = {}
			licensies.car = true;

			emitNet("gm:character:addLicense", licensies);
		}, false);


		BlipsController.CreateBlip({
			name: "Auto Ecole",
			sprite: 269,
			scale: 0.8,
			color: BlipColor.Red,
			coords: {
				x: 222.6501922607422,
				y: 375.49713134765625,
				z: 106.37598419189453,
			},
		});

		InteractionPoints.createPoint({
			position: Vector3.create({
				x: 222.6501922607422,
				y: 375.49713134765625,
				z: 106.37598419189453 - 0.9,
			}),
			action: () => {
				this.openMenu();
			},
			helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ~b~vous interagir avec l'armurier",
			marker: false,
			ped: {
				model: "s_f_m_fembarber",
				heading: 88.36699676513672,
			},
		});
	}

	public static startTest() {
		this.Tick = setTick(async () => {
			console.log("uiibgeribg");
			const nextCheckPoint = this.CurrentCheckPoint + 1;

			if (CheckPoints[nextCheckPoint] == null) {
				if (DoesBlipExist(this.CurrentBlip)) {
					RemoveBlip(this.CurrentBlip);
				}

				this.Status = false;
			} else {
				if (this.CurrentCheckPoint != this.LastCheckPoint) {
					if (DoesBlipExist(this.CurrentBlip)) {
						RemoveBlip(this.CurrentBlip);
					}

					this.CurrentBlip = AddBlipForCoord(
						CheckPoints[nextCheckPoint].Pos.x,
						CheckPoints[nextCheckPoint].Pos.y,
						CheckPoints[nextCheckPoint].Pos.z
					);
					SetBlipRoute(this.CurrentBlip, true);
					this.LastCheckPoint = this.CurrentCheckPoint;
				}

				const [x, y, z] = GetEntityCoords(PlayerPedId(), false);
				const distance = GetDistanceBetweenCoords(
					x,
					y,
					z,
					CheckPoints[nextCheckPoint].Pos.x,
					CheckPoints[nextCheckPoint].Pos.y,
					CheckPoints[nextCheckPoint].Pos.z,
					true
				);

				if (distance <= 90.0) {
					// @ts-ignore
					DrawMarker(
						36,
						CheckPoints[nextCheckPoint].Pos.x,
						CheckPoints[nextCheckPoint].Pos.y,
						CheckPoints[nextCheckPoint].Pos.z,
						0.0,
						0.0,
						0.0,
						0,
						0.0,
						0.0,
						1.5,
						1.5,
						1.5,
						102,
						204,
						102,
						100,
						false,
						true,
						2,
						false,
						false,
						false
					);
				}

				if (distance <= 3.0) {
					CheckPoints[nextCheckPoint].Action(PlayerPedId(), this.setCurrentZoneType);
					this.CurrentCheckPoint = this.CurrentCheckPoint + 1;
				}
			}

			if (IsPedInAnyVehicle(PlayerPedId(), false)) {
				const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);
				const speed = GetEntitySpeed(vehicle) * 3.6;
				const getSpeed = Math.floor(GetEntitySpeed(vehicle) * 3.6);

				let tooMuchSpeed = false;
				let damageControl = 0;

				if (this.CurrentZoneType == 1 && getSpeed >= this.SpeedLimit[0]) {
					tooMuchSpeed = true;
					this.Errors = this.Errors + 1;
					this.AboveSpeedLimit = true;
					Notifications.Show(
						"Vous roulez trop vite, vitesse limite : " +
							DriverSchool.SpeedLimit[0] +
							" km/h~w~!\n~r~Nombre d'erreurs " +
							this.Errors +
							"/5"
					);
					await Delay(2000);
				}

				if (this.CurrentZoneType == 2 && getSpeed >= this.SpeedLimit[1]) {
					tooMuchSpeed = true;
					this.Errors = this.Errors + 1;
					this.AboveSpeedLimit = true;
					Notifications.Show(
						"Vous roulez trop vite, vitesse limite : " +
							DriverSchool.SpeedLimit[1] +
							" km/h~w~!\n~r~Nombre d'erreurs " +
							this.Errors +
							"/5"
					);
					await Delay(2000);
				}

				if (this.CurrentZoneType == 3 && getSpeed >= this.SpeedLimit[2]) {
					tooMuchSpeed = true;
					this.Errors = this.Errors + 1;
					this.AboveSpeedLimit = true;
					Notifications.Show(
						"Vous roulez trop vite, vitesse limite : " +
							DriverSchool.SpeedLimit[2] +
							" km/h~w~!\n~r~Nombre d'erreurs " +
							this.Errors +
							"/5"
					);
					await Delay(2000);
				}

				if (HasEntityCollidedWithAnything(vehicle) && damageControl == 0) {
					this.Errors = this.Errors + 1;
					Notifications.Show("Votre vehicule c'est pris des dégats\n~r~Nombre d'erreurs " + this.Errors + "/5");
					await Delay(2000);
				}

				if (!tooMuchSpeed) {
					this.AboveSpeedLimit = false;
				}

				if (GetEntityHealth(vehicle) < GetEntityHealth(vehicle)) {
					this.Errors = this.Errors + 1;

					Notifications.Show("Votre vehicule c'est pris des dégats\n~r~Nombre d'erreurs " + this.Errors + "/5");

					this.VehicleHealth = GetEntityHealth(vehicle);
					await Delay(2000);
				}
				if (this.Errors >= 5) {
					this.CurrentCheckPoint = 10;
					RemoveBlip(this.CurrentBlip);
					SetNewWaypoint(204.82, 377.133);
					// @ts-ignore
					DrawMarker(
						36,
						204.82,
						377.133,
						107.24,
						0.0,
						0.0,
						0.0,
						0,
						0.0,
						0.0,
						1.5,
						1.5,
						1.5,
						102,
						204,
						102,
						100,
						false,
						true,
						2,
						false,
						false,
						false
					);
					const [x, y, z] = GetEntityCoords(PlayerPedId(), false);
					const dist = GetDistanceBetweenCoords(x, y, z, 204.82, 377.133, 107.24, true);

					if (dist <= 2.5) {
						ShowHelpNotification("Appuyez sur ~INPUT_TALK~ pour rendre le véhicule.");
						if (IsControlJustPressed(0, 51)) {
							this.stopDriveTest(false);
							this.Errors = 0;
							this.CurrentCheckPoint = 0;
							RemoveBlip(this.CurrentBlip);
						}
					}
				}
			}
		});
	}

	public static setCurrentZoneType(zoneType: ZoneType) {
		this.CurrentZoneType = zoneType;
	}

	public static startDriveTest(type: Drive) {
		this.Status = true;

		const driveType = type;
		let vehicleName: string = "rhapsody";

		if (driveType == 1) {
			vehicleName = "rhapsody";
			this.Licencies = 1;
		} else if (driveType == 2) {
			vehicleName = "bati";
			this.Licencies = 2;
		} else if (driveType == 3) {
			vehicleName = "mule";
			this.Licencies = 3;
		}

		RequestModel(GetHashKey(vehicleName));
		RequestModel(0x242c34a7);

		this.Vehicule = CreateVehicle(GetHashKey(vehicleName), 213.61, 389.34, 106.85, 171.44, true, false);
		SetPedIntoVehicle(PlayerPedId(), this.Vehicule, -1);
		this.Licencies = 1;

		this.Ped = CreatePedInsideVehicle(this.Vehicule, 5, 0x242c34a7, 0, true, false);
		SetEntityAsMissionEntity(this.Ped, false, false);
		Notifications.Show("Bonne chance pour l'examen");
		this.startTest();
	}

	public static stopDriveTest(status: boolean) {
		if (status) {
			let licensies: ILicenses = {};

			Notifications.Show("GG pour le permis bg");
			RemoveBlip(this.CurrentBlip);
			// add permis event

			switch (this.Licencies) {
				case 1:
					licensies.car = true;
					break;
				case 2:
					licensies.motorCycle = true;
					break;
				case 3:
					licensies.truck = true;
					break;
				default:
					return;
			}

			if (DoesEntityExist(GetVehiclePedIsIn(PlayerPedId(), false))) {
				DeleteEntity(GetVehiclePedIsIn(PlayerPedId(), false));
				SetEntityAsNoLongerNeeded(GetVehiclePedIsIn(PlayerPedId(), false));
			}

			clearTick(this.Tick);
		} else {
			Notifications.Show("Bah le looser ta louper le oneshot mdr, repasse ton permis");

			if (DoesEntityExist(GetVehiclePedIsIn(PlayerPedId(), false))) {
				DeleteEntity(GetVehiclePedIsIn(PlayerPedId(), false));
				SetEntityAsNoLongerNeeded(GetVehiclePedIsIn(PlayerPedId(), false));
			}

			clearTick(this.Tick);
		}
	}

	public static openMenu() {
		CoraUI.openMenu({
			name: "Permis",
			subtitle: "Menu interaction",
			glare: true,
			onOpen: () => FreezeEntityPosition(PlayerPedId(), true),
			onClose: () => FreezeEntityPosition(PlayerPedId(), false),
			buttons: [
				{
					name: "Permis de conduire voiture",
					rightText: Prices["licenses"]["car"].toString() + "$",
					onClick: async () => {
						if (!(await Money.pay(Prices["licenses"]["car"]))) return;
						DriverSchool.startDriveTest(1);
						CoraUI.closeMenu();
					},
				},
				{
					name: "Permis de conduire camion",
					rightText: Prices["licenses"]["truck"].toString() + "$",
					onClick: async () => {
						if (!(await Money.pay(Prices["licenses"]["truck"]))) return;
						DriverSchool.startDriveTest(2);
						CoraUI.closeMenu();
					},
				},
				{
					name: "Permis de conduire moto",
					rightText: Prices["licenses"]["moto"].toString() + "$",
					onClick: async () => {
						if (!(await Money.pay(Prices["licenses"]["moto"]))) return;
						DriverSchool.startDriveTest(3);
						CoraUI.closeMenu();
					},
				},
			],
		});
	}
}
*/
