import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://rentalmotorbikewebapp.azurewebsites.net",
  //baseURL: "http://localhost:8080",
});

export default apiClient;
