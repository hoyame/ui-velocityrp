import { Delay } from "../../../shared/utils/utils";
import { Nui } from "../../core/nui";
import { hexToRgb, TriggerServerCallbackAsync } from "../../core/utils";
import Vehicle from "../../core/vehicle";

export abstract class Cardealer {
    private static data: any;
    private static cam: any;

    private static lastVeh: any;

    public static async initialize() {
        await this.grabData()

        Nui.RegisterCallback("spawnCar", (data: any) => this.spawnCar(data));
        Nui.RegisterCallback("setColor", (data: any) => this.setColor(data));
        Nui.RegisterCallback("buyVehicle", (data: any) => this.buyVehicle(data));
        Nui.RegisterCallback("leave", () => this.disableCam());

        onNet('hoyame:cardealer:close', () => {
            this.disableCam()
        })

        on('hoyame:cardealer:open', () => {
            this.open();
            this.enableCam()
        })
    }

    public static async open() {
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
        this.cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", false)
        SetCamActive(this.cam, true)
        SetCamCoord(this.cam, -41.046, -1094.127, 28.073)
        SetCamFov(this.cam, 50.0)
        PointCamAtCoord(this.cam, -47.177, -1092.30, 27.302)
        RenderScriptCams(true, true, 1500, true, true)

        FreezeEntityPosition(PlayerPedId(), true)
        SetEntityVisible(PlayerPedId(), false, false);

        this.spawnCar({model: "asbo"})
    }

    private static disableCam() {
        if (this.lastVeh) DeleteVehicle(this.lastVeh);

        RenderScriptCams(false, true, 1500, true, true)
        DestroyCam(this.cam, true)
        FreezeEntityPosition(PlayerPedId(), false)
        SetEntityVisible(PlayerPedId(), true, true);
        Nui.SendMessage({ path: "" });
        Nui.SetFocus(false, false, false);
        DisplayRadar(true);
    }

    private static async spawnCar(vehicle: any) {
        if (this.lastVeh) DeleteVehicle(this.lastVeh);
        this.lastVeh = await Vehicle.spawnVehicle(vehicle.model, null, [-47.177, -1092.30, 27.302, 285.77], false, false, true)
    }

    private static async setColor(c: any) {
        const color: any = hexToRgb(c)

        if (this.lastVeh) {
            SetVehicleCustomPrimaryColour(this.lastVeh, color.r, color.g, color.b)
        }
    }

    private static async buyVehicle(vehicle: any) {
        //const data = await TriggerServerCallbackAsync('hoyame:cardealer:buyVehicle', vehicle);

        emitNet("esx_vehicleshop:buyVehicle", vehicle.model, vehicle.type)
    }
}