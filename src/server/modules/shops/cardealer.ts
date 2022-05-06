import { privateEncrypt } from "crypto"
import { Delay } from "../../../shared/utils/utils"
import { MySQL } from "../../core/mysql"
import { RegisterServerCallback } from "../../core/utils"

export abstract class Cardealer {
    private static data = {
        categories: [], vehicles: []
    }

    public static async initialize() {
        console.log('6531g536e1g6516g')

        await Delay(1000);
        this.getData();

        RegisterServerCallback("hoyame:cardealer:returnData", this.returnData.bind(this))
        RegisterServerCallback("hoyame:cardealer:buyVehicle", this.buyVehicle.bind(this))
    }

    private static async getData() {
        const resultCategories = await MySQL.QueryAsync("SELECT * FROM vehicle_categories", [])
        if (!resultCategories) return console.log("Error getting categories")

        this.data.categories = resultCategories 

        const resultVehicles = await MySQL.QueryAsync("SELECT * FROM vehicles", [])
        if (!resultVehicles) return console.log("Error getting vehicles")

        this.data.vehicles = resultVehicles
    }

    private static async buyVehicle(vehicle: any) {
        let plate = Math.random().toString(16).substr(2, 6);
        plate = plate.toUpperCase()

        if (vehicle.category == "plane") {

        } else if (vehicle.category == "superboat") {
        
        } else {
            
        }

        return true 
    }

    private static returnData() {
        return this.data
    }
}