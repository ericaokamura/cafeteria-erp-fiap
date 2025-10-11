import Header from '../components/Header'
;
import './Login.css';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('token') ? true : false);

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('email');
        setIsLoggedIn(false);
        navigate("/login");
    }

    const doLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8090/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nomeUsuario: username,
                    senha: password
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Login bem-sucedido:", data);
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('role', data.role);
                sessionStorage.setItem('email', username);
                setIsLoggedIn(true);
                navigate("/menu");

            } else if (response.status == 404) {
                const errorData = await response.text();
                console.log("Erro:", errorData);
                alert("Usuário não encontrado.");
                
            } else {
                const errorData = await response.text();
                console.log("Erro:", errorData);
                alert("Usuário ou senha inválidos.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro na conexão com o servidor.");
        }
    };

    return (
        <>
            <Header/>
            <form onSubmit={doLogin} className="container">
                <h1 className="title">LOGIN</h1>
                {isLoggedIn && sessionStorage.getItem('token') && (
                    <Link className="links-logout" onClick={logout}><h4>Logout</h4></Link>
                )}  
                <div className="formGroup">
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
                    <div>
                        <input
                            className="input"
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Digite seu usuário"
                            required
                        />
                    </div>
                </div>  
                <div className="formGroup">
                    <label className="label">Senha:</label>
                    <div>
                        <input
                            className="input"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Digite sua senha"
                            required
                        />
                    </div>
                    <div className="links-esqueci-a-senha">
                        <a href="#">Esqueci a senha</a>
                    </div> 
                </div>                
                <div>
                    <button className="button" type="submit">Entrar</button>
                </div>
                <div className="links-novo-cadastro">
                    <Link to="/novo-cadastro">Novo Cadastro</Link>
                </div>
            </form>
        </>
    );
}
