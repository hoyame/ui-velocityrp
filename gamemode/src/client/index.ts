import "../shared/extensions";
import { GaragePrivate } from "./modules/game/garage/garage-private";
import { Properties } from "./modules/game/properties/properties";
import { ContextMenuController } from "./modules/player/context-menu/context-menu";
import { BlipsController } from "./misc/blips";
import { Fuel } from "./modules/game/vehicles/fuel";
import { Fish } from "./modules/game/activity/fishing";
import { Speedometer } from "./modules/game/vehicles/speedometer";
import { Admin } from "./core/admin";
import { Hunting } from "./modules/game/activity/hunting";
import { Misc } from "./misc";
import { Billing } from "./player/billing";
import { Character } from "./player/character";
import { Health } from "./player/health";
import { Inventory } from "./player/inventory";
import { Jobs } from "./player/jobs";
import { Money } from "./player/money";
import { Orgs } from "./player/orgs";
import { Property } from "./player/property";
import { Vehicules } from "./player/vehicules";
import { Lodaout } from "./player/lodaout";
import { Notifications } from "./player/notifications";
import { Needs } from "./player/needs";
import { SafeZone } from "./misc/safezone";
import { RichPresence } from "./misc/richPresence";
import { Lootboxes } from "./modules/game/lootboxes/lootboxes";
import { InteractionPoints } from "./misc/interaction-points";
import { GoFast } from "./modules/game/illegal/gofast";
import { Callouts } from "./modules/game/jobs/callouts";
import { Hud } from "./misc/hud";
import { Barber } from "./modules/player/outfits/barber";
import { Organisation } from "./modules/game/organisation";
import { Tatoos } from "./modules/player/outfits/tatoos";
import { InteractiveObjects } from "./modules/world/interactive-objects";
import { InstructionalButtons } from "./misc/instructional-buttons";
import { Garage as GarageModule } from "./modules/game/garage/garage";
import { EMS } from "./modules/game/jobs/ems";
import { Location } from "./modules/game/location/location";
import { Props } from "./modules/world/props";
// import { DriverSchool } from "./modules/game/driverschool";
import { Fleeca } from "./modules/game/illegal/fleeca";
import { WeaponShop } from "./modules/game/weaponshop";
import { Doorlocks } from "./modules/world/doorlocks/doorlocks";
import { Ltd } from "./modules/game/jobs/ltd";
import { ClothShop } from "./modules/player/outfits/clothShop";
import { RealEstateAgent } from "./modules/game/jobs/realestateagent";
import { Police } from "./modules/game/jobs/police";
import { Taxi } from "./modules/game/jobs/taxi";
import { ScubaDiving } from "./modules/game/activity/scubadiving";
import { Mecano } from "./modules/game/jobs/mecano";
import { Animations } from "./modules/player/animations/menu";
import { Unicorn } from "./modules/game/jobs/unicorn";
import { Keys } from "./modules/game/vehicles/keys";

class Gamemode {
	public static async Initialize() {
		FreezeEntityPosition(PlayerPedId(), false);

		await Admin.initialize();
		await Inventory.initialize();
		await Misc.initialize();
		await Money.initialize();
		await Jobs.initialize();
		await Orgs.initialize();
		await Billing.initialize();
		await Vehicules.initialize();
		await Property.initialize();
		await Health.initialize();

		await GaragePrivate.initialize();
		await Properties.initialize();
		await Fuel.initialize();
		await Speedometer.initialize();
		await Hud.initialize();

		await ContextMenuController.initialize();
		await BlipsController.initialize();
		await Fish.initialize();
		await Hunting.initialize();
		await Notifications.initialize();
		await Needs.initialize();
		await SafeZone.initialize();
		await RichPresence.initialize();
		await Lootboxes.initialize();
		await InteractionPoints.initialize();
		await GoFast.initialize();
		await Callouts.initialize();
		await Lodaout.initialize();

		await Barber.initialize();
		await Tatoos.initialize();
		await Organisation.initialize();
		await InteractiveObjects.initialize();
		await Doorlocks.initialize();
		await InstructionalButtons.initialize();
		await Props.initialize();

		await GarageModule.initialize();
		await EMS.initialize();
		await Ltd.initialize();
		await Taxi.initialize();
		await Location.initialize();
		await Fleeca.initialize();
		await ClothShop.initialize();

		await Character.initialize();
		// await DriverSchool.initialize();
		await WeaponShop.initialize();
		await RealEstateAgent.initialize();
		await Police.initialize();
		await ScubaDiving.initialize();

		await Mecano.initialize();
		await Animations.initialize();
		await Unicorn.initialize();
		await Keys.initialize();
		await Animations.initialize();

		console.log("GAMEMODE INITIALIZED");
	}
}

Gamemode.Initialize();
