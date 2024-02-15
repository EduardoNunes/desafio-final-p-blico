import { useEffect, useState } from "react";
import IconClientGreen from "../../assets/icon-client-green.svg";
import IconClientRed from "../../assets/icon-client-red.svg";
import IconPaperBrown from "../../assets/icon-paper-brown.svg";
import IconPaperGreen from "../../assets/icon-paper-green.svg";
import IconPaperYellow from "../../assets/icon-paper-yellow.svg";
import EditUserModal from "../../components/EditUserModal/EditUserModal";
import EditUserSuccessModal from "../../components/EditUserSuccessModal/EditUserSuccessModal";
import Header from "../../components/Header/Header";
import LineTable from "../../components/LineTable/LineTable";
import SideBar from "../../components/SIdeBar/SideBar";
import { useMenuSideBarColor } from "../../context/MenuSideBarColorContext";
import api from "../../services/api";
import { clear, getItem } from "../../utils/storage";
import ChartCharge from "./dashBoardComponents/ChartCharge/ChartCharge";
import ClientArea from "./dashBoardComponents/ClientArea/ClientArea";
import TotalValues from "./dashBoardComponents/TotalValues/TotalValues";
import "./home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  setTimeout(function () {
    clear();

    navigate("/");
  }, 25200000);

  const { openEditUserModal, openEditUserSuccessModal } = useMenuSideBarColor();
  const [homeCharges, setHomeCharges] = useState();
  const [homeClients, setHomeClients] = useState();

  const token = getItem("token");

  async function loadChargeClient() {
    try {
      const { data } = await api.get("/dashboardCharges", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHomeCharges(data);
    } catch (error) {
      console.error(`erro na requisicao da api ${error.message}`);
    }
    try {
      const { data } = await api.get("/dashboardClients", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHomeClients(data);
    } catch (error) {
      console.error(`erro na requisicao da api ${error.message}`);
    }
  }

  useEffect(() => {
    loadChargeClient();
  }, []);

  return (
    <div className="home-container">
      {openEditUserModal && <EditUserModal />}
      {openEditUserSuccessModal && <EditUserSuccessModal />}
      <SideBar />
      <div className="board">
        <Header title={<h1>Resumo Cobranças</h1>} />
        <div className="container">
          <div className="chart">
            <div className="section-top">
              <TotalValues
                backGroundColor={"#EEF6F6"}
                iconPaper={<img src={IconPaperGreen} alt="Icon Paper" />}
                titleCharge={"Cobranças Pagas"}
                valueCharge={
                  !homeCharges
                    ? "0"
                    : (homeCharges.Paga.total / 100).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                }
              />
              <TotalValues
                backGroundColor={"#FFEFEF"}
                iconPaper={<img src={IconPaperBrown} alt="Icon Paper" />}
                titleCharge={"Cobranças Vencidas"}
                valueCharge={
                  !homeCharges
                    ? "0"
                    : (homeCharges.Vencida.total / 100).toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )
                }
              />
              <TotalValues
                backGroundColor={"#FCF6DC"}
                iconPaper={<img src={IconPaperYellow} alt="Icon Paper" />}
                titleCharge={"Cobranças Previstas"}
                valueCharge={
                  !homeCharges
                    ? "0"
                    : (homeCharges.Pendente.total / 100).toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )
                }
              />
            </div>
            <div className="section-middle">
              <ChartCharge
                titleCharge={"Cobranças Pagas"}
                amountCharge={!homeCharges ? "0" : homeCharges.Paga.quantidade}
                fontColor={"#1FA7AF"}
                backGroundColor={"#EEF6F6"}
                setType={"Paga"}
                lineTableComponent={
                  !homeCharges ? (
                    <span>Carregando dados.</span>
                  ) : (
                    homeCharges.Paga.charges.map((pagas, index) => (
                      <LineTable
                        key={index}
                        cliente={pagas.nome}
                        idDaCob={pagas.id_cob.slice(0, 8)}
                        valor={(pagas.valor / 100).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      />
                    ))
                  )
                }
              />
              <ChartCharge
                titleCharge={"Cobranças Vencidas"}
                amountCharge={
                  !homeCharges ? "0" : homeCharges.Vencida.quantidade
                }
                fontColor={"#971D1D"}
                backGroundColor={"#FFEFEF"}
                setType={"Vencida"}
                lineTableComponent={
                  !homeCharges ? (
                    <span>Carregando dados.</span>
                  ) : (
                    homeCharges.Vencida.charges.map((vencidas, index) => (
                      <LineTable
                        key={index}
                        cliente={vencidas.nome}
                        idDaCob={vencidas.id_cob.slice(0, 8)}
                        valor={(vencidas.valor / 100).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      />
                    ))
                  )
                }
              />
              <ChartCharge
                titleCharge={"Cobranças Previstas"}
                amountCharge={
                  !homeCharges ? "0" : homeCharges.Pendente.quantidade
                }
                fontColor={"#C5A605"}
                backGroundColor={"#FCF6DC"}
                setType={"Pendente"}
                lineTableComponent={
                  !homeCharges ? (
                    <span>Carregando dados.</span>
                  ) : (
                    homeCharges.Pendente.charges.map((pendente, index) => (
                      <LineTable
                        key={index}
                        cliente={pendente.nome}
                        idDaCob={pendente.id_cob.slice(0, 8)}
                        valor={(pendente.valor / 100).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      />
                    ))
                  )
                }
              />
            </div>
            <div className="section-bottom">
              <ClientArea
                titleClientArea={"Clientes Inadimplentes"}
                amountClient={
                  !homeClients
                    ? "0"
                    : homeClients.clientesInadimplentes.quantidade
                }
                fontColor={"#971D1D"}
                backGroundColor={"#FFEFEF"}
                setType={"Inadimplente"}
                iconClient={<img src={IconClientRed} alt="Icon Client" />}
                lineTableComponent={
                  !homeClients ? (
                    <span>Sem clientes cadastrados.</span>
                  ) : (
                    homeClients.clientesInadimplentes.clientes.map(
                      (cliente, index) => (
                        <LineTable
                          key={index}
                          cliente={cliente.nome}
                          idDaCob={cliente.id}
                          valor={cliente.cpf}
                        />
                      )
                    )
                  )
                }
              />
              <ClientArea
                titleClientArea={"Clientes em dia"}
                amountClient={
                  !homeClients ? "0" : homeClients.clientesEmdia.quantidade
                }
                fontColor={"#1FA7AF"}
                backGroundColor={"#EEF6F6"}
                setType={"Em dia"}
                iconClient={<img src={IconClientGreen} alt="Icon Client" />}
                lineTableComponent={
                  !homeClients ? (
                    <span>Sem clientes cadastrados.</span>
                  ) : (
                    homeClients.clientesEmdia.clientes.map((cliente, index) => (
                      <LineTable
                        key={index}
                        cliente={cliente.nome}
                        idDaCob={cliente.id}
                        valor={cliente.cpf}
                      />
                    ))
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
