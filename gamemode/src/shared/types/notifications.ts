export interface INotification {
	id: number;
	message: string;
	header?: {
		title: string;
		subtitle: string;
	};
	icon: string;
	type: NotificationType;
	timeout: number;
}

export enum NotificationType {
	Info,
	Success,
	Warning,
	Error,
}
