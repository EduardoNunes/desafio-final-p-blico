import { useNavigate } from "react-router-dom";
import ArrowWhite from "../../assets/arrow-white.svg";
import IconEdit from "../../assets/icon-edit.svg";
import IconExit from "../../assets/icon-exit.svg";
import { useMenuSideBarColor } from "../../context/MenuSideBarColorContext";
import { clear } from "../../utils/storage";

import "./edit-exit-user.css";
import { useAddClientContext } from "../../context/AddClienteContext";
import { useChargesContext } from "../../context/ChargesContext";

export default function ModalEditUser() {
  const navigate = useNavigate();
  const { setUserCharges } = useChargesContext();
  const { setClients } = useAddClientContext();

  function handleLogout() {
    setUserCharges([]);
    setClients([]);

    clear();
    return navigate("/");
  }

  const { handleOpenEditUserModal } = useMenuSideBarColor();
  return (
    <div className="edit-exit-user">
      <img className="arrow-white" src={ArrowWhite} />
      <div className="icons">
        <img src={IconEdit} onClick={() => handleOpenEditUserModal(true)} />
        <img src={IconExit} onClick={() => handleLogout()} />
      </div>
    </div>
  );
}
