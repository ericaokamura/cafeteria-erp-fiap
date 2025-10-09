import Menu from '../components/Menu'
import './NovoCadastro.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NovoCadastro() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [cpf, setCpf] = useState('');

    const navigate = useNavigate();

    const salvarCadastro = async (e) => {
        e.preventDefault();

        if(password === '') {
            alert("A senha não deve estar vazia.")
            return;
        }

        if(password.length < 8) {
            alert("A senha deve conter pelo menos 8 caracteres.")
            return;
        }
        
        try {
            const response = await fetch('http://localhost:8090/cadastro', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify({ nomeUsuario: username, senha: password, cpf: cpf, tipoFuncionario: role })
            });
    
            if (response.ok) {
              setUsername('');
              setPassword('');
              setCpf('');
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
            <Menu/>
            <div className="container">
                <h1 className="title">NOVO CADASTRO</h1>

                <form className="form">
                    <label>Nome Completo:</label>
                    <input type="text" className="input" />

                    <div className="row">
                        <div className="column">
                            <label>Data de nascimento:</label>
                            <input type="date" className="input" />
                        </div>
                        <div className="column">
                            <label>Sexo:</label>
                            <input type="text" className="input-sexo" />
                        </div>
                    </div>

                    <label>E-mail:</label>
                    <input  value={username} type="email" className="input" onChange={(e) => setUsername(e.target.value)} />

                    <label>Telefone:</label>
                    <input type="tel" className="input" />

                    <div className="row">
                        <div className="column">
                            <label>CPF:</label>
                            <input value={cpf} type="text" className="input" onChange={(e) => setCpf(e.target.value)} placeholder="Digite apenas números" />
                        </div>
                        <div className="column">
                            <label>RG:</label>
                            <input type="text" className="input-rg" />
                        </div>
                    </div>

                    <label>Endereço:</label>
                    <input type="text" className="input" />

                    <div className="radioGroup">
                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="FUNCIONARIO"
                                checked={role === 'FUNCIONARIO'}
                                onChange={() => setRole('FUNCIONARIO')}
                            />
                            Funcionário
                        </label>
                        <label>
                            <input
                            type="radio"
                            name="role"
                            value="GERENTE"
                            checked={role === 'GERENTE'}
                            onChange={() => setRole('GERENTE')}
                            />
                            Gerente
                        </label>
                    </div>

                    <label>Senha:</label>
                    <input value={password} type="password" className="input" onChange={(e) => setPassword(e.target.value)}/>

                    <div className="buttonContainer">
                        <button type="submit" className="button" onClick={salvarCadastro}>
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}