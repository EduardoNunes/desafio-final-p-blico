import IconDelete from "../../assets/icon-delete.svg";
import IconEdit from "../../assets/icon-edit.svg";
import { useChargesContext } from "../../context/ChargesContext";
import "./LineClientCharges.css";

export default function LineClientCharges({
  id,
  descricao,
  data_venc,
  valor,
  status,
  clientId,
}) {
  const formatedId = id.split("-");

  const dateParts = data_venc.slice(0, 10).split("-");
  const formatedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

  const realValor = valor / 100;
  const formatedValor = `R$ ${realValor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const { handleOpenConfirmDeletChargeModal, handleOpenModalEditCharges } =
    useChargesContext();

  return (
    <div className="container-line-charges">
      <div className="block id">
        <p title={formatedId[0]}>{formatedId[0]}</p>
      </div>

      <div className="block date">
        <p title={formatedDate}>{formatedDate}</p>
      </div>

      <div className="block valor">
        <p title={formatedValor}>{formatedValor}</p>
      </div>

      <div
        className={`block status ${status === "Vencida" && "vencida"} ${
          status === "Pendente" && "pendente"
        } ${status === "Paga" && "paga"}`}
      >
        <p title={status}>{status}</p>
      </div>

      <div className="block description">
        <p title={descricao}>{descricao}</p>
      </div>

      <img
        src={IconEdit}
        alt="Lápis de representação de edição de cobrança"
        onClick={(event) => handleOpenModalEditCharges(event, true, id)}
      />

      <img
        src={IconDelete}
        alt="Lixeirinha para excluir a cobrança"
        onClick={(event) =>
          handleOpenConfirmDeletChargeModal(event, true, id, clientId)
        }
      />
    </div>
  );
}
