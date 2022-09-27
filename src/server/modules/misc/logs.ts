import LogsConfig from "../../../shared/data/logs.json";

export enum LogsKeys {
	Anticheat,
}

const LogsLinks = [LogsConfig.anticheat];

export abstract class Logs {
	public static async intialize() {}

	public static sendLogs(type: any, message: any) {
		if (LogsLinks[type]) {
			this.send(LogsLinks[type], message);
		}
	}

	private static send(link: string, message: any) {}
}
