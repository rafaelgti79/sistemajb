import axios from "axios";

const api = axios.create({
  baseURL: "https://www.cxlotto.app/apiTotem"
});

export default api;
