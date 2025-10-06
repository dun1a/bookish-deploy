import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../styles/global.css';
// import logo from "../assets/img/logoOne.png"

export const NavBar = ({ isAuthenticated, setIsAuthenticated }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleClick = (e) => {
        setIsAuthenticated(false);
        localStorage.removeItem("user");
    }

    return (
        <nav className="navbar">


            <div className="nav_menu" onClick={() => setMenuOpen(!menuOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul className={menuOpen ? "open" : ""}>
                {!isAuthenticated ? (
                    <>
                        <div className="nav_logo-title">
                            <Link to="/" className="nav_bookish-title">
                                <span className="nav_bookish-title">Bookish</span>
                            </Link>
                        </div>
                        <div className="nav_nav-center">

                            <li>
                                <NavLink to="/" className={({ isActive }) => (isActive ? "nav_active" : "")}>
                                    Home
                                </NavLink>
                            </li>
                            <span></span>
                            <li>
                                <NavLink to="/about-us" className={({ isActive }) => (isActive ? "nav_active" : "")}>
                                    About us
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/contact-us" className={({ isActive }) => (isActive ? "nav_active" : "")}>
                                    Contact us
                                </NavLink>
                            </li>

                        </div>

                        <div className="nav_nav-right">
                            <li>
                                <NavLink to="/login" className={({ isActive }) => (isActive ? "nav_active" : "")}>
                                    Sign in
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/signup" className={({ isActive }) => (isActive ? "nav_active" : "")}>
                                    Get Started
                                </NavLink>
                            </li>
                        </div>
                    </>
                ) : (
                    <div className="nav_nav-right">
                        <li>
                            <NavLink to="/mainPage" className={({ isActive }) => (isActive ? "nav_active" : "")}>
                                My Bookish
                            </NavLink>
                        </li>
                        <li>
                            <NavLink onClick={handleClick}>
                                Log out
                            </NavLink>
                        </li>
                    </div>
                )}

            </ul>
        </nav>
    );
};

export default NavBar;