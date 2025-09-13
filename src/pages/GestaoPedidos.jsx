import { useState, useEffect } from 'react';
import Menu from '../components/Menu';
import './GestaoPedidos.css';
import { useNavigate } from 'react-router-dom';
import Pagination from '../utils/Pagination';

export default function GestaoPedidos() {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [todosPedidos, setTodosPedidos] = useState([]);

    const [filtro, setFiltro] = useState('');
    const [valor, setValor] = useState(''); 

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const userEmail = sessionStorage.getItem("email");

        if (!token || !userEmail) {
            navigate('/login');
            return;
        }
    }, []);

    const pageNumberLimit = 5;
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPageLimit, setMaxPageLimit] = useState(5);
    const [minPageLimit, setMinPageLimit] = useState(0);

    const onPageChange = (pageNumber)=>{
        console.log("page number", pageNumber);
        setCurrentPage(pageNumber);
    }

    const onPrevClick = ()=>{
        if((currentPage-1) % pageNumberLimit === 0){
            setMaxPageLimit(maxPageLimit - pageNumberLimit);
            setMinPageLimit(minPageLimit - pageNumberLimit);
        }
        setCurrentPage(prev=> prev-1);
    }

    const onNextClick = ()=>{
        if(currentPage+1 > maxPageLimit){
            setMaxPageLimit(maxPageLimit + pageNumberLimit);
            setMinPageLimit(minPageLimit + pageNumberLimit);
        }
        setCurrentPage(prev=>prev+1);
    }


    useEffect(() => {

        const token = sessionStorage.getItem("token");

        const carregarPedidos = async () => {
            try {
                const response = await fetch('http://localhost:8090/pedidos', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });

                if (response.status === 403) {
                    alert("Acesso não autorizado. Faça login novamente.");
                    navigate('/login');
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }

                const data = await response.json();
                setTodosPedidos(data);
                console.log("todos os pedidos", data);

            } catch (error) {
                console.error("Erro ao buscar pedidos:", error);
            }
        };

        carregarPedidos();
    }, []);

    useEffect(() => {

        const token = sessionStorage.getItem("token");

        setLoading(true);

        const carregarPedidosPorPaginacao = async (numeroPagina) => {
            try {
                const response = await fetch('http://localhost:8090/pedidos/paginacao?numeroPagina=' + numeroPagina, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });

                console.log("numero pagina", numeroPagina);

                if (response.status === 403) {
                    alert("Acesso não autorizado. Faça login novamente.");
                    navigate('/login');
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }

                const data = await response.json();
                setPedidos(data);
                setLoading(false);
                console.log("pedidos por página", data);

            } catch (error) {
                console.error("Erro ao buscar pedidos:", error);
            }
        };
        if(!filtro || !valor) {
            carregarPedidosPorPaginacao(currentPage-1);
        }
    }, [currentPage]);

    const paginationAttributes = {
        currentPage,
        maxPageLimit,
        minPageLimit,
        response: pedidos,
        totalPages: 5
    };

    useEffect(() => {

        setLoading(true);
           
        const token = sessionStorage.getItem("token");

        const carregarPedidosPorPaginacaoEFiltro = async () => {
            try {
                const response = await fetch(`http://localhost:8090/pedidos/paginacao/${filtro}?numeroPagina=${currentPage-1}&${filtro}=${valor}`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });

                if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

                const data = await response.json();
                setPedidos(data);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao limpar filtro:", error);
            }
        };
        if(filtro && valor) {
            carregarPedidosPorPaginacaoEFiltro();
        }
    }, [currentPage, filtro, valor]);

    const onLimparFiltro = () => {

        setFiltro('');
        setValor('');
        setCurrentPage(1);

        setLoading(true);
           
        const token = sessionStorage.getItem("token");

        const carregarPedidosPorPaginacao = async () => {
            let numeroPagina = currentPage - 1;
            try {
                const response = await fetch(`http://localhost:8090/pedidos/paginacao?numeroPagina=${numeroPagina}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });

                if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

                const data = await response.json();
                setPedidos(data);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao limpar filtro:", error);
            }
        };
        carregarPedidosPorPaginacao();

    };
    
    return (
        <>
            <Menu />
            <div className="container">
                <h2>Pedidos</h2>
                <div>
                    <h3 style={{marginTop: "20px"}}>Filtros de pesquisa</h3>
                    <h4>Filtrar por</h4>
                    <select style={{height:"30px", border: "1px solif #0000000", borderRadius: "4px"}} value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                        <option value="">-- Escolha uma opção --</option>
                        <option value="comanda">Comanda</option>
                        <option value="mesa">Mesa</option>
                        <option value="statusPedido">Status Pedido</option>
                    </select>
                    <input style={{height:"30px", marginLeft: "20px", marginRight: "20px", paddingLeft: "10px", border: "1px solif #0000000", borderRadius: "4px"}}
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        placeholder="Insira um valor"/>
                    <button className="filterButton" onClick={onLimparFiltro}>Limpar filtro</button>    
                </div>
                <hr className="divider" />
                {!loading ? <Pagination {...paginationAttributes} 
                          onPrevClick={onPrevClick} 
                          onNextClick={onNextClick}
                          onPageChange={onPageChange}/>
                : <div> Loading... </div>
                }
            </div>
        </>
    );
}
