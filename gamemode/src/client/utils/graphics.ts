export abstract class Graphics {
	public static DrawText(x: number, y: number, scale: number, font: number, text: string) {
		SetTextFont(font);
		SetTextScale(scale, scale);
		SetTextColour(255, 255, 255, 255);
		SetTextJustification(1);
		BeginTextCommandDisplayText("STRING");
		AddTextComponentSubstringPlayerName(text);
		EndTextCommandDisplayText(x, y);
	}
}
