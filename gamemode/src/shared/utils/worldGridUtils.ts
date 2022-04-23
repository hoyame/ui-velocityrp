import { Vec3 } from "@wdesgardin/fivem-js/lib/utils/Vector3";

export interface WorldCell {
	x: number;
	y: number;
}

export abstract class WorldGridUtils {
	public static readonly cellSize = 50;
	public static readonly minX = -3800;
	public static readonly maxX = 4500;
	public static readonly minY = -4400;
	public static readonly maxY = 8000;

	public static getCell(x: number, y: number): WorldCell {
		x = Math.clamp(x + Math.abs(this.minX), 0, WorldGridUtils.maxX + Math.abs(this.minX));
		y = Math.clamp(y + Math.abs(this.minY), 0, WorldGridUtils.maxY + Math.abs(this.minY));

		return {
			x: Math.floor(x / WorldGridUtils.cellSize),
			y: Math.floor(y / WorldGridUtils.cellSize),
		};
	}

	public static getPositionCell(position: Vec3): WorldCell {
		return WorldGridUtils.getCell(position.x, position.z);
	}

	public static getCells(x: number, y: number): WorldCell[] {
		const cell = WorldGridUtils.getCell(x, y);
		const cells = [];

		for (const x of [-1, 0, 1]) {
			for (const y of [-1, 0, 1]) {
				cells.push({ x: cell.x + x, y: cell.y + y });
			}
		}

		return cells;
	}

	public static getNearbyCells(cell: WorldCell): WorldCell[] {
		const cells = [];

		for (const x of [-1, 0, 1]) {
			for (const y of [-1, 0, 1]) {
				cells.push({ x: cell.x + x, y: cell.y + y });
			}
		}

		return cells;
	}

	public static getPositionCells(position: Vec3): WorldCell[] {
		return WorldGridUtils.getCells(position.x, position.z);
	}
}
