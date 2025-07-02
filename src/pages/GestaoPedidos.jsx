import { useState, useEffect } from 'react';
import Menu from '../components/Menu';
import Pedido from '../components/Pedido';
import './GestaoPedidos.css';
import { useNavigate } from 'react-router-dom';

export default function GestaoPedidos() {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const userEmail = sessionStorage.getItem("email");

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
                console.log("todos os pedidos", data);

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
                <h2>Pedidos</h2>
                {pedidos.length > 0 && (
                    <div>
                        {pedidos.map((p, index) => (
                            <Pedido key={index} pedido={p}/>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
