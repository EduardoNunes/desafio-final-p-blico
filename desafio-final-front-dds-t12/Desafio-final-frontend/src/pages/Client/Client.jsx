import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import IconClients from "../..//assets/icon-client.svg";
import IconArrowTopDown from "../../assets/arrow-top-down.svg";
import GroupEmptySearch from "../../assets/group-empty-search.svg";
import MagnifyingGlass from "../../assets/icon-magnifying-glass.svg";
import IconTools from "../../assets/icon-tools.svg";
import ConfirmDeletChargeModal from "../../components/ConfirmDeletChargeModal/ConfirmDeletChargeModal";
import CustomerDetails from "../../components/CustomerDetails/CustomerDetails";
import EditCustomerModal from "../../components/EditCustomerModal/EditCustomerModal";
import EditUserModal from "../../components/EditUserModal/EditUserModal";
import EditUserSuccessModal from "../../components/EditUserSuccessModal/EditUserSuccessModal";
import Header from "../../components/Header/Header";
import ModalCharges from "../../components/ModalCharges/ModalCharges";
import ModalEditCharges from "../../components/ModalEditCharges/ModalEditCharges";
import RegisterCustomerModal from "../../components/RegisterCustomerModal/RegisterCustomerModal";
import SideBar from "../../components/SIdeBar/SideBar";
import { useAddClientContext } from "../../context/AddClienteContext";
import { useChargesContext } from "../../context/ChargesContext";
import { useMenuSideBarColor } from "../../context/MenuSideBarColorContext";
import api from "../../services/api";
import { getItem } from "../../utils/storage";
import "./client.css";
import LineTableClient from "./clientComponents/LineTableClient";

export default function Client() {
  const { clients, setClients } = useAddClientContext();
  const [changeOrder, setChangeOrder] = useState(true);
  const [searchClient, setSearchClient] = useState("");

  const {
    openRegisterCustomerModal,
    handleOpenRegisterCustomerModal,
    openEditUserModal,
    showDetails,
    openEditCustomerModal,
    openEditUserSuccessModal,
    testandoUseEffect,
    filter,
    dataFilter,
    setDataFilter,
  } = useMenuSideBarColor();

  const { openConfirmDeletChargeModal, openModalEditCharges } =
    useChargesContext();
  const { openModalCharges, filterType } = useChargesContext();

  function notify(message) {
    toast.success(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  }
  function notifyError(message) {
    toast.error(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  }

  const token = getItem("token");

  const toggleChangeOrder = () => {
    setChangeOrder(!changeOrder);
  };

  let orderClients = "";

  if (filter) {
    orderClients = changeOrder
      ? dataFilter.slice().sort((a, b) => a.nome.localeCompare(b.nome))
      : dataFilter;
  } else {
    orderClients = changeOrder
      ? clients.slice().sort((a, b) => b.id - a.id)
      : clients.slice().sort((a, b) => a.nome.localeCompare(b.nome));
  }

  async function loadClients() {
    try {
      const { data } = await api.get("/consultClient", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(data);
    } catch (error) {
      console.error(`erro na requisicao da api ${error.message}`);
    }
  }

  useEffect(() => {
    if (clients.length === 0) {
      loadClients();
    }
  }, []);

  async function handleSearchClient(event) {
    event.preventDefault();
    try {
      const response = await api.get(
        `/searchClients?searchTerm=${searchClient}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (filter) {
        if (!searchClient) {
          try {
            const response = await api.get(
              `/consultClient?status=${filterType}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setDataFilter(response.data);
          } catch (error) {
            console.error(`erro na requisicao da api ${error.message}`);
          }
        } else {
          const newDataFilter = dataFilter.filter((client) => {
            const name = client.nome.toLowerCase();
            const email = client.email.toLowerCase();
            const cpf = client.cpf;
            const term = searchClient.toLowerCase();

            return (
              name.includes(term) || email.includes(term) || cpf.includes(term)
            );
          });
          setDataFilter(newDataFilter);
        }
      }

      setClients(response.data);
    } catch (error) {
      console.error("Erro inesperado", error);
    }
  }

  return (
    <div className="client-container">
      {testandoUseEffect}
      {openEditUserModal && <EditUserModal />}
      {openEditUserSuccessModal && <EditUserSuccessModal />}
      {openModalEditCharges && (
        <ModalEditCharges notify={notify} notifyError={notifyError} />
      )}
      <ToastContainer />
      {openRegisterCustomerModal && (
        <RegisterCustomerModal notify={notify} notifyError={notifyError} />
      )}
      {openEditCustomerModal && (
        <EditCustomerModal notify={notify} notifyError={notifyError} />
      )}

      {openModalCharges && (
        <ModalCharges notify={notify} notifyError={notifyError} />
      )}

      {openConfirmDeletChargeModal && (
        <ConfirmDeletChargeModal notify={notify} notifyError={notifyError} />
      )}

      <SideBar />
      <div className="board">
        <Header
          title={
            <h3
              style={{
                height: "28px",
                color: "#0E8750",
                fontWeight: "400",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Clientes
            </h3>
          }
        />
        {showDetails ? (
          <CustomerDetails notify={notify} notifyError={notifyError} />
        ) : (
          <div className="container">
            <div className="chart">
              <div className="tool-bar">
                <div className="left">
                  <img src={IconClients} alt="Icon Client" />
                  <h1>Clientes</h1>
                </div>
                <div className="tools">
                  <button
                    className="button"
                    onClick={() => handleOpenRegisterCustomerModal(true)}
                  >
                    + Adicionar cliente
                  </button>
                  <img src={IconTools} alt="icon tools" />
                  <OutlinedInput
                    className="search-bar"
                    id="outlined-adornment-password"
                    type="text"
                    placeholder="Pesquisa"
                    onChange={(event) => setSearchClient(event.target.value)}
                    onBlur={(event) => handleSearchClient(event)}
                    onKeyDown={(event) =>
                      event.key === "Enter" && handleSearchClient(event)
                    }
                    value={searchClient}
                    sx={{
                      height: "39px",
                      width: "50%",
                      borderRadius: "10px",
                      backgroundColor: "#FFFFFF",
                      boxShadow: "3px 3px 3px rgb(220 220 220)",
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          edge="end"
                          type="submit"
                          onClick={(event) => handleSearchClient(event)}
                        >
                          <img
                            src={MagnifyingGlass}
                            alt="icon magnifying glass"
                          />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </div>
              </div>
              <div className="table-clients">
                <div className="title">
                  <ul>
                    <li>
                      <img
                        src={IconArrowTopDown}
                        alt="Arrows top/down"
                        onClick={toggleChangeOrder}
                      />
                      Cliente
                    </li>
                    <li>CPF</li>
                    <li>E-mail</li>
                    <li>Telefone</li>
                    <li>Status</li>
                    <li>Criar Cobrança</li>
                  </ul>
                  <div className="informations">
                    {orderClients.length === 0 ? (
                      <img
                        src={GroupEmptySearch}
                        alt="Resultados não encontrados. Verifique a escrita"
                        id="group-empty-search"
                      />
                    ) : (
                      orderClients.map((clients, index) => (
                        <LineTableClient
                          key={index}
                          id={clients.id}
                          client={clients.nome}
                          cpf={clients.cpf}
                          email={clients.email}
                          phone={clients.telefone}
                          status={clients.status}
                          charge={clients.createCharge}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
