import { Delay } from "../../shared/utils/utils";
import { WorldCell, WorldGridUtils } from "../../shared/utils/worldGridUtils";

export abstract class WorldGrid {
	private static playersByCells: number[][][] = [];
	private static cellByPlayer: { [id: number]: WorldCell } = {};

	public static async initialize() {
		this.playersByCells = this.createGrid();
		setTick(this.mainTick.bind(this));
	}

	public static async mainTick() {
		const newPlayersByCells = this.createGrid();
		const newCellByPlayer: { [id: number]: WorldCell } = {};

		const players = getPlayers();

		for (let i = 0; i < players.length; i = i + 100) {
			await Delay(200);
			const max = Math.min(i + 100, players.length);

			for (let j = i; j < max; j++) {
				const player = players[j];

				const ped = GetPlayerPed(player.toString());
				if (DoesEntityExist(ped)) {
					const pos = GetEntityCoords(ped);
					const newCell = WorldGridUtils.getCell(pos[0], pos[1]);

					newPlayersByCells[newCell.x][newCell.y].push(player);
					newCellByPlayer[player] = newCell;
				}
			}
		}

		this.cellByPlayer = newCellByPlayer;
		this.playersByCells = newPlayersByCells;

		await Delay(2000);
	}

	public static getNearbyPlayers(player: number): number[] {
		const players: number[] = [];

		const playerCell = this.cellByPlayer[player];
		if (!playerCell) return players;

		for (const cell of WorldGridUtils.getNearbyCells(playerCell)) {
			players.push(...this.playersByCells[cell.x][cell.y]);
		}

		return players;
	}

	private static createGrid() {
		const rows = (WorldGridUtils.maxY + Math.abs(WorldGridUtils.minY)) / WorldGridUtils.cellSize;
		const cols = (WorldGridUtils.maxX + Math.abs(WorldGridUtils.minX)) / WorldGridUtils.cellSize;
		const grid: number[][][] = [];
		for (let x = 0; x < cols; x++) {
			grid.push([]);
			for (let y = 0; y < rows; y++) {
				grid[x].push([]);
				grid[x][y] = [];
			}
		}

		return grid;
	}
}
