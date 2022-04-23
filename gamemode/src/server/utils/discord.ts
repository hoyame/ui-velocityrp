import { File } from "./screenshot";
import FormData from "form-data";
import fetch from "node-fetch";
import Config from "../../shared/config/webhooks.json";

export abstract class DiscordUtils {
	static async SendPlayerScreenshot(title: string, image: File) {
		const formData = new FormData();
		formData.append("payload_json", JSON.stringify({ embeds: [{ title: title, image: { url: "attachment://" + image.name } }] }));
		formData.append("file", image.content, { filename: image.name });

		await fetch(Config.screenshotsWebhook, {
			method: "POST",
			headers: formData.getHeaders(),
			body: formData,
		});
	}

	static async SendAdminLog(log: string) {
		await this.SendLog(log, Config.adminLogsWebhook);
	}

	static async SendFleecaLog(log: string) {
		await this.SendLog(log, Config.fleecaWebhook);
	}

	static async SendLog(log: string, url: string) {
		await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ content: log }),
		});
	}
}
