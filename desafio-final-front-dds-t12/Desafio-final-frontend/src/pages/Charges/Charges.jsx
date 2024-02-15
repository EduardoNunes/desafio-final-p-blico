import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import IconArrowTopDown from "../../assets/arrow-top-down.svg";
import MagnifyingGlass from "../../assets/icon-magnifying-glass.svg";
import IconPaperCharge from "../../assets/icon-paper-charge.svg";
import IconTools from "../../assets/icon-tools.svg";
import ConfirmDeletChargeModal from "../../components/ConfirmDeletChargeModal/ConfirmDeletChargeModal";
import EditUserModal from "../../components/EditUserModal/EditUserModal";
import EditUserSuccessModal from "../../components/EditUserSuccessModal/EditUserSuccessModal";
import Header from "../../components/Header/Header";
import RegisterCustomerModal from "../../components/RegisterCustomerModal/RegisterCustomerModal";
import SideBar from "../../components/SIdeBar/SideBar";
import ModalEditCharges from "../../components/ModalEditCharges/ModalEditCharges";
import { useChargesContext } from "../../context/ChargesContext";
import { useMenuSideBarColor } from "../../context/MenuSideBarColorContext";
import api from "../../services/api";
import { getItem } from "../../utils/storage";
import "./charges.css";
import LineTableCharges from "./chargesComponents/LineTableCharges";
import ModalInfoCharges from "../../components/ModalInfoCharges/ModalInfoCharges";
import GroupEmptySearch from "../../assets/group-empty-search.svg";
import CustomerDetails from "../../components/CustomerDetails/CustomerDetails";
import ModalCharges from "../../components/ModalCharges/ModalCharges";

export default function Charges() {
  const [searchCharge, setSearchCharge] = useState("");
  const {
    userCharges,
    setUserCharges,
    openModalInfoCharges,
    openModalEditCharges,
    toggleChangeOrderClient,
    toggleChangeOrderIdCob,
    orderCharges,
    setOrderCharges,
    openModalCharges,
    orderDataFilter,
    setOrderDataFilter,
    filterType,
  } = useChargesContext();

  const {
    openRegisterCustomerModal,
    openEditUserModal,
    openEditUserSuccessModal,
    showDetails,
    filter,
    dataFilter,
    setDataFilter,
  } = useMenuSideBarColor();

  const { openConfirmDeletChargeModal } = useChargesContext();

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

  async function loadCharges() {
    try {
      const { data } = await api.get("/allCharges", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserCharges(data);
      setOrderCharges(data);
    } catch (error) {
      console.error(`erro na requisicao da api ${error.message}`);
    }
  }

  useEffect(() => {
    if (userCharges.length === 0) {
      loadCharges();
    }
  }, []);

  async function handleSearchCharge(event) {
    event.preventDefault();
    try {
      const response = await api.get(
        `/searchCharges?searchTerm=${searchCharge}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (filter) {
        if (!searchCharge) {
          try {
            const response = await api.get(`/allCharges?status=${filterType}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            setDataFilter(response.data);
            setOrderDataFilter(response.data);
          } catch (error) {
            console.error(`erro na requisicao da api ${error.message}`);
          }
        } else {
          const newDataFilter = dataFilter.filter((charge) => {
            const name = charge.nome.toLowerCase();
            const idCob = charge.id_cob.toLowerCase();
            const term = searchCharge.toLowerCase();

            return name.includes(term) || idCob.includes(term);
          });
          setDataFilter(newDataFilter);
          setOrderDataFilter(newDataFilter);
        }
      }

      setUserCharges(response.data);
      setOrderCharges(response.data);
    } catch (error) {
      console.error("Erro inesperado", error);
    }
  }

  return (
    <div className="charges-container">
      {openEditUserModal && <EditUserModal />}
      {openEditUserSuccessModal && <EditUserSuccessModal />}
      <ToastContainer />
      {openRegisterCustomerModal && (
        <RegisterCustomerModal notify={notify} notifyError={notifyError} />
      )}
      {openConfirmDeletChargeModal && (
        <ConfirmDeletChargeModal notify={notify} notifyError={notifyError} />
      )}
      {openModalCharges && <ModalCharges />}
      {openModalEditCharges && (
        <ModalEditCharges notify={notify} notifyError={notifyError} />
      )}
      {openModalInfoCharges && <ModalInfoCharges />}
      <SideBar />
      <div className="board">
        <Header
          title={
            <h3
              style={{
                marginTop: "36px",
                color: "#0E8750",
                fontWeight: "400",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Cobranças
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
                  <img src={IconPaperCharge} alt="Icon paper charge" />
                  <h1>Cobranças</h1>
                </div>
                <div className="tools">
                  <img src={IconTools} alt="icon tools" />
                  <OutlinedInput
                    className="search-bar"
                    id="outlined-adornment-password"
                    type="text"
                    placeholder="Pesquisa"
                    onChange={(event) => setSearchCharge(event.target.value)}
                    onBlur={(event) => handleSearchCharge(event)}
                    onKeyDown={(event) =>
                      event.key === "Enter" && handleSearchCharge(event)
                    }
                    value={searchCharge}
                    sx={{
                      height: "39px",
                      width: "80%",
                      marginLeft: "15px",
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
                          onClick={(event) => handleSearchCharge(event)}
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
                        onClick={toggleChangeOrderClient}
                      />
                      Cliente
                    </li>
                    <li>
                      <img
                        src={IconArrowTopDown}
                        alt="Arrows top/down"
                        onClick={toggleChangeOrderIdCob}
                      />
                      ID Cob.
                    </li>
                    <li>Valor</li>
                    <li>Data de venc.</li>
                    <li>Status</li>
                    <li>Descrição</li>
                    <li></li>
                  </ul>
                  <div className="informations">
                    {filter ? (
                      orderDataFilter.map((charges, index) => (
                        <LineTableCharges
                          key={index}
                          client={charges.nome}
                          idCob={charges.id_cob}
                          valor={charges.valor}
                          dataVenc={charges.data_venc}
                          stats={charges.status}
                          description={charges.descricao}
                          id={charges.id}
                        />
                      ))
                    ) : userCharges.length === 0 ? (
                      <img
                        src={GroupEmptySearch}
                        alt="Resultados não encontrados. Verifique a escrita"
                        id="group-empty-search"
                      />
                    ) : (
                      orderCharges.map((charges, index) => (
                        <LineTableCharges
                          key={index}
                          client={charges.nome}
                          idCob={charges.id_cob}
                          valor={charges.valor}
                          dataVenc={charges.data_venc}
                          stats={charges.status}
                          description={charges.descricao}
                          id={charges.id}
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
