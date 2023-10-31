import { Link } from "react-router-dom";

import "./Header.scss";
import useScreenSize from "../../../utils/screenSize";
import { Fragment } from "react";
import Cookies from "js-cookie";
import { TOKEN } from "../../../constants";

const Header = () => {
  const screenSize = useScreenSize();
  const isAuthenticated = Boolean(Cookies.get(TOKEN))

  return (
    <header>
      <nav className="nav">
        <div className="container nav__container">
          <Link to="/" className="nav__logo">
            {screenSize > 450 ? "PTP Solutions" : "PTPs"}
          </Link>
          <ul className="nav__menu">
            {isAuthenticated ? (
              <li className="nav__item">
                <Link className="nav__link" to="/account">
                  My Account
                </Link>
              </li>
            ) : (
              <Fragment>
                <li className="nav__item">
                  <Link className="nav__link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav__item">
                  <Link className="nav__link" to="/register">
                    Register
                  </Link>
                </li>
              </Fragment>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
