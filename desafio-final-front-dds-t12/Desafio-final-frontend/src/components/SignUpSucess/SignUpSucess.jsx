import "./SignUpSucess.css";
import { Link } from "react-router-dom";
import SignUpSucessCheked from "../../assets/SignUpSucessCheked.png";
import { useSignUpContext } from "../../context/SignUpContext";

export default function SignUpSucess() {
  const { handleClickStep } = useSignUpContext();
  return (
    <div className="container-SignUpSucess">
      <div className="box-Sucess">
        <img src={SignUpSucessCheked} alt="" />
        <h1>Cadastro realizado com Sucesso!</h1>
      </div>
      <Link className="goToLogin" onClick={() => handleClickStep("one")} to="/">
        Ir para Login
      </Link>
    </div>
  );
}
