// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://stock-trading-1-hyhu.onrender.com/", 
});

export default api;
