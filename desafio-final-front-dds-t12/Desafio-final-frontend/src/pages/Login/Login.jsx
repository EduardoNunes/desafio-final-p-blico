import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  FormHelperText,
  OutlinedInput,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import api from "../../services/api";
import { setItem } from "../../utils/storage";
import "./Login.css";

const theme = createTheme({
  typography: {
    fontFamily: ['"Inter"', "sans-serif"].join(","),
  },
});

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [erro, setErro] = useState(false);
  const [emptyEmail, setEmptyEmail] = useState(null);
  const [emptyPassword, setEmptyPassword] = useState(null);
  const [emailInvalid, setEmailInvalid] = useState(false);

  function handleChangeForm(event) {
    const value = event.target.value;

    setForm({ ...form, [event.target.name]: value });
  }

  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }

  function handleMouseDownPassword(event) {
    event.preventDefault();
  }

  function isEmailValid(email) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  }

  function notifyError(message) {
    toast.error(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro(false);
    setEmptyEmail(false);
    setEmptyPassword(false);

    if (!form.email || !form.password) {
      setErro(true);
      if (!form.email) {
        setEmptyEmail(true);
      }

      if (!form.password) {
        setEmptyPassword(true);
      }

      return;
    }

    if (!isEmailValid(form.email)) {
      setErro(true);
      setEmailInvalid(true);
      return;
    }

    try {
      const body = {
        email: form.email,
        senha: form.password,
      };

      const response = await api.post("/login", { ...body });

      setItem("token", response.data.token);
      setItem("userName", response.data.user.nome);
      setItem("userId", response.data.user.id);

      navigate("/home");
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 401) {
        notifyError(error.response.data.mensagem);
      } else {
        notifyError("Erro interno do servidor");
      }
    }

    setForm({
      email: "",
      password: "",
    });
  }

  return (
    <div className="container-login">
      <section className="left-side">
        <h1>
          Gerencie todos os pagamentos
          <br />
          da sua empresa em um só
          <br />
          lugar.
        </h1>
      </section>

      <section className="right-side">
        <ToastContainer />
        <form id="container-login-form">
          <h1>Faça seu login!</h1>

          <ThemeProvider theme={theme}>
            <FormControl
              sx={{
                display: "flex",

                marginTop: "1.5rem",
                width: "18rem",
              }}
            >
              <FormLabel
                sx={{
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 600,
                  fontSize: "14px",
                }}
                htmlFor="email-login"
                error={
                  (erro && emptyEmail) || (erro && !isEmailValid(form.email))
                }
              >
                E-mail
              </FormLabel>

              <OutlinedInput
                sx={{
                  background: "white",
                }}
                id="email-login"
                placeholder="Digite seu e-mail"
                type="email"
                name="email"
                error={
                  (erro && emptyEmail) || (erro && !isEmailValid(form.email))
                }
                value={form.email}
                onChange={(event) => handleChangeForm(event)}
                size="small"
              />
              <FormHelperText sx={{ m: 0, color: "red" }}>
                {emptyEmail && erro && "Este espaço deve ser preenchido"}
                {erro && emailInvalid && "Digite um email válido"}
              </FormHelperText>
            </FormControl>

            <FormControl
              sx={{
                display: "flex",

                marginTop: "1.5rem",
                width: "18rem",
              }}
            >
              <div>
                <div id="forgot">
                  <FormLabel
                    sx={{
                      fontFamily: '"Nunito", sans-serif',
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                    htmlFor="password-login"
                    error={emptyPassword && erro}
                  >
                    Senha
                  </FormLabel>

                  <a href="/">Esqueceu a senha?</a>
                </div>

                <OutlinedInput
                  id="password-login"
                  placeholder="Digite sua senha"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  error={emptyPassword && erro}
                  onChange={(event) => handleChangeForm(event)}
                  onKeyDown={(event) =>
                    event.key === "Enter" && handleSubmit(event)
                  }
                  sx={{
                    width: "18rem",
                    background: "white",
                  }}
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
                  {emptyPassword && erro && "Este espaço deve ser preenchido"}
                </FormHelperText>
              </div>
            </FormControl>
          </ThemeProvider>

          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: "rgba(218, 1, 117, 1)",
              borderRadius: "10px",
              textTransform: "none",
              fontFamily: '"Nunito", sans-serif',
              width: "120px",
              height: "35px",
              fontSize: "18px",
              marginTop: "30px",
              "&:hover": {
                background: "rgba(218, 1, 117, 0.9)",
              },
            }}
          >
            Entrar
          </Button>

          <div className="no-account">
            <span>Ainda não possui uma conta?</span>
            <Link to="/signup">Cadastre-se</Link>
          </div>
        </form>
      </section>
    </div>
  );
}
