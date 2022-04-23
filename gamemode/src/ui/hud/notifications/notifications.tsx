import React, { useEffect, useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { INotification, NotificationType } from "../../../shared/types/notifications";
import "./notifications.scss";

const Notifications: React.FC = () => {
	const [state, setState] = useState<INotification[]>([]);

	const onMessage = (event: any) => {
		if (event.data.type == "notification") {
			if (event.data?.data?.hide == true) {
				setState(state => state.filter(n => n.id != event.data.data.id));
				return;
			}

			const notification = event.data.data as INotification;
			if (!!notification) {
				setState(state => [...state, notification]);
				setTimeout(() => setState(state => state.filter(n => n.id !== notification.id)), notification.timeout - 600);
			}
		}
	};

	React.useEffect(() => {
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	});

	const getClassName = (type: NotificationType) => {
		switch (type) {
			case NotificationType.Error:
				return "error";
			case NotificationType.Success:
				return "success";
			case NotificationType.Warning:
				return "warning";
			default:
				return "";
		}
	};

	const parseText = (text: string) => {
		const escaped = text
			.replace(/\\/g, "\\\\") // first replace the escape character
			.replace(/[*#[\]_|`]/g, x => "\\" + x) // then escape any special characters
			.replace(/---/g, "\\-\\-\\-") // hyphens only if it's 3 or more
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");

		return escaped
			.replaceAll("~n~", "<br/>")
			.replaceAll("~r~", '</span><span class="color-red">')
			.replaceAll("~g~", '</span><span class="color-green">')
			.replaceAll("~b~", '</span><span class="color-blue">')
			.replaceAll("~y~", '</span><span class="color-yellow">')
			.replaceAll("~w~", '</span><span class="color-white">')
			.replace("</span>", "");
	};

	return (
		<div className="notifications-container">
			<TransitionGroup>
				{state.map(notification => (
					<CSSTransition key={notification.id} classNames="notification" timeout={300}>
						<div className={`notification ${getClassName(notification.type)}`}>
							<div className={!!notification.header ? "content advanced-notification" : "content"}>
								{!!notification.header && (
									<div className="notification-header">
										{!!notification.icon && <img src={`notifications/${notification.icon}.png`} alt="" />}
										<div>
											<h2 dangerouslySetInnerHTML={{ __html: parseText(notification.header.title) }}></h2>
											<h2 dangerouslySetInnerHTML={{ __html: parseText(notification.header.subtitle) }}></h2>
										</div>
									</div>
								)}
								{!notification.header && !!notification.icon && (
									<img src={`notifications/${notification.icon}.png`} alt="" />
								)}
								<p dangerouslySetInnerHTML={{ __html: parseText(notification.message) }}></p>
							</div>
							<div className="time-bar" style={{ animationDuration: notification.timeout + "ms" }}></div>
						</div>
					</CSSTransition>
				))}
			</TransitionGroup>
		</div>
	);
};

export default Notifications;
