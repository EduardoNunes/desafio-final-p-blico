import { createContext, useContext, useState } from "react";
import api from "../services/api";
import { getItem } from "../utils/storage";

const MenuSideBarColorContext = createContext();

export function useMenuSideBarColor() {
  return useContext(MenuSideBarColorContext);
}

export function MenuSideBarColorProvider({ children }) {
  const [openEditUserModal, setOpenEditUserModal] = useState(false);
  const [openRegisterCustomerModal, setOpenRegisterCustomerModal] =
    useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });
  const [showDetails, setShowDetails] = useState(false);
  const [clientDataDetails, setClientDataDetails] = useState({});
  const [openEditCustomerModal, setOpenEditCustomerModal] = useState(false);
  const [openEditUserSuccessModal, setOpenEditUserSuccessModal] =
    useState(false);
  const [openConfirmDeletChargeModal, setOpenConfirmDeletChargeModal] =
    useState(false);
  const [chargeId, setChargeId] = useState();
  const [filter, setFilter] = useState(false);
  const [dataFilter, setDataFilter] = useState([]);

  const handleClickMenuSideBarColor = () => {
    setShowDetails(false);
    setFilter(false);
  };

  const handleOpenEditUserModal = async (openClose) => {
    const userId = getItem("userId");
    const token = getItem("token");
    if (openClose) {
      try {
        const { data } = await api.get(`/userDetails/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData({
          name: data.user.nome,
          email: data.user.email,
          cpf: data.user.cpf || "",
          phone: data.user.telefone || "",
        });
      } catch (error) {
        console.error("Erro inesperado na requisição", error);
      }
    }

    setOpenEditUserModal(openClose);
  };

  const handleOpenRegisterCustomerModal = (openClose) => {
    setOpenRegisterCustomerModal(openClose);
  };

  const handleOpenEditCustomerModal = (openClose) => {
    setOpenEditCustomerModal(openClose);
  };

  const handleOpenEditUserSuccessModal = (openClose) => {
    setOpenEditUserSuccessModal(openClose);
  };

  const handleOpenConfirmDeletChargeModal = (openClose, id, event) => {
    event.stopPropagation();
    setOpenConfirmDeletChargeModal(openClose);
    setChargeId(id);
  };

  return (
    <MenuSideBarColorContext.Provider
      value={{
        handleClickMenuSideBarColor,
        openEditUserModal,
        setOpenEditUserModal,
        handleOpenEditUserModal,
        openRegisterCustomerModal,
        setOpenRegisterCustomerModal,
        handleOpenRegisterCustomerModal,
        userData,
        setUserData,
        showDetails,
        setShowDetails,
        clientDataDetails,
        setClientDataDetails,
        openEditCustomerModal,
        setOpenEditCustomerModal,
        handleOpenEditCustomerModal,
        openEditUserSuccessModal,
        setOpenEditUserSuccessModal,
        handleOpenEditUserSuccessModal,
        openConfirmDeletChargeModal,
        setOpenConfirmDeletChargeModal,
        handleOpenConfirmDeletChargeModal,
        chargeId,
        setChargeId,
        filter,
        setFilter,
        dataFilter,
        setDataFilter,
      }}
    >
      {children}
    </MenuSideBarColorContext.Provider>
  );
}
