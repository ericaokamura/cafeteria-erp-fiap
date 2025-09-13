import './EstoqueQA.css';
import Menu from '../components/Menu'
import React, { useState } from 'react';

export default function EstoqueQA() {

    const token = sessionStorage.getItem("token");

    const [resposta, setResposta] = useState('');
    const [question, setQuestion] = useState('');

    const enviarPergunta = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`http://localhost:8080/ai/${question}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            const data = await response.text();
            setResposta(data);
        } catch (error) {
            console.error('Erro ao enviar pergunta:', error);
            setResposta({ error: error.message });
        }
    };
    

    return (
        <>
            <Menu/>
            <div className="container">
                <h2 className="title">Controle de Estoque</h2>
                <form onSubmit={enviarPergunta}>
            <div style={{ display: "block" }}>
                <input
                    className="question-input"
                    type="text"
                    placeholder="Faça uma pergunta"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <br />
                <button type="submit" className="sendButton" style={{ marginTop: "20px" }}>Enviar</button>
            </div>

            {resposta && (
                <div style={{ marginTop: '20px' }}>
                    <strong>Resposta:</strong> {JSON.stringify(resposta)}
                </div>
            )}
        </form>

            </div>
        </>
    )
}