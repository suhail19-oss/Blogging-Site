import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();
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

    return (
        <header>
            <Link to="/" className="logo">
                Blogify
            </Link>
            <nav>
                {loading ? (
                    <span>Loading...</span>
                ) : userInfo ? (
                    <>
                        <Link to="/create" style={{ margin: "0 10px" }}>
                            Create a New Post
                        </Link>
                        <span onClick={handleLogout} style={{ margin: "0 10px", cursor: 'pointer', color: 'black' }}>
                            Logout
                        </span>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ margin: "0 10px" }}>
                            Login
                        </Link>
                        <Link to="/register" style={{ margin: "0 10px" }}>
                            Register
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}
