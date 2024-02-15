import "./line-table-charges.css";
import IconEditCharge from "../../../assets/icon-edit.svg";
import IconDeleteCharge from "../../../assets/icon-delete.svg";
import { useChargesContext } from "../../../context/ChargesContext";

export default function LineTableClient({
  client,
  idCob,
  valor,
  dataVenc,
  stats,
  description,
  id,
}) {
  const {
    handleOpenModalInfoCharges,
    handleOpenModalEditCharges,
    handleOpenConfirmDeletChargeModal,
    handleOpenClientDetails,
  } = useChargesContext();

  let dateFormat = "";
  const date = dataVenc;
  const data = date?.split("T")[0];
  dateFormat = data?.split("-");
  const dataFormat = `${dateFormat[2]}/${dateFormat[1]}/${dateFormat[0]}`;

  const idFormat = idCob.split("-");

  return (
    <div
      className="line-table-charges"
      onClick={() => handleOpenModalInfoCharges(true, idCob)}
    >
      <div
        className="cliente"
        onClick={(event) => handleOpenClientDetails(id, event)}
      >
        <p title={client}>{client}</p>
      </div>
      <div className="id-cob">
        <p title={idFormat[0]}>{idFormat[0]}</p>
      </div>
      <div className="valor">
        <p title={String(valor).replace(/([0-9]{2})$/g, ",$1")}>
          R$ {String(valor).replace(/([0-9]{2})$/g, ",$1")}
        </p>
      </div>
      <div className="data-venc">
        <p title={dataFormat}>{dataFormat}</p>
      </div>
      <div className={`status ${stats}`}>
        <p>{stats}</p>
      </div>
      <div className="descricao">
        <p title={description}>{description}</p>
      </div>
      <div className="editar-deletar">
        <img
          src={IconEditCharge}
          alt="Icon Charge"
          onClick={(event) => handleOpenModalEditCharges(event, true, idCob)}
        />
        <img
          src={IconDeleteCharge}
          alt="Icon Charge"
          onClick={(event) =>
            handleOpenConfirmDeletChargeModal(event, true, idCob, id)
          }
        />
      </div>
    </div>
  );
}
