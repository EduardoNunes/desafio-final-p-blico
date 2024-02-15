import { Navigate } from "react-router-dom";
import { getItem } from "../utils/storage";

export function PrivateRoutes({ children }) {
  const token = getItem("token");
  return token ? children : <Navigate to="/" />;
}
