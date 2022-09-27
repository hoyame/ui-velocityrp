export interface INotification {
	id: number;
	title: string;
	message: string;
	timeout: number;
	advanced?: boolean;
	url?: string;
}
