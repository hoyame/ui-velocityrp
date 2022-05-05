import React, { useState } from 'react';

import "./style.scss";

const CarDealer = () => {
    const [catIndex, setCatIndex] = useState()
    const [categories, setCategories] = useState([
        "Compacts",
        "Supersportive"
    ])

    return (
        <div className="cardealer">
            <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent: "center", width: "19%" }}>
                <p style={{fontSize: 20, fontWeight: 200, marginBottom: -10}}>PREMIUM DEALERSHIP</p>
                <p style={{fontSize: 70, fontWeight: 400, marginBottom: -10}}>VOITURES</p>
                <p style={{fontSize: 18, fontWeight: 300, marginBottom: 0, opacity: 0.5}}>BIENVENUE DANS VOTRE CONCESSIONAIRE</p>
                <p style={{fontSize: 18, fontWeight: 300, marginBottom: 30, opacity: 0.5}}>VOUS RETROUVEZ ICI TOUT LES VEHICULES</p>
            
                <div style={{display: "flex", alignItems: "center", marginBottom: 7.5}}>
                    <svg width="17" height="17" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.56934 17.1973H2.63281C3.30078 17.1973 3.81934 16.6787 3.81934 16.0107V14.4902C5.7793 14.6133 8.6709 14.71 11 14.71C13.3291 14.71 16.2207 14.6221 18.1719 14.4902V16.0107C18.1719 16.6787 18.6904 17.1973 19.3672 17.1973H20.4219C21.0986 17.1973 21.6172 16.6787 21.6172 16.0107V10.7988C21.6172 9.24316 21.3271 8.38184 20.5098 7.31836L19.7275 6.33398C19.4023 4.76074 18.8223 3.09961 18.5146 2.44922C18.0225 1.40332 17.0732 0.788086 15.8604 0.621094C15.2188 0.533203 13.3379 0.489258 11 0.489258C8.66211 0.489258 6.77246 0.541992 6.13965 0.621094C4.92676 0.770508 3.96875 1.40332 3.48535 2.44922C3.17773 3.09961 2.59766 4.76074 2.27246 6.33398L1.49023 7.31836C0.664062 8.38184 0.382812 9.24316 0.382812 10.7988V16.0107C0.382812 16.6787 0.901367 17.1973 1.56934 17.1973ZM4.24121 5.52539C4.44336 4.65527 4.83008 3.49512 5.09375 3.0293C5.34863 2.56348 5.63867 2.37012 6.18359 2.2998C6.80762 2.21191 8.31055 2.15918 11 2.15918C13.6807 2.15918 15.1924 2.19434 15.8164 2.2998C16.3613 2.37891 16.6426 2.56348 16.9062 3.0293C17.1787 3.48633 17.5391 4.65527 17.75 5.52539C17.8467 5.90332 17.6797 6.0791 17.2842 6.06152C15.9307 5.98242 14.2256 5.89453 11 5.89453C7.77441 5.89453 6.06934 5.98242 4.71582 6.06152C4.31152 6.0791 4.16211 5.90332 4.24121 5.52539ZM4.55762 12.249C3.72266 12.249 3.08105 11.6162 3.08105 10.7812C3.08105 9.9375 3.72266 9.30469 4.55762 9.30469C5.39258 9.30469 6.02539 9.9375 6.02539 10.7812C6.02539 11.6162 5.39258 12.249 4.55762 12.249ZM17.4424 12.249C16.5986 12.249 15.9658 11.6162 15.9658 10.7812C15.9658 9.9375 16.5986 9.30469 17.4424 9.30469C18.2773 9.30469 18.9102 9.9375 18.9102 10.7812C18.9102 11.6162 18.2773 12.249 17.4424 12.249ZM8.62695 11.8799C7.99414 11.8799 7.55469 11.4404 7.55469 10.8164C7.55469 10.1924 7.99414 9.75293 8.62695 9.75293H13.373C13.9971 9.75293 14.4365 10.1924 14.4365 10.8164C14.4365 11.4404 13.9971 11.8799 13.373 11.8799H8.62695Z" fill="#fff"/>
                    </svg>

                    <p style={{marginLeft: 7.5, fontSize: 18}}>LISTES DES VOITURES</p>
                </div>

                <div className='vehicleList'>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                        <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.348633 8.6543C0.348633 8.96191 0.462891 9.22559 0.708984 9.4541L7.54688 16.1514C7.74023 16.3447 7.98633 16.4502 8.27637 16.4502C8.85645 16.4502 9.32227 15.9932 9.32227 15.4043C9.32227 15.1143 9.19922 14.8594 9.00586 14.6572L2.84473 8.6543L9.00586 2.65137C9.19922 2.44922 9.32227 2.18555 9.32227 1.9043C9.32227 1.31543 8.85645 0.858398 8.27637 0.858398C7.98633 0.858398 7.74023 0.963867 7.54688 1.15723L0.708984 7.8457C0.462891 8.08301 0.348633 8.34668 0.348633 8.6543Z" fill="#fff"/>
                        </svg>

                        <p>Sportives</p>

                        <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.65137 8.6543C9.64258 8.34668 9.52832 8.08301 9.29102 7.8457L2.45312 1.15723C2.25098 0.963867 2.01367 0.858398 1.72363 0.858398C1.13477 0.858398 0.677734 1.31543 0.677734 1.9043C0.677734 2.18555 0.791992 2.44922 0.994141 2.65137L7.14648 8.6543L0.994141 14.6572C0.791992 14.8594 0.677734 15.1143 0.677734 15.4043C0.677734 15.9932 1.13477 16.4502 1.72363 16.4502C2.00488 16.4502 2.25098 16.3447 2.45312 16.1514L9.29102 9.4541C9.53711 9.22559 9.65137 8.96191 9.65137 8.6543Z" fill="#fff"/>
                        </svg>
                    </div>
                </div>

                <div className='vehicle-container'>
                    <div className="vehicle-component">
                        <p>Audi RS7 2022</p>
                        <p>250 000 $</p>
                    </div>

                    <div className="vehicle-component">
                        <p>Audi RS7 2022</p>
                        <p>250 000 $</p>
                    </div>

                    <div className="vehicle-component">
                        <p>Audi RS7 2022</p>
                        <p>250 000 $</p>
                    </div>

                    <div className="vehicle-component">
                        <p>Audi RS7 2022</p>
                        <p>250 000 $</p>
                    </div>    
                    
                    <div className="vehicle-component">
                        <p>Audi RS7 2022</p>
                        <p>250 000 $</p>
                    </div>

                    <div className="vehicle-component">
                        <p>Audi RS7 2022</p>
                        <p>250 000 $</p>
                    </div>
                </div>

                <div style={{display: "flex", alignItems: "center", marginBottom: 20}}>
                    <svg width="17" height="17" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.2471 14.3281L18.6484 10.9268C19.668 9.90725 19.6416 8.69436 18.6045 7.63088L18.1035 7.12111C17.1895 8.29006 14.5879 9.68752 14.0957 9.19533C14.0166 9.11623 14.0078 8.95803 14.1221 8.83498C15.168 7.78908 15.8799 6.74318 16.0381 5.07326L11.5381 0.555684C10.624 -0.349589 9.10352 0.00197303 8.68164 1.63674C8.10157 3.87795 7.60938 5.21389 7.14356 6.22463L15.2471 14.3281ZM1.68555 20.0938C3.0918 21.5088 4.9375 21.5264 6.32618 20.1289C7.37207 19.0918 8.37403 16.7979 9.15625 15.5674L11.1953 17.6153C11.8897 18.3184 12.7334 18.3184 13.4014 17.6416L14.1484 16.8946C14.834 16.2002 14.8164 15.4004 14.1133 14.6973L7.08204 7.65725C6.37012 6.95412 5.56153 6.94533 4.86719 7.63088L4.12891 8.36916C3.45215 9.04592 3.45215 9.88088 4.15528 10.584L6.19434 12.6231C4.97266 13.3965 2.67871 14.4072 1.64161 15.4444C0.244144 16.8418 0.261722 18.6787 1.68555 20.0938ZM4.08496 18.8369C3.50489 18.8369 3.03028 18.3623 3.03028 17.7822C3.03028 17.2022 3.50489 16.7276 4.08496 16.7276C4.66504 16.7276 5.13086 17.2022 5.13086 17.7822C5.13086 18.3623 4.66504 18.8369 4.08496 18.8369Z" fill="#fff"/>
                    </svg>

                    <p style={{marginLeft: 7.5, fontSize: 18}}>COULEURS</p>
                </div>

                <div className='color-container'>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                        <div className="color-component" style={{backgroundColor: "#fed32f"}}></div>
                        <div className="color-component" style={{backgroundColor: "#cc2e2d"}}></div>
                        <div className="color-component" style={{backgroundColor: "#23c5d0"}}></div>
                        <div className="color-component" style={{backgroundColor: "#d26223"}}></div>
                        <div className="color-component" style={{backgroundColor: "#8b50f8"}}></div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <div className="color-component" style={{backgroundColor: "#ffffff"}}></div>
                        <div className="color-component" style={{backgroundColor: "#862126"}}></div>
                        <div className="color-component" style={{backgroundColor: "#3ab19d"}}></div>
                        <div className="color-component" style={{backgroundColor: "#424242"}}></div>
                        <div className="color-component" style={{backgroundColor: "#905225"}}></div>
                    </div>
                </div>

                <div style={{display: "flex", alignItems: "center", marginBottom: 20}}>
                    <svg width="17" height="17" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.558594 1.37695C0.558594 1.83398 0.945312 2.2207 1.38477 2.2207H4.13574L5.49805 11.5195C5.69141 12.8467 6.39453 13.6553 7.73926 13.6553H17.9697C18.3828 13.6553 18.7607 13.3301 18.7607 12.8643C18.7607 12.4072 18.3828 12.082 17.9697 12.082H7.94141C7.51953 12.082 7.25586 11.792 7.19434 11.3438L7.05371 10.4297H18.04C19.3848 10.4297 20.0967 9.6123 20.29 8.27637L20.9492 3.87305C20.9668 3.75879 20.9844 3.60938 20.9844 3.5127C20.9844 2.99414 20.624 2.64258 20.0176 2.64258H5.9375L5.79688 1.69336C5.68262 0.928711 5.375 0.541992 4.39941 0.541992H1.38477C0.945312 0.541992 0.558594 0.928711 0.558594 1.37695ZM6.92188 16.5293C6.92188 17.3818 7.60742 18.0674 8.45996 18.0674C9.3125 18.0674 9.99805 17.3818 9.99805 16.5293C9.99805 15.6768 9.3125 14.9912 8.45996 14.9912C7.60742 14.9912 6.92188 15.6768 6.92188 16.5293ZM15.0342 16.5293C15.0342 17.3818 15.7285 18.0674 16.5811 18.0674C17.4336 18.0674 18.1104 17.3818 18.1104 16.5293C18.1104 15.6768 17.4336 14.9912 16.5811 14.9912C15.7285 14.9912 15.0342 15.6768 15.0342 16.5293Z" fill="#FFF"/>
                    </svg>

                    <p style={{marginLeft: 7.5, fontSize: 18}}>ACHETER</p>
                </div>

                <div className="buy-button">
                    <p>Acheter cette voiture</p>
                </div>
            </div>

            <div>

            </div>
        </div>        
    );
}

export default CarDealer;

