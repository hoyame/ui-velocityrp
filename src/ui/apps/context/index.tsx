import React, { useState } from "react";
import { IContextComponent } from "../../../shared/data/context"

import './style.scss';

// 👋 Saluer

const Context = () => {
    const [state, setState] = useState<IContextComponent[]>([])
    const [dark, setDark] = useState(false)

    const onMessage = (event: any) => {
        if (event.data.type == "context") {
            setState([])
            setState(event.data.data.menu)
            setDark(event.data.dark)
            console.log("dark")
            console.log(event.data.dark)
		}
	};

    const close = () => {
        fetch(`https://${location.hostname.replace("cfx-nui-", "")}/close`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(true)
        })
    }

    
    const onClick = (id: number) => {
        fetch(`https://${location.hostname.replace("cfx-nui-", "")}/onClick`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(id)
        })
    }

    React.useEffect(() => {
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	});

    const Component = (props: IContextComponent) => {
        return (
            <li>
                <a className={dark ? "dark" : "light"} onClick={() => onClick(props.id)}>
                    <span>{props.text}</span>
                </a>
            </li>
        )
    }

    return (
        <div className="context">
            <div className={dark ? "pointer dark" : "pointer light"} onClick={() => close()}>
                <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_173_115)"><path d="M21.1521 19.5012L26.7604 13.8927C26.9146 13.7383 26.9998 13.5323 27 13.3127C27 13.0929 26.9149 12.8867 26.7604 12.7326L26.2689 12.2412C26.1144 12.0865 25.9084 12.0017 25.6885 12.0017C25.469 12.0017 25.263 12.0865 25.1085 12.2412L19.5002 17.8494L13.8917 12.2412C13.7374 12.0865 13.5313 12.0017 13.3116 12.0017C13.0921 12.0017 12.886 12.0865 12.7317 12.2412L12.24 12.7326C11.92 13.0526 11.92 13.5731 12.24 13.8927L17.8484 19.5012L12.24 25.1095C12.0856 25.2641 12.0006 25.4701 12.0006 25.6898C12.0006 25.9094 12.0856 26.1154 12.24 26.2699L12.7316 26.7612C12.8859 26.9159 13.0921 27.0007 13.3115 27.0007C13.5312 27.0007 13.7373 26.9159 13.8916 26.7612L19.5001 21.1529L25.1084 26.7612C25.2629 26.9159 25.4689 27.0007 25.6884 27.0007H25.6887C25.9083 27.0007 26.1143 26.9159 26.2688 26.7612L26.7602 26.2699C26.9145 26.1155 26.9996 25.9094 26.9996 25.6898C26.9996 25.4701 26.9145 25.2641 26.7602 25.1096L21.1521 19.5012Z" fill="#ED5749"/></g><defs><filter id="filter0_d_173_115" x="0" y="0" width="39" height="39" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="6"/><feColorMatrix type="matrix" values="0 0 0 0 0.929412 0 0 0 0 0.341176 0 0 0 0 0.286275 0 0 0 0.5 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_173_115"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_173_115" result="shape"/></filter><clipPath id="clip0_173_115"><rect width="15" height="15" fill="white" transform="translate(12 12)"/></clipPath></defs>
                </svg>
            </div>
        
            <ul className="container">
                {
                    state.map((v, k) => {
                        return <Component key={k} {...v} />
                    })
                }
            </ul>
        </div>
    )
}

export default Context;