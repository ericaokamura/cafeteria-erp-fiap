import Menu from '../components/Menu';
import './Logout.css';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Logout() {

    const navigate = useNavigate();

    const [sessaoEncerrada, setSessaoEncerrada] = useState(false);

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('email');
        setSessaoEncerrada(true);
    }

    return (
        <>
            <Menu/>
            <div className="container">
                <h1 className="title">LOGOUT</h1>
                {sessaoEncerrada ?
                    <h3>Sessão encerrada!</h3>
                : <Link className="links-logout" onClick={logout}><h4>Sair</h4></Link> 
                } 
            </div>
        </>
    );
}
