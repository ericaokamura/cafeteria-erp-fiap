import { useState, useEffect } from "react";
import Menu from '../components/Menu'
import './CardapioEditor.css'

export default function CardapioEditor() {

    const [products, setProducts] = useState([]);

    let produtos = [];

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        const carregarProdutos = async () => {
            try {
              const response = await fetch('http://localhost:8090/produtos/', {
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
    

    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a CSV file first');
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file);

        const token = sessionStorage.getItem("token");

        try {
            setStatus('Uploading...');
            const response = await fetch('http://localhost:8090/csv/uploadProdutos', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                body: formData
            });
    
            if (response.ok) {
                setStatus('Upload successful!');
                const res = await fetch('http://localhost:8090/produtos/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });
                const data = await res.json();
                setProducts(data);
    
            } else {
                const error = await response.text();
                setStatus('Upload failed: ' + error);
            }
        } catch (error) {
            setStatus('Error: ' + error.message);
        }
    };    

    return(
        <>
            <Menu/>
            <div className="container">
                <div className="header">
                    <h2>Visualizar Produtos do Cardápio</h2>
                    <div className="headerButtons">
                        <h3>Adicionar Novos Produtos (Lote)</h3>
                        <input type="file" accept=".csv" onChange={handleFileChange} />
                        <br /><br />
                        <button onClick={handleUpload}>Faça o upload do CSV</button>
                        <p>{status}</p>
                    </div>
                </div>
                <hr style={{border:"1px solid #ccc",margin:"20px 0"}}/>
                <div className="productList">
                    {products.map((product, index) => (
                    <div key={index} className="productCard">
                        <div className="productInfo">
                            <div>
                                <p className="productName">Descrição: {product.descricao}</p>
                                <p className="description">Preço: R$ {product.valorUnitario.toFixed(2)}</p>
                            </div>
                        </div>
                        <hr style={{border:"1px solid #ccc",margin:"20px 0"}}/>
                    </div>
                    ))}
                </div>
            </div>
        </>
    )
}