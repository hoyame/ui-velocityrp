import { Delay } from "../../../shared/utils/utils";
import { Nui } from "../../core/nui";
import { TriggerServerCallbackAsync } from "../../core/utils";
import Vehicle from "../../core/vehicle";

export abstract class Cardealer {
    private static data: any;
    private static cam: any;

    private static lastVeh: any;

    public static async initialize() {
        Nui.RegisterCallback("spawnCar", (data: any) => this.spawnCar(data));

        await Delay(1500);

        await this.grabData()

        // this.open();
        // this.enableCam()
        // await Delay(7500);
        // this.disableCam()

    }

    public static open() {
        Nui.SendMessage({ path: "cardealer" });
        Nui.SendMessage({ type: "cardealer", data: this.data });

        DisplayRadar(false);
        Nui.SetFocus(true, true, false);

    }

    public static close() {
        Nui.SendMessage({ path: "" });
        DisplayRadar(true);
        Nui.SetFocus(false, false, false);
    }

    private static async grabData() {
        const data = await TriggerServerCallbackAsync('hoyame:cardealer:returnData');
        this.data = data;
    }

    private static enableCam() {
        const coords = GetEntityCoords(GetPlayerPed(-1), false)
        this.cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", true)
        SetCamCoord(this.cam, coords[0] + 2.0, coords[1] + 5.0, coords[2] + 0.8)
        SetCamFov(this.cam, 50.0)
        PointCamAtCoord(this.cam, coords[0], coords[1] - 2.5, coords[2] + 0.5)
        SetCamShakeAmplitude(this.cam, 13.0)
        RenderScriptCams(true, true, 1500, true, true)
        FreezeEntityPosition(PlayerPedId(), true)
        SetEntityVisible(PlayerPedId(), false, false);
    }

    private static disableCam() {
        RenderScriptCams(false, true, 1500, true, true)
        DestroyCam(this.cam, true)
        FreezeEntityPosition(PlayerPedId(), false)
        SetEntityVisible(PlayerPedId(), true, true);
    }

    private static async spawnCar(vehicle: any) {
        console.log(vehicle)

        if (this.lastVeh) DeleteVehicle(this.lastVeh);


        this.lastVeh = await Vehicle.spawnVehicle(vehicle.model, null, null, false, false, true)
    }
}