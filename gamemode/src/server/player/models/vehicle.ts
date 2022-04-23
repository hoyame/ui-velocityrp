import { ItemId, ItemsConfig } from "../../../shared/config/items";
import { IVehicle, IVehiculesCustom } from "../../../shared/types/vehicules";
import { withInventory } from "./withInventory";

export class Vehicle extends withInventory implements IVehicle {
	name: string;
	plate: string;
	customs: IVehiculesCustom;
	isOut: boolean;
	privateGarageId?: number | undefined;

	constructor(data: IVehicle) {
		super(data.inventory);
		this.name = data.name;
		this.plate = data.plate;
		this.customs = data.customs;
		this.isOut = data.isOut;
		this.privateGarageId = data.privateGarageId;
	}

	public canCarry(itemId: ItemId, quantity: number) {
		const limit = ItemsConfig[itemId].vehicleLimit;
		return super.canCarry(itemId, quantity) && (limit == undefined || this.getItemQuantity(itemId) + quantity <= limit);
	}

	public updateCustom(custom: IVehiculesCustom) {
		this.customs = custom;
	}
}
