import { RequestWaitModel } from "./utils";

export default abstract class Vehicle {
    public static async spawnVehicle(name: string, custom: any, pos: any, enter: boolean, network: boolean, freeze: boolean) {
        const [x, y, z, h] = pos || GetEntityCoords(PlayerPedId(), false);
        const vehicle = GetHashKey(name);
        await RequestWaitModel(vehicle);
        const v = CreateVehicle(vehicle, x, y, z, h || GetEntityHeading(PlayerPedId()), network, false);

        if (enter) SetPedIntoVehicle(PlayerPedId(), v, -1);
        if (freeze) {
            SetVehicleOnGroundProperly(v);
            FreezeEntityPosition(v, true);
        } 

        return v
    }
} 