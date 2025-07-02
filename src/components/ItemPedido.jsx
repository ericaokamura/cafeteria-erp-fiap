import React, { useState, useEffect } from 'react';
import { data } from 'react-router-dom';

export default function ItemPedido({ idProduto }) {
  
    const [item, setItem] = useState({});

    const [quantidade, setQuantidade] = useState(1);

    useEffect(() => {

        const token = sessionStorage.getItem("token");
        
        const carregarProduto = async () => {
            try {
                const response = await fetch('http://localhost:8090/produtos/' + idProduto, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
                });
                const data = await response.json();
                setItem(data);
                console.log("produto", data)
            } catch (error) {
                console.error("Erro ao buscar pedidos:", error);
            }
        };

        carregarProduto();

    }, []);

    const handleQuantidadeChange = (e) => {
        const qtd = parseInt(e.target.value, 10);
        setQuantidade(qtd);
    };

    let subtotal = quantidade * item.valorUnitario;

    return(
        <>
            <div>
                <h3>Produto: {item.nome}</h3>
                <h3>Preço: R$ {item.valorUnitario}</h3>
                <div style={{display: "inline-flex"}}>
                    <h3 style={{marginRight: "20px"}}>Quantidade:</h3>
                    <input type="number" value={quantidade} onChange={handleQuantidadeChange} min="0"></input>
                </div> 
                <h3>Sub Total: {subtotal.toFixed(2)}</h3>
            </div>
            <hr style={{border:"1px solid #ccc",margin:"20px 0"}}/>
        </>
    )
}

