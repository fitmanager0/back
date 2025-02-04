import "./product.css";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from "axios";
import { useState } from "react";

const Product = () => {
    const [preferenceId, setPreferenceId] = useState<string | null>(null); // Especifica el tipo de preferenceId

    // Inicializa MercadoPago con tu clave pública
    initMercadoPago('APP_USR-5aa6c368-4c57-4623-aef3-36f29c7ce870');

    // Función para crear la preferencia
    const createPreference = async () => {
        try {
            const response = await axios.post("http://localhost:3000/create_preference", {
                title: "un titulo",
                quantity: 1,
                price: 100,
            });
            const { id } = response.data;
            return id;
        } catch (error) {
            console.log(error);
        }
    };

    // Función para manejar la compra
    const handleBuy = async () => {
        const id = await createPreference();
        if (id) {
            setPreferenceId(id);
        }
    };

    return (
        <div className="contenedor-del-producto">
            <div className="card-product">
                <div className="card">
                    <img
                        src="https://www.mercadopago.com.co/herramientas-para-vender/check-out"
                        alt="boton"
                    />
                    <h3>bananita contenta</h3>
                    <p className="price">100</p>
                    <button onClick={handleBuy}>comprar</button>
                    {preferenceId && <Wallet initialization={{ preferenceId: preferenceId }} />}
                </div>
            </div>
        </div>
    );
};

export default Product; // Exportación predeterminada