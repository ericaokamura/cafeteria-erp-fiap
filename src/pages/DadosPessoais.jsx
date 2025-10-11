import Header from '../components/Header'

import './DadosPessoais.css'
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DadosPessoais() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [cpf, setCpf] = useState('');
    const [ maskedCpf, setMaskedCpf] = useState('');
    
    const navigate = useNavigate();

    useEffect(() => {

        const token = sessionStorage.getItem("token");

        const email = sessionStorage.getItem('email');

        const carregarDadosPessoais = async () => {
            try {
                const response = await fetch(`http://localhost:8090/cadastro/nomeUsuario?nomeUsuario=${email}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': 'Bearer ' + token
                  },
                });
        
                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.nomeUsuario);
                    setPassword(data.senha);
                    setRole(data.tipoFuncionario);
                    setCpf(data.cpf);
                    setMaskedCpf("***." + data.cpf.substring(3,6) + ".***-**");
                } else {
                    const errorData = await response.json();
                    console.log(errorData)
                }
            } catch (error) {
                console.log(error)
            }
        };
        carregarDadosPessoais();
    }, []);

    const encerrarConta = async (e) => {
        e.preventDefault();

        const token = sessionStorage.getItem("token");
        const email = sessionStorage.getItem('email');

        try {
            const response = await fetch(`http://localhost:8090/cadastro/nomeUsuario?nomeUsuario=${email}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': 'Bearer ' + token
                }
            });
    
            if (response.ok) {
                console.log("Conta encerrada com sucesso!");
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('role');
                sessionStorage.removeItem('email');
                navigate("/login");
            } else {
                const errorData = await response.json();
                console.log(errorData)
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <>
            <Header/>
            <div className="container">
                <h1 className="title">DADOS PESSOAIS</h1>

                <form className="form">

                    <label>E-mail:</label>
                    <input value={username} type="email" className="input" disabled/>

                    <div className="row">
                        <div className="column">
                            <label>CPF:</label>
                            <input value={maskedCpf} type="text" className="input" disabled />
                        </div>
                    </div>

                    <label>Tipo de Funcionário:</label>
                    <input value={role} type="email" className="input" disabled/>

                    <label>Senha:</label>
                    <input value={password} type="password" className="input" disabled/>
                        
                    <div>
                        <button type="submit" className="button" onClick={encerrarConta} >
                            Encerrar conta
                        </button>
                    </div>
                </form>
                
            </div>
           
        </>
    )
}