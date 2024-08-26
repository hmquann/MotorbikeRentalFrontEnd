import axios from "axios";

const apiClient = axios.create({
  //baseURL: "https://mimotorbe-htccgvbqdzb6h2em.eastus2-01.azurewebsites.net",
  baseURL: "http://localhost:8080",
});

export default apiClient;
