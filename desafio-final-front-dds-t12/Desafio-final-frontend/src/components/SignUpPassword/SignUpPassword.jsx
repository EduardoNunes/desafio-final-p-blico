import "./SignUpPassword.css";
import { Link } from "react-router-dom";
import EyeHiddenPass from "../../assets/EyeHiddenPass.png";
import { useState } from "react";
import { useSignUpContext } from "../../context/SignUpContext";

export default function SignUpPassword() {
  const { colectUserInfos, handleColectUserInfos, errors, handleSucessSignup } =
    useSignUpContext();

  const [showPass, setShowPass] = useState("password");
  function handleShowPass() {
    setShowPass(showPass === "password" ? "text" : "password");
  }

  return (
    <div className="container-SignUpPassword">
      <h1>Escolha uma Senha</h1>
      <form>
        <div>
          <label htmlFor="userPass">
            Senha*
            <img
              src={EyeHiddenPass}
              alt=""
              className="eyeHiddenPass"
              onClick={handleShowPass}
            />
          </label>
          <input
            type={showPass}
            id="userPass"
            name="password"
            value={colectUserInfos.password}
            onChange={(event) => handleColectUserInfos(event)}
          />
          {errors.userPass && <p className="error">{errors.userPass}</p>}
        </div>

        <div>
          <label htmlFor="userPassConfirmation">
            Repita a senha*
            <img
              src={EyeHiddenPass}
              alt=""
              className="eyeHiddenPass"
              onClick={handleShowPass}
            />
          </label>
          <input
            type={showPass}
            id="confirmPass"
            name="confirmPass"
            value={colectUserInfos.confirmPass}
            onChange={(event) => handleColectUserInfos(event)}
          />
          {errors.userConfirmPass && (
            <p className="error">{errors.userConfirmPass}</p>
          )}
        </div>
        <div className="buttonDiv">
          <input
            type="button"
            value="Continuar"
            id="buttonContinue"
            className="buttonContinue"
            onClick={handleSucessSignup}
          />
          <p>
            Já possui uma conta? Faça seu{" "}
            <Link className="goToLogin" to="/">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
