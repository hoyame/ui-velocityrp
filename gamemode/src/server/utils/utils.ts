export abstract class Utils {
	public static GenerateUUID() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
			const r = (Math.random() * 16) | 0,
				v = c == "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	public static CheckTbl(tbl: any, value: any) {
		let status = false;

		tbl.forEach((v: any) => {
			console.log(v, value);
			if (value == v) {
				status = true;
			}
		});

		return status;
	}

	public static isEqualObjects = (a: any, b: any) => {
		if (Object.keys(a).length !== Object.keys(b).length) {
			return false;
		}

		for (const key in a) {
			const a_value = a[key];
			const b_value = b[key];
			// If the value is an object, check if they're different objects
			// If it isn't, uses !== to check
			if (
				(a_value instanceof Object && !Utils.isEqualObjects(a_value, b_value)) ||
				(!(a_value instanceof Object) && a_value !== b_value)
			) {
				return false;
			}
		}
		return true;
	};
}
