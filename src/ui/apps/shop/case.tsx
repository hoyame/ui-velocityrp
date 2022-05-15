import React, { useState } from 'react';
import Lootboxes from './lootboxes';

import './style.scss'

const CasePage = () => {
    const [routes, setRoutes] = useState('case')

    const SelectCase = () => {
        return (
            <div className="case">
                <div className="container">
                    <img style={{marginBottom: 90}} src="https://media.discordapp.net/attachments/857379508747239425/974795338789572628/unknown.png?width=1440&height=57" />

                    <div className="cases"> 
                        <div className="element">
                            <div className="component">
                                <img style={{width: 290}} src="https://cdn.discordapp.com/attachments/857379508747239425/974796829298397286/unknown.png" />
                                <p>CAISSE RUBY</p>
                            </div>

                            <div className="buy">
                                <img style={{height: 20, marginTop: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />
                                <p>5000</p>
                            </div>
                        </div>
                        <div className="element">
                            <div className="component">
                                <img style={{width: 290}} src="https://cdn.discordapp.com/attachments/857379508747239425/974800383744544838/unknown.png" />
                                <p>CAISSE DIAMAND</p>
                            </div>

                            <div className="buy">
                                <img style={{height: 20, marginTop: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />
                                <p>5000</p>
                            </div>
                        </div>
                        <div className="element">
                            <div className="component">
                                <img style={{width: 290}} src="https://cdn.discordapp.com/attachments/857379508747239425/974800575990464573/unknown.png" />
                                <p>CAISSE GOLD</p>
                            </div>

                            <div className="buy">
                                <img style={{height: 20, marginTop: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />
                                <p>5000</p>
                            </div>
                        </div>
                        <div className="element">
                            <div className="component">
                                <img style={{width: 290}} src="https://cdn.discordapp.com/attachments/857379508747239425/974800973383995493/unknown.png" />
                                <p>CAISSE SILVER</p>
                            </div>

                            <div className="buy">
                                <img style={{height: 20, marginTop: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />
                                <p>5000</p>
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
            { routes == 'gambling' && <Lootboxes /> }
        </>
    )
}

export default CasePage;