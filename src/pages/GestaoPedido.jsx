import { useState, useEffect } from 'react';
import Menu from '../components/Menu';
import Pedido from '../components/Pedido';
import './GestaoPedido.css';
import { useNavigate } from 'react-router-dom';

export default function GestaoPedido() {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userEmail = localStorage.getItem("email");

        if (!token || !userEmail) {
            navigate('/login');
            return;
        }
    }, []);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        console.log("Token", token);

        const carregarPedidos = async () => {
            try {
                const response = await fetch('http://localhost:8090/pedidos', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });

                if (response.status === 403) {
                    alert("Acesso não autorizado. Faça login novamente.");
                    navigate('/login');
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }

                const data = await response.json();
                setPedidos(data);

            } catch (error) {
                console.error("Erro ao buscar pedidos:", error);
            }
        };

        carregarPedidos();
    }, []);

    return (
        <>
            <Menu />
            <div className="container">
                <h1 className="title">Gestão de Pedidos</h1>
                {pedidos.map((p, index) => (
                    <Pedido key={index} pedido={p} />
                ))}
            </div>
        </>
    );
}
