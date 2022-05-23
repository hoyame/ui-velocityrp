import React, { useState } from 'react'
import { Switch, Route } from 'react-router-dom';
import Main from '../../main/main';
import ArmePage from './armes';
import CasePage from './case';
import Lootboxes from './lootboxes';

import './style.scss'


const Shop = () => {
    const [route, setRoute] = useState('armes')

    return (
        <div className="shop">
            <div className="header">
                <div style={{display: "flex", alignItems: 'center', marginLeft: 7.5}}>
                    <p style={{margin: "0 5px"}} className="">CAISSES</p>
                    <p style={{margin: "0 5px"}} className="active">ARMES</p>
                    <p style={{margin: "0 5px"}} className="">VEHICULES</p>
                </div>

                <div style={{display: "flex", alignItems: 'center', marginRight: 30}}>
                    <img style={{height: 27, marginTop: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />

                    <div>
                        <p style={{fontSize: 13, marginBottom: -2.5, color: "#8AFA21"}}>BALANCE</p>
                        <p style={{fontSize: 16, color: "#fff"}}>120.000 COINS</p>
                    </div>

                    <svg style={{marginLeft: 15}} width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.15" d="M0 0H21V21H0V0Z" fill="url(#paint0_linear_1_238)"/><path d="M11.07 9.835H13.545V11.65H11.07V14.125H9.255V11.65H6.795V9.835H9.255V7.375H11.07V9.835Z" fill="white"/><defs><linearGradient id="paint0_linear_1_238" x1="11" y1="26" x2="1.5" y2="-12" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0.13"/></linearGradient></defs>
                    </svg>
                </div>
            </div>

            { route == 'case' && <CasePage /> }
            { route == 'armes' && <ArmePage /> }
        </div>
    );
}

export default Shop;