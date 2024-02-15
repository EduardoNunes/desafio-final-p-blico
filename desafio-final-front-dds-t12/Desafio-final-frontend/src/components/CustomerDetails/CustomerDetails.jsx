import { Button } from "@mui/material";
import IconArrowTopDown from "../../assets/arrow-top-down.svg";
import IconClients from "../../assets/icon-client.svg";
import IconEditClient from "../../assets/icon-edit-client.svg";
import { useChargesContext } from "../../context/ChargesContext";
import { useMenuSideBarColor } from "../../context/MenuSideBarColorContext";
import LineClientCharges from "../LineClientCharges/LineClientCharges";
import "./CustomerDetails.css";

export default function CustomerDetails({ notify, notifyError }) {
  const { clientDataDetails, handleOpenEditCustomerModal } =
    useMenuSideBarColor();
  const { clientCharges, handleOpenModalCharges } = useChargesContext();

  const id = clientDataDetails.id;
  const client = clientDataDetails.client;
  const charges = clientCharges;

  let formattedPhone = client.telefone;
  let formattedCpf = client.cpf;
  let formattedCep = client.cep;

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

  if (formattedCep) {
    if (!formattedCep.includes(".")) {
      formattedCep = `${formattedCep.slice(0, 2)}.${formattedCep.slice(
        2,
        5
      )}-${formattedCep.slice(5)}`;
    }
  }

  return (
    <div className="customer-details-container">
      <div className="container-content">
        <section className="client-name">
          <img src={IconClients} alt="Ícone de clientes" />
          <h1>{client.nome}</h1>
        </section>

        <section className="client-datails">
          <div className="header-client-details">
            <h1>Dados do cliente</h1>
            <Button
              id="cancel-changes-btn"
              variant="contained"
              onClick={() => handleOpenEditCustomerModal(true)}
              sx={{
                background: "rgba(222, 222, 233, 1)",
                borderRadius: "10px",
                textTransform: "none",
                fontFamily: '"Nunito", sans-serif',
                color: "#0E8750",
                width: "25%",
                height: "35px",
                fontSize: "18px",
                "&:hover": {
                  background: "rgba(222, 222, 233, 0.9)",
                },
              }}
            >
              <img
                src={IconEditClient}
                alt="Lapis de representação de edição de cliente"
              />
              Editar Cliente
            </Button>
          </div>

          <div className="client-infos">
            <div className="line">
              <div className="block first">
                <div className="title">E-mail</div>
                <div className="data" title={client.email}>
                  {client.email}
                </div>
              </div>

              <div className="block second">
                <div className="title">Telefone</div>
                <div className="data" title={formattedPhone}>
                  {formattedPhone}
                </div>
              </div>

              <div className="block third">
                <div className="title">CPF</div>
                <div className="data" title={formattedCpf}>
                  {formattedCpf}
                </div>
              </div>
            </div>

            <div className="line">
              <div className="block first">
                <div className="title">Endereço</div>
                <div className="data" title={client.endereco}>
                  {client.endereco}
                </div>
              </div>

              <div className="block second">
                <div className="title">Bairro</div>
                <div className="data" title={client.bairro}>
                  {client.bairro}
                </div>
              </div>

              <div className="block third">
                <div className="title">Complemento</div>
                <div className="data" title={client.complemento}>
                  {client.complemento}
                </div>
              </div>

              <div className="block">
                <div className="title">CEP</div>
                <div className="data" title={formattedCep}>
                  {formattedCep}
                </div>
              </div>

              <div className="block">
                <div className="title">Cidade</div>
                <div className="data" title={client.cidade}>
                  {client.cidade}
                </div>
              </div>

              <div className="block">
                <div className="title">UF</div>
                <div className="data" title={client.uf}>
                  {client.uf}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="client-charges">
          <div className="header-client-charges">
            <h1>Cobranças do cliente</h1>
            <Button
              id="apply-changes-btn"
              variant="contained"
              onClick={() => handleOpenModalCharges(true)}
              sx={{
                background: "rgba(218, 1, 117, 1)",
                borderRadius: "10px",
                textTransform: "none",
                fontFamily: '"Nunito", sans-serif',
                width: "25%",
                height: "35px",
                fontSize: "18px",
                "&:hover": {
                  background: "rgba(218, 1, 117, 0.9)",
                },
              }}
            >
              + Nova Cobrança
            </Button>
          </div>

          <div className="table-titles">
            <div className="title id">
              <img src={IconArrowTopDown} alt="" />
              <h2>ID Cob.</h2>
            </div>

            <div className="title date">
              <img src={IconArrowTopDown} alt="" />
              <h2>Data de venc.</h2>
            </div>

            <div className="title valor">
              <h2>Valor</h2>
            </div>

            <div className="title status">
              <h2>Status</h2>
            </div>

            <div className="title description">
              <h2>Descrição</h2>
            </div>
          </div>

          <div className="table-lines">
            {charges.length === 0 ? (
              <span>Cadastre uma cobrança.</span>
            ) : (
              charges.map((charge) => (
                <LineClientCharges
                  key={charge.id_cob}
                  id={charge.id_cob}
                  descricao={charge.descricao}
                  data_venc={charge.data_venc}
                  valor={charge.valor}
                  status={charge.status}
                  clientId={client.id}
                  notify={notify}
                  notifyError={notifyError}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
