declare global {
	interface Date {
		addDays(days: number): Date;
		addHours(hours: number): Date;
		toMysqlString(): string;
	}
}

Date.prototype.addDays = function (days: number) {
	this.setDate(this.getDate() + days);
	return this;
};

Date.prototype.addHours = function (hours: number) {
	this.setTime(this.getTime() + hours * 60 * 60 * 1000);
	return this;
};

Date.prototype.toMysqlString = function () {
	return this.toISOString().slice(0, 19).replace("T", " ");
};

export {};
