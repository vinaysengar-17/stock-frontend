import React, { useContext } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import { TradeContext } from '../context/TradeContext';

const TradeList = () => {
  const { trades, loading, error } = useContext(TradeContext);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Stock Name</th>
          <th>Quantity</th>
          <th>Broker Name</th>
          <th>Price</th>
          <th>Amount</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {trades.map((trade) => (
          <tr key={trade._id}>
            <td>{trade.stock_name}</td>
            <td>{trade.quantity}</td>
            <td>{trade.broker_name}</td>
            <td>{trade.price}</td>
            <td>{trade.amount}</td>
            <td>{new Date(trade.timestamp).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TradeList;
