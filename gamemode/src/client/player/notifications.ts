import { INotification, NotificationType } from "../../shared/types/notifications";
import { Nui } from "../utils/nui";

export abstract class Notifications {
	private static notificationId = 0;

	public static async initialize() {
		onNet("gm:player:notify", this.Show.bind(this));
		on("gm:player:localnotify", this.Show.bind(this));
	}

	public static ShowAdvanced(
		message: string,
		title: string,
		subtitle: string,
		icon = "",
		type: NotificationType = NotificationType.Info,
		timeout: number = 10000
	) {
		const notification: INotification = { id: ++this.notificationId, message, timeout, icon, type, header: { title, subtitle } };
		Nui.SendMessage({ type: "notification", data: notification });
		return notification.id;
	}

	public static Show(message: string, icon = "", type: NotificationType = NotificationType.Info, timeout: number = 10000) {
		const notification: INotification = { id: ++this.notificationId, message, timeout, icon, type };
		Nui.SendMessage({ type: "notification", data: notification });
		return notification.id;
	}

	public static ShowError(message: string, icon = "error", timeout: number = 10000) {
		return this.Show(message, icon, NotificationType.Error, timeout);
	}

	public static ShowSuccess(message: string, icon = "", timeout: number = 10000) {
		return this.Show(message, icon, NotificationType.Success, timeout);
	}

	public static ShowWarning(message: string, icon = "error", timeout: number = 10000) {
		return this.Show(message, icon, NotificationType.Warning, timeout);
	}

	public static Hide(id: number) {
		Nui.SendMessage({ type: "notification", data: { id, hide: true } });
	}
}
