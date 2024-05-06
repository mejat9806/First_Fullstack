import axios from "axios";

export const axiosApi = axios.create({
  baseURL: "https://127.0.0.1:4000/api/v1/",
  withCredentials: true,
});
