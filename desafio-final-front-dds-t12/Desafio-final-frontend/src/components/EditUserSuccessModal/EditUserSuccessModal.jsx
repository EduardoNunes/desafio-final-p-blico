import "./EditUserSuccessModal.css";
import SignUpSucessCheked from "../../assets/SignUpSucessCheked.png";
import { useEffect } from "react";
import { useMenuSideBarColor } from "../../context/MenuSideBarColorContext";

export default function EditUserSuccessModal() {
  const { handleOpenEditUserSuccessModal } = useMenuSideBarColor();
  useEffect(() => {
    function closeModal() {
      handleOpenEditUserSuccessModal(false);
    }
    const timeoutClose = setTimeout(() => {
      closeModal();
    }, 3000);

    return () => clearTimeout(timeoutClose);
  }, []);
  return (
    <div className="container-success-edit-user-modal">
      <div className="box-Sucess">
        <img src={SignUpSucessCheked} alt="" />
        <h1>Cadastro alterado com Sucesso!</h1>
      </div>
    </div>
  );
}
