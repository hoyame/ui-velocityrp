import React, { useEffect, useState } from "react";

import logo from './logo.svg';
import v1 from './img/v1.png';
import v2 from './img/v2.png';
import v3 from './img/v3.png';
import v4 from './img/v4.png';
import v5 from './img/v5.png';
import v6 from './img/v6.png';
import v7 from './img/v7.png';
import v8 from './img/v8.png';
import v9 from './img/v9.png';
import v10 from './img/v10.png';
import v11 from './img/v11.png';
import "./style.scss";

interface ICardealer {
	categories?: any;
	vehicles?: any;
	store?: boolean;
	coins?: number;
}

const CarDealer = (props: ICardealer) => {
	return (
		<div id="concessionnaire">
		  <div className="container">
			<img className="voiture" draggable="false" src={v3}/>
			<header>
			  <h1 className="nomVoiture">Fiat</h1>
			  <ul className="stats">
				<li className="prix">
				  <h2>Coût</h2>
				  <p>200 GC</p>
				</li>
				<li className="stat">
				  <h2>Vitesse maximale</h2>
				  <p>260 km/h</p>
				  <h2>Capacité du coffre</h2>
				  <p>0 L</p>
				</li>
				<li className="stat">
				  <h2>Accélération à 100km/h</h2>
				  <p>2.44 secondes</p>
				  <h2>Capacité du réservoir de carburant</h2>
				  <p>83 L</p>
				</li>
				<li className="stat">
				  <h2>Assurance</h2>
				  <p>30 jours</p>
				  <h2>Extras</h2>
				  <p>Accord complet</p>
				</li>
			  </ul>
			  <div className="options">
				<div className="btn">
				  Acheter
				</div>
				<div className="essai">
				  Essai routier
				</div>
			  </div>
			</header>
			<ul className="menu">
			  <li className="voiture active">
				<img src={v1} />
				<p className="nom">Fiat</p>
			  </li>
			  <li className="voiture">
				<img src={v2} />
				<p className="nom">Surge</p>
			  </li>
			  <li className="voiture">
				<img src={v3} />
				<p className="nom">Zion</p>
			  </li>
			  <li className="voiture">
				<img src={v4} />
				<p className="nom">Baller</p>
			  </li>
			  <li className="voiture">
				<img src={v5} />
				<p className="nom">Dilettante</p>
			  </li>
			  <li className="voiture">
				<img src={v6} />
				<p className="nom">Dubsta</p>
			  </li>
			  <li className="voiture">
				<img src={v7} />
				<p className="nom">Elegy</p>
			  </li>
			  <li className="voiture">
				<img src={v8} />
				<p className="nom">Felon</p>
			  </li>
			  <li className="voiture">
				<img src={v9} />
				<p className="nom">Futo</p>
			  </li>
			  <li className="voiture">
				<img src={v10} />
				<p className="nom">Monroe</p>
			  </li>
			  <li className="voiture">
				<img src={v11} />
				<p className="nom">Surge</p>
			  </li>
			</ul>
		  </div>
		</div>
	  );
};

export default CarDealer;

function onEffect(arg0: () => void) {
	throw new Error("Function not implemented.");
}
