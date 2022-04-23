export interface IReport {
	id: number;
	serverId: string;
	message: string;
	takenById?: string;
	dt: number;
}
