import React, { useEffect, useState } from "react";
import bidon from "./icons/bidon.png";
import bus from "./icons/bus.png";
import camion from "./icons/camion.png";
import carre from "./icons/carre.png";
import carteb from "./icons/carteb.png";
import cookie from "./icons/cookie.png";
import peche from "./icons/peche.png";
import priseimg from "./icons/prise-img.png";
import prise from "./icons/prise.png";
import sapin from "./icons/sapin.png";
import taxi from "./icons/taxi.png";
import taxi2 from "./icons/taxi2.png";

import "./style.scss";

interface IJob {
    icon?: string;
    name?: string;
	description?: string;
    salaire?: number;
}

const Jobs = () => {
    const [jobList, setJobList] = useState<IJob[]>([
		{
			name: 'Electricien',
			description: "Job d'electricien",
			salaire: 2
		}
	]);
    const [selected, setSelected] = useState<IJob>({});

	const itineraire = (data: any) => {
		fetch(`https://${location.hostname.replace("cfx-nui-", "")}/itineraire`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},

			body: JSON.stringify(data),
		});
	};

	const onMessage = (event: any) => {
		if (event.data.type == "jobs") {
			setJobList(event.data.jobs);
		}
	};

	React.useEffect(() => {
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	});

	useEffect(() => {
		setTimeout(() => {
			setSelected(jobList[0])
		}, 1000)
	}, [selected])

    const JobItem = (props: IJob) => {
        return (
            <div className={props.name == selected.name ? "item active" : "item"} onClick={() => setSelected(props)}>
                <div className="icon">
                    <img src={props.icon} alt="" />
                </div>
                <div className="infos">
                    <p className="titreInfo">{props.name}</p>
                    <p className="subInfo">
                        Salaire : 
                        { props.salaire == 1 && <span style={{marginLeft: 4}} className="f">faible</span> }
                        { props.salaire == 2 && <span style={{marginLeft: 4}} className="m">moyen</span> }
                        { props.salaire == 3 && <span style={{marginLeft: 4}} className="h">haut</span> }
                    </p>
                </div>
            </div>
        )
    }

	return (
		<div id="jobs">
			<div id="menuToggle"></div>
			<div className="left">
				<div className="menu" id="menuScroll">
					{
                        jobList.map((v, k) => {
                            return (
								<JobItem key={k} {...v} />
							)
                        })
                    }
				</div>
			</div>
			<div className="right">
				<div className="display">
					<div className="tabInfo">
						<h1 className="jobName">{selected.name}</h1>
						<p className="jobDesc">
							{selected.description}
						</p>
						<hr />
						<div className="bottom">
							<p>Trouver un emploi</p>
							<div onClick={() => itineraire(selected)} className="btnJob">Itinéraire vers le travail</div>
						</div>
					</div>
					<div className="pub">
						<div className="flex-row" style={{
							marginBottom: 7.5,
							alignItems: "center"
						}}>
							<img style={{height: 25, marginRight: 12.5}} src={carteb} alt="" />
							<h2>Vous voulez gagner plus ?</h2>
						</div>
						<p className="descPub">
							Essayer des alternatives:
							<br />
							Organisations, évènements, activités et plus encore
						</p>
					</div>
				</div>
				<img className="image-prisa" src={priseimg} alt="" />
			</div>
		</div>
	);
};

export default Jobs;
