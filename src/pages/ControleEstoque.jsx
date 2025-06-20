import React, { useState, useEffect } from 'react';
import './ControleEstoque.css';
import Menu from '../components/Menu'

export default function ControleEstoque() {

  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {

    const token = sessionStorage.getItem("token");

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8090/itensEstoque/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Erro ao buscar itens do estoque:", error);
      }
    };

    fetchData();
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
          const response = await fetch('http://localhost:8090/csv/uploadItensEstoque', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
              const data = await res.json();
              setData(data);
  
          } else {
              const error = await response.text();
              setStatus('Upload failed: ' + error);
          }
      } catch (error) {
          setStatus('Error: ' + error.message);
      }
  };   

  return (
    <>
    <Menu/>
    <div className="container">
        <h2 className="title">Controle de Estoque</h2>
        <div className="headerButtons">
            <h3>Adicionar Novos Produtos (Lote)</h3>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <br /><br />
            <button onClick={handleUpload}>Faça o upload do CSV</button>
            <p>{status}</p>
        </div>
        <table className="table">
            <thead>
                <tr>
                    <th>PRODUTO</th>
                    <th>QUANTIDADE IDEAL</th>
                    <th>QUANTIDADE ATUAL</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={item.id}>
                    <td>{item.descricao}</td>
                    <td>
                        <input
                        type="number"
                        value={item.quantidadeIdeal}
                        disabled="true"
                        className="input"
                        />
                    </td>
                    <td>
                        <input
                        type="number"
                        value={item.quantidadeAtual}
                        disabled="true"
                        className="input"
                        />
                    </td>
                    </tr>
                ))}
            </tbody>
        </table>
      
    </div>
    </>
  );
}