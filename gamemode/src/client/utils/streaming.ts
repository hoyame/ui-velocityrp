export abstract class Streaming {
	private static timeOut: number = 6000;

	public static RequestClipsetAsync(clipset: string) {
		return new Promise(resolve => {
			if (HasClipSetLoaded(clipset)) resolve(true);

			RequestClipSet(clipset);
			const start = GetGameTimer();

			const interval = setInterval(() => {
				const hasClipsetLoaded = HasClipSetLoaded(clipset);
				if (hasClipsetLoaded || GetGameTimer() - start > this.timeOut) {
					clearInterval(interval);
					resolve(hasClipsetLoaded);
				}
			}, 200);
		});
	}

	public static RequestAnimDictionnaryAsync(animDict: string): Promise<boolean> {
		return new Promise(resolve => {
			if (!DoesAnimDictExist(animDict)) resolve(false);
			if (HasAnimDictLoaded(animDict)) resolve(true);

			RequestAnimDict(animDict);
			const start = GetGameTimer();

			const interval = setInterval(() => {
				const hasAnimDictLoaded = HasAnimDictLoaded(animDict);
				if (hasAnimDictLoaded || GetGameTimer() - start > this.timeOut) {
					clearInterval(interval);
					resolve(hasAnimDictLoaded);
				}
			}, 200);
		});
	}

	public static RequestModelAsync(model: string | number): Promise<boolean> {
		return new Promise(resolve => {
			if (!IsModelInCdimage(model)) resolve(false);
			if (HasModelLoaded(model)) resolve(true);

			RequestModel(model);
			const start = GetGameTimer();

			const interval = setInterval(() => {
				const loaded = HasModelLoaded(model);
				if (loaded || GetGameTimer() - start > this.timeOut) {
					clearInterval(interval);
					resolve(loaded);
				}
			}, 200);
		});
	}

	public static RequestTextureDictionnaryAsync(textDict: string): Promise<boolean> {
		return new Promise(resolve => {
			if (HasStreamedTextureDictLoaded(textDict)) resolve(true);

			RequestStreamedTextureDict(textDict, true);
			const start = GetGameTimer();

			const interval = setInterval(() => {
				const hasAnimDictLoaded = HasStreamedTextureDictLoaded(textDict);
				if (hasAnimDictLoaded || GetGameTimer() - start > this.timeOut) {
					clearInterval(interval);
					resolve(hasAnimDictLoaded);
				}
			}, 200);
		});
	}

	public static RequestScaleFormAsync(scaleform: string): Promise<number> {
		return new Promise(resolve => {
			const scale = RequestScaleformMovie(scaleform);

			const start = GetGameTimer();
			const interval = setInterval(() => {
				const loaded = HasScaleformMovieLoaded(scale);
				if (loaded || GetGameTimer() - start > this.timeOut) {
					clearInterval(interval);
					resolve(loaded ? scale : -1);
				}
			}, 200);
		});
	}
}
