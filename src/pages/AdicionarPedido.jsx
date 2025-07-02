import './AdicionarPedido.css';
import Menu from '../components/Menu'
import React, { useState } from 'react';
import { useEffect } from 'react';

export default function AdicionarPedido() {

    const [nomeCliente, setNomeCliente] = useState('');

    const [comanda, setComanda] = useState('');

    const [mesa, setMesa] = useState('');

    const [selectedProduct, setSelectedProduct] = useState({});

    const adicionarItemProduto = () => {

        let itens = [];
        
        itens.push({ idProduto: selectedProduct, quantidade: 1 });

        console.log(itens);

        const token = sessionStorage.getItem("token");

        try {
            const response = fetch('http://localhost:8090/pedidos', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              },
              body: JSON.stringify({ formaPagamento: "PIX", pagamentoAprovado: false, itensPedido: itens, nomeCliente: nomeCliente, comanda: comanda, mesa: mesa })
            });
    
            if (response.ok) {
              const data = response.json();
            } else {
              const errorData = response.json();
              console.log("Erro: " + errorData);
            }
        } catch (error) {
            console.error('Erro na conexão com o servidor.');
        }

        setNomeCliente('');

    }

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        const carregarProdutos = async () => {
            try {
              const response = await fetch('http://localhost:8090/produtos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
              });
              const data = await response.json();
              console.log("produtos", data);
              setProducts(data);
            } catch (error) {
              console.error("Erro ao buscar pedidos:", error);
            }
        };
    
        carregarProdutos();
    }, []);

    return (
        <>
            <Menu/>
            <div className="container formulario">
                <form>
                    <div className="itens-pedido">
                        <div style={{display:"inline-flex",width:"80%"}}>
                            <div style={{width:"100%", paddingTop: "0px"}}>
                                <h2 style={{ margin: "20px auto" }}>Iniciar Pedido</h2>
                            </div>
                        </div>
                        <hr style={{border:"1px solid #ccc",margin:"20px 0"}}/>
                        <div className="campos">
                            <h4 style={{fontWeight: "400", marginLeft: "0",marginRight: "10px", verticalAlign:"center"}}>Nome: </h4>
                            <input className="input-field" type="text" value={nomeCliente} onChange={event => {setNomeCliente(event.target.value)}} style={{backgroundColor:"#FFFFFF",width:"250px",height:"30px"}}/>
                            <h4 style={{fontWeight: "400", marginRight: "10px", verticalAlign:"center"}}>Comanda: </h4>
                            <input className="input-field" type="text" value={comanda} onChange={event => {setComanda(event.target.value)}} style={{backgroundColor:"#FFFFFF",width:"50px",height:"30px"}}/>
                            <h4 style={{fontWeight: "400", marginRight: "10px", verticalAlign:"center"}}>Mesa: </h4>
                            <input className="input-field" type="text" value={mesa} onChange={event => {setMesa(event.target.value)}} style={{backgroundColor:"#FFFFFF",width:"50px",height:"30px"}}/>
                        </div>
                        <hr style={{border:"1px solid #ccc",margin:"20px 0"}}/>
                        <div style={{display:"inline-flex",width:"80%"}}>
                            <div style={{textAlign: "center", width:"100%", marginTop: "0px", marginBottom: "20px"}}>
                                <h3>Adicionar Item Pedido</h3>
                            </div>
                        </div>
                        <div style={{display: "block"}}>
                            <select style={{ height: "30px" }}
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(Number(e.target.value))}>
                                    <option value="">-- Select --</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.id} - {product.nome} - {product.descricao}
                                        </option>
                                    ))}
                            </select>
                            <br/>
                            <button className="button-adicionar-produto" style={{}} onClick={adicionarItemProduto}>Adicionar</button>
                        </div>
                    </div>    
                </form>  
            </div>
        </>
    )
}