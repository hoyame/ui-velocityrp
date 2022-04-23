import "../shared/extensions";

//@ts-ignore
global.fetch = require("node-fetch");

import { MySQL } from "./core/mysql";
import { Instance } from "./core/instance";
import { Admin } from "./core/admin";
import { InteractMenu } from "./modules/context-menu/context-menu";
import Anticheat from "./modules/anticheat/anticheat";
import { Roberry } from "./modules/illegal/roberry";
import { PlayersController } from "./player/playersController";
import { CharactersController } from "./player/charactersController";
import { InventoryController } from "./player/inventoryController";
import { HuntingController } from "./modules/activity/huntingController";
import { FishingController } from "./modules/activity/fishingController";
import { DocumentsController } from "./player/documentsController";
import { RichPresence } from "./misc/richPresence";
import { Lootboxes } from "./modules/lootboxes/lootboxes";
import { GoFast } from "./modules/illegal/gofast";
import { Jobs } from "./modules/jobs";
import { Misc } from "./misc";
import { OrganisationController } from "./modules/organisation/controller";
import { EMS } from "./modules/jobs/ems";
import { VehiclesController } from "./player/vehiclesController";
import { JobController } from "./player/jobController";
import { OrgController } from "./player/orgController";
import { GaragesController } from "./modules/garage/controller";
import { PropertiesController } from "./modules/property/controller";
import { Fleeca } from "./modules/illegal/fleeca";
import { Doorlocks } from "./modules/world/doorlocks/doorlocks";
import { Ltd } from "./modules/jobs/ltd";
import { Police } from "./modules/jobs/police";
import { ClothesController } from "./player/clothesController";
import { WorldGrid } from "./core/worldGrid";
import { CompaniesController } from "./modules/companies/controller";
import { Taxi } from "./modules/jobs/taxi";
import { ScubaDiving } from "./modules/activity/scubadiving";
import { Animation } from "./modules/animation/animation";

class Gamemode {
	public static async Initialize() {
		await MySQL.initialize();
		await WorldGrid.initialize();
		await PlayersController.initialize();
		await Instance.initialize();
		await InteractMenu.Initialize();
		await Admin.initialize();
		//await Anticheat.initialize();
		await Roberry.initialize();
		await Doorlocks.initialize();
		await CharactersController.initialize();
		await InventoryController.initialize();
		await DocumentsController.initialize();
		await OrganisationController.initialize();
		await VehiclesController.initialize();
		await JobController.initialize();
		await OrgController.initialize();
		await HuntingController.initialize();
		await FishingController.initialize();
		await RichPresence.initialize();
		await Lootboxes.initialize();
		await GoFast.initialize();
		await Jobs.initialize();
		await EMS.initialize();
		await Ltd.initialize();
		await Taxi.initialize();
		await Misc.initialize();
		await GaragesController.initialize();
		await PropertiesController.initialize();
		await Fleeca.initialize();
		await Police.initialize();
		await ClothesController.initialize();
		await CompaniesController.initialize();
		await ScubaDiving.initialize();
		await Animation.initialize();

		console.log("GAMEMODE INITIALIZED");
	}
}

Gamemode.Initialize();
