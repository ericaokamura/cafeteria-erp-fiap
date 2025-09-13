import React from 'react';
import Pedido from '../components/Pedido'

const Pagination = (props)=> {

    const { currentPage, maxPageLimit, minPageLimit} = props;
    const totalPages = props.totalPages;
    const data = props.response;

    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    const handlePrevClick = ()=>{
        props.onPrevClick();
    }
    const handleNextClick = ()=>{
        props.onNextClick();
    }
    const handlePageClick = (e)=>{
        props.onPageChange(Number(e.target.id));
    }

    const pageNumbers = pages.map(page => {
        if(page <= maxPageLimit  && page > minPageLimit) {
            return(
                <button key={page} id={page} onClick={handlePageClick} 
                    className={currentPage===page ? 'active' : null}>
                    {page}
                </button>
            );
        } else {
            return null;
        }
      }
    );

    let pageIncrementEllipses = null;
    if(pages.length > maxPageLimit) {
        pageIncrementEllipses = <button onClick={handleNextClick}>&hellip;</button>
    }

    let pageDecremenEllipses = null;
    if(minPageLimit >=1){
        pageDecremenEllipses = <button onClick={handlePrevClick}>&hellip;</button> 
    }

    const renderData = (data)=>{
        console.log("data", data);
        return(
            <ul>
                {data.length > 0 && (
                    <div>
                        {data.map((p, index) => (
                            <Pedido key={index} pedido={p}/>
                        ))}
                    </div>
                )}
            </ul>
        )
    }
    
    return(
        <div className="main">
            <div className="mainData">
              {renderData(data)}
            </div>
            <div style={{display:"inline-flex",marginTop:"20px"}}>
                <button className="prevButton" onClick={handlePrevClick} disabled={currentPage === pages[0]}>Anterior</button>
                <div>
                    <div>
                        {pageDecremenEllipses}
                    </div> 
                    <div style={{marginRight:"20px",marginLeft:"20px"}}>
                        {pageNumbers}
                    </div> 
                    <div>
                        {pageIncrementEllipses}
                    </div>
                </div>
                <button className="nextButton" onClick={handleNextClick} disabled={currentPage === pages[pages.length-1]}>Próximo</button>
            </div>
        </div>
    )
}
export default Pagination;