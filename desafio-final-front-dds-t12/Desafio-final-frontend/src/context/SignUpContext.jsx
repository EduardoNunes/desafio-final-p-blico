import { createContext, useContext, useState } from "react";
import api from "../services/api";

const SignUpContext = createContext();

export function useSignUpContext() {
  return useContext(SignUpContext);
}

export function SignUpContextProvider({ children }) {
  const [colectUserInfos, setColectUserInfos] = useState({
    name: "",
    email: "",
    password: "",
    confirmPass: "",
  });
  const [stepOne, setStepOne] = useState(true);
  const [stepTwo, setStepTwo] = useState(false);
  const [stepThree, setStepThree] = useState(false);
  const [errors, setErrors] = useState({});

  function handleColectUserInfos(event) {
    const value = event.target.value;
    setColectUserInfos({ ...colectUserInfos, [event.target.name]: value });
  }

  const handleClickStep = (selectedStep) => {
    setStepOne(selectedStep === "one");
    setStepTwo(selectedStep === "two");
    setStepThree(selectedStep === "three");
  };

  function isNameValid(nome) {
    const regex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/;
    return regex.test(nome);
  }

  function isEmailValid(email) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  }

  function validate(colectUserInfos) {
    const error = {};
    if (!isNameValid(colectUserInfos.name)) {
      error.userName = "Campo obrigatório.";
    }
    if (!isEmailValid(colectUserInfos.email)) {
      error.userEmail = "Insira um e-mail válido";
    }
    return error;
  }

  function nextStepWithButton(colectUserInfos) {
    if (
      !isEmailValid(colectUserInfos.email) ||
      !isNameValid(colectUserInfos.name)
    ) {
    } else {
      handleClickStep("two");
    }
  }

  function handleButtonContinueClick() {
    setErrors(validate(colectUserInfos));
    nextStepWithButton(colectUserInfos);
  }

  function isPassValid(senha) {
    const regex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;
    if (regex.test(senha)) {
      return true;
    } else {
      return false;
    }
  }
  function validatePass(colectUserInfos) {
    const error = {};
    if (!isPassValid(colectUserInfos.password)) {
      error.userPass =
        "A senha deve conter no mínimo 8 caracteres, incluindo um número, uma letra maiúscula e um caractere especial.";
    }
    if (colectUserInfos.confirmPass != colectUserInfos.password) {
      error.userConfirmPass = "As senhas não coincidem.";
    }
    return error;
  }

  function nextStepWithButtonPassword(colectUserInfos) {
    if (
      !isPassValid(colectUserInfos.password) ||
      colectUserInfos.confirmPass != colectUserInfos.password
    ) {
      return;
    } else {
      handleClickStep("three");
    }
  }

  async function handleSucessSignup() {
    setErrors(validatePass(colectUserInfos));

    try {
      if (colectUserInfos.confirmPass != colectUserInfos.password) {
        return;
      }
      const body = {
        nome: colectUserInfos.name,
        email: colectUserInfos.email,
        senha: colectUserInfos.password,
      };
      const response = await api.post("/signUp", { ...body });

      nextStepWithButtonPassword(colectUserInfos);
      setColectUserInfos({
        name: "",
        email: "",
        password: "",
        confirmPass: "",
      });
      setErrors({});
    } catch (error) {
      if (
        error.response.data.mensagem ===
        "O preenchimento da senha é obrigatório"
      ) {
        return;
      } else if (error.response.data.mensagem === "Email já cadastrado") {
        handleClickStep("one");
        setErrors({ userEmail: "Email já cadastrado" });
      }
    }
  }

  return (
    <SignUpContext.Provider
      value={{
        colectUserInfos,
        setColectUserInfos,
        handleColectUserInfos,
        stepOne,
        stepTwo,
        stepThree,
        handleClickStep,
        errors,
        setErrors,
        validate,
        handleButtonContinueClick,
        handleSucessSignup,
        isPassValid,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
}
