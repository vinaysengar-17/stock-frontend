// src/pages/BulkTrade.js
import React from 'react';
import BulkTradeForm from '../components/BulkTradeForm';

const BulkTrade = () => {
  return (
    <div>
      <h2>Bulk Create Trades</h2>
      <p className="text-muted">Add multiple trades at once</p>
      <BulkTradeForm />
    </div>
  );
};

export default BulkTrade;