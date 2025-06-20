import './Menu.css'
import { Link } from 'react-router-dom';


export default function Menu() {

    const isTokenValid = sessionStorage.getItem('token') ? true : false;

    return (
        <>
            <div className="menu">
                <div style={{paddingLeft:"60px",paddingRight:"60px"}}>
                    <h4>HOME</h4>
                </div>
                <div style={{paddingLeft:"60px",paddingRight:"60px"}}>
                    <h4>SOBRE</h4>
                </div>
                <div className="circle"></div>
                <div style={{paddingLeft:"60px",paddingRight:"60px"}}>
                    <h4>CONTATO</h4>
                </div>
                <div style={{paddingLeft:"60px",paddingRight:"60px"}}>
                    <Link to="/login"><h4>LOGIN</h4></Link>
                </div>
                {isTokenValid ? (
                    <div style={{paddingLeft:"60px",paddingRight:"60px"}}>
                        <Link to="/dashboard"><h4>DASHBOARD</h4></Link>
                    </div>
                ):(
                    <div style={{paddingLeft:"60px",paddingRight:"60px"}}></div>
                )}
            </div>
        </>
    )
}