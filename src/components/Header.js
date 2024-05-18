import React from "react";
import "./header.css";

const Header = ({ children }) => {
    return (
        <>
            <div className="header-container">
                <header className="header">
                <nav>
                    <ul>
                        <li>
                            <h1>Incluevents</h1>
                        </li>
                        <li>
                            <a href="/eventos">Eventos</a>
                        </li>
                        <li>
                            <a href="/validacoes">Validacoes</a>
                        </li>
                    </ul>
                </nav>
                </header>
            </div>
            {children}
        </>
     
    );
  };
  
  export default Header;