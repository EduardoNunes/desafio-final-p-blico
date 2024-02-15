import { Link } from "react-router-dom";
import { useSignUpContext } from "../../context/SignUpContext";
import "./SignUpNameEmail.css";

export default function SignUpNameEmail() {
  const {
    colectUserInfos,
    handleColectUserInfos,
    errors,
    handleButtonContinueClick,
  } = useSignUpContext();

  return (
    <div className="container-SignUpNameEmail">
      <h1>Adicione Seus Dados</h1>
      <form>
        <div>
          <label htmlFor="userName">Nome*</label>
          <input
            type="text"
            id="userName"
            name="name"
            value={colectUserInfos.name}
            onChange={(event) => handleColectUserInfos(event)}
          />
          {errors.userName && <p className="error">{errors.userName}</p>}
        </div>
        <div>
          <label htmlFor="userEmail">E-mail*</label>
          <input
            type="email"
            id="userEmail"
            name="email"
            value={colectUserInfos.email}
            onChange={(event) => handleColectUserInfos(event)}
          />
          {errors.userEmail && <p className="error">{errors.userEmail}</p>}
        </div>
        <div className="buttonDiv">
          <input
            type="button"
            value="Continuar"
            id="buttonContinue"
            className="buttonContinue"
            onClick={handleButtonContinueClick}
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
