import './EstoqueQA.css';
import Header from '../components/Header'

import React, { useState } from 'react';

export default function EstoqueQA() {

    const [mensagem, setMensagem] = useState("");
    const [chat, setChat] = useState([
    { remetente: "bot", texto: "Olá! Sou seu assistente com IA 🤖" },
    ]);
    const [carregando, setCarregando] = useState(false);

    const enviarPergunta = async (event) => {
        event.preventDefault();
        if (!mensagem.trim()) return;

        const novaMensagem = { remetente: "user", texto: mensagem };
        const novoChat = [...chat, novaMensagem];
        setChat(novoChat);
        setMensagem("");
        setCarregando(true);

        const token = sessionStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8090/api/chat?question=${novaMensagem.texto}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            const data = await response.text();
            setChat([...novoChat, { remetente: "bot", texto: data }]);

        } catch (error) {
            console.error("Erro ao conectar com API:", error);
            setChat([
                ...novoChat,
                { remetente: "bot", texto: "⚠️ Erro ao conectar com o servidor." },
            ]);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <>
        <Header />
        <div style={styles.container}>
            <h3>Chat com IA</h3>
            <br/>
            <div style={styles.chatBox}>
                {chat.map((msg, i) => (
                    <div
                        key={i}
                        style={{
                            ...styles.message,
                            alignSelf: msg.remetente === "user" ? "flex-end" : "flex-start",
                            backgroundColor: msg.remetente === "user" ? "#fef9f9" : "#EAEAEA",
                        }}
                    >
                        {msg.texto}
                    </div>
                ))}
                {carregando && <div style={styles.loading}>💭 Pensando...</div>}
            </div>

            <form onSubmit={enviarPergunta} style={styles.form}>
                <input
                    type="text"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    style={styles.input} />
                <button type="submit" style={styles.button}>
                    Enviar
                </button>
            </form>
        </div></>
      );
}
    
const styles = {
    container: {
        width: 400,
        margin: "20px auto",
        border: "1px solid #ccc",
        borderRadius: 10,
        padding: 10,
        display: "flex",
        flexDirection: "column",
        height: 500,
        backgroundColor: "white",
    },
    chatBox: {
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginBottom: 10,
        margin: "20px",
    },
    message: {
        padding: "8px 12px",
        borderRadius: 16,
        maxWidth: "70%",
    },
    loading: {
        alignSelf: "flex-start",
        color: "#666",
        fontStyle: "italic",
    },
    form: {
        display: "flex",
        gap: 10,
    },
    input: {
        flex: 1,
        padding: 8,
        borderRadius: 8,
        border: "1px solid #ccc",
    },
    button: {
        padding: "10px 30px",
        border: "1px solid #888",
        backgroundColor: "white",
        borderRadius: "6px",
        fontsize: "16px",
        cursor: "pointer",
        boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)",     
    }
};