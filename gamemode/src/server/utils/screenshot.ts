export class File {
	name: string;
	content: Buffer;

	constructor(name: string, content: Buffer) {
		this.name = name;
		this.content = content;
	}
}

export abstract class ScreenshotUtils {
	static takeScreenshot(player: string | number, options = { encoding: "jpg", quality: 0.92 }) {
		return new Promise<File>((resolve, reject) => {
			global.exports["screenshot-basic"].requestClientScreenshot(player, options, (errorMessage: string | false, dataUri: string) => {
				if (errorMessage) {
					return reject(new Error(errorMessage));
				}

				const extension = dataUri.substring(dataUri.indexOf("/") + 1, dataUri.indexOf(";"));
				const base64Data = dataUri.substring(dataUri.indexOf(",") + 1);

				resolve(new File(`screenshot.${extension}`, Buffer.from(base64Data, "base64")));
			});
		});
	}
}
