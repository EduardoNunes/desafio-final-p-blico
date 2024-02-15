import { Link } from "react-router-dom";
import { useMenuSideBarColor } from "../../context/MenuSideBarColorContext";
import iconChargeBlack from "../../assets/icon-charge-black.svg";
import iconClientBlack from "../../assets/icon-client-black.svg";
import iconClientPink from "../../assets/icon-client-pink.svg";
import iconHomeBlack from "../../assets/icon-home-black.svg";
import iconHomePink from "../../assets/icon-home-pink.svg";
import iconChargesPink from "../../assets/icon-charge-pink.svg";
import "./sidebar.css";

export default function SideBar() {
  const { handleClickMenuSideBarColor } = useMenuSideBarColor();

  return (
    <div className="side-bar-container">
      <nav className="nav-bar">
        <ul>
          <li className={location.pathname.includes("home") ? "home" : ""}>
            <Link to="/home">
              <img
                src={
                  location.pathname.includes("home")
                    ? iconHomePink
                    : iconHomeBlack
                }
                alt="home icon"
                onClick={() => handleClickMenuSideBarColor()}
              />
            </Link>
          </li>
          <li className={location.pathname.includes("client") ? "client" : ""}>
            <Link to="/client">
              <img
                src={
                  location.pathname.includes("client")
                    ? iconClientPink
                    : iconClientBlack
                }
                alt="client icon"
                onClick={() => handleClickMenuSideBarColor()}
              />
            </Link>
          </li>
          <li className={location.pathname.includes("charge") ? "charge" : ""}>
            <Link to="/charges">
              <img
                src={
                  location.pathname.includes("charge")
                    ? iconChargesPink
                    : iconChargeBlack
                }
                alt="charge icon"
                onClick={() => handleClickMenuSideBarColor()}
              />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
