import React from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import Menu from '../components/Menu';

export default function Dashboard() {
  return (
    <>
        <Menu/>
        <div className="container">
            <Link to="/adicionar-pedido"><button className="button">Adicionar Pedido</button></Link>
            <Link to="/gestao-pedidos"><button className="button">Gestão de Pedidos</button></Link>
            <Link to="/editar-cardapio"><button className="button">Visualizar Produtos do Cardápio</button></Link>
            <Link to="/controle-estoque"><button className="button">Gestão de Estoque</button></Link>
            <Link to="/estoque-qa"><button className="button">Estoque QA</button></Link>
        </div>
    </>
  );
}
