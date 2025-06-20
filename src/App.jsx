import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from './pages/Login'
import NovoCadastro from './pages/NovoCadastro'
import GestaoPedido from './pages/GestaoPedido'
import CardapioEditor from './pages/CardapioEditor'
import ControleEstoque from './pages/ControleEstoque'
import Dashboard from './pages/Dashboard'


function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/novo-cadastro" element={<NovoCadastro />}/>
        <Route path="/gestao-pedido" element={<GestaoPedido />}/>
        <Route path="/editar-cardapio" element={<CardapioEditor />}/>
        <Route path="/controle-estoque" element={<ControleEstoque />}/>

      </Routes>
    </Router>
    </>
  )
}

export default App
