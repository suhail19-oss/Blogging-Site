import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("http://localhost:4000/profile", {
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data);
                } else {
                    setUserInfo(null);
                }
            } catch (error) {
                console.error("Failed to fetch user info:", error);
                alert("Error fetching user info. Please refresh the page.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [setUserInfo]);

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to log out?")) {
            try {
                const response = await fetch("http://localhost:4000/logout", {
                    method: "POST",
                    credentials: "include",
                });

                if (response.ok) {
                    setUserInfo(null);
                    navigate("/login");
                } else {
                    alert("Logout failed. Please try again.");
                }
            } catch (error) {
                console.error("Logout error:", error);
                alert("Logout error. Please try again.");
            }
        }
    };

    // Header styles
    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#f1f1f1',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };

    const linkStyle = {
        textDecoration: 'none',
        color: 'black',
        padding: '10px',
        margin: '0 10px',
        transition: 'text-decoration 0.3s, transform 0.3s',
    };

    const activeStyle = {
        textDecoration: 'underline',
    };

    const formatUsername = (username) => {
        return username.charAt(0).toUpperCase() + username.slice(1);
    };

    return (
        <header style={headerStyle}>
            <Link to="/" style={{ ...linkStyle, fontSize: '1.5rem', fontWeight: 'bold' }}>
                Blogify
            </Link>
            <nav style={{ display: 'flex', alignItems: 'center' }}>
                {loading ? (
                    <span style={{ color: '#666' }}>Loading...</span>
                ) : userInfo ? (
                    <>
                        <span style={{ margin: '0 10px', fontWeight: 'bold' }}>
                            Hello, {formatUsername(userInfo.username)}!
                        </span>
                        <Link to="/create" 
                              style={{ ...linkStyle, ...(location.pathname === '/create' ? activeStyle : {}) }}
                              onMouseEnter={(e) => {
                                  e.target.style.transform = 'scale(1.05)';
                                  e.target.style.textDecoration = 'underline';
                              }} 
                              onMouseLeave={(e) => {
                                  e.target.style.transform = 'scale(1)';
                                  e.target.style.textDecoration = '';
                              }}
                        >
                            Create a New Post
                        </Link>
                        <span
                            onClick={handleLogout}
                            style={{ ...linkStyle, cursor: 'pointer', ...(location.pathname === '/login' ? activeStyle : {}) }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                                e.target.style.textDecoration = 'underline';
                            }} 
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.textDecoration = '';
                            }}
                        >
                            Logout
                        </span>
                    </>
                ) : (
                    <>
                        <Link to="/login" 
                              style={{ ...linkStyle, ...(location.pathname === '/login' ? activeStyle : {}) }}>
                            Login
                        </Link>
                        <Link to="/register" 
                              style={{ ...linkStyle, ...(location.pathname === '/register' ? activeStyle : {}) }}>
                            Register
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}
