import { Vector3 } from "@wdesgardin/fivem-js";
import { Delay } from "../../shared/utils/utils";

export class Instance {
	public static async initialize() {
		console.log("[GM] | [Core] - Instanec Load");

		onNet("gm:inst:enter", (id?: any) => {
			let src = source;

			this.enter(src, id);
		});

		onNet("gm:inst:create", () => {
			let src = source;

			this.create(src);
		});

		onNet("gm:inst:leave", async (clear?: boolean) => {
			let src = source;

			if (clear) {
				const dist = Math.max(0, Math.min(Number(1500) || 5, 50));
				const pos = Vector3.fromArray(GetEntityCoords(GetPlayerPed(source)));
				let deleted = 0;

				for (const vehicle of GetAllVehicles() as number[]) {
					if (DoesEntityExist(vehicle) && pos.distance(Vector3.fromArray(GetEntityCoords(vehicle))) <= dist) {
						DeleteEntity(vehicle);
						deleted++;
					}
				}

				await Delay(5000);
			}

			this.leave(src);
		});

		onNet("gm:inst:joinPlayer", (targetId: string) => {
			const targetBucket = GetPlayerRoutingBucket(targetId);
			if (!!targetBucket) this.enter(source, targetBucket);
		});

		// entity

		onNet("gm:inst:enterEntity", (entity: any, bucket: any) => {
			this.enterEntity(entity, bucket);
		});

		onNet("gm:inst:createEntity", (entity: any, bucket: any) => {
			this.createEntity(entity, bucket);
		});

		onNet("gm:inst:leaveEntity", (entity: any) => {
			this.leaveEntity(entity);
		});
	}

	public static enter(source: any, instanceId: number) {
		SetPlayerRoutingBucket(source, instanceId);
		console.log(
			'[GM][Player] | [Instance] - Player "' + GetPlayerName(source) + '" Enter Instance : ' + GetPlayerRoutingBucket(source)
		);
	}

	public static create(source: any) {
		SetPlayerRoutingBucket(source, source);
		console.log(
			'[GM][Player] | [Instance] - Player "' + GetPlayerName(source) + '" Create Instance : ' + GetPlayerRoutingBucket(source)
		);
	}

	public static leave(source: any) {
		SetPlayerRoutingBucket(source, 0);
		console.log(
			'[GM][Player] | [Instance] - Player "' + GetPlayerName(source) + '" Leave Instance : ' + GetPlayerRoutingBucket(source)
		);
	}

	// entity

	public static enterEntity(entity: any, bucket: number) {
		SetEntityRoutingBucket(entity, bucket);
		console.log(
			'[GM][Player] | [Instance] - Entity "' + GetPlayerName(source) + '" Enter Instance : ' + GetEntityRoutingBucket(entity)
		);
	}

	public static createEntity(entity: any, bucket: any) {
		SetEntityRoutingBucket(entity, bucket);
		console.log(
			'[GM][Player] | [Instance] - Entity "' + GetPlayerName(source) + '" Create Instance : ' + GetEntityRoutingBucket(entity)
		);
	}

	public static leaveEntity(entity: any) {
		SetEntityRoutingBucket(entity, 0);
		console.log(
			'[GM][Player] | [Instance] - Entity "' + GetPlayerName(source) + '" Leave Instance : ' + GetPlayerRoutingBucket(source)
		);
	}
}
