import { createContext, useContext, useState } from "react";
import api from "../services/api";
import { getItem } from "../utils/storage";
import { useMenuSideBarColor } from "./MenuSideBarColorContext";
import { useAddClientContext } from "./AddClienteContext";

const ChargesContext = createContext();

export function useChargesContext() {
  return useContext(ChargesContext);
}

export function ChargesContextProvider({ children }) {
  const {
    clientDataDetails,
    setClientDataDetails,
    setShowDetails,
    dataFilter,
    setDataFilter,
  } = useMenuSideBarColor();
  const { setClients } = useAddClientContext();

  const [clientCharges, setClientCharges] = useState([]);
  const [userCharges, setUserCharges] = useState([]);
  const [colectModalChargesInfos, setColectModalChargesInfos] = useState({
    cliente_id: "",
    descricao: "",
    data_venc: "",
    valor: "",
    status: "Paga",
    formattedValue: "",
  });
  const [orderCharges, setOrderCharges] = useState(userCharges);
  const [orderDataFilter, setOrderDataFilter] = useState(dataFilter);
  const [modalChargeErrors, setModalChargeErrors] = useState({});
  const [openModalCharges, setOpenModalCharges] = useState(false);
  const [colectChargesViewInfos, setColectChargesViewInfos] = useState({});
  const [openModalInfoCharges, setOpenModalInfoCharges] = useState(false);
  const [colectModalEditCharges, setColectModalEditCharges] = useState({});
  const [openModalEditCharges, setOpenModalEditCharges] = useState(false);
  const [openConfirmDeletChargeModal, setOpenConfirmDeletChargeModal] =
    useState(false);
  const [chargeId, setChargeId] = useState();
  const [clientId, setClientId] = useState();
  const [previousStatus, setPreviousStatus] = useState();
  const [filterType, setFilterType] = useState();

  const token = getItem("token");

  function handleColectModalChargesInfos(event) {
    const value = event.target.value;
    setColectModalChargesInfos({
      ...colectModalChargesInfos,
      [event.target.name]: value,
    });
  }

  function isFieldValid(descricao) {
    if (descricao === "") {
      return false;
    } else {
      return true;
    }
  }

  function modalChargeValidate(colectModalChargesInfos) {
    const error = {};
    if (!isFieldValid(colectModalChargesInfos.descricao)) {
      error.descCharge = "*Campo Obrigatório.";
    }
    if (!isFieldValid(colectModalChargesInfos.data_venc)) {
      error.dataVencCharge = "*Campo Obrigatório";
    }
    if (!isFieldValid(colectModalChargesInfos.valor)) {
      error.valorCharge = "*Campo Obrigatório";
    }
    return error;
  }

  async function handleCreateCharge({ event, notify, notifyError }) {
    event.preventDefault();
    setModalChargeErrors(modalChargeValidate(colectModalChargesInfos));
    if (
      colectModalChargesInfos.descricao &&
      colectModalChargesInfos.data_venc &&
      colectModalChargesInfos.valor
    ) {
      try {
        const body = {
          cliente_id: colectModalChargesInfos.cliente_id,
          descricao: colectModalChargesInfos.descricao,
          data_venc: colectModalChargesInfos.data_venc,
          valor: colectModalChargesInfos.valor,
          status: colectModalChargesInfos.status,
        };
        const response = await api.post(
          "/addCharge",
          { ...body },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        try {
          const { data } = await api.get("/allCharges", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUserCharges(data);
          setOrderCharges(data);
        } catch (error) {
          console.error(`Erro inesperado no servidor ${error.message}`);
        }

        try {
          const response = await api.get(
            `/clientDetails/${colectModalChargesInfos.cliente_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setClientCharges([...response.data.charges]);
        } catch (error) {
          console.error(`Erro inesperado no servidor ${error.message}`);
        }

        handleOpenModalCharges(false);
        setColectModalChargesInfos({
          cliente_id: "",
          descricao: "",
          data_venc: "",
          valor: "",
          status: "Paga",
          formattedValue: "",
        });
        const message = response.data.mensagem;
        if (response.status === 201) {
          notify(message);
        }
      } catch (error) {
        if (error.response.status === 401 || error.response.status === 400) {
          notifyError(error.response.data.mensagem);
        } else {
          notifyError("Erro interno do servidor");
        }
      }
    }
  }

  function handleBlur(e) {
    setModalChargeErrors(modalChargeValidate(colectModalChargesInfos));
  }

  function handleCoinChange(event) {
    const inputCoin = event.target.value;
    const coinValue = inputCoin.replace(/\D/g, "");
    let formattedValue = "";

    if (coinValue.length === 0) {
      formattedValue = "";
    } else {
      const numericValue = Number(coinValue) / 100;

      formattedValue = numericValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    }
    setColectModalChargesInfos({
      ...colectModalChargesInfos,
      formattedValue: formattedValue,
      valor: coinValue,
    });
  }

  function handleOpenModalCharges(openClose) {
    setOpenModalCharges(openClose);
    setModalChargeErrors({});
    if (!openClose) {
      setColectModalChargesInfos({
        cliente_id: "",
        descricao: "",
        data_venc: "",
        valor: "",
        status: "Paga",
        formattedValue: "",
      });
    }
  }

  function findChargeViewInfo(id) {
    const charge = userCharges.find((charge) => charge.id_cob === id);
    let formatChargeValue = "";
    let idCob = "";
    let data = "";
    let className = "";
    if (id) {
      const idFormat = id.split("-");
      idCob = idFormat[0];
      const date = new Date(charge.data_venc);
      const dateFormat = date.toLocaleDateString("pt-BR");
      data = dateFormat;
      if (charge.status === "Pendente") {
        className = "status-pendente";
      } else if (charge.status === "Vencida") {
        className = "status-vencida";
      } else {
        className = "status-paga";
      }
    }
    const numericValue = Number(charge?.valor) / 100;
    formatChargeValue = numericValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setColectChargesViewInfos({
      ...charge,
      valor: formatChargeValue,
      idCob: idCob,
      data_venc: data,
      className: className,
    });
  }

  function handleOpenModalInfoCharges(openClose, idCob) {
    findChargeViewInfo(idCob);
    setOpenModalInfoCharges(openClose);
  }

  function findChargeToEdit(id) {
    let charge = "";
    if (userCharges.length !== 0) {
      charge = userCharges.find((charge) => charge.id_cob === id);
    } else {
      charge = clientCharges.find((charge) => charge.id_cob === id);
      charge = { ...charge, id: clientDataDetails.client.id };
    }

    setPreviousStatus(charge.status);

    let toRadiosPagaDefaultChecked = "";
    let toRadiosPendenteDefaultChecked = "";
    let formattedValue = "";
    const numericValue = Number(charge?.valor) / 100;
    formattedValue = numericValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    let dateFormat = "";
    const date = charge?.data_venc;
    const data = date?.split("T")[0];
    dateFormat = data?.split("-");

    if (charge?.status === "Paga") {
      toRadiosPagaDefaultChecked = true;
      toRadiosPendenteDefaultChecked = false;
    } else {
      toRadiosPagaDefaultChecked = false;
      toRadiosPendenteDefaultChecked = true;
    }

    setColectModalEditCharges({
      ...charge,
      formattedValue: formattedValue,
      data_venc: `${dateFormat[0]}-${dateFormat[1]}-${dateFormat[2]}`,
      toRadiosPagaDefaultChecked: toRadiosPagaDefaultChecked,
      toRadiosPendenteDefaultChecked: toRadiosPendenteDefaultChecked,
    });
  }

  function handleOpenModalEditCharges(event, openClose, idCob) {
    if (openClose === true) {
      event.stopPropagation();
      findChargeToEdit(idCob);
      setOpenModalEditCharges(openClose);
    } else {
      setOpenModalEditCharges(openClose);
    }
  }

  function handleColectModalEditChargesInfos(event) {
    const value = event.target.value;
    setColectModalEditCharges({
      ...colectModalEditCharges,
      [event.target.name]: value,
    });
  }

  function handleCoinChangeEditCharge(event) {
    const inputCoin = event.target.value;
    const coinValue = inputCoin.replace(/\D/g, "");
    let formattedValue = "";

    if (coinValue.length === 0) {
      formattedValue = "";
    } else {
      const numericValue = Number(coinValue) / 100;

      formattedValue = numericValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    }
    setColectModalEditCharges({
      ...colectModalEditCharges,
      formattedValue: formattedValue,
      valor: coinValue,
    });
  }

  function handleBlurEdit(e) {
    setModalChargeErrors(modalChargeValidate(colectModalEditCharges));
  }

  async function handleEditCharge(event, notify, notifyError) {
    setModalChargeErrors(modalChargeValidate(colectModalEditCharges));
    try {
      const body = {
        cliente_id: colectModalEditCharges.id,
        descricao: colectModalEditCharges.descricao,
        data_venc: colectModalEditCharges.data_venc,
        valor: colectModalEditCharges.valor,
        status: colectModalEditCharges.status,
        id_cob: colectModalEditCharges.id_cob,
      };
      const response = await api.put(
        "/updateCharge",
        { ...body },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setColectModalEditCharges({
        cliente_id: "",
        descricao: "",
        data_venc: "",
        valor: "",
        status: "Paga",
        formattedValue: "",
      });

      try {
        const { data } = await api.get("/allCharges", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const clientAttCharges = data.filter(
          (charge) => charge.id === colectModalEditCharges.id
        );

        setClientCharges([...clientAttCharges]);
        setUserCharges(data);
        setOrderCharges(data);
      } catch (error) {
        console.error(`erro na requisicao da api ${error.message}`);
      }

      try {
        const { data } = await api.get("/consultClient", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setClients(data);
      } catch (error) {
        console.error(`erro na requisicao da api ${error.message}`);
      }

      try {
        const response = await api.get(`/allCharges?status=${previousStatus}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDataFilter(response.data);
        setOrderDataFilter(response.data);
      } catch (error) {
        console.error(`erro na requisicao da api ${error.message}`);
      }

      setOpenModalEditCharges(false);
      const message = response.data.mensagem;

      if (response.status === 200) {
        notify(message);
      }
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 400) {
        notifyError(error.response.data.mensagem);
      } else {
        notifyError("Erro interno do servidor");
      }
    }
  }

  const handleOpenConfirmDeletChargeModal = (
    event,
    openClose,
    id,
    clientId
  ) => {
    event.stopPropagation();
    setOpenConfirmDeletChargeModal(openClose);
    setChargeId(id);
    setClientId(clientId);
  };

  async function handleDeleteCharge({ notify, notifyError }) {
    try {
      const token = getItem("token");

      const response = await api.delete(`/deleteCharge/${chargeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      try {
        const response = await api.get(`/clientDetails/${clientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setClientCharges([...response.data.charges]);
      } catch (error) {
        console.error(`Erro inesperado no servidor ${error.message}`);
      }

      try {
        const { data } = await api.get("/allCharges", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserCharges(data);
        setOrderCharges(data);
      } catch (error) {
        console.error(`erro na requisicao da api ${error.message}`);
      }
      setOpenConfirmDeletChargeModal(false);

      notify(response.data.mensagem);
    } catch (error) {
      notifyError(error.response.data.mensagem);
    }
  }

  const toggleChangeOrderClient = () => {
    setOrderCharges(
      orderCharges === userCharges
        ? orderCharges.slice().sort((a, b) => a.nome.localeCompare(b.nome))
        : userCharges
    );
    setOrderDataFilter(
      orderDataFilter === dataFilter
        ? orderDataFilter.slice().sort((a, b) => a.nome.localeCompare(b.nome))
        : dataFilter
    );
  };

  const toggleChangeOrderIdCob = () => {
    setOrderCharges(
      orderCharges === userCharges
        ? orderCharges.slice().sort((a, b) => a.id_cob.localeCompare(b.id_cob))
        : userCharges
    );
    setOrderDataFilter(
      orderDataFilter === dataFilter
        ? orderDataFilter
            .slice()
            .sort((a, b) => a.id_cob.localeCompare(b.id_cob))
        : dataFilter
    );
  };

  async function handleOpenClientDetails(id, event) {
    event.stopPropagation();
    const clientId = id;
    const token = getItem("token");

    try {
      const response = await api.get(`/clientDetails/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const client = { ...response.data.client, id: clientId };
      setClientDataDetails({ ...response.data, client: client });
      setClientCharges([...response.data.charges]);
      setShowDetails(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <ChargesContext.Provider
      value={{
        userCharges,
        setUserCharges,
        colectModalChargesInfos,
        setColectModalChargesInfos,
        handleColectModalChargesInfos,
        handleCreateCharge,
        handleCoinChange,
        handleOpenModalCharges,
        setOpenModalCharges,
        openModalCharges,
        modalChargeErrors,
        handleBlur,
        colectChargesViewInfos,
        setColectChargesViewInfos,
        handleOpenModalInfoCharges,
        openModalInfoCharges,
        setOpenModalInfoCharges,
        openModalEditCharges,
        handleOpenModalEditCharges,
        colectModalEditCharges,
        handleEditCharge,
        handleBlurEdit,
        handleColectModalEditChargesInfos,
        handleCoinChangeEditCharge,
        clientCharges,
        setClientCharges,
        handleOpenConfirmDeletChargeModal,
        openConfirmDeletChargeModal,
        setOpenConfirmDeletChargeModal,
        handleDeleteCharge,
        orderCharges,
        setOrderCharges,
        toggleChangeOrderClient,
        toggleChangeOrderIdCob,
        handleOpenClientDetails,
        orderDataFilter,
        setOrderDataFilter,
        filterType,
        setFilterType,
      }}
    >
      {children}
    </ChargesContext.Provider>
  );
}
