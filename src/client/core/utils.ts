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