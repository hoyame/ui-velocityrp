import { Vector3 } from "@nativewrappers/client";
import { RegisterServerCallback } from "../../core/utils";
import { CharactersController } from "../../player/charactersController";

export abstract class Taxi {
	private static playerDestinations: { [player: number]: Vector3 } = {};
	public static async initialize() {
		RegisterServerCallback("gm:taxi:createMission", this.createMission.bind(this));
		RegisterServerCallback("gm:taxi:endMission", this.endMission.bind(this));

		onNet("gm:taxi:updateTaximeter", this.updateTaximeter.bind(this));
	}

	private static createMission(source: number) {
		const playerPos = Vector3.fromArray(GetEntityCoords(GetPlayerPed(source.toString())));
		this.playerDestinations[source] = this.getDestination(playerPos);
		return this.playerDestinations[source];
	}

	private static getDestination(playerPos: Vector3): Vector3 {
		const destination = this.destinations[Math.randomRange(0, this.destinations.length - 1)];
		return playerPos.distance(destination) > 100 ? destination : this.getDestination(playerPos);
	}

	private static endMission(source: number) {
		const character = CharactersController.getCharacter(source);
		if (!character || !this.playerDestinations[source]) return 0;

		const playerPos = Vector3.fromArray(GetEntityCoords(GetPlayerPed(source.toString())));
		if (playerPos.distance(this.playerDestinations[source]) > 20) return 0;

		delete this.playerDestinations[source];
		const reward = Math.randomRange(50, 100);
		character.giveMoney(reward);
		return reward;
	}

	private static updateTaximeter(passengers: number[], fare?: number) {
		for (const target of passengers) {
			emitNet("gm:taxi:updateTaximeterTarget", target, fare);
		}
	}

	private static destinations = [
		new Vector3(293.5, -590.2, 42.7),
		new Vector3(253.4, -375.9, 44.1),
		new Vector3(120.8, -300.4, 45.1),
		new Vector3(-38.4, -381.6, 38.3),
		new Vector3(-107.4, -614.4, 35.7),
		new Vector3(-252.3, -856.5, 30.6),
		new Vector3(-236.1, -988.4, 28.8),
		new Vector3(-277.0, -1061.2, 25.7),
		new Vector3(-576.5, -999.0, 21.8),
		new Vector3(-602.8, -952.6, 21.6),
		new Vector3(-790.7, -961.9, 14.9),
		new Vector3(-912.6, -864.8, 15.0),
		new Vector3(-1069.8, -792.5, 18.8),
		new Vector3(-1306.9, -854.1, 15.1),
		new Vector3(-1468.5, -681.4, 26.2),
		new Vector3(-1380.9, -452.7, 34.1),
		new Vector3(-1326.3, -394.8, 36.1),
		new Vector3(-1383.7, -270.0, 42.5),
		new Vector3(-1679.6, -457.3, 39.4),
		new Vector3(-1812.5, -416.9, 43.7),
		new Vector3(-2043.6, -268.3, 23.0),
		new Vector3(-2186.4, -421.6, 12.7),
		new Vector3(-1862.1, -586.5, 11.2),
		new Vector3(-1859.5, -617.6, 10.9),
		new Vector3(-1635.0, -988.3, 12.6),
		new Vector3(-1284.0, -1154.2, 5.3),
		new Vector3(-1126.5, -1338.1, 4.6),
		new Vector3(-867.9, -1159.7, 5.0),
		new Vector3(-847.5, -1141.4, 6.3),
		new Vector3(-722.6, -1144.6, 10.2),
		new Vector3(-575.5, -318.4, 34.5),
		new Vector3(-592.3, -224.9, 36.1),
		new Vector3(-559.6, -162.9, 37.8),
		new Vector3(-535.0, -65.7, 40.6),
		new Vector3(-758.2, -36.7, 37.3),
		new Vector3(-1375.9, 21.0, 53.2),
		new Vector3(-1320.3, -128.0, 48.1),
		new Vector3(-1285.7, 294.3, 64.5),
		new Vector3(-1245.7, 386.5, 75.1),
		new Vector3(-760.4, 285.0, 85.1),
		new Vector3(-626.8, 254.1, 81.1),
		new Vector3(-563.6, 268.0, 82.5),
		new Vector3(-486.8, 272.0, 82.8),
		new Vector3(88.3, 250.9, 108.2),
		new Vector3(234.1, 344.7, 105.0),
		new Vector3(435.0, 96.7, 99.2),
		new Vector3(482.6, -142.5, 58.2),
		new Vector3(762.7, -786.5, 25.9),
		new Vector3(809.1, -1290.8, 25.8),
		new Vector3(490.8, -1751.4, 28.1),
		new Vector3(432.4, -1856.1, 27.0),
		new Vector3(164.3, -1734.5, 28.9),
		new Vector3(-57.7, -1501.4, 31.1),
		new Vector3(52.2, -1566.7, 29.0),
		new Vector3(310.2, -1376.8, 31.4),
		new Vector3(182.0, -1332.8, 28.9),
		new Vector3(-74.6, -1100.6, 25.7),
		new Vector3(-887.0, -2187.5, 8.1),
		new Vector3(-749.6, -2296.6, 12.5),
		new Vector3(-1064.8, -2560.7, 19.7),
		new Vector3(-1033.4, -2730.2, 19.7),
		new Vector3(-1018.7, -2732.0, 13.3),
		new Vector3(797.4, -174.4, 72.7),
		new Vector3(508.2, -117.9, 60.8),
		new Vector3(159.5, -27.6, 67.4),
		new Vector3(-36.4, -106.9, 57.0),
		new Vector3(-355.8, -270.4, 33.0),
		new Vector3(-831.2, -76.9, 37.3),
		new Vector3(-1038.7, -214.6, 37.0),
		new Vector3(1918.4, 3691.4, 32.3),
		new Vector3(1820.2, 3697.1, 33.5),
		new Vector3(1619.3, 3827.2, 34.5),
		new Vector3(1418.6, 3602.2, 34.5),
		new Vector3(1944.9, 3856.3, 31.7),
		new Vector3(2285.3, 3839.4, 34.0),
		new Vector3(2760.9, 3387.8, 55.7),
		new Vector3(1952.8, 2627.7, 45.4),
		new Vector3(1051.4, 474.8, 93.7),
		new Vector3(866.4, 17.6, 78.7),
		new Vector3(319.0, 167.4, 103.3),
		new Vector3(88.8, 254.1, 108.2),
		new Vector3(-44.9, 70.4, 72.4),
		new Vector3(-115.5, 84.3, 70.8),
		new Vector3(-384.8, 226.9, 83.5),
		new Vector3(-578.7, 139.1, 61.3),
		new Vector3(-651.3, -584.9, 34.1),
		new Vector3(-571.8, -1195.6, 17.9),
		new Vector3(-1513.3, -670.0, 28.4),
		new Vector3(-1297.5, -654.9, 26.1),
		new Vector3(-1645.5, 144.6, 61.7),
		new Vector3(-1160.6, 744.4, 154.6),
		new Vector3(-798.1, 831.7, 204.4),
	];
}
