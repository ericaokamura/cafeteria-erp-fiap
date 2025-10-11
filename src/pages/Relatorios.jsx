import { useState, useEffect } from 'react';
import Header from '../components/Header'
;
import './Relatorios.css';
import { useNavigate } from 'react-router-dom';

export default function Relatorios() {

    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");

    const onDownloadRelatorioVendas = async () => {

        if(dataInicio === '' || dataFim === '') {
            alert("Preencha as data de início e fim antes de realizar o download do relatório.")
            return;
        }
        
        const token = sessionStorage.getItem("token");
    
        try {
            const response = await fetch(`http://localhost:8090/export?dataInicio=${dataInicio}&dataFim=${dataFim}`, {
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

            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {
            console.error("Erro ao fazer download do relatório:", error);
        }
        
    }

    return (
        <>
            <Header />
            <div className="container">
                <h2>Exportação de Relatórios</h2>
                <hr className="divider" />

                <h3>Filtro por Data</h3>

                <br/>

                <div style={{ marginBottom: 10 }}>
                    <label>De: </label>
                    <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    />
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label>Até: </label>
                    <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    />
                </div>
                
                <hr />

                <div style={{marginTop:"20px"}}>
                    <button style={{border:"1px solid #000000"}} onClick={onDownloadRelatorioVendas}>Download Relatório de Vendas</button>
                </div>
            </div>
        </>
    );
}