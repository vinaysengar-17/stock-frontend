import React, { useContext } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import { TradeContext } from '../context/TradeContext';

const LotList = () => {
  const { lots, loading, error } = useContext(TradeContext);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Stock Name</th>
          <th>Lot Quantity</th>
          <th>Realized Quantity</th>
          <th>Lot Status</th>
          <th>Price</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {lots.map((lot) => (
          <tr key={lot._id}>
            <td>{lot.stock_name}</td>
            <td>{lot.lot_quantity}</td>
            <td>{lot.realized_quantity}</td>
            <td>{lot.lot_status}</td>
            <td>{lot.price}</td>
            <td>{new Date(lot.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default LotList;
