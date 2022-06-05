import React, { useState } from 'react';
import Lootboxes from './lootboxes';
import Boutique from "../../../shared/data/boutique.json";

import './style.scss'

const CasePage = () => {
    const [routes, setRoutes] = useState('case')
    const [caseSelected, setCaseSelected] = useState("")

    const SelectCase = () => {
        return (
            <div className="case">
                <div className="container">
                    <img style={{height: 57, marginBottom: 50}} src="https://cdn.discordapp.com/attachments/956333971908730961/983027158865817712/unknown.png?width=1440&height=57" />

                    <div style={{display: 'flex', flexDirection: "row"}}>
                        <div className='sub-element'>
                            <img style={{height: 125, marginRight: 10}} src="https://cdn.discordapp.com/attachments/857379508747239425/974796829298397286/unknown.png" />
                            <div>
                                <p style={{width: 100, textAlign: 'center', fontSize: 18, marginRight: 10, marginBottom: 10}}>CAISSE MENSUELLE</p>
                                <div style={{color: '#f6ea30', display: 'flex', alignItems: 'center', width: 100, justifyContent: 'center'}}>
                                    <img style={{height: 15, marginBottom: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />
                                    <p>{Boutique.cases.ruby.price}</p>
                                </div>
                            </div>
                        </div>
                        <div className='sub-element'>
                            <img style={{height: 80, marginRight: 10}} src="https://cdn.discordapp.com/attachments/956333971908730961/983047270876467271/SeekPng.com_mclaren-logo-png_8783967.png" />
                            <div>
                                <p style={{width: 100, textAlign: 'center', fontSize: 18, marginRight: 10, marginBottom: 10}}>CAISSE MENSUELLE</p>
                                <div style={{color: '#f6ea30', display: 'flex', alignItems: 'center', width: 100, justifyContent: 'center'}}>
                                    <img style={{height: 15, marginBottom: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />
                                    <p>{Boutique.cases.ruby.price}</p>
                                </div>
                            </div>
                        </div>
                        <div className='sub-element'></div>
                    </div>

                    <img style={{height: 57, marginTop: 50, marginBottom: 50}} src="https://media.discordapp.net/attachments/956333971908730961/983027716217524304/unknown.png?width=2520&height=100" />

                    <div className="cases"> 
                        <div className="element">
                            <div className="component">
                                <img style={{width: 250}} src="https://cdn.discordapp.com/attachments/857379508747239425/974796829298397286/unknown.png" />
                                <p>CAISSE RUBY</p>
                            </div>

                            <div className="buy" onClick={() => {
                                setRoutes('gambling')
                                setCaseSelected('ruby')
                            }}>
                                <img style={{height: 20, marginTop: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />
                                <p>{Boutique.cases.ruby.price}</p>
                            </div>
                        </div>
                        <div className="element">
                            <div className="component">
                                <img style={{width: 250}} src="https://cdn.discordapp.com/attachments/857379508747239425/974800383744544838/unknown.png" />
                                <p>CAISSE DIAMAND</p>
                            </div>

                            <div className="buy" onClick={() => {
                                setRoutes('gambling')
                                setCaseSelected('diamond')
                            }}>
                                <img style={{height: 20, marginTop: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />
                                <p>{Boutique.cases.diamand.price}</p>
                            </div>
                        </div>
                        <div className="element">
                            <div className="component">
                                <img style={{width: 250}} src="https://cdn.discordapp.com/attachments/857379508747239425/974800575990464573/unknown.png" />
                                <p>CAISSE GOLD</p>
                            </div>

                            <div className="buy" onClick={() => {
                                setRoutes('gambling')
                                setCaseSelected('gold')
                            }}>
                                <img style={{height: 20, marginTop: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />
                                <p>{Boutique.cases.gold.price}</p>
                            </div>
                        </div>
                        <div className="element">
                            <div className="component">
                                <img style={{width: 250}} src="https://cdn.discordapp.com/attachments/857379508747239425/974800973383995493/unknown.png" />
                                <p>CAISSE SILVER</p>
                            </div>

                            <div className="buy" onClick={() => {
                                setRoutes('gambling')
                                setCaseSelected('silver')
                            }}>
                                <img style={{height: 20, marginTop: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />
                                <p>{Boutique.cases.silver.price}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            { routes == 'case' && <SelectCase /> }
            { routes == 'gambling' && <Lootboxes case={caseSelected} /> }
        </>
    )
}

export default CasePage;