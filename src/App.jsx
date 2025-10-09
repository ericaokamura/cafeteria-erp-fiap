import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from './pages/Login'
import NovoCadastro from './pages/NovoCadastro'
import GestaoPedidos from './pages/GestaoPedidos'
import CardapioEditor from './pages/CardapioEditor'
import ControleEstoque from './pages/ControleEstoque'
import EditarPedido from './pages/EditarPedido'
import AdicionarPedido from './pages/AdicionarPedido'
import EstoqueQA from './pages/EstoqueQA.jsx'
import Dashboard from './pages/Dashboard'
import Relatorios from './pages/Relatorios'
import DadosPessoais from './pages/DadosPessoais'
import Logout from './pages/Logout'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/menu" element={<Dashboard />}/>
          <Route path="/novo-cadastro" element={<NovoCadastro />}/>
          <Route path="/gestao-pedidos" element={<GestaoPedidos />}/>
          <Route path="/editar-cardapio" element={<CardapioEditor />}/>
          <Route path="/editar-pedido/:id" element={<EditarPedido />}/>
          <Route path="/adicionar-pedido" element={<AdicionarPedido />}/>
          <Route path="/controle-estoque" element={<ControleEstoque />}/>
          <Route path="/estoque-qa" element={<EstoqueQA />}/>
          <Route path="/relatorios" element={<Relatorios />}/>
          <Route path="/dados-pessoais" element={<DadosPessoais />}/>
          <Route path="/logout" element={<Logout />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
