import { Delay } from "../../../shared/utils/utils";
import { Nui } from "../../core/nui";
import { hexToRgb, TriggerServerCallbackAsync } from "../../core/utils";
import Vehicle from "../../core/vehicle";

export abstract class Cardealer {
    private static data: any;
    private static cam: any;
    private static lastVeh: any;
    private static shop: any;

    public static async initialize() {
        await this.grabData()

        Nui.RegisterCallback("spawnCar", (data: any) => this.spawnCar(data));
        Nui.RegisterCallback("setColor", (data: any) => this.setColor(data));
        Nui.RegisterCallback("buyVehicle", (data: any) => this.buyVehicle(data));
        Nui.RegisterCallback("grabData", () => this.grabDataNUI());
        
        Nui.RegisterCallback("leave", () => this.disableCam());

        onNet('hoyame:cardealer:close', () => {
            this.disableCam();
        })

        on('hoyame:cardealer:open', (shop: string) => {
            this.open(shop);
            this.enableCam(shop);
        })
    }

    public static async open(shop: string) {
        Nui.SendMessage({ path: "cardealer" });
        Nui.SendMessage({ type: "cardealer", data: this.data, shop: shop });
        this.shop = shop;

        DisplayRadar(false);
        Nui.SetFocus(true, true, false);
    }

    public static close() {
        Nui.SendMessage({ path: "" });
        DisplayRadar(true);
        Nui.SetFocus(false, false, false);
        this.shop = null;

    }

    private static async grabData() {
        const data = await TriggerServerCallbackAsync('hoyame:cardealer:returnData');
        this.data = data;
    }

    private static async grabDataNUI() {
        const data = await TriggerServerCallbackAsync('hoyame:cardealer:returnData');
        Nui.SendMessage({ type: "cardealer", data: this.data, shop: this.shop });
        this.data = data;
    }

    private static enableCam(shop: string) {
        console.log("bzuifbzefbziufbziebgeizbg")
        console.log(shop)
        if (shop == "carshop") {
            this.cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", false)
            SetCamActive(this.cam, true)
            SetCamCoord(this.cam, -41.046, -1094.127, 28.073)
            SetCamFov(this.cam, 50.0)
            PointCamAtCoord(this.cam, -47.177, -1092.30, 27.302)
            RenderScriptCams(true, true, 1500, true, true)
            FreezeEntityPosition(PlayerPedId(), true)
            SetEntityVisible(PlayerPedId(), false, false);

            this.spawnCar({model: "asbo"})
        } else if (shop == "planeshop") {
            this.cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", false)
            SetCamActive(this.cam, true)
            SetCamCoord(this.cam, -967.869, -2975.583, 13.945)
            SetCamFov(this.cam, 50.0)
            PointCamAtCoord(this.cam, -962.527, -2965.897, 13.945)
            RenderScriptCams(true, true, 1500, true, true)
            FreezeEntityPosition(PlayerPedId(), true)
            SetEntityVisible(PlayerPedId(), false, false);

            this.spawnCar({model: "frogger"})
        } else if (shop == "boatshop") {
            this.cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", false)
            SetCamActive(this.cam, true)
            SetCamCoord(this.cam, 568.757, -3136.3957, 2.951)
            SetCamFov(this.cam, 35.0)
            PointCamAtCoord(this.cam, 568.658, -3164.614, 2.951)
            RenderScriptCams(true, true, 1500, true, true)
            FreezeEntityPosition(PlayerPedId(), true)
            SetEntityVisible(PlayerPedId(), false, false);

            this.spawnCar({model: "seashark"})
        }

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
        this.shop = null;
    }

    private static async spawnCar(vehicle: any) {
        if (this.lastVeh) DeleteVehicle(this.lastVeh);
        this.shop == "carshop" && ( this.lastVeh = await Vehicle.spawnVehicle(vehicle.model, null, [-47.177, -1092.30, 27.302, 285.77], false, false, true))
        this.shop == "planeshop" && ( this.lastVeh = await Vehicle.spawnVehicle(vehicle.model, null, [-962.527, -2965.897, 13.945, 205.77], false, false, true))
        this.shop == "boatshop" && ( this.lastVeh = await Vehicle.spawnVehicle(vehicle.model, null, [568.658, -3164.614, 2.951, 285.77], false, false, true))   
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