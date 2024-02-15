import "./HorizontalStepper.css";
import { useState } from "react";
import HorizontalStepperGray from "../../assets/HorizontalStepperGray.png";
import HorizontalStepperGreen from "../../assets/HorizontalStepperGreen.png";
import { useSignUpContext } from "../../context/SignUpContext";

export default function HorizontalStepper() {
  const {
    stepOne,
    stepTwo,
    stepThree,
    handleClickStep,
    handleButtonContinueClick,
    handleSucessSignup,
  } = useSignUpContext();
  return (
    <div className="container-HorizontalStepper">
      <img
        src={stepOne ? HorizontalStepperGreen : HorizontalStepperGray}
        alt=""
        onClick={() => handleClickStep("one")}
      />
      <img
        src={stepTwo ? HorizontalStepperGreen : HorizontalStepperGray}
        alt=""
        onClick={handleButtonContinueClick}
      />
      <img
        src={stepThree ? HorizontalStepperGreen : HorizontalStepperGray}
        alt=""
        onClick={handleSucessSignup}
      />
    </div>
  );
}
