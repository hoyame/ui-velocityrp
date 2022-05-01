import React, { useEffect, useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useNuiEvent } from "../../nui";

import "./notifications.scss";

interface INotification {
    id: number;
    title: string;
    message: string;
    timeout: number;
    advanced?: boolean;
    url?: string;
}

const Notifications: React.FC = () => {
	const [state, setState] = useState<INotification[]>([
		{
			id: 1,
			title: "eifub",
			message: "amonagudum",
			timeout: 5000,
			advanced: false,
			url: ""
		}
	]);
     
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
            .replaceAll("~s~", "")
			.replaceAll("VelocityRP", "")
			.replaceAll("~w~", '</span><span class="color-white">')
			.replace("</span>", "");
	};

    const parseTitle = (text: string) => {
		const escaped = text
			.replace(/\\/g, "\\\\") // first replace the escape character
			.replace(/[*#[\]_|`]/g, x => "\\" + x) // then escape any special characters
			.replace(/---/g, "\\-\\-\\-") // hyphens only if it's 3 or more
			.replace(/&/g, "")
			.replace(/</g, "")
			.replace(/>/g, "");

		return escaped
			.replaceAll("~n~", "")
			.replaceAll("~r~", "")
			.replaceAll("VelocityRP", "")
			.replaceAll("~s~", "")
			.replaceAll("~g~", "")
			.replaceAll("~b~", "")
			.replaceAll("~y~", "")
			.replaceAll("~w~", "")
			.replace("</span>", "");
	};

	return (

        <div className="notifications-container">
            <TransitionGroup>
                {state.map(notification => (
                    <CSSTransition key={notification.id} classNames="notification" timeout={300}>
                        <div className="notification">
                            {
                                notification.advanced && (
                                    <>
                                        <div className="notification-header">
                                            <img className="banner" src={notification.url ? notification.url : "https://cdn.discordapp.com/attachments/857379508747239425/969621675698180164/unknown.png"} />
                                        </div>
                                    </>
                                )
                            }

                        	<div className={!!notification.advanced ? "content advanced-notification" : "content"}>
                                <svg className="scl" width="31" height="42" viewBox="0 0 31 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_d_103_25)"><rect x="14" y="14" width="3" height="34" fill="#7AF903"/></g><defs><filter id="filter0_d_103_25" x="0" y="0" width="31" height="62" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="7"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0.478431 0 0 0 0 0.976471 0 0 0 0 0.0117647 0 0 0 1 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_103_25"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_103_25" result="shape"/></filter></defs>
                                </svg>

                                <div className="icon">
                                    <svg className="svg" width="47.5" height="47.5" viewBox="0 0 59 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g filter="url(#filter0_d_103_31)"><path fill-rule="evenodd" clip-rule="evenodd" d="M28.7729 21.0229C25.7309 21.4068 23.3999 23.6935 23.004 26.6822C22.9568 27.0383 22.9447 27.636 22.9447 29.6002V32.0704L22.8072 32.0961C22.7316 32.1103 22.5215 32.1955 22.3403 32.2854C21.7167 32.595 21.2318 33.1981 21.0578 33.8807C20.9802 34.1853 20.9808 34.7322 21.0591 35.033C21.2423 35.7368 21.7307 36.33 22.381 36.6385C22.9086 36.8888 22.5095 36.8763 29.6091 36.8648L36.0773 36.8543L36.3744 36.7461C37.0717 36.4924 37.6459 35.9197 37.8862 35.2384C38.0071 34.8958 38.0374 34.252 37.9492 33.9016C37.7728 33.2008 37.2933 32.5989 36.6618 32.2854C36.4806 32.1955 36.2705 32.1103 36.1949 32.0961L36.0575 32.0704V29.6002C36.0575 26.9265 36.0386 26.6045 35.8391 25.8645C35.1678 23.3753 33.157 21.5336 30.6142 21.079C30.2114 21.0069 29.1542 20.9747 28.7729 21.0229ZM26.2549 37.8672C26.3085 38.0718 26.6477 38.5811 26.9263 38.8756C28.0909 40.1062 29.8646 40.3521 31.3402 39.4874C31.8737 39.1747 32.6339 38.2993 32.7472 37.8672L32.7687 37.7855H29.5011H26.2335L26.2549 37.8672Z" fill="#7AF903"/></g><defs><filter id="filter0_d_103_31" x="0" y="0" width="59" height="61" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="10.5"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0.435417 0 0 0 0 0.545533 0 0 0 0 0.916667 0 0 0 1 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_103_31"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_103_31" result="shape"/></filter></defs>
                                    </svg>

                                </div>

                                <div>
                                    <p className="title">{notification.title ? parseTitle(notification.title) : "NOTIFICATION"}</p>

                                    <p className="msg" dangerouslySetInnerHTML={{ __html: parseText(notification.message) }}></p>
                                </div>
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
