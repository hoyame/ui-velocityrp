import React, { useState } from 'react'
import { Switch, Route } from 'react-router-dom';
import Main from '../../main/main';
import CarDealer from '../cardealer';
import ArmePage from './armes';
import Lootboxes from './lootboxes';
import Boutique from "../../../shared/data/boutique.json";

import './style.scss'
import Notifications from './notifications/notifications';

const Shop = () => {
    const [coins, setCoins] = useState(1);
    const [code, setCode] = useState(15);
    const [routePrimary, setRoutePrimary] = useState('case')

    const onMessage = (event: any) => {
        if (event.data.type == "store") {
            setCoins(event.data.coins)
            setCode(event.data.code)
		}
	};

    React.useEffect(() => {
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	});

    const leave = () => {
        fetch(`https://${location.hostname.replace("cfx-nui-", "")}/leave`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(true)
        })
    }

    document.addEventListener('keydown', function(event) {
        if (event.keyCode == 27) leave()
    })

    const CasePage = () => {
        const [routes, setRoutes] = useState('case')
        const [caseSelected, setCaseSelected] = useState("")
    
        const SelectCase = () => {
            return (
                <div className="case">
                    <div className="container">
                        <img style={{height: 57, marginBottom: 50}} src="https://cdn.discordapp.com/attachments/956333971908730961/983027158865817712/unknown.png?width=1440&height=57" />
    
                        <div style={{display: 'flex', flexDirection: "row"}}>
                            <div className='sub-element' onClick={() => {
                                setRoutePrimary('vehicles')
                                fetch(`https://${location.hostname.replace("cfx-nui-", "")}/openVehicles`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },

                                    body: JSON.stringify(true)
                                })
                            }}>
                                <img style={{height: 75, marginRight: 10}} src="https://cdn.discordapp.com/attachments/956333971908730961/983047270876467271/SeekPng.com_mclaren-logo-png_8783967.png" />
                                <div>
                                    <p style={{width: 100, textAlign: 'center', fontSize: 18}}>VEHICULES BOUTIQUE</p>
                                </div>
                            </div>
    
                            <div className='sub-element' onClick={() => {
                                   setRoutes('gambling')
                                   setCaseSelected('monthly')

                                   fetch(`https://${location.hostname.replace("cfx-nui-", "")}/openCase`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },

                                        body: JSON.stringify('monthly')
                                    })
                            }}>
                                <img style={{height: 125, marginRight: 10}} src="https://cdn.discordapp.com/attachments/1009466792135110697/1035934130329882655/Sans_titre_1.png" />
                                <div>
                                    <p style={{width: 100, textAlign: 'center', fontSize: 18, marginRight: 10, marginBottom: 10}}>CAISSE HALLOWEEN</p>
                                    <div style={{color: '#f6ea30', display: 'flex', alignItems: 'center', width: 100, justifyContent: 'center'}}>
                                        <img style={{height: 15, marginBottom: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />
                                        <p style={{color: coins < Boutique.cases["monthly"].price ? "#DC143C" : ""}}>{Boutique.cases.monthly.price}</p>
                                    </div>
                                </div>
                            </div>
                   
    
                            <div className='sub-element' onClick={() => {
                                fetch(`https://${location.hostname.replace("cfx-nui-", "")}/exclusiveVehicle`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },

                                    body: JSON.stringify(true)
                                })
                            }}>
                                <img style={{height: 75, marginRight: 10}} src="https://cdn.discordapp.com/attachments/1035939013351182438/1036275557693923388/2018-chevrolet-camaro-zl1-033-removebg-preview.png" />
                                <div>
                                    <p style={{width: 100, textAlign: 'center', fontSize: 18, marginBottom: 10}}>VEHICULES EXCLUSIF</p>
                                    <div style={{color: '#f6ea30', display: 'flex', alignItems: 'center', width: 100, justifyContent: 'center'}}>
                                        <p style={{width: 100, textAlign: 'center', fontSize: 15}}>CHEVROLET CAMARO</p>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <img style={{height: 57, marginTop: 50, marginBottom: 50}} src="https://media.discordapp.net/attachments/956333971908730961/983027716217524304/unknown.png?width=2520&height=100" />
    
                        <div className="cases"> 
                            <div className="element">
                                <div className="component" onClick={() => {
                                    // if (coins < Boutique.cases["ruby"].price) return;

                                    setRoutes('gambling')
                                    setCaseSelected('ruby')

                                    fetch(`https://${location.hostname.replace("cfx-nui-", "")}/openCase`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },

                                        body: JSON.stringify('ruby')
                                    })
                                }}>
                                    <img style={{width: 250}} src="https://cdn.discordapp.com/attachments/857379508747239425/974796829298397286/unknown.png" />
                                    <p style={{marginBottom: -20}}>CAISSE RUBY</p>
    
                                    <div style={{color: '#f6ea30', display: 'flex', alignItems: 'center', width: 100, justifyContent: 'center'}}>
                                        <img style={{height: 20, marginTop: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />
                                        <p style={{color: coins < Boutique.cases["ruby"].price ? "#DC143C" : ""}}>{Boutique.cases.ruby.price}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="element">
                                <div className="component" onClick={() => {
                                    // if (coins < Boutique.cases["diamand"].price) return;

                                    setRoutes('gambling')
                                    setCaseSelected('diamand')

                                    fetch(`https://${location.hostname.replace("cfx-nui-", "")}/openCase`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },

                                        body: JSON.stringify('diamand')
                                    })
                                }}>
                                    <img style={{width: 250}} src="https://cdn.discordapp.com/attachments/857379508747239425/974800383744544838/unknown.png" />
                                    <p style={{marginBottom: -20}}>CAISSE DIAMAND</p>
    
                                    <div style={{color: '#f6ea30', display: 'flex', alignItems: 'center', width: 100, justifyContent: 'center'}}>
                                        <img style={{height: 20, marginTop: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />
                                        <p style={{color: coins < Boutique.cases["diamand"].price ? "#DC143C" : ""}}>{Boutique.cases.diamand.price}</p>
                                    </div>
                                </div>
    
                              
                            </div>
                            <div className="element">
                                <div className="component" onClick={() => {
                                    // if (coins < Boutique.cases["gold"].price) return;
                                    setRoutes('gambling')
                                    setCaseSelected('gold')

                                    fetch(`https://${location.hostname.replace("cfx-nui-", "")}/openCase`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },

                                        body: JSON.stringify('gold')
                                    })
                                }}>
                                    <img style={{width: 250}} src="https://cdn.discordapp.com/attachments/857379508747239425/974800575990464573/unknown.png" />
                                    <p style={{marginBottom: -20}}>CAISSE GOLD</p>
    
                                    <div style={{color: '#f6ea30', display: 'flex', alignItems: 'center', width: 100, justifyContent: 'center'}}>
                                        <img style={{height: 20, marginTop: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />
                                        <p style={{color: coins < Boutique.cases["gold"].price ? "#DC143C" : ""}}>{Boutique.cases.gold.price}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="element">
                                <div className="component" onClick={() => {
                                    // if (coins < Boutique.cases["silver"].price) return;
                                    setRoutes('gambling')
                                    setCaseSelected('silver')

                                    fetch(`https://${location.hostname.replace("cfx-nui-", "")}/openCase`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },

                                        body: JSON.stringify('silver')
                                    })
                                }}>
                                    <img style={{width: 250}} src="https://cdn.discordapp.com/attachments/857379508747239425/974800973383995493/unknown.png" />
                                    <p style={{marginBottom: -20}}>CAISSE SILVER</p>
    
                                    <div style={{color: '#f6ea30', display: 'flex', alignItems: 'center', width: 100, justifyContent: 'center'}}>
                                        <img style={{height: 20, marginTop: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />
                                        <p style={{color: coins < Boutique.cases["silver"].price ? "#DC143C" : ""}}>{Boutique.cases.silver.price}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div className="others">
                        <img style={{height: 50, marginBottom: 50}} src="https://cdn.discordapp.com/attachments/956333971908730961/983312634956906526/unknown.png?width=1440&height=57" />
                        
                        <div className='sub-element' onClick={() => {
                            if (coins < Boutique.packs["mecano"]) return;
                            fetch(`https://${location.hostname.replace("cfx-nui-", "")}/buyMecano`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                    
                                body: JSON.stringify(true)
                            })
                        }}>
                            <img style={{height: 100, marginRight: 60}} src="https://cdn.discordapp.com/attachments/956333971908730961/983317365976604702/unknown.png" />
                            <div>
                                <p style={{width: 100, textAlign: 'center', fontSize: 18, marginRight: 10, marginBottom: 10}}>CRÉE TON MECANO</p>
                                <div style={{color: '#f6ea30', display: 'flex', alignItems: 'center', width: 100, justifyContent: 'center'}}>
                                    <img style={{height: 15, marginBottom: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />
                                    <p style={{color: coins < Boutique.packs["mecano"] ? "#DC143C" : ""}}>{Boutique.packs.mecano}</p>
                                </div>
                            </div>
                        </div>
    
                        <div className='sub-element' onClick={() => {
                            if (coins < Boutique.packs["orga"]) return;

                            fetch(`https://${location.hostname.replace("cfx-nui-", "")}/buyOrganisation`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                    
                                body: JSON.stringify(true)
                            })
                        }}>
                            <img style={{height: 135, marginLeft: -10, marginRight: 45, marginBottom: -5}} src="https://cdn.discordapp.com/attachments/956333971908730961/983318140215779388/removal.ai_tmp-629dd815de6f8.png" />
                            <div>
                                <p style={{width: 100, textAlign: 'center', fontSize: 18, marginRight: 10, marginBottom: 10}}>CRÉE TON ORGA</p>
                                <div style={{color: '#f6ea30', display: 'flex', alignItems: 'center', width: 100, justifyContent: 'center'}}>
                                    <img style={{height: 15, marginBottom: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />
                                    <p style={{color: coins < Boutique.packs["orga"] ? "#DC143C" : ""}}>{Boutique.packs.orga}</p>
                                </div>
                            </div>
                        </div>
    
                        <div className='sub-element' onClick={() => {
                            if (coins < Boutique.packs["entreprise"]) return;

                            fetch(`https://${location.hostname.replace("cfx-nui-", "")}/buyFarmCompany`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                    
                                body: JSON.stringify(true)
                            })
                        }}>
                            <img style={{height: 135, marginLeft: -10, marginRight: 45, marginBottom: -5}} src="https://cdn.discordapp.com/attachments/956333971908730961/983324444510527528/removal.ai_tmp-629ddc3bbed5e.png" />
                            <div>
                                <p style={{width: 100, textAlign: 'center', fontSize: 18, marginRight: 10, marginBottom: 10}}>CRÉE TON METIER</p>
                                <div style={{color: '#f6ea30', display: 'flex', alignItems: 'center', width: 100, justifyContent: 'center'}}>
                                    <img style={{height: 15, marginBottom: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />
                                    <p style={{color: coins < Boutique.packs["entreprise"] ? "#DC143C" : ""}}>{Boutique.packs.entreprise}</p>
                                </div>
                            </div>
                        </div>
    
                        <div className='sub-element' onClick={() => {
                            fetch(`https://${location.hostname.replace("cfx-nui-", "")}/reclameVip`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                    
                                body: JSON.stringify(true)
                            })
                        }}>
                            <img style={{height: 135, marginRight: 40}} src="https://cdn.discordapp.com/attachments/878647902631780392/983326466173448192/unknown.png" />
                            <div>
                                <p style={{width: 100, textAlign: 'center', fontSize: 18, marginRight: 10, marginBottom: 10}}>RECLAMER SON VIP</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    
        return (
            <>
                { routes == 'case' && <SelectCase /> }
                { routes == 'gambling' && <Lootboxes case={caseSelected} coins={coins} /> }
            </>
        )
    }

    return (
        <div className="shop" style={{background: routePrimary == 'vehicles' ? "linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))" : "#101010e0"}}>
            <div className="header" style={{display: routePrimary == 'vehicles' && "none"}}>
                <div className='oh' style={{display: "flex", alignItems: 'center', marginLeft: 7.5}}>
                    <p onClick={() => setRoutePrimary('case')} style={{margin: "0 5px"}} className={routePrimary == 'case' ? "active" : ""}>CAISSES</p>
                    <p onClick={() => setRoutePrimary('armes')} style={{margin: "0 5px"}} className={routePrimary == 'armes' ? "active" : ""}>ARMES</p>
                </div>

                <div style={{marginTop: 50}}> 
                    <div style={{display: "flex", alignItems: 'center', marginRight: 30}}>
                        <img style={{height: 27, marginTop: 2, marginRight: 7.5}} src="https://cdn.discordapp.com/attachments/857379508747239425/974799289211580506/unknown.png" />

                        <div>
                            <p style={{fontSize: 13, marginBottom: -2.5, color: "#8AFA21"}}>BALANCE</p>
                            <p style={{fontSize: 16, color: "#fff"}}>{coins} COINS</p>
                        </div>

                        <svg style={{marginLeft: 15}} width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.15" d="M0 0H21V21H0V0Z" fill="url(#paint0_linear_1_238)"/><path d="M11.07 9.835H13.545V11.65H11.07V14.125H9.255V11.65H6.795V9.835H9.255V7.375H11.07V9.835Z" fill="white"/><defs><linearGradient id="paint0_linear_1_238" x1="11" y1="26" x2="1.5" y2="-12" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0.13"/></linearGradient></defs>
                        </svg>
    
                    </div>

                    <div style={{marginTop: 10, marginLeft: 35}}>
                        <p style={{fontSize: 13, marginBottom: -2.5, color: "#8AFA21"}}>CODE BOUTIQUE</p>
                        <p style={{fontSize: 16, color: "#fff"}}>{code}</p>
                    </div>
                </div>
            </div>

            { routePrimary == 'case' && <CasePage /> }
            { routePrimary == 'armes' && <ArmePage /> }
            { routePrimary == 'vehicles' && <CarDealer coins={coins} store={true} categories={Boutique['categories']} vehicles={Boutique['vehicles']} /> }
        
            <div id="notifications-store" style={{ opacity: "1" }}>
				<Notifications inUI={true} />
			</div> 
        </div>
    );
}

export default Shop;
