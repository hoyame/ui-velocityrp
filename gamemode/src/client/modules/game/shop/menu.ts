import { ItemId, ItemsConfig } from "../../../../shared/config/items";
import { Inventory } from "../../../player/inventory";
import { Money } from "../../../player/money";
import { CoraUI } from "../../../core/coraui";

export const OpenShopMenu = (items: ItemId[]) => {
	let btn = items.map(i => ({
		name: ItemsConfig[i].name,
		rightText: "~g~" + ItemsConfig[i].buyPrice + " $",
		onClick: () => Inventory.buyItem(i),
	}));

	CoraUI.openMenu({
		name: "Superettes",
		subtitle: "Achetter un objet",
		glare: true,
		onOpen: () => FreezeEntityPosition(PlayerPedId(), true),
		onClose: () => FreezeEntityPosition(PlayerPedId(), false),
		buttons: btn,
	});
};

export const OpenDarkShopMenu = (items: ItemId[]) => {
	let btn = items.map(i => ({
		name: ItemsConfig[i].name,
		rightText: "~g~" + ItemsConfig[i].buyPrice + " $",
		onClick: () => Inventory.buyItem(i),
	}));

	CoraUI.openMenu({
		name: "Dark shop",
		subtitle: "Achetter un objet",
		glare: true,
		onOpen: () => FreezeEntityPosition(PlayerPedId(), true),
		onClose: () => FreezeEntityPosition(PlayerPedId(), false),
		buttons: btn,
	});
};
