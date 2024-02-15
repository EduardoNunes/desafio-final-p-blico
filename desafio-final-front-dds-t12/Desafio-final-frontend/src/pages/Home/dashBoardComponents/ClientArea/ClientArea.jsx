import "./client-area.css";
import { Link, useNavigate } from "react-router-dom";
import { getItem } from "../../../../utils/storage";
import { useMenuSideBarColor } from "../../../../context/MenuSideBarColorContext";
import api from "../../../../services/api";
import { useChargesContext } from "../../../../context/ChargesContext";

export default function ClientArea({
  titleClientArea,
  amountClient,
  fontColor,
  backGroundColor,
  iconClient,
  lineTableComponent,
  setType,
}) {
  const { setFilter, setDataFilter } = useMenuSideBarColor();
  const { setFilterType } = useChargesContext();
  const token = getItem("token");
  const navigate = useNavigate();

  async function hadleClickFilterClient(setType) {
    setFilterType(setType);
    try {
      const response = await api.get(`/consultClient?status=${setType}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFilter(true);
      setDataFilter(response.data);
      navigate("/client");
    } catch (error) {
      console.error(`erro na requisicao da api ${error.message}`);
    }
  }

  return (
    <div className="client-area">
      <div className="title">
        <div className="left">
          {iconClient}
          <h2>{titleClientArea}</h2>
        </div>
        <div
          className="p"
          style={{ color: fontColor, backgroundColor: backGroundColor }}
        >
          {amountClient}
        </div>
      </div>
      <div className="information">
        <h3>Clientes</h3>
        <h3>ID do clie.</h3>
        <h3>CPF</h3>
      </div>
      <div className="transation">
        <div className="p">{lineTableComponent}</div>
      </div>
      <div className="link">
        <Link onClick={() => hadleClickFilterClient(setType)}>Ver Todos</Link>
      </div>
    </div>
  );
}
