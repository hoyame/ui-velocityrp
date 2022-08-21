import React from "react";

import './staff.scss';

const Staff = () => {
    return (
        <div id="staff">
            <div style={{display: "flex"}}>
                <div className="box">
                    <p style={{
                        color: "#43ef01",
                        textShadow: "0 0px 7.5px #43ef01"
                    }}>Nombre de joueurs</p>

                    <p style={{
                        fontSize: 45,
                        color: "#ffffff"
                    }}>254</p>
                </div>

                <div className="box">
                    <p style={{
                        color: "#43ef01",
                        textShadow: "0 0px 7.5px #43ef01"
                    }}>Nombre de staffs</p>

                    <p style={{
                        fontSize: 45,
                        color: "#ffffff"
                    }}>32</p>
                </div>

                <div className="box">
                    <p style={{
                        color: "#43ef01",
                        textShadow: "0 0px 7.5px #43ef01"
                    }}>Nombre de reports</p>

                    <p style={{
                        fontSize: 45,
                        color: "#ffffff"
                    }}>54</p>
                </div>
            </div>
        </div>
    )
}

export default Staff;