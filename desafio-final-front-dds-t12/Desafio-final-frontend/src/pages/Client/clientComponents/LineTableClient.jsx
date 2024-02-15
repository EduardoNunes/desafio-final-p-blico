import IconPaperCharge from "../../../assets/icon-page-charge.svg";
import { useAddClientContext } from "../../../context/AddClienteContext";
import { useChargesContext } from "../../../context/ChargesContext";
import { useMenuSideBarColor } from "../../../context/MenuSideBarColorContext";
import "./line-table-client.css";

export default function LineTableClient({
  id,
  client,
  cpf,
  email,
  phone,
  status,
}) {
  const { clientDataDetails, setClientDataDetails } = useMenuSideBarColor();
  const { handleOpenModalCharges, handleOpenClientDetails } =
    useChargesContext();
  const { clients } = useAddClientContext();

  function openClientAddCharge(id) {
    const client = clients.find((client) => client.id === id);

    setClientDataDetails({ ...clientDataDetails, client: client });

    handleOpenModalCharges(true);
  }

  let formattedPhone = phone;
  let formattedCpf = cpf;

  if (!formattedPhone.includes("(")) {
    formattedPhone = `(${formattedPhone.slice(0, 2)}) ${formattedPhone.slice(
      2,
      7
    )}-${formattedPhone.slice(7)}`;
  }

  if (!formattedCpf.includes("-")) {
    formattedCpf = `${formattedCpf.slice(0, 3)}.${formattedCpf.slice(
      3,
      6
    )}.${formattedCpf.slice(6, 9)}-${formattedCpf.slice(9)}`;
  }

  return (
    <div className="line-table-client">
      <div
        className="cliente"
        onClick={(event) => handleOpenClientDetails(id, event)}
      >
        <p title={client}>{client}</p>
      </div>
      <div className="cpf">
        <p title={formattedCpf}>{formattedCpf}</p>
      </div>
      <div className="email">
        <p title={email}>{email}</p>
      </div>
      <div className="telefone">
        <p title={formattedPhone}>{formattedPhone}</p>
      </div>
      <div
        className={`status ${
          status === "Inadimplente" ? "inadimplente" : "em-dia"
        }`}
      >
        <p>{status}</p>
      </div>
      <div className="criar-cobranca">
        <img
          src={IconPaperCharge}
          alt="Icon Charge"
          onClick={() => openClientAddCharge(id)}
        />
      </div>
    </div>
  );
}
