import { privateEncrypt } from "crypto";
import { Delay } from "../../../shared/utils/utils";
import { MySQL } from "../../core/mysql";
import { RegisterServerCallback } from "../../core/utils";

export abstract class Cardealer {
	private static data = {
		categories: [],
		vehicles: [],
	};

	public static async initialize() {
		await Delay(1000);

		RegisterServerCallback("hoyame:cardealer:returnData", this.returnData.bind(this));
	}

	// private static async getData() {
	//     const resultCategories = await MySQL.QueryAsync("SELECT * FROM vehicle_categories", [])
	//     if (!resultCategories) return console.log("Error getting categories")

	//     this.data.categories = resultCategories

	//     const resultVehicles = await MySQL.QueryAsync("SELECT * FROM vehicles", [])
	//     if (!resultVehicles) return console.log("Error getting vehicles")

	//     this.data.vehicles = resultVehicles
	// }

	// private static async buyVehicle(source: any, vehicle: any) {
	//     let plate = Math.random().toString(16).substr(2, 6);
	//     plate = plate.toUpperCase()

	//     if (vehicle.category == "plane") {
	//         const result = await MySQL.QueryAsync(
	//             `INSERT INTO owned_vehicles(owner, plate, vehicle, type, state, garage)  VALUES(?, ?, ?, ?, ?, ?)`,
	//             [
	//                 getPlayerIdentifiers(source)[0],
	//                 plate,
	//                 JSON.stringify({
	//                     model: vehicle.model,
	//                     plate: plate
	//                 }),
	//                 "aircraft",
	//                 1,
	//                 "Garage Helico Aeroport"
	//             ]
	//         );
	//     } else if (vehicle.category == "superboat") {
	//         const result = await MySQL.QueryAsync(
	//             `INSERT INTO owned_vehicles(owner, plate, vehicle, type, state)  VALUES(?, ?, ?, ?, ?)`,
	//             [
	//                 getPlayerIdentifiers(source)[0],
	//                 plate,
	//                 JSON.stringify({
	//                     model: vehicle.model,
	//                     plate: plate
	//                 }),
	//                 "boat",
	//                 1
	//             ]
	//         );
	//     } else {
	//         const result = await MySQL.QueryAsync(
	//             `INSERT INTO owned_vehicles(owner, plate, vehicle, type, state)  VALUES(?, ?, ?, ?, ?)`,
	//             [
	//                 getPlayerIdentifiers(source)[0],
	//                 plate,
	//                 JSON.stringify({
	//                     model: vehicle.model,
	//                     plate: plate
	//                 }),
	//                 "car",
	//                 1
	//             ]
	//         );
	//     }

	//     emitNet('hoyame:showNotification', 'Merci de votre achat, votre véhicule vous attends dans votre garage.');

	//     return true
	// }

	private static returnData() {
		return this.data;
	}
}
