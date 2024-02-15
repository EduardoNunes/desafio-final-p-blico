import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useState } from "react";
import { PatternFormat } from "react-number-format";
import CloseButton from "../../assets/close.svg";
import "./EditUserModal.css";
import { useMenuSideBarColor } from "../../context/MenuSideBarColorContext";
import { useSignUpContext } from "../../context/SignUpContext";
import validateCpf from "../../utils/validateCpf";
import api from "../../services/api";
import { getItem, setItem } from "../../utils/storage";

const theme = createTheme({
  typography: {
    fontFamily: ['"Inter"', "sans-serif"].join(","),
  },
});

export default function EditUserModal() {
  const { handleOpenEditUserModal, userData, handleOpenEditUserSuccessModal } =
    useMenuSideBarColor();
  const { isPassValid } = useSignUpContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: userData.name,
    email: userData.email,
    cpf: userData.cpf || "",
    phone: userData.phone || "",
    password: "",
    confirm_password: "",
  });
  const [erro, setErro] = useState(false);
  const [emptyName, setEmptyName] = useState(null);
  const [emptyEmail, setEmptyEmail] = useState(null);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [wrongConfPass, setWrongConfPass] = useState(false);
  const [cpfInvalid, setCpfInvalid] = useState(false);
  const [phoneInvalid, setPhoneInvalid] = useState(false);

  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }

  function handleClickShowConfirmPassword() {
    setShowConfirmPassword(!showConfirmPassword);
  }

  function handleMouseDownPassword(event) {
    event.preventDefault();
  }

  function handleChangeForm(event) {
    const value = event.target.value;

    setForm({ ...form, [event.target.name]: value });
  }

  function isEmailValid(email) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  }

  function isPhoneValid(phone) {
    if (phone.includes("_")) {
      return false;
    } else {
      return true;
    }
  }

  async function handleSubmitChanges(event) {
    event.preventDefault();
    setErro(false);
    setEmptyName(false);
    setEmptyEmail(false);
    setEmailInvalid(false);
    setInvalidPassword(false);
    setWrongConfPass(false);
    setCpfInvalid(false);
    setPhoneInvalid(false);

    if (!form.name || !form.email) {
      setErro(true);
      if (!form.name) {
        setEmptyName(true);
      }

      if (!form.email) {
        setEmptyEmail(true);
      }

      return;
    }

    if (!isEmailValid(form.email)) {
      setErro(true);
      setEmailInvalid(true);
      return;
    }

    if (form.password) {
      if (!isPassValid(form.password)) {
        setErro(true);
        setInvalidPassword(true);
        return;
      }
    }

    if (form.confirm_password) {
      if (form.confirm_password !== form.password) {
        setErro(true);
        setWrongConfPass(true);
        return;
      }
    }

    if (form.cpf) {
      if (!validateCpf(form.cpf)) {
        setErro(true);
        setCpfInvalid(true);
        return;
      }
    }

    if (form.phone) {
      if (!isPhoneValid(form.phone)) {
        setErro(true);
        setPhoneInvalid(true);
        return;
      }
    }

    try {
      let body = { nome: form.name, email: form.email };
      if (form.password) {
        body = {
          ...body,
          senha: form.password,
        };
      }
      if (form.cpf) {
        body = {
          ...body,
          cpf: form.cpf.replaceAll(".", "").replace("-", ""),
        };
      }
      if (form.phone) {
        body = {
          ...body,
          telefone: form.phone
            .replace("(", "")
            .replace(")", "")
            .replace(" ", "")
            .replace("-", ""),
        };
      }

      const token = getItem("token");
      const { data } = await api.put(
        "/updateUser",
        { ...body },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItem("userName", data.usuario.nome);
    } catch (error) {
      console.error(error.message);
      return;
    }
    handleOpenEditUserSuccessModal(true);
    handleOpenEditUserModal(false);
  }

  return (
    <div className="container-modal">
      <ThemeProvider theme={theme}>
        <form className="form-edit-user">
          <div className="form-header-user">
            <h1>Edite seu cadastro</h1>
            <img
              id="close-btn"
              src={CloseButton}
              alt="fechar modal"
              onClick={() => handleOpenEditUserModal(false)}
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
              htmlFor="edit-name-input"
            >
              Nome*
            </FormLabel>
            <OutlinedInput
              id="edit-name-input"
              placeholder="Digite seu nome"
              type="text"
              name="name"
              value={form.name}
              onChange={(event) => handleChangeForm(event)}
              size="small"
            />
            <FormHelperText sx={{ m: 0, color: "red" }}>
              {emptyName && erro && "Este espaço deve ser preenchido"}
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
              htmlFor="edit-email-input"
              error={
                (erro && emptyEmail) || (erro && !isEmailValid(form.email))
              }
            >
              E-mail*
            </FormLabel>
            <OutlinedInput
              id="edit-email-input"
              placeholder="Digite seu e-mail"
              type="email"
              value={form.email}
              onChange={(event) => handleChangeForm(event)}
              error={
                (erro && emptyEmail) || (erro && !isEmailValid(form.email))
              }
              name="email"
              size="small"
            />
            <FormHelperText sx={{ m: 0, color: "red" }}>
              {emptyEmail && erro && "Este espaço deve ser preenchido"}
              {erro && emailInvalid && "Digite um email válido"}
            </FormHelperText>
          </FormControl>

          <div className="container-cpf-phone">
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
                htmlFor="edit-cpf-input"
                error={erro && cpfInvalid}
              >
                CPF
              </FormLabel>
              <PatternFormat
                format="###.###.###-##"
                customInput={OutlinedInput}
                mask="_"
                className="cpf-phone-input"
                id="edit-cpf-input"
                placeholder="Digite seu CPF"
                type="text"
                name="cpf"
                error={erro && cpfInvalid}
                onChange={(event) => handleChangeForm(event)}
                value={form.cpf}
                size="small"
              />
              <FormHelperText sx={{ m: 0, color: "red" }}>
                {erro && cpfInvalid && "Digite um CPF válido"}
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
                htmlFor="edit-phone-input"
                error={erro && !isPhoneValid(form.phone)}
              >
                Telefone
              </FormLabel>

              <PatternFormat
                format="(##) #####-####"
                customInput={OutlinedInput}
                mask="_"
                className="cpf-phone-input"
                id="edit-phone-input"
                placeholder="Digite seu Telefone"
                type="text"
                name="phone"
                onChange={(event) => handleChangeForm(event)}
                value={form.phone}
                error={erro && !isPhoneValid(form.phone)}
                size="small"
              />
              <FormHelperText sx={{ m: 0, color: "red" }}>
                {erro &&
                  !isPhoneValid(form.phone) &&
                  "Digite um telefone válido"}
              </FormHelperText>
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
              htmlFor="edit-password-input"
              error={erro && invalidPassword}
            >
              Nova Senha
            </FormLabel>
            <OutlinedInput
              id="edit-password-input"
              placeholder="Digite seu senha"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={(event) => handleChangeForm(event)}
              error={erro && invalidPassword}
              size="small"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText sx={{ m: 0, color: "red" }}>
              {erro && invalidPassword && "Digite uma senha válida"}
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
              htmlFor="confirm-password-input"
              error={erro && wrongConfPass}
            >
              Confirmar Senha
            </FormLabel>
            <OutlinedInput
              id="confirm-password-input"
              placeholder="Digite seu senha"
              type={showConfirmPassword ? "text" : "password"}
              name="confirm_password"
              value={form.confirm_password}
              onChange={(event) => handleChangeForm(event)}
              error={erro && wrongConfPass}
              size="small"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />

            <FormHelperText sx={{ m: 0, color: "red" }}>
              {erro && wrongConfPass && "Senhas não coincidem"}
            </FormHelperText>
          </FormControl>

          <Button
            id="aply-changes-btn"
            onClick={handleSubmitChanges}
            variant="contained"
            sx={{
              background: "rgba(218, 1, 117, 1)",
              borderRadius: "10px",
              textTransform: "none",
              fontFamily: '"Nunito", sans-serif',
              width: "40%",
              height: "8%",
              fontSize: "18px",
              marginTop: 2,
              "&:hover": {
                background: "rgba(218, 1, 117, 0.9)",
              },
            }}
          >
            Aplicar
          </Button>
        </form>
      </ThemeProvider>
    </div>
  );
}
