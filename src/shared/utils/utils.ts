export async function Delay(ms: number) {
	return new Promise(res => setTimeout(res, ms));
}

export function CheckTbl(tbl: any, value: any) {
	let status = false;

	tbl.forEach((v: any) => {
		if (value == v) {
			status = true;
		}
	});

	return status;
}

export function isEqualObjects(a: any, b: any) {
	if (!a && !b) return true;
	if (!a || !b) return false;

	// if the number of keys is different, they are different
	if (Object.keys(a).length !== Object.keys(b).length) {
		return false;
	}

	for (const key in a) {
		const a_value = a[key];
		const b_value = b[key];
		// If the value is an object, check if they're different objects
		// If it isn't, uses !== to check
		if ((a_value instanceof Object && !isEqualObjects(a_value, b_value)) || (!(a_value instanceof Object) && a_value !== b_value)) {
			return false;
		}
	}
	return true;
}
