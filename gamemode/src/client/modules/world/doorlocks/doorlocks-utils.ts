export abstract class DoorlocksUtils {
	public static DrawEntityBoundingBox(entity: number, r: number, g: number, b: number, a: number) {
		const box = this.GetEntityBoundingBox(entity);
		this.DrawBoundingBox(box, r, g, b, a);
	}

	public static GetEntityBoundingBox(entity: number) {
		const [min, max] = GetModelDimensions(GetEntityModel(entity));
		const pad = 0.001;

		return [
			GetOffsetFromEntityInWorldCoords(entity, min[0] - pad, min[1] - pad, min[2] - pad),
			GetOffsetFromEntityInWorldCoords(entity, max[0] + pad, min[1] - pad, min[2] - pad),
			GetOffsetFromEntityInWorldCoords(entity, max[0] + pad, max[1] + pad, min[2] - pad),
			GetOffsetFromEntityInWorldCoords(entity, min[0] - pad, max[1] + pad, min[2] - pad),
			GetOffsetFromEntityInWorldCoords(entity, min[0] - pad, min[1] - pad, max[2] + pad),
			GetOffsetFromEntityInWorldCoords(entity, max[0] + pad, min[1] - pad, max[2] + pad),
			GetOffsetFromEntityInWorldCoords(entity, max[0] + pad, max[1] + pad, max[2] + pad),
			GetOffsetFromEntityInWorldCoords(entity, min[0] - pad, max[1] + pad, max[2] + pad),
		];
	}

	public static DrawBoundingBox(box: number[][], r: number, g: number, b: number, a: number) {
		const polyMatrix = this.GetBoundingBoxPolyMatrix(box);
		const edgeMatrix = this.GetBoundingBoxEdgeMatrix(box);

		this.DrawPolyMatrix(polyMatrix, r, g, b, a);
		this.DrawEdgeMatrix(edgeMatrix, 255, 255, 255, 255);
	}

	public static GetBoundingBoxPolyMatrix(box: number[][]) {
		return [
			[box[2], box[1], box[0]],
			[box[3], box[2], box[0]],
			[box[4], box[5], box[6]],
			[box[4], box[6], box[7]],
			[box[2], box[3], box[6]],
			[box[7], box[6], box[3]],
			[box[0], box[1], box[4]],
			[box[5], box[4], box[1]],
			[box[1], box[2], box[5]],
			[box[2], box[6], box[5]],
			[box[4], box[7], box[3]],
			[box[4], box[3], box[0]],
		];
	}

	public static GetBoundingBoxEdgeMatrix(box: number[][]) {
		return [
			[box[0], box[1]],
			[box[1], box[2]],
			[box[2], box[3]],
			[box[3], box[0]],
			[box[4], box[5]],
			[box[5], box[6]],
			[box[6], box[7]],
			[box[7], box[4]],
			[box[0], box[4]],
			[box[1], box[5]],
			[box[2], box[6]],
			[box[3], box[7]],
		];
	}

	public static DrawPolyMatrix(polyCollection: number[][][], r: number, g: number, b: number, a: number) {
		for (const poly of polyCollection) {
			DrawPoly(
				poly[0][0],
				poly[0][1],
				poly[0][2],
				poly[1][0],
				poly[1][1],
				poly[1][2],
				poly[2][0],
				poly[2][1],
				poly[2][2],
				r,
				g,
				b,
				a
			);
		}
	}

	public static DrawEdgeMatrix(linesCollection: number[][][], r: number, g: number, b: number, a: number) {
		for (const line of linesCollection) {
			DrawLine(line[0][0], line[0][1], line[0][2], line[1][0], line[1][1], line[1][2], r, g, b, a);
		}
	}
}
