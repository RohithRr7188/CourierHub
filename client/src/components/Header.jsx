import React, { useContext, useState, useEffect } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../UserContext";
import logtrans from "../Assets/logtrans.png";
import { logout } from "../api/user";

const Header = () => {
  const history = useNavigate();
  const { userhome, setuserhome } = useContext(UserContext);
  const { user, setUser } = useContext(UserContext);
  const { usertype, setUsertype } = useContext(UserContext);
  const [navbarState, setNavbarState] = useState("transparent");

  const handleScroll = () => {
    if (window.scrollY > 500) {
      setNavbarState("colored");
    } else if (window.scrollY > 50) {
      setNavbarState("blurred");
    } else {
      setNavbarState("transparent");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();

    logout()
      .then((res) => {
        toast.success(res.message);
        setUser(null);
        setUsertype(null);
        history("/login");
      })
      .catch((err) => console.error(err));
  };

  return (
    <main>
      <nav className={`navbar navbar-custom navbar-expand-lg ${navbarState}`}>
        <img src={logtrans} alt="logo" width="160" height="75" />

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto navbar-nav-margin">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link navbarnav-link " to="/" activeclassname="active">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link navbarnav-link " to="/ordertracking" activeclassname="active">
                    Track order
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link navbarnav-link" to="/order" activeclassname="active">
                    Place order
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link navbarnav-link" to="/signup" activeclassname="active">
                    Sign Up
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link navbarnav-link" to="/login" activeclassname="active">
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link navbarnav-link" to={userhome} activeclassname="active">
                    {user}'s Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link navbarnav-link" to="/map" activeclassname="active">
                    Map
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link navbarnav-link" to="/ordertracking" activeclassname="active">
                    Track order
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link navbarnav-link" to="/order" activeclassname="active">
                    Place order
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link navbarnav-link" to="/chats" activeclassname="active">
                    Chat
                  </Link>
                </li>
                <li className="nav-item">
                  <span className="nav-link navbarnav-link" style={{ cursor: "pointer" }} onClick={handleLogout}>
                    Logout
                  </span>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </main>
  );
};

export default Header;
