import { useState, useEffect } from 'react';
import Menu from '../components/Menu';
import './Relatorios.css';
import { useNavigate } from 'react-router-dom';

export default function Relatorios() {


    const onDownloadRelatorioVendas = () => {
        
        const token = sessionStorage.getItem("token");

        const exportarRelatorioVendas = async () => {
            try {
                const response = await fetch('http://localhost:8090/export', {
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
        };

        exportarRelatorioVendas();
    }

    return (
        <>
            <Menu />
            <div className="container">
                <h2>Exportação de Relatórios</h2>
                <hr className="divider" />
                <div style={{marginTop:"20px"}}>
                    <button style={{border:"1px solid #000000"}} onClick={onDownloadRelatorioVendas}>Download Relatório de Vendas</button>
                </div>
            </div>
        </>
    );
}