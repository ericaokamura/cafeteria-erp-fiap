import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from './pages/Login'
import NovoCadastro from './pages/NovoCadastro'
import GestaoPedidos from './pages/GestaoPedidos'
import CardapioEditor from './pages/CardapioEditor'
import ControleEstoque from './pages/ControleEstoque'
import EditarPedido from './pages/EditarPedido'
import AdicionarPedido from './pages/AdicionarPedido'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/novo-cadastro" element={<NovoCadastro />}/>
          <Route path="/gestao-pedidos" element={<GestaoPedidos />}/>
          <Route path="/editar-cardapio" element={<CardapioEditor />}/>
          <Route path="/editar-pedido/:id" element={<EditarPedido />}/>
          <Route path="/adicionar-pedido" element={<AdicionarPedido />}/>
          <Route path="/controle-estoque" element={<ControleEstoque />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
