import "./VerticalStepper.css";
import VerticalStepperGreenLine from "../../assets/VerticalStepperGreenLine.png";
import VerticalStepperGreenBall from "../../assets/VerticalStepperGreenBall.png";
import VerticalStepperGrayBall from "../../assets/VerticalStepperGrayBall.png";
import VerticalStepperCheckedBox from "../../assets/VerticalStepperCheckedBall.png";
import { useEffect, useState } from "react";
import { useSignUpContext } from "../../context/SignUpContext";

export default function VerticalStepper() {
  const { stepOne, stepTwo, stepThree } = useSignUpContext();
  const [verticalStepperOne, setVerticalStepperOne] = useState(
    VerticalStepperGreenBall
  );
  const [verticalStepperTwo, setVerticalStepperTwo] = useState(
    VerticalStepperGrayBall
  );
  const [verticalStepperThree, setVerticalStepperThree] = useState(
    VerticalStepperGrayBall
  );

  useEffect(() => {
    if (stepOne === true) {
      setVerticalStepperOne(VerticalStepperGreenBall);
      setVerticalStepperTwo(VerticalStepperGrayBall);
      setVerticalStepperThree(VerticalStepperGrayBall);
    } else if (stepTwo === true) {
      setVerticalStepperOne(VerticalStepperCheckedBox);
      setVerticalStepperTwo(VerticalStepperGreenBall);
      setVerticalStepperThree(VerticalStepperGrayBall);
    } else {
      setVerticalStepperTwo(VerticalStepperCheckedBox);
      setVerticalStepperThree(VerticalStepperCheckedBox);
    }
  }, [stepOne, stepTwo, stepThree]);

  return (
    <div className="container-VerticalStepper">
      <div className="box-VerticalStepper">
        <img src={verticalStepperOne} alt="" className="ball" />
        <img src={VerticalStepperGreenLine} alt="" className="line" />
        <img src={verticalStepperTwo} alt="" className="ball" />
        <img src={VerticalStepperGreenLine} alt="" className="line" />
        <img src={verticalStepperThree} alt="" className="ball" />
      </div>
      <div className="box-Text">
        <div className="text">
          <strong>Cadastre-se</strong>
          <p>Por favor, escreva seu nome e e-mail</p>
        </div>
        <div className="text">
          <strong>Escolha uma senha</strong>
          <p>Escolha uma senha segura</p>
        </div>
        <div className="text">
          <strong>Cadastro realizado com sucesso</strong>
          <p>E-mail e senha cadastrados com sucesso</p>
        </div>
      </div>
    </div>
  );
}
