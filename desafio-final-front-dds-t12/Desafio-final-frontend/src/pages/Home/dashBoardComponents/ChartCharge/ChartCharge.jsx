import "./chart-charge.css";
import { Link, useNavigate } from "react-router-dom";
import { useMenuSideBarColor } from "../../../../context/MenuSideBarColorContext";
import { getItem } from "../../../../utils/storage";
import api from "../../../../services/api";
import { useChargesContext } from "../../../../context/ChargesContext";

export default function ChartCharge({
  titleCharge,
  amountCharge,
  fontColor,
  backGroundColor,
  lineTableComponent,
  setType,
}) {
  const { setFilter, setDataFilter } = useMenuSideBarColor();
  const { setOrderDataFilter, setFilterType } = useChargesContext();
  const token = getItem("token");
  const navigate = useNavigate();

  async function handleClickPaidsCharges(setType) {
    setFilterType(setType);
    try {
      const response = await api.get(`/allCharges?status=${setType}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("cobranças filtradas", response.data);

      setFilter(true);
      setDataFilter(response.data);
      setOrderDataFilter(response.data);
      navigate("/charges");
    } catch (error) {
      console.error(`erro na requisicao da api ${error.message}`);
    }
  }

  return (
    <div className="container-chart-charge">
      <div className="title">
        <h2>{titleCharge}</h2>
        <div
          className="p"
          style={{ color: fontColor, backgroundColor: backGroundColor }}
        >
          {amountCharge}
        </div>
      </div>
      <div className="information">
        <h3>Cliente</h3>
        <h3>ID da cob.</h3>
        <h3>Valor</h3>
      </div>
      <div className="transation">
        <div className="p">{lineTableComponent}</div>
      </div>
      <div className="link">
        <Link onClick={() => handleClickPaidsCharges(setType)}>Ver Todos</Link>
      </div>
    </div>
  );
}
