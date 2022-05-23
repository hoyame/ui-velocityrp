import { enumValues } from "@nativewrappers/client";
import React, { useState } from "react";

import './style.scss'

const ArmePage = () => {
    const [specif, setSpecif] = useState([
        {
            name: "Degats",
            value: 10
        },
        {
            name: "Cadence de tir",
            value: 10
        },
        {
            name: "Precision",
            value: 80
        },
        {
            name: "Portée",
            value: 80
        },
    ])

    const Specifications = (props: { specif: string, value: number}) => {
        console.log(props.value)
        return (
            <div className="specification">
                <svg style={{marginLeft: -13, marginBottom: -8}} width="7" height="7" viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="8" height="8" fill="#8AFA21"/>
                </svg>

                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <p>{props.specif}</p>
                    <p style={{color: "#8AFA21"}}>{props.value}</p>
                </div>

                <div style={{display: "flex", justifyContent: "space-between", marginTop: 8, marginBottom: 2}}>
                    <div className={props.value > 0 ? "indic ba" : "indic"}></div>
                    <div className={props.value > 50 ? "indic ba" : "indic"}></div>
                    <div className={props.value > 125 ? "indic ba" : "indic"}></div>
                    <div className={props.value == 200 ? "indic ba" : "indic"}></div>
                </div>
            </div>
        );
    }

    return (
        <div className="armes">
            <img style={{ height: 65 }} src="https://cdn.discordapp.com/attachments/956333971908730961/975871396968296468/unknown.png" />
        
            <div className="container">
                <div className="it-1">
                    <p style={{fontSize: 30, fontWeight: 600, marginBottom: -3}}>FAMAS</p>
                    <p style={{fontSize: 27, fontWeight: 500, marginBottom: 20, color: "#8AFA21"}}>MK II BULLPUP</p>

                    <p style={{color: "#8AFA21", marginBottom: 15}}>SPECIFICATIONS</p>
                
                    <div style={{marginBottom: 25}}>
                        {
                            specif.map((spec, index) => {
                                return <Specifications specif={spec.name} value={spec.value} key={index} />
                            })
                        }
                    </div>

                    <p style={{color: "#8AFA21", marginBottom: 15}}>COULEURS</p>


                    <div className='colors' style={{marginBottom: 25}}>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                            <div className="elem" onClick={() => null} style={{backgroundColor: "#fed32f"}}></div>
                            <div className="elem" onClick={() => null} style={{backgroundColor: "#cc2e2d"}}></div>
                            <div className="elem" onClick={() => null} style={{backgroundColor: "#23c5d0"}}></div>
                            <div className="elem" onClick={() => null} style={{backgroundColor: "#d26223"}}></div>
                            <div className="elem" onClick={() => null} style={{backgroundColor: "#8b50f8"}}></div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <div className="elem" onClick={() => null} style={{backgroundColor: "#ffffff"}}></div>
                            <div className="elem" onClick={() => null} style={{backgroundColor: "#862126"}}></div>
                            <div className="elem" onClick={() => null} style={{backgroundColor: "#3ab19d"}}></div>
                            <div className="elem" onClick={() => null} style={{backgroundColor: "#424242"}}></div>
                            <div className="elem" onClick={() => null} style={{backgroundColor: "#905225"}}></div>
                        </div>
                    </div>

                    <div className="button-buy">
                        1000 $
                    </div>
                </div>

                <div className="it-2">
                    <div style={{position: "absolute", zIndex: 1}}>
                        <img style={{ height: 360 }} src="https://cdn.discordapp.com/attachments/956333971908730961/976618176978747412/unknown.png" />
                    </div>

                    <div className="comp">
                        <div className="comp-1">
                            <div style={{display: 'flex'}}>
                                <div className="elem">SLOT ACCESOIRE</div>
                                <img style={{height: 40}} src="https://cdn.discordapp.com/attachments/956333971908730961/978081084329828402/unknown.png" />
                            </div>

                            <div style={{display: 'flex', alignItems: "flex-end"}}>
                                <div className="elem">SLOT ACCESOIRE</div>
                                <img style={{height: 40}} src="https://cdn.discordapp.com/attachments/956333971908730961/978082972483850280/unknown.png" />

                            </div>
                        </div>
                    </div>

                </div>
                
                <div className="it-3">
                    <p style={{fontSize: 22, fontWeight: 600, marginBottom: -3}}>AMELIORATION</p>
                    <p style={{fontSize: 24, fontWeight: 500, marginBottom: 20, color: "#8AFA21"}}>ACCESOIRES</p>
                
                    <div className="items-container">
                        <div style={{ marginBottom: 10 }}>
                            <div className="item">
                                <p style={{marginBottom: 20}}>Silencieux</p>
                                <img style={{margin: 'auto', width: 90}} src="https://cdn.discordapp.com/attachments/956333971908730961/978030834361712670/unknown.png" />
                            </div>

                            <div className="buy">
                                150 $
                            </div>
                        </div>

                        <div style={{ marginBottom: 10 }}>
                            <div className="item">
                                <p style={{marginBottom: 20}}>Silencieux</p>
                                <img style={{margin: 'auto', width: 90}} src="https://cdn.discordapp.com/attachments/956333971908730961/978030834361712670/unknown.png" />
                            </div>

                            <div className="buy">
                                150 $
                            </div>
                        </div>

                        <div style={{ marginBottom: 10 }}>
                            <div className="item">
                                <p style={{marginBottom: 20}}>Silencieux</p>
                                <img style={{margin: 'auto', width: 90}} src="https://cdn.discordapp.com/attachments/956333971908730961/978030834361712670/unknown.png" />
                            </div>

                            <div className="buy">
                                150 $
                            </div>
                        </div>

                        <div style={{ marginBottom: 10 }}>
                            <div className="item">
                                <p style={{marginBottom: 20}}>Silencieux</p>
                                <img style={{margin: 'auto', width: 90}} src="https://cdn.discordapp.com/attachments/956333971908730961/978030834361712670/unknown.png" />
                            </div>

                            <div className="buy">
                                150 $
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <img style={{height: 20}} src="https://cdn.discordapp.com/attachments/956333971908730961/976631184031375360/unknown.png" />
        
            <div className="armes-c">
                <div className="container">
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <p style={{marginBottom: -10, fontSize: 20}}>AK-47</p>
                        <p style={{marginBottom: -10, fontSize: 18, color: "#82E229"}}>1500 $</p>
                    </div>
                    <img style={{ height: 115 }} src="https://cdn.discordapp.com/attachments/956333971908730961/976618176978747412/unknown.png" />
                </div> 

                <div className="container">
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <p style={{marginBottom: -10, fontSize: 20}}>AK-47</p>
                        <p style={{marginBottom: -10, fontSize: 18, color: "#82E229"}}>1500 $</p>
                    </div>
                    <img style={{ height: 115 }} src="https://cdn.discordapp.com/attachments/956333971908730961/976618176978747412/unknown.png" />
                </div> 

                <div className="container">
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <p style={{marginBottom: -10, fontSize: 20}}>AK-47</p>
                        <p style={{marginBottom: -10, fontSize: 18, color: "#82E229"}}>1500 $</p>
                    </div>
                    <img style={{ height: 115 }} src="https://cdn.discordapp.com/attachments/956333971908730961/976618176978747412/unknown.png" />
                </div> 

                <div className="container">
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <p style={{marginBottom: -10, fontSize: 20}}>AK-47</p>
                        <p style={{marginBottom: -10, fontSize: 18, color: "#82E229"}}>1500 $</p>
                    </div>
                    <img style={{ height: 115 }} src="https://cdn.discordapp.com/attachments/956333971908730961/976618176978747412/unknown.png" />
                </div> 
                <div className="container">
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <p style={{marginBottom: -10, fontSize: 20}}>AK-47</p>
                        <p style={{marginBottom: -10, fontSize: 18, color: "#82E229"}}>1500 $</p>
                    </div>
                    <img style={{ height: 115 }} src="https://cdn.discordapp.com/attachments/956333971908730961/976618176978747412/unknown.png" />
                </div> 
            </div>
        </div>
    );
}

export default ArmePage;