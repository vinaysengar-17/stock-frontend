import React, { useState, useContext } from "react";
import { Form, Button, Alert, Spinner, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { TradeContext } from "../context/TradeContext";

const TradeForm = () => {
  const { createTrade, loading } = useContext(TradeContext);
  const [formData, setFormData] = useState({
    stock_name: "",
    quantity: "",
    broker_name: "",
    price: "",
  });
  const [tradeType, setTradeType] = useState("BUY"); // 'BUY' or 'SELL'
  const [method, setMethod] = useState("FIFO");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' && tradeType === 'SELL' ? Math.abs(value) * -1 : value
    }));
  };

  const handleTradeTypeChange = (type) => {
    setTradeType(type);
    // Update quantity to negative if switching to SELL
    if (type === 'SELL') {
      setFormData(prev => ({
        ...prev,
        quantity: prev.quantity ? -Math.abs(prev.quantity) : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        quantity: prev.quantity ? Math.abs(prev.quantity) : ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      // Only pass method for SELL trades
      await createTrade(formData, tradeType === 'SELL' ? method : undefined);
      setSuccess(`Trade ${tradeType.toLowerCase()} created successfully!`);
      setFormData({
        stock_name: "",
        quantity: "",
        broker_name: "",
        price: "",
      });
    } catch (err) {
      setError(`Failed to ${tradeType.toLowerCase()} trade. ${err.message}`);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Trade Type</Form.Label>
        <div>
          <ToggleButtonGroup
            type="radio"
            name="tradeType"
            value={tradeType}
            onChange={handleTradeTypeChange}
          >
            <ToggleButton
              id="tbg-btn-buy"
              value="BUY"
              variant={tradeType === 'BUY' ? 'primary' : 'outline-primary'}
            >
              BUY
            </ToggleButton>
            <ToggleButton
              id="tbg-btn-sell"
              value="SELL"
              variant={tradeType === 'SELL' ? 'danger' : 'outline-danger'}
            >
              SELL
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </Form.Group>

      <Form.Group className="mb-3" controlId="stockName">
        <Form.Label>Stock Name</Form.Label>
        <Form.Control
          type="text"
          name="stock_name"
          value={formData.stock_name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="quantity">
        <Form.Label>Quantity</Form.Label>
        <Form.Control
          type="number"
          name="quantity"
          value={Math.abs(formData.quantity) || ''}
          onChange={handleChange}
          min="1"
          required
        />
        <Form.Text className="text-muted">
          {tradeType === 'SELL' ? 'Quantity will be recorded as negative' : ''}
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="brokerName">
        <Form.Label>Broker Name</Form.Label>
        <Form.Control
          type="text"
          name="broker_name"
          value={formData.broker_name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="price">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          min="0"
          required
        />
      </Form.Group>

      {tradeType === 'SELL' && (
        <Form.Group className="mb-3" controlId="method">
          <Form.Label>Matching Method</Form.Label>
          <Form.Select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="FIFO">FIFO (First In First Out)</option>
            <option value="LIFO">LIFO (Last In First Out)</option>
          </Form.Select>
        </Form.Group>
      )}

      <Button type="submit" variant={tradeType === 'SELL' ? 'danger' : 'primary'} disabled={loading}>
        {loading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          `${tradeType} Stock`
        )}
      </Button>
    </Form>
  );
};

export default TradeForm;