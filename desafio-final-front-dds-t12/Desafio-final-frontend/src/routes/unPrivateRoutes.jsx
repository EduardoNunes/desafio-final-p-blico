import { Navigate } from "react-router-dom";
import { getItem } from "../utils/storage";

export function UnPrivateRoutes({ children }) {
  const token = getItem("token");
  return !token ? children : <Navigate to="/home" />;
}
