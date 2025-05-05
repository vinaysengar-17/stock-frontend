import { createContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../api/api"; 
export const TradeContext = createContext();

const TradeProvider = ({ children }) => {
  const [trades, setTrades] = useState([]);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/trades");
      setTrades(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLots = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/lots");
      setLots(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const createTrade = async (tradeData, method = null) => {
    setLoading(true);
    try {
      let url = "/api/trades";
      if (method) {
        url += `?method=${method}`;
      }
      const response = await axios.post(url, tradeData);
      fetchTrades();
      fetchLots();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

 
  const bulkCreateTrades = async (tradesData) => {
    setLoading(true);
    try {
      const buys = tradesData.filter(trade => !trade.method);
      const sells = tradesData.filter(trade => trade.method);
  
      // Group sells by method
      const sellsByMethod = sells.reduce((groups, trade) => {
        if (!groups[trade.method]) groups[trade.method] = [];
        groups[trade.method].push(trade);
        return groups;
      }, {});
  
      // Send buys (no method needed)
      if (buys.length > 0) {
        await api.post('/trades/bulk', { trades: buys });
      }
  
      // Send sells grouped by method
      for (const method in sellsByMethod) {
        const methodTrades = sellsByMethod[method].map(({ method, ...rest }) => rest);
        await api.post('/trades/bulk', {
          trades: methodTrades,
          method, // FIFO or LIFO
        });
      }
  
      fetchTrades();
      fetchLots();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create trades");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    fetchTrades();
    fetchLots();
  }, []);

  return (
    <TradeContext.Provider
      value={{
        trades,
        lots,
        loading,
        error,
        fetchTrades,
        fetchLots,
        createTrade,
        bulkCreateTrades,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
};

export default TradeProvider;
