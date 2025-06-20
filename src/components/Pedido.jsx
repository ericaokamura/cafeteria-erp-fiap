import { useState, useEffect } from 'react';
import './Pedido.css';


export default function Pedido({ pedido }) {

  const [total, setTotal] = useState(0.00);
  const [itens, setItens] = useState([]);

  const itensPedido = pedido.itensPedido;

  useEffect(() => {

    const carregarItensPedido = async () => {
      
      const itensCarregados = [];

      const token = sessionStorage.getItem("token");

      try {
        for (const item of itensPedido) {
          const response = await fetch('http://localhost:8090/produtos/' + item.idProduto, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
          })

          if (!response.ok) {
            throw new Error('Erro na requisição do produto ' + item.idProduto);
          }
          const data = await response.json();

          itensCarregados.push({
            descricao: data.descricao,
            quantidade: item.quantidade,
            valorUnitario: data.valorUnitario,
            subtotal: item.quantidade * data.valorUnitario,
          });
        }

        console.log("Erica", itensCarregados);

        setItens(itensCarregados);

        const soma = itensCarregados.reduce((acc, curr) => acc + curr.subtotal, 0);
        setTotal(soma);

      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      }
    };

    carregarItensPedido();

  }, [itensPedido]);


  const finalizarPedido = async () => {

    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8090/pedidos/${pedido.id}?statusPedido=FINALIZADO`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
          'Access-Control-Allow-Origin': '*'
        } 
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Pedido finalizado", data);
      } else {
        const errorData = await response.json();
        console.log("Erro: " + errorData);
      }
    } catch {
      console.log("Erro ao finalizar pedido");
    }
  };

  const cancelarPedido = async () => {

    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8090/pedidos/${pedido.id}?statusPedido=CANCELADO`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
          'Access-Control-Allow-Origin': '*'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Pedido cancelado", data);
      } else {
        const errorData = await response.json();
        console.log("Erro: " + errorData);
      }
    } catch {
      console.log("Erro ao cancelar pedido");
    }
  };

  return (
    <>
      <div className="orderBox">
        <div className="orderInfo">
          <h2 className="comanda">Comanda {pedido.comanda} - ({pedido.nomeCliente})</h2>
          <h3 className="table">Mesa {pedido.mesa}</h3>
          <div className="itemList">
            {itens.map((item, index) => (
              <div key={index} className="summaryRow">
                <span>Produto: {item.descricao}</span>
                <br />
                <span>Qtd: {item.quantidade}</span>
                <br />
                <span><strong>Subtotal: R$ {item.subtotal.toFixed(2)}</strong></span>
              </div>
            ))}
          </div>
        </div>
        <div className="summary">
          <div className="totalRow">
            <span>TOTAL:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <div style={{ marginTop: "20px" }}>
            <button className="finalizeButton" onClick={finalizarPedido}>Finalizar Pedido</button>
            <button className="cancelButton" onClick={cancelarPedido}>Cancelar Pedido</button>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
}
