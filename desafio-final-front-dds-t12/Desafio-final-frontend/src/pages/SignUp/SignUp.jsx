import "./SignUp.css";
import SignUpNameEmail from "../../components/SignUpNameEmail/SignUpNameEmail";
import SignUpPassword from "../../components/SignUpPassword/SignUpPassword";
import SignUpSucess from "../../components/SignUpSucess/SignUpSucess";
import VerticalStepper from "../../components/VerticalStepper/VerticalStepper";
import HorizontalStepper from "../../components/HorizontalStepper/HorizontalStepper";
import { useSignUpContext } from "../../context/SignUpContext";

export default function SignUp() {
  const { stepOne, stepTwo, stepThree } = useSignUpContext();
  return (
    <div className="container-signUp">
      <section className="box-left">
        <VerticalStepper />
      </section>
      <section className="box-right">
        {stepOne ? <SignUpNameEmail /> : ""}
        {stepTwo ? <SignUpPassword /> : ""}
        {stepThree ? <SignUpSucess /> : ""}
        <HorizontalStepper />
      </section>
    </div>
  );
}
