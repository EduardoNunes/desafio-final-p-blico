import axios from "axios";

const api = axios.create({
  baseURL: "https://bugbusters.cyclic.app",
  timeout: 10000,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "X-Requested-With": "XMLHttpRequest",
  },
});

export default api;
