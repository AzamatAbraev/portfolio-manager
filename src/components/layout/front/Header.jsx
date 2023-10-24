import { Link } from "react-router-dom";

import "./Header.scss";
import useScreenSize from "../../../utils/screenSize";

const Header = () => {
  const screenSize = useScreenSize();
  return (
    <header>
      <nav className="nav">
        <div className="container nav__container">
          <Link to="/" className="nav__logo">
            {screenSize > 450 ? "PTP Solutions" : "PTPs"}
          </Link>
          <ul className="nav__menu">
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
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
