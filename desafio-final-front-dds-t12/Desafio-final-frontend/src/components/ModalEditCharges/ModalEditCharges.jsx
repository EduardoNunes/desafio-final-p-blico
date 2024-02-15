import Paper from "../../assets/Paper.png";
import CloseIcon from "../../assets/close.png";
import { useChargesContext } from "../../context/ChargesContext";
import { useMenuSideBarColor } from "../../context/MenuSideBarColorContext";
import "./modal-edit-charges.css";

export default function ModalEditCharges({ notify, notifyError, id }) {
  const {
    modalChargeErrors,
    handleBlurEdit,
    handleOpenModalEditCharges,
    colectModalEditCharges,
    handleEditCharge,
    handleColectModalEditChargesInfos,
    handleCoinChangeEditCharge,
  } = useChargesContext();

  const { clientDataDetails } = useMenuSideBarColor();

  return (
    <div className="container-modal-charges">
      <div className="modal-charges">
        <div className="modal-header">
          <img src={Paper} alt="Paper image" className="paper-img" />
          <h1>Edição de Cobrança</h1>
          <img
            src={CloseIcon}
            alt=""
            className="close-img"
            onClick={(event) => handleOpenModalEditCharges(event, false)}
          />
        </div>
        <form>
          <label htmlFor="userName">Nome:* </label>
          <input
            type="text"
            name="name"
            id="userName"
            className="inputName"
            defaultValue={
              location.pathname.includes("client")
                ? clientDataDetails.client.nome
                : colectModalEditCharges.nome
            }
            disabled
          />
          <div className="forDescription">
            <label htmlFor="chargeDescription">Descrição:*</label>
            <textarea
              type="text"
              name="descricao"
              id="chargeDescription"
              className="inputDescription"
              value={colectModalEditCharges.descricao}
              onChange={(event) => handleColectModalEditChargesInfos(event)}
              onBlur={(event) => handleBlurEdit(event)}
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
                value={colectModalEditCharges.data_venc}
                onChange={(event) => {
                  handleColectModalEditChargesInfos(event);
                }}
                onBlur={(event) => handleBlurEdit(event)}
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
                value={colectModalEditCharges.formattedValue}
                onChange={(event) => handleCoinChangeEditCharge(event)}
                onBlur={(event) => handleBlurEdit(event)}
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
                onClick={(event) => handleColectModalEditChargesInfos(event)}
                type="radio"
                defaultChecked={
                  colectModalEditCharges.toRadiosPagaDefaultChecked
                }
              />
              <label htmlFor="chargePaidOut">Cobrança Paga</label>
            </div>
            <div className="forRadios">
              <input
                id="chargePending"
                name="status"
                value={"Pendente"}
                onClick={(event) => handleColectModalEditChargesInfos(event)}
                type="radio"
                defaultChecked={
                  colectModalEditCharges.toRadiosPendenteDefaultChecked
                }
              />
              <label htmlFor="chargePending">Cobrança Pendente</label>
            </div>
          </div>
          <div className="forButtons">
            <input
              type="button"
              name=""
              id="buttonCancel"
              onClick={(event) => handleOpenModalEditCharges(event, false)}
              value={"Cancelar"}
              className="buttonCancel"
            />
            <input
              type="button"
              name=""
              id="buttonApply"
              value={"Aplicar"}
              className="buttonApply"
              onClick={(event) => handleEditCharge(event, notify, notifyError)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
