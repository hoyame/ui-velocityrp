import React, { useState } from 'react';

import './style.scss';

interface IInteractionMenu {
    title: string;
    description: string;
}

const Menu = (props?: IInteractionMenu) => {
    const [input, setInput] = useState('')

    const close = () => {
        fetch(`https://${location.hostname.replace("cfx-nui-", "")}/close`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(true)
        })
    }

    const push = () => {
        fetch(`https://${location.hostname.replace("cfx-nui-", "")}/push`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(input)
        })
    }

    return (
        <>
            <img style={{
                position: 'absolute',
                top: 15,
                left: 15,
                width: 50,
                opacity: 1
            }} src="https://cdn.discordapp.com/attachments/749017234743099423/1014504170100887552/256X256_d1.png" />

            <p className="title">{props.title}</p>

            <p className="description">{props.description || 'Entrez la z'}</p>
        
            <div className="input">
                <textarea value={input} onChange={(e) => setInput(e.target.value)}></textarea>
            </div>

            <div className="buttons">
                <div className="interact" onClick={() => {
                    push()
                }}>
                    Accepter
                </div>

                <div className="quit" onClick={() => {
                    close();  
                }}>
                    Quitter
                </div>
            </div>
        </>
    )
}

const InteractionMenu = () => {
    const [data, setState] = useState<any>({}) 

    const onMessage = (event: any) => {
        if (event.data.type == "interaction") {
            setState(event.data.content)
		}
	};

    React.useEffect(() => {
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	});

    return (
        <div id="interaction">
            {
                data.title && <Menu 
                    title={data.title} 
                    description={data.description} 
                    cbContent={data.cbContent}
                    textLeft={data.textLeft}
                    actionsLeft={data.actionsLeft}
                    textRight={data.textRight}
                    actionsRight={data.actionsRight}
                /> 
            }
        </div>
    );
}

export default InteractionMenu;