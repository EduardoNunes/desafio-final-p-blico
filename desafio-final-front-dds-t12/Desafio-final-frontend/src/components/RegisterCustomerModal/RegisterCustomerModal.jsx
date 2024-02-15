import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  OutlinedInput,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { PatternFormat } from "react-number-format";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseButton from "../../assets/close.svg";
import CustomerIcon from "../../assets/customer-icon.svg";
import { useMenuSideBarColor } from "../../context/MenuSideBarColorContext";
import api from "../../services/api";
import { getItem } from "../../utils/storage";
import validateCpf from "../../utils/validateCpf";
import "./RegisterCustomerModal.css";
import { useAddClientContext } from "../../context/AddClienteContext";

const theme = createTheme({
  typography: {
    fontFamily: ['"Inter"', "sans-serif"].join(","),
  },
});

export default function RegisterCustomerModal({ notify, notifyError }) {
  const { clients, setClients } = useAddClientContext();
  const { handleOpenRegisterCustomerModal } = useMenuSideBarColor();
  const [form, setForm] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    cep: "",
    address: "",
    complement: "",
    neighborhood: "",
    city: "",
    uf: "",
  });
  const [erro, setErro] = useState(false);
  const [emptyName, setEmptyName] = useState(null);
  const [emptyEmail, setEmptyEmail] = useState(null);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [emptyCpf, setEmptyCpf] = useState(null);
  const [cpfInvalid, setCpfInvalid] = useState(false);
  const [emptyPhone, setEmptyPhone] = useState(null);
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [cpfExists, setCpfExists] = useState(false);

  function handleChangeForm(event) {
    const value = event.target.value;

    setForm({ ...form, [event.target.name]: value });
  }

  function isEmailValid(email) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  }

  async function handleBlur() {
    if (form.cep.length === 10) {
      const cep = form.cep.replaceAll(/\D/g, "");
      const { data } = await axios(`https://viacep.com.br/ws/${cep}/json/`);

      setForm({
        ...form,
        address: data.logradouro,
        complement: data.complemento,
        neighborhood: data.bairro,
        city: data.localidade,
        uf: data.uf,
      });
    }
  }

  async function handleSubmitChanges(event) {
    event.preventDefault();
    setErro(false);
    setEmptyName(false);
    setEmptyEmail(false);
    setEmailInvalid(false);
    setEmptyCpf(false);
    setCpfInvalid(false);
    setEmptyPhone(false);
    setPhoneInvalid(false);
    setEmailExists(false);
    setCpfExists(false);

    if (!form.name || !form.email || !form.cpf || !form.phone) {
      setErro(true);
      if (!form.name) {
        setEmptyName(true);
      }

      if (!form.email) {
        setEmptyEmail(true);
      }

      if (!form.cpf) {
        setEmptyCpf(true);
      }

      if (!form.phone) {
        setEmptyPhone(true);
      }
      return;
    }

    if (!isEmailValid(form.email)) {
      setErro(true);
      setEmailInvalid(true);
      return;
    }

    if (!validateCpf(form.cpf)) {
      setErro(true);
      setCpfInvalid(true);
      return;
    }

    if (form.phone.includes("_")) {
      setErro(true);
      setPhoneInvalid(true);
      return;
    }

    try {
      const body = {
        nome: form.name.trim(),
        email: form.email,
        cpf: form.cpf.replaceAll(".", "").replace("-", ""),
        telefone: form.phone
          .replace("(", "")
          .replace(")", "")
          .replace(" ", "")
          .replace("-", ""),
        cep: form.cep.replace(".", "").replace("-", ""),
        endereco: form.address,
        complemento: form.complement,
        bairro: form.neighborhood,
        cidade: form.city,
        uf: form.uf,
      };

      const token = getItem("token");

      const response = await api.post(
        "/registerClient",
        {
          ...body,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const message = response.data.mensagem;

      if (response.status === 201) {
        notify(message);
      }

      try {
        const { data } = await api.get("/consultClient", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setClients(data);
      } catch (error) {
        console.error(`erro na requisicao da api ${error.message}`);
      }

      setForm({
        name: "",
        email: "",
        cpf: "",
        phone: "",
        cep: "",
        address: "",
        complement: "",
        neighborhood: "",
        city: "",
        uf: "",
      });

      handleOpenRegisterCustomerModal(false);
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 400) {
        notifyError(error.response.data.mensagem);
        if (error.response.data.mensagem.includes("e-mail")) {
          setErro(true);
          setEmailExists(true);
        }
        if (error.response.data.mensagem.includes("cpf")) {
          setErro(true);
          setCpfExists(true);
        }
      } else {
        notifyError("Erro interno do servidor");
      }
      return;
    }
  }

  function handleCancelRecord() {
    setForm({
      name: "",
      email: "",
      cpf: "",
      phone: "",
      cep: "",
      address: "",
      complement: "",
      neighborhood: "",
      city: "",
      uf: "",
    });

    handleOpenRegisterCustomerModal(false);
  }

  return (
    <div className="container-modal">
      <ThemeProvider theme={theme}>
        <form id="form-modal">
          <div className="form-header">
            <img src={CustomerIcon} alt="Representação de clientes" />
            <h1>Cadastro do Cliente</h1>
            <img
              id="close-btn"
              src={CloseButton}
              alt="fechar modal"
              onClick={() => handleOpenRegisterCustomerModal(false)}
            />
          </div>

          <FormControl
            sx={{
              m: 1,
              width: "100%",
              alignSelf: "center",
            }}
          >
            <FormLabel
              sx={{
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 600,
                fontSize: "14px",
                color: "#3f3f55",
              }}
              error={erro && emptyName}
              htmlFor="customer-name-input"
            >
              Nome*
            </FormLabel>
            <OutlinedInput
              error={erro && emptyName}
              id="customer-name-input"
              placeholder="Digite o nome"
              type="text"
              name="name"
              value={form.name}
              onChange={(event) => handleChangeForm(event)}
              size="small"
            />
            <FormHelperText sx={{ m: 0, color: "red" }}>
              {erro && emptyName && "Este espaço deve ser preenchido"}
            </FormHelperText>
          </FormControl>

          <FormControl
            sx={{
              m: 1,
              width: "100%",
              alignSelf: "center",
            }}
          >
            <FormLabel
              sx={{
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 600,
                fontSize: "14px",
                color: "#3f3f55",
              }}
              error={
                (erro && emptyEmail) ||
                (erro && !isEmailValid(form.email)) ||
                (erro && emailExists)
              }
              htmlFor="customer-email-input"
            >
              E-mail*
            </FormLabel>
            <OutlinedInput
              error={
                (erro && emptyEmail) ||
                (erro && !isEmailValid(form.email)) ||
                (erro && emailExists)
              }
              id="customer-email-input"
              placeholder="Digite o e-mail"
              type="email"
              value={form.email}
              onChange={(event) => handleChangeForm(event)}
              name="email"
              size="small"
            />
            <FormHelperText sx={{ m: 0, color: "red" }}>
              {emptyEmail && erro && "Este espaço deve ser preenchido"}
              {erro && emailInvalid && "Este e-mail é inválido"}
              {erro && emailExists && "E-mail já cadastrado"}
            </FormHelperText>
          </FormControl>

          <div className="two-inputs">
            <FormControl
              sx={{
                width: "50%",
              }}
            >
              <FormLabel
                sx={{
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#3f3f55",
                }}
                htmlFor="customer-cpf-input"
                error={(erro && !validateCpf(form.cpf)) || (erro && cpfExists)}
              >
                CPF*
              </FormLabel>
              <PatternFormat
                format="###.###.###-##"
                customInput={OutlinedInput}
                mask="_"
                error={(erro && !validateCpf(form.cpf)) || (erro && cpfExists)}
                id="customer-cpf-input"
                placeholder="Digite o CPF"
                type="text"
                name="cpf"
                onChange={(event) => handleChangeForm(event)}
                value={form.cpf}
                size="small"
              />
              <FormHelperText sx={{ m: 0, color: "red" }}>
                {emptyCpf && erro && "Este espaço deve ser preenchido"}
                {erro && cpfInvalid && "CPF inválido"}
                {erro && cpfExists && "CPF já cadastrado"}
              </FormHelperText>
            </FormControl>

            <FormControl
              sx={{
                width: "50%",
              }}
            >
              <FormLabel
                sx={{
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#3f3f55",
                }}
                htmlFor="customer-phone-input"
                error={(erro && emptyPhone) || (erro && phoneInvalid)}
              >
                Telefone*
              </FormLabel>

              <PatternFormat
                format="(##) #####-####"
                customInput={OutlinedInput}
                mask="_"
                error={(erro && emptyPhone) || (erro && phoneInvalid)}
                id="customer-phone-input"
                placeholder="Digite o telefone"
                type="text"
                name="phone"
                onChange={(event) => handleChangeForm(event)}
                value={form.phone}
                size="small"
              />
              <FormHelperText sx={{ m: 0, color: "red" }}>
                {emptyPhone && erro && "Este espaço deve ser preenchido"}
                {erro && phoneInvalid && "Telefone inválido"}
              </FormHelperText>
            </FormControl>
          </div>

          <div className="two-inputs">
            <FormControl
              sx={{
                width: "40%",
              }}
            >
              <FormLabel
                sx={{
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#3f3f55",
                }}
                htmlFor="customer-cep-input"
              >
                CEP
              </FormLabel>
              <PatternFormat
                format="##.###-###"
                customInput={OutlinedInput}
                mask="_"
                id="customer-cep-input"
                placeholder="Digite o bairro"
                type="text"
                name="cep"
                value={form.cep}
                onChange={(event) => handleChangeForm(event)}
                onBlur={handleBlur}
                size="small"
              />
            </FormControl>

            <FormControl
              sx={{
                width: "60%",
              }}
            >
              <FormLabel
                sx={{
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#3f3f55",
                }}
                htmlFor="customer-neighborhood-input"
              >
                Bairro
              </FormLabel>
              <OutlinedInput
                id="customer-neighborhood-input"
                placeholder="Digite o bairro"
                type="text"
                name="neighborhood"
                value={form.neighborhood}
                onChange={(event) => handleChangeForm(event)}
                size="small"
              />
            </FormControl>
          </div>
          <FormControl
            sx={{
              m: 1,
              width: "100%",
              alignSelf: "center",
            }}
          >
            <FormLabel
              sx={{
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 600,
                fontSize: "14px",
                color: "#3f3f55",
              }}
              htmlFor="customer-address-input"
            >
              Endereço
            </FormLabel>
            <OutlinedInput
              id="customer-address-input"
              placeholder="Digite o endereço"
              type="text"
              name="address"
              value={form.address}
              onChange={(event) => handleChangeForm(event)}
              size="small"
            />
          </FormControl>
          <FormControl
            sx={{
              m: 1,
              width: "100%",
              alignSelf: "center",
            }}
          >
            <FormLabel
              sx={{
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 600,
                fontSize: "14px",
                color: "#3f3f55",
              }}
              htmlFor="customer-complement-input"
            >
              Complemento
            </FormLabel>
            <OutlinedInput
              id="customer-complement-input"
              placeholder="Digite o complemento"
              type="text"
              name="complement"
              value={form.complement}
              onChange={(event) => handleChangeForm(event)}
              size="small"
            />
          </FormControl>

          <div className="two-inputs">
            <FormControl
              sx={{
                width: "70%",
              }}
            >
              <FormLabel
                sx={{
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#3f3f55",
                }}
                htmlFor="customer-city-input"
              >
                Cidade
              </FormLabel>

              <OutlinedInput
                id="customer-city-input"
                placeholder="Digite a cidade"
                type="text"
                name="city"
                value={form.city}
                onChange={(event) => handleChangeForm(event)}
                size="small"
              />
            </FormControl>

            <FormControl
              sx={{
                width: "30%",
              }}
            >
              <FormLabel
                sx={{
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#3f3f55",
                }}
                htmlFor="customer-uf-input"
              >
                UF
              </FormLabel>
              <OutlinedInput
                id="customer-uf-input"
                placeholder="Digite a UF"
                type="text"
                name="uf"
                value={form.uf}
                onChange={(event) => handleChangeForm(event)}
                size="small"
              />
            </FormControl>
          </div>

          <div className="two-inputs">
            <Button
              id="cancel-changes-btn"
              onClick={handleCancelRecord}
              variant="contained"
              sx={{
                background: "rgba(222, 222, 233, 1)",
                borderRadius: "10px",
                textTransform: "none",
                fontFamily: '"Nunito", sans-serif',
                color: "#0E8750",
                width: "50%",
                height: "35px",
                marginLeft: "3%",
                fontSize: "18px",
                marginTop: 2,
                "&:hover": {
                  background: "rgba(222, 222, 233, 0.9)",
                },
              }}
            >
              Cancelar
            </Button>

            <Button
              id="apply-changes-btn"
              onClick={handleSubmitChanges}
              variant="contained"
              sx={{
                background: "rgba(218, 1, 117, 1)",
                borderRadius: "10px",
                textTransform: "none",
                fontFamily: '"Nunito", sans-serif',
                width: "50%",
                height: "35px",
                fontSize: "18px",
                marginTop: 2,
                "&:hover": {
                  background: "rgba(218, 1, 117, 0.9)",
                },
              }}
            >
              Aplicar
            </Button>
            <ToastContainer />
          </div>
        </form>
      </ThemeProvider>
    </div>
  );
}
