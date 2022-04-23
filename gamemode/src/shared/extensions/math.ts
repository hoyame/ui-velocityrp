declare global {
	interface Math {
		roundTo: (value: number, digits: number) => number;
		randomRange: (min: number, max: number) => number;
		clamp: (value: number, min: number, max: number) => number;
	}
}

(() => {
	Math.roundTo = (value: number, digits: number) => {
		return Number(Math.round(Number(value + "e" + digits)) + "e-" + digits);
	};

	Math.randomRange = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};

	Math.clamp = (value: number, min: number, max: number) => {
		return Math.min(Math.max(value, min), max);
	};
})();

export {};
