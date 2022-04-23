export abstract class Environnment {
	private static _isDev?: boolean;

	public static get IsDev() {
		if (this._isDev) return this._isDev;
		this._isDev = !!GetConvarInt("IS_DEV", 0);
		return this._isDev;
	}
}
