import { IVehiculesCustom } from "../../shared/types/vehicules";
import { RegisterServerCallback } from "../core/utils";
import { CharactersController } from "./charactersController";
import Config from "../../shared/config/prices.json";
import { Vehicle } from "./models/vehicle";

export abstract class VehiclesController {
	private static allVehicles: { [plate: string]: Vehicle } = {};
	private static vehicleOwner: { [plate: string]: string } = {};

	public static async initialize() {
		onNet("gm:vehicle:add", this.add.bind(this));
		onNet("gm:vehicle:remove", this.remove.bind(this));
		onNet("gm:vehicle:use", this.use.bind(this));
		onNet("gm:vehicle:update", this.update.bind(this));
		onNet("gm:vehicle:range", this.range.bind(this));
		onNet("gm:vehicle:fourriere", this.fourriere.bind(this));

		RegisterServerCallback("gm:vehicle:get", this.get.bind(this));
		RegisterServerCallback("gm:vehicle:getVehicle", (_, plate: string) => this.getVehicle(plate));
		RegisterServerCallback("gm:vehicle:returnVehicleProprio", this.returnVehicleProprio.bind(this));
		RegisterServerCallback("gm:vehicle:checkPlate", this.checkPlate.bind(this));
	}

	public static getVehicle(plate: string) {
		return this.allVehicles[plate];
	}

	public static getVehicleOwner(plate: string) {
		return this.vehicleOwner[plate];
	}

	private static get(id: number) {
		const charId = id || parseInt(source);
		let vehicles = CharactersController.getCharacter(charId).vehicles;

		return vehicles;
	}

	private static checkPlate(souce: number, plate: string, id?: number): boolean {
		const charId = id || parseInt(source);
		let vehicles = CharactersController.getCharacter(charId).vehicles;

		return vehicles.findIndex(v => v.plate == plate) !== -1;
	}

	private static update(plate: string, custom: IVehiculesCustom, id: number): boolean {
		const charId = id || parseInt(source);
		let vehicles = CharactersController.getCharacter(charId).vehicles;
		let index = vehicles.findIndex(v => v.plate == plate);

		if (!vehicles[index] || !vehicles[index].customs) return false;

		vehicles[index].customs = custom;
		CharactersController.updateVehicles(charId, vehicles);

		return true;
	}

	private static async add(name: string, plate: string, customs: IVehiculesCustom, id?: number): Promise<boolean> {
		const charId = id || parseInt(source);
		let vehicles = CharactersController.getCharacter(charId).vehicles;

		if (this.checkPlate(charId, plate)) return false;

		const vehicle = new Vehicle({ name, plate, customs, isOut: true, inventory: [] });
		vehicles.push(vehicle);
		CharactersController.updateVehicles(charId, vehicles);

		this.allVehicles[plate] = vehicle;
		this.vehicleOwner[plate] = CharactersController.getCharacter(charId)?.infos?.name || "";

		return true;
	}

	private static remove(plate: string, id?: number): boolean {
		const charId = id || parseInt(source);
		let vehicles = CharactersController.getCharacter(charId).vehicles;

		vehicles = vehicles.filter((x: any) => x[1] != plate);
		CharactersController.updateVehicles(charId, vehicles);

		return true;
	}

	private static give(plate: string, target: string, id?: number) {
		// soon
	}

	private static use(plate: string, pos?: number[], id?: number): boolean {
		const charId = id || parseInt(source);

		const vehicles = CharactersController.getCharacter(charId).vehicles;
		const vehicle = vehicles.find(v => v.plate == plate);
		if (!vehicle) return false;

		vehicle.isOut = true;
		vehicle.privateGarageId = undefined;
		CharactersController.updateVehicles(charId, vehicles);

		this.spawn(vehicle, pos, charId, true);

		return true;
	}

	private static fourriere(plate: string, pos?: number[], id?: number): boolean {
		const charId = id || parseInt(source);
		let character = CharactersController.getCharacter(charId);
		const vehicles = CharactersController.getCharacter(charId).vehicles;
		const vehicle = vehicles.find(v => v.plate == plate);
		if (!vehicle) return false;

		if (character.canPay(Config["fourriere"])) {
			vehicle.isOut = true;
			CharactersController.updateVehicles(charId, vehicles);
			this.spawn(vehicle, pos, charId);
		}

		return true;
	}

	private static range(plate: string, customs: IVehiculesCustom, priv?: number, id?: number): boolean {
		const charId = id || parseInt(source);
		const vehicles = CharactersController.getCharacter(charId).vehicles;
		const vehicle = vehicles.find(v => v.plate == plate);
		if (!vehicle) return false;

		vehicle.isOut = false;
		vehicle.privateGarageId = priv;
		vehicle.customs = customs;

		CharactersController.updateVehicles(charId, vehicles);
		emitNet("gm:vehicles:delete", source);

		return true;
	}

	private static spawn(vehicle: Vehicle, pos?: number[], id?: number, enter?: boolean): boolean {
		const charId = id || parseInt(source);
		const character = CharactersController.getCharacter(charId);

		this.vehicleOwner[vehicle.plate] = character.infos.name;
		this.allVehicles[vehicle.plate] = vehicle;

		emitNet("gm:vehicles:spawn", charId, vehicle.name, vehicle.customs, pos, enter || false);

		return true;
	}

	private static returnVehicleProprio(source: number, plate: string) {
		const name = this.vehicleOwner[plate] || "";
		return name;
	}
}
