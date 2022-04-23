import Config from "../../shared/config/server.json";

export abstract class Misc {
	public static async initialize() {
		onNet("gm:dev:printCoords", (x: number, y: number, z: number, heading: number) => {
			console.log("[" + x + ", " + y + ", " + z + "]");
			console.log("{ x:" + x + ", y:" + y + ", z:" + z + "}");
			console.log('{ "x":' + x + ', "y":' + y + ', "z":' + z + "}");
			console.log('{ "x":' + x + ', "y":' + y + ', "z":' + z + ', "heading":' + heading + "}");

			console.log(x, y, z);

			console.log("heading : " + heading);
		});

		onNet("gameEventTriggered", (name: string, args: any[]) => {
			console.log(`Game event ${name} ${args.join(", ")}`);
		});

		if (Config["meteo-timer"] == true) {
			const timer = 60000 * 15;
			let index = 0;

			setInterval(() => {
				if (index >= 5) {
					index = 0;
				}

				const meteo = Config["meteo-options"][index];

				emitNet("gm:updateWeather", meteo);
				index++;
			}, timer);
		}
	}
}
