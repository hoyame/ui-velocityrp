import { enumValues } from "@nativewrappers/client";
import React, { useState } from "react";
import Boutique from "../../../shared/data/boutique.json";

import katana from "../../assets/weapons/katana_276x106.png";
import revolver from "../../assets/weapons/double-action-revolver_276x106.png";
import nanyRevolver from "../../assets/weapons/navy-revolver_276x106.png";
import cayo from "../../assets/weapons/perico-pistol_276x106.png";
import ak47 from "../../assets/weapons/assault-rifle_276x106.png";
import defense from "../../assets/weapons/combat-pdw_276x106.png";
import ceramic from "../../assets/weapons/ceramic-pistol_276x106.png";

import Hrevolver from "../../assets/weapons_img/weapon_double-action-revolver.png";
import HnanyRevolver from "../../assets/weapons_img/weapon_navy-revolver.png";
import Hcayo from "../../assets/weapons_img/weapon_perico_pistol.png";
import Hak47 from "../../assets/weapons_img/weapon_assault-rifles.png";
import Hdefense from "../../assets/weapons_img/weapon_combat-pdw.png";
import Hceramic from "../../assets/weapons_img/weapon_ceramic-pistol.png";

import './style.scss'

const ImgWeapons = {
    "katana": katana,
    "revolver": revolver,
    "nanyRevolver": nanyRevolver,
    "cayo": cayo,
    "ak47": ak47,
    "defense": defense,
    "ceramic": ceramic
}

const ImgWeaponsTall = {
    "katana": katana,
    "revolver": Hrevolver,
    "nanyRevolver": HnanyRevolver,
    "cayo": Hcayo,
    "ak47": Hak47,
    "defense": Hdefense,
    "ceramic": Hceramic
}

const ArmePage = () => {
    const [weaponsList, setWeaponList] = useState(Boutique.weapons)

    const [weaponSelected, setWeaponSelected] = useState({
        name: "WEAPON_ASSAULTRIFLE",
        label: "AK-47",
        img: "ak47",
        price: 3500,
    });

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

    const WeaponComponent = (props: {
        label: string;
        name: string;
        description: string;
        price: number;
        img;
        componentData?: any
    }) => {
        return (
            <div className="container" onClick={() => setWeaponSelected(props)}>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <p style={{marginBottom: -10, fontSize: 20}}>{props.label}</p>
                    <p style={{marginBottom: -10, fontSize: 18, color: "#82E229"}}>{props.price} $</p>
                </div>
                <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <img style={{ margin: "15px 0 0 0", height: 90 }} src={ImgWeapons[props.img]} />
                </div>
            </div> 
        );
    }
    
    const returnWeaponList: any = () => {
        return weaponsList.map((v, k) => {
            return <WeaponComponent key={k} {...v}/>
        })
    }

    const AccesoriesComponent = (props: {
        label: string;
        name: string;
        price: number
    }) => {
        return (
            <div style={{ marginBottom: 10 }}>
                <div className="item">
                    <p style={{marginBottom: 20}}>{props.label}</p>
                    <img style={{margin: 'auto', width: 90}} src="https://cdn.discordapp.com/attachments/956333971908730961/978030834361712670/unknown.png" />
                </div>

                <div className="buy">
                    {props.price} $
                </div>
            </div>
        );
    }

    const returnAccesoriesList = () => {
        return (    
            <>
                <AccesoriesComponent label="Silencieux" name="sil" price={5000} />
            </>
        )
        
    }

    return (
        <div className="armes">
            <img style={{ height: 65 }} src="https://cdn.discordapp.com/attachments/956333971908730961/975871396968296468/unknown.png" />
        
            <div className="container">
                <div className="it-1">
                    <p style={{fontSize: 30, fontWeight: 600, marginBottom: -3}}>ARMES</p>
                    <p style={{fontSize: 27, fontWeight: 500, marginBottom: 20, color: "#8AFA21"}}>{weaponSelected.label}</p>

                    <p style={{color: "#8AFA21", marginBottom: 15}}>SPECIFICATIONS</p>
                
                    <div style={{marginBottom: 25}}>
                        {
                            specif.map((spec, index) => {
                                return <Specifications specif={spec.name} value={Math.randomRange(20, 100)} key={index} />
                            })
                        }
                    </div>

                    <div className="button-buy" onClick={() => {
                        fetch(`https://${location.hostname.replace("cfx-nui-", "")}/buyWeapon`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify(weaponSelected)
                        })
                    }}>
                        {weaponSelected.price} Coins
                    </div>
                </div>

                <div className="it-2">
                    <div style={{position: "absolute", zIndex: 1}}>
                        <img style={{ height: 250 }} src={ImgWeaponsTall[weaponSelected.img]} />
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

                        <div className="comp-2">
                            <div style={{display: 'flex'}}>
                                <div className="elem">SLOT ACCESOIRE</div>
                                <img style={{height: 40}} src="https://cdn.discordapp.com/attachments/956333971908730961/978081084329828402/unknown.png" />
                            </div>

                            <div style={{display: 'flex', alignItems: "flex-end"}}>
                                <div className="elem">SLOT ACCESOIRE</div>
                                <img style={{height: 130}} src="https://cdn.discordapp.com/attachments/956333971908730961/978245804093476864/unknown.png" />
                            </div>
                        </div>

                        <div className="comp-3">
                            <div style={{display: 'flex', alignItems: "flex-end"}}>
                                <img style={{height: 47.5}} src="https://cdn.discordapp.com/attachments/956333971908730961/978246588319301652/unknown.png" />
                                <div className="elem">SLOT ACCESOIRE</div>
                            </div>

                            <div style={{display: 'flex', alignItems: "flex-end"}}>
                                <img style={{height: 150}} src="https://cdn.discordapp.com/attachments/956333971908730961/978247256438362192/unknown.png" />
                                <div className="elem">SLOT ACCESOIRE</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <img style={{height: 20}} src="https://cdn.discordapp.com/attachments/956333971908730961/976631184031375360/unknown.png" />
        
            <div className="armes-c">
                {
                    returnWeaponList()
                }
            </div>
        </div>
    );
}

export default ArmePage;