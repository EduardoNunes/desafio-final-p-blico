import { Button } from "@mui/material";
import AlertSymbol from "../../assets/alert-orange.svg";
import CloseButton from "../../assets/close.svg";
import { useChargesContext } from "../../context/ChargesContext";
import "./ConfirmDeletChargeModal.css";

export default function ConfirmDeletChargeModal({ notify, notifyError }) {
  const { handleOpenConfirmDeletChargeModal, handleDeleteCharge } =
    useChargesContext();

  return (
    <div className="container-confirm-delet-charge-modal">
      <div className="box-confirm">
        <img
          id="close-confirm-btn"
          src={CloseButton}
          alt="fechar modal"
          onClick={(event) => handleOpenConfirmDeletChargeModal(event, false)}
        />
        <img src={AlertSymbol} alt="" />
        <h3>Tem certeza que deseja excluir esta cobrança?</h3>
        <div className="container-buttons">
          <Button
            id="aply-changes-btn"
            onClick={(event) => handleOpenConfirmDeletChargeModal(event, false)}
            variant="contained"
            sx={{
              background: "rgba(242, 214, 208, 1)",
              color: "rgba(174, 17, 0, 1)",
              borderRadius: "4px",
              textTransform: "none",
              fontFamily: '"Nunito", sans-serif',
              width: "40%",
              maxWidth: "150px",
              height: "50%",
              fontSize: "18px",
              marginTop: 2,
              "&:hover": {
                background: "rgba(242, 214, 208, 0.9)",
              },
            }}
          >
            Não
          </Button>

          <Button
            id="aply-changes-btn"
            onClick={() => handleDeleteCharge({ notify, notifyError })}
            variant="contained"
            sx={{
              background: "rgba(172, 217, 197, 1)",
              color: "rgba(3, 74, 42, 1)",
              borderRadius: "4px",
              textTransform: "none",
              fontFamily: '"Nunito", sans-serif',
              width: "40%",
              maxWidth: "150px",
              height: "50%",
              fontSize: "18px",
              marginTop: 2,
              "&:hover": {
                background: "rgba(172, 217, 197, 0.9)",
              },
            }}
          >
            Sim
          </Button>
        </div>
      </div>
    </div>
  );
}
