import "./modal-info-charges.css";
import PaperIcon from "../../assets/Paper.png";
import CloseIcon from "../../assets/close.svg";
import { useChargesContext } from "../../context/ChargesContext";
import { useEffect } from "react";

export default function ModalInfoCharges() {
  const { handleOpenModalInfoCharges, colectChargesViewInfos } =
    useChargesContext();
  return (
    <div className="background">
      <div className="container-info-charges">
        <div className="modal-header">
          <img src={PaperIcon} alt="" />
          <h1>Detalhe da cobrança</h1>
          <img
            src={CloseIcon}
            alt=""
            className="close-icon"
            onClick={() => handleOpenModalInfoCharges(false)}
          />
        </div>
        <div className="for-name">
          <strong>Nome:</strong>
          <p>{colectChargesViewInfos.nome}</p>
        </div>
        <div className="for-description">
          <strong>Descrição</strong>
          <p className="description">{colectChargesViewInfos.descricao}</p>
        </div>
        <div className="maturity-value">
          <div>
            <strong>Vencimento</strong>
            <p>{colectChargesViewInfos.data_venc}</p>
          </div>
          <div>
            <strong>Valor</strong>
            <p>{colectChargesViewInfos.valor}</p>
          </div>
        </div>
        <div className="id-status">
          <div>
            <strong>ID cobranças</strong>
            <p>{colectChargesViewInfos.idCob}</p>
          </div>
          <div>
            <strong>Status</strong>
            <p className={colectChargesViewInfos.className}>
              {colectChargesViewInfos.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
