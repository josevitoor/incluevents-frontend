import React from "react";
import "./header.css";

const Header = ({ children }) => {
    const pathname = window.location.pathname;

    return (
        <>
            <div className="header-container">
                <header className="header">
                    <div className="header-content">
                        <h1>Incluevents</h1>
                        <nav className="nav-tabs">
                            <ul>
                                <li className={pathname === "/eventos" ? "active" : ""}>
                                    <a href="/eventos">Eventos</a>
                                </li>
                                <li className={pathname === "/validacoes" ? "active" : ""}>
                                    <a href="/validacoes">Validações</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </header>
            </div>
            {children}
        </>
    );
};

export default Header;
