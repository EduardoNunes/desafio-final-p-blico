import { useState } from "react";
import { Link } from "react-router-dom";
import iconArrowDownGreen from "../../assets/icon-arrow-down-green.svg";
import { getItem } from "../../utils/storage";
import EditExitUser from "./EditExitUser";
import "./header.css";
import { useMenuSideBarColor } from "../../context/MenuSideBarColorContext";

export default function Header({ title }) {
  const [showEditExit, setShowEditExit] = useState(false);
  const { showDetails, setShowDetails } = useMenuSideBarColor();
  const handleClick = () => {
    setShowEditExit(!showEditExit);
  };

  function handleShowDetails() {
    setShowDetails(false);
  }

  const user = getItem("userName");

  function toggleInitialsUser(name) {
    const array = name.split(" ");
    const first = array[0].slice(0, 1);
    const last = array[array.length - 1].slice(0, 1);
    return `${first}${last}`;
  }
  return (
    <div className="header">
      <div className="header-content">
        <div className="title">
          {location.pathname.includes("client") ? (
            <p onClick={handleShowDetails}>{title}</p>
          ) : (
            title
          )}
          {showDetails && (
            <p>
              <span>&gt;</span> <span>Detalhes do Cliente</span>
            </p>
          )}
        </div>
        <div className="user">
          <div className="initials">
            <h2>{toggleInitialsUser(user)}</h2>
          </div>
          <div className="name">
            <h3>{user.split(" ")[0]}</h3>
            <img
              className="arrow-green"
              src={iconArrowDownGreen}
              alt="arrow green"
              onClick={handleClick}
            />
            <div
              className={`edit-exit ${showEditExit ? "" : "edit-exit-none"}`}
            >
              <EditExitUser />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
