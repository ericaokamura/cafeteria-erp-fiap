import './EditarPedido.css';
import Menu from '../components/Menu'
import { useParams } from 'react-router-dom';
import React, { useState } from 'react';
import { useEffect } from 'react';

export default function EditarPedido() {

    const { id } = useParams();

    const [nomeCliente, setNomeCliente] = useState('');

    const [selectedProduct, setSelectedProduct] = useState('');

    const [pedido, setPedido] = useState({});

    const [comentarios, setComentarios] = useState('');

    const [formaPagamento, setFormaPagamento] = useState('');

    const [comanda, setComanda] = useState(0);

    const [mesa, setMesa] = useState(0);

    const [itensPedido, setItensPedido] = useState([]);

    const [selectedQuantity, setSelectedQuantity] = useState(1);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const carregarPedido = async () => {
            try {
                const response = await fetch('http://localhost:8090/pedidos/' + id, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                  },
                });
        
                if (response.ok) {
                  const data = await response.json();
                  setPedido(data);
                  setNomeCliente(data.nomeCliente);
                  setMesa(data.mesa);
                  setComanda(data.comanda);
                  setFormaPagamento(data.formaPagamento);
                } else {
                  const errorData = await response.json();
                  console.log("Erro: " + errorData);
                }
            } catch (error) {
                console.error('Erro na conexão com o servidor.');
            }
        };
        carregarPedido();
    }, []);

    useEffect(() => {
        carregarItensPedido();
    }, []);

    const handleFormaPagamentoChange = async (formaPagamento) => {
        const token = sessionStorage.getItem("token");
        try {
            const response = await fetch('http://localhost:8090/pedidos/' + id + '/alterarFormaPagamento?formaPagamento=' + formaPagamento, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Forma de pagamento atualizada.", data);
                setFormaPagamento(formaPagamento);
            } else {
                const errorData = await response.json();
                console.log("Erro: " + errorData);
            }
        } catch (error) {
            console.error('Erro na conexão com o servidor.');
        }
    }
   
    const carregarItensPedido = async () => {
        const token = sessionStorage.getItem("token");
        try {
            const response = await fetch('http://localhost:8090/pedidos/' + id + '/itens', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log("Itens pedido", data);
                setItensPedido(data);
            } else {
                const errorData = await response.json();
                console.log("Erro: " + errorData);
            }
        } catch (error) {
            console.error('Erro na conexão com o servidor.');
        }
    };
    

    const adicionarItemProduto = async (event) => {
        event.preventDefault();

        if (!selectedProduct) {
            alert("Selecione um produto antes de adicionar.");
            return;
        }
    
        const token = sessionStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8090/pedidos/${id}/inserirItem/${selectedProduct}?quantidade=${selectedQuantity}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log("Item adicionado:", data);
                carregarItensPedido();
                setSelectedProduct('');
                setSelectedQuantity(1);
                alert("Produto adicionado.");

            } else {
                console.error('Erro ao adicionar item ao pedido');
            }

        } catch (error) {
            console.error('Erro na conexão com o servidor.');
        }
    };

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
              setProducts(data);
            } catch (error) {
              console.error("Erro ao buscar pedidos:", error);
            }
        };
    
        carregarProdutos();
    }, []);

    const onEnviarComentario = () => {

        const token = sessionStorage.getItem("token");

        console.log("comentarios", comentarios);

        const salvarComentarios = async () => {
            try {
              const response = await fetch(`http://localhost:8090/pedidos/${pedido.id}/comentarios/${comentarios}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
              });
              const data = await response.json();
              setProducts(data);
            } catch (error) {
              console.error("Erro ao enviar comentários:", error);
            }
        };
        salvarComentarios();
    };

    return (
        <>
            <Menu/>
            <div className="container formulario">
                <form>
                    <div className="itens-pedido">
                        <div style={{display:"inline-flex",width:"80%"}}>
                            <div style={{width:"100%"}}>
                                <h2>Editar Pedido</h2>
                            </div>
                        </div>
                        <hr style={{border:"1px solid #ccc",margin:"20px 0"}}/>
                        <div className="campos">
                            <h4 style={{fontWeight: "400", marginRight: "10px", verticalAlign:"center"}}>Nome: </h4>
                            <input className="input-field" type="text" value={nomeCliente} onChange={event => {setNomeCliente(event.target.value)}} style={{backgroundColor:"#FFFFFF",width:"250px",height:"30px"}}/>
                            <h4 style={{fontWeight: "400", marginRight: "10px", verticalAlign:"center"}}>Comanda: </h4>
                            <input className="input-field" type="text" value={comanda} onChange={event => {setComanda(event.target.value)}} style={{backgroundColor:"#FFFFFF",width:"50px",height:"30px"}}/>
                            <h4 style={{fontWeight: "400", marginRight: "10px", verticalAlign:"center"}}>Mesa: </h4>
                            <input className="input-field" type="text" value={mesa} onChange={event => {setMesa(event.target.value)}} style={{backgroundColor:"#FFFFFF",width:"50px",height:"30px"}}/>
                        </div>
                        <hr style={{border:"1px solid #ccc",margin:"20px 0"}}/>
                        <div style={{display:"inline-flex",width:"80%"}}>
                            <div style={{textAlign: "center", width:"100%", marginTop: "0px"}}>
                                <h3>Adicionar Item Pedido</h3>
                            </div>
                        </div>
                        <div style={{display: "block",marginTop: "20px"}}>
                            <span>Produto:        </span>
                            <select style={{height: "30px"}}
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}>
                                <option value="">-- Select --</option>
                                    {products.map((product, index) => (
                                        <option key={index} value={product.id}>
                                            {product.id} - {product.nome} - {product.descricao}
                                        </option>
                                    ))}
                            </select>
                            <br/>
                            <span>Quantidade:    </span>
                            <input
                                type="number"
                                min="1"
                                value={selectedQuantity}
                                onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
                                style={{ marginTop: "20px", height: "20px", marginLeft: "10px", width: "60px" }}/>
                            <br/>
                            <div>
                                <button style={{justifySelf: "center", marginRight: 0}} className="button-adicionar-produto" onClick={adicionarItemProduto}>Adicionar Produto</button>
                            </div>
                        </div>
                        <div style={{marginTop:"20px"}}>
                            <h3 style={{marginTop:"20px"}}>Adicionar ou Editar Comentário</h3>
                            <h4 className="comentarios">{comentarios}</h4>
                            <input value={pedido.comentarios} style={{height: "30px",marginRight: "20px"}} onChange={e=>setComentarios(e.target.value)}></input>
                            <button style={{border: "1px solid #000000"}} onClick={onEnviarComentario}>Enviar comentário</button>
                         </div> 
                        <div style={{marginTop: "30px"}}>
                            <h3>Forma de Pagamento</h3>
                            <select style={{marginTop: "20px"}} name="forma-pagamento" value={formaPagamento} onChange={(event) => handleFormaPagamentoChange(event.target.value)}>
                                <option id="0" >PIX</option>
                                <option id="1" >CARTAO_CREDITO</option>
                                <option id="2" >CARTAO_DEBITO</option>
                            </select>
                        </div>
                    </div>    
                </form>
            </div>
        </>
    )
}