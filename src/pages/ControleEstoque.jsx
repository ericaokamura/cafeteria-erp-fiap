import React, { useState, useEffect } from 'react';
import './ControleEstoque.css';
import Header from '../components/Header'

export default function ControleEstoque() {

  const [data, setData] = useState([]);

  const [quantidadeAtualizada, setQuantidadeAtualizada] = useState();

  const fetchData = async () => {

    const token = sessionStorage.getItem("token");

    const username = sessionStorage.getItem("email");

    try {
      const res = await fetch('http://localhost:8090/itensEstoque/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
      });

      if (res.ok) {
        const json = await res.json();
        const lowStockItems = json.filter(item => item.quantidadeAtual < item.quantidadeIdeal);
        setData(json);

        if (lowStockItems.length > 0) {
          sendBatchEmailAlert(lowStockItems, username);
        }
      } else{
        const errorData = res.json();
        console.log("Erro: " + errorData);
      }
    } catch (error) {
      console.error("Erro ao buscar itens do estoque:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
      setFile(e.target.files[0]);
  };

  const salvarItemEstoque = async (item) => {

    const token = sessionStorage.getItem("token");

    item.quantidadeAtual = quantidadeAtualizada;

    try {
      const res = await fetch(`http://localhost:8090/itensEstoque/id/${item.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(item)
      });

      if (res.ok) {
        console.log("Item do estoque salvo com sucesso!");
        alert("Item do estoque salvo com sucesso!");
      } else {
        const errorData = res.json();
        console.log("Erro: " + errorData);
      }
    } catch (error) {
      console.log("Erro interno do servidor: " + error);
    }
  }

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
          const response = await fetch('http://localhost:8090/csv/uploadItensEstoque', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
          });
  
          if (response.ok) {
              setStatus('Upload successful!');
  
              const res = await fetch('http://localhost:8090/itensEstoque/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
              });
              const json = await res.json();
              setData(json);
  
          } else {
              const error = await response.text();
              setStatus('Upload failed: ' + error);
          }
      } catch (error) {
          setStatus('Error: ' + error.message);
      }
  };   

  async function sendBatchEmailAlert(lowStockItems, username) {
    try {
      const token = sessionStorage.getItem("token");
      const response = fetch("http://localhost:8090/alert/emailBatch/" + username, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(lowStockItems),
      });
  
      if (response.ok) {
        console.log("Batch email alert sent successfully.");
      } else {
        console.error("Email batch failed:", response.status);
      }
    } catch (err) {
      console.error("Erro ao enviar alerta por e-mail (batch):", err);
    }
  }

  return (
    <>
    <Header/>
    <div className="container">
        <h2 className="title">Controle de Estoque</h2>
        <div className="headerButtons">
            <h3>Adicionar Novos Produtos (Lote)</h3>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <br /><br />
            <button className="button" onClick={handleUpload}>Faça o upload do CSV</button>
            <p>{status}</p>
        </div>
        <table className="table">
            <thead>
                <tr>
                    <th>PRODUTO</th>
                    <th>QUANTIDADE IDEAL</th>
                    <th>QUANTIDADE ATUAL</th>
                    <th>STATUS</th>
                    <th>EDITAR</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => {

                    const isLowStock = item.quantidadeAtual < item.quantidadeIdeal;

                    const circleStyle = {
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        marginRight: "8px",
                        backgroundColor: isLowStock ? "red" : "green",
                    };

                    return (
                        <tr key={index}>
                            <td>{item.descricao}</td>
                            <td>
                                <input
                                  type="number"
                                  value={item.quantidadeIdeal}
                                  disabled={true}
                                  className="input-quantidade"
                                />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={item.quantidadeAtual}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  setData(prevData =>
                                    prevData.map((d, i) =>
                                      i === index ? { ...d, quantidadeAtual: newValue } : d
                                    )
                                  );
                                  setQuantidadeAtualizada(newValue);
                                }}
                                className="input-quantidade"
                                />
                            </td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                  <span style={circleStyle}></span>
                                  <span>{isLowStock ? "Faltando" : "Em estoque"}</span>
                              </div>
                            </td>
                            <td>
                              <button className="buttonSalvar" onClick={() => salvarItemEstoque(item)}>Salvar</button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
    </>
  );
}