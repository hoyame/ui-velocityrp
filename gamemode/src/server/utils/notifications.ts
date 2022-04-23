import { NotificationType } from "../../shared/types/notifications";

export const SendNotification = (
	source: number | string,
	message: string,
	icon = "",
	type: NotificationType = NotificationType.Info,
	timeout: number = 10000
) => {
	emitNet("gm:player:notify", source, message, icon, type, timeout);
};

export const SendSuccessNotification = (source: number | string, message: string, icon = "", timeout: number = 10000) => {
	emitNet("gm:player:notify", source, message, icon, NotificationType.Success, timeout);
};

export const SendErrorNotification = (source: number | string, message: string, icon = "error", timeout: number = 10000) => {
	emitNet("gm:player:notify", source, message, icon, NotificationType.Error, timeout);
};
