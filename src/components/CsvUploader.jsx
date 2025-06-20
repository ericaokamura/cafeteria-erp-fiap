import React, { useState } from 'react';

function CsvUploader() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
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

    try {
      setStatus('Uploading...');
      const response = await fetch('http://localhost:8090/csv/uploadProdutos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
        setStatus('Upload successful!');
      } else {
        const error = await response.text();
        setStatus('Upload failed: ' + error);
      }
    } catch (error) {
      setStatus('Error: ' + error.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Adicionar Novos Produtos (Lote)</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload}>Faça o upload do CSV</button>
      <p>{status}</p>

      {data.length > 0 && (
        <div>
          <h3>Uploaded Data:</h3>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CsvUploader;
