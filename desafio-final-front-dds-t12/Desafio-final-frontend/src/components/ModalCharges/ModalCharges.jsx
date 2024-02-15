import { useEffect } from "react";
import Paper from "../../assets/Paper.png";
import CloseIcon from "../../assets/close.png";
import { useChargesContext } from "../../context/ChargesContext";
import { useMenuSideBarColor } from "../../context/MenuSideBarColorContext";
import "./modal-charges.css";

export default function ModalCharges({ notify, notifyError }) {
  const {
    colectModalChargesInfos,
    setColectModalChargesInfos,
    handleColectModalChargesInfos,
    handleCreateCharge,
    handleCoinChange,
    handleOpenModalCharges,
    openModalCharges,
    modalChargeErrors,
    handleBlur,
  } = useChargesContext();
  const { clientDataDetails } = useMenuSideBarColor();

  useEffect(() => {
    if (openModalCharges) {
      setColectModalChargesInfos({
        ...colectModalChargesInfos,
        cliente_id: `${clientDataDetails.client.id}`,
      });
    }
  }, [openModalCharges]);

  return (
    <div className="container-modal-charges">
      <div className="modal-charges">
        <div className="modal-header">
          <img src={Paper} alt="Paper image" className="paper-img" />
          <h1>Cadastro de Cobrança</h1>
          <img
            src={CloseIcon}
            alt=""
            className="close-img"
            onClick={() => handleOpenModalCharges(false)}
          />
        </div>
        <form>
          <label htmlFor="userName">Nome:* </label>
          <input
            type="text"
            name="name"
            id="userName"
            className="inputName"
            defaultValue={clientDataDetails.client.nome}
            disabled
          />
          <div className="forDescription">
            <label htmlFor="chargeDescription">Descrição:*</label>
            <textarea
              type="text"
              name="descricao"
              id="chargeDescription"
              className="inputDescription"
              value={colectModalChargesInfos.descricao}
              onChange={(event) => handleColectModalChargesInfos(event)}
              onBlur={(event) => handleBlur(event)}
            />
            {modalChargeErrors.descCharge && (
              <p className="error">{modalChargeErrors.descCharge}</p>
            )}
          </div>
          <div className="maturity-value">
            <div>
              <label htmlFor="dateMaturity">Vencimento:*</label>
              <input
                type="date"
                name="data_venc"
                id="dateMaturity"
                value={colectModalChargesInfos.data_venc}
                onChange={(event) => {
                  handleColectModalChargesInfos(event);
                }}
                onBlur={(event) => handleBlur(event)}
              />
              {modalChargeErrors.dataVencCharge && (
                <p className="error">{modalChargeErrors.dataVencCharge}</p>
              )}
            </div>
            <div>
              <label htmlFor="chargeValue">Valor:*</label>
              <input
                type="text"
                name="valor"
                id="chargeValue"
                value={colectModalChargesInfos.formattedValue}
                onChange={(event) => handleCoinChange(event)}
                onBlur={(event) => handleBlur(event)}
                className="input-value"
                placeholder="R$ 0,00"
              />
              {modalChargeErrors.valorCharge && (
                <p className="error">{modalChargeErrors.valorCharge}</p>
              )}
            </div>
          </div>
          <div className="chargeStatus">
            <p>Status:*</p>
            <div className="forRadios">
              <input
                id="chargePaidOut"
                name="status"
                value={"Paga"}
                onClick={(event) => handleColectModalChargesInfos(event)}
                type="radio"
                defaultChecked
              />
              <label htmlFor="chargePaidOut">Cobrança Paga</label>
            </div>
            <div className="forRadios">
              <input
                id="chargePending"
                name="status"
                value={"Pendente"}
                onClick={(event) => handleColectModalChargesInfos(event)}
                type="radio"
              />
              <label htmlFor="chargePending">Cobrança Pendente</label>
            </div>
          </div>
          <div className="forButtons">
            <input
              type="button"
              name=""
              id="buttonCancel"
              onClick={() => handleOpenModalCharges(false)}
              value={"Cancelar"}
              className="buttonCancel"
            />
            <input
              type="button"
              name=""
              id="buttonApply"
              value={"Aplicar"}
              className="buttonApply"
              onClick={(event) =>
                handleCreateCharge({ event, notify, notifyError })
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
}
