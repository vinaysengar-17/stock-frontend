// src/components/BulkTradeForm.js
import React, { useState, useContext } from "react";
import { 
  Form, 
  Button, 
  Alert, 
  Spinner, 
  Row, 
  Col, 
  ToggleButtonGroup, 
  ToggleButton,
  Badge
} from "react-bootstrap";
import { TradeContext } from "../context/TradeContext";
import { FaPlus, FaMinus, FaExchangeAlt } from "react-icons/fa";

const BulkTradeForm = () => {
  const { bulkCreateTrades, loading } = useContext(TradeContext);
  const [trades, setTrades] = useState([
    {
      stock_name: "",
      quantity: 1,
      broker_name: "",
      price: "",
      tradeType: "BUY", // 'BUY' or 'SELL'
      method: "FIFO"    // Only used for SELL
    },
  ]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleTradeChange = (index, e) => {
    const { name, value } = e.target;
    const newTrades = [...trades];
    
    if (name === 'quantity') {
      newTrades[index] = {
        ...newTrades[index],
        quantity: newTrades[index].tradeType === 'SELL' 
          ? -Math.abs(value) 
          : Math.abs(value)
      };
    } else {
      newTrades[index] = {
        ...newTrades[index],
        [name]: value
      };
    }
    
    setTrades(newTrades);
  };

  const handleTradeTypeChange = (index, type) => {
    const newTrades = [...trades];
    newTrades[index] = {
      ...newTrades[index],
      tradeType: type,
      quantity: type === 'SELL' 
        ? -Math.abs(newTrades[index].quantity)
        : Math.abs(newTrades[index].quantity)
    };
    setTrades(newTrades);
  };

  const handleMethodChange = (index, method) => {
    const newTrades = [...trades];
    newTrades[index] = {
      ...newTrades[index],
      method
    };
    setTrades(newTrades);
  };

  const addTrade = () => {
    setTrades([
      ...trades,
      {
        stock_name: "",
        quantity: 1,
        broker_name: "",
        price: "",
        tradeType: "BUY",
        method: "FIFO"
      },
    ]);
  };

  const removeTrade = (index) => {
    if (trades.length === 1) return;
    const newTrades = [...trades];
    newTrades.splice(index, 1);
    setTrades(newTrades);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validate all trades
    const isValid = trades.every(trade => 
      trade.stock_name && 
      trade.quantity && 
      trade.broker_name && 
      trade.price
    );
    
    if (!isValid) {
      setError("Please fill all fields in all trade forms");
      return;
    }

    try {
      // Prepare trades for submission
      const tradesToSubmit = trades.map(trade => ({
        stock_name: trade.stock_name,
        quantity: trade.quantity,
        broker_name: trade.broker_name,
        price: trade.price,
        method: trade.tradeType === 'SELL' ? trade.method : undefined
      }));

      await bulkCreateTrades(tradesToSubmit);
      
      const buyCount = trades.filter(t => t.tradeType === 'BUY').length;
      const sellCount = trades.filter(t => t.tradeType === 'SELL').length;
      
      setSuccess(
        `Successfully submitted ${trades.length} trades: ` +
        `${buyCount} BUY and ${sellCount} SELL`
      );
      
      // Reset form
      setTrades([{
        stock_name: "",
        quantity: 1,
        broker_name: "",
        price: "",
        tradeType: "BUY",
        method: "FIFO"
      }]);
    } catch (err) {
      setError(`Failed to submit bulk trades: ${err.message}`);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {trades.map((trade, index) => (
        <div key={index} className="mb-4 p-3 border rounded">
          <Row className="mb-2 align-items-center">
            <Col xs={8}>
              <h5>
                Trade #{index + 1} 
                <Badge 
                  bg={trade.tradeType === 'BUY' ? 'primary' : 'danger'} 
                  className="ms-2"
                >
                  {trade.tradeType}
                </Badge>
              </h5>
            </Col>
            <Col xs={4} className="text-end">
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeTrade(index)}
                disabled={trades.length === 1}
                className="me-2"
              >
                <FaMinus />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleTradeTypeChange(
                  index, 
                  trade.tradeType === 'BUY' ? 'SELL' : 'BUY'
                )}
                title="Toggle Buy/Sell"
              >
                <FaExchangeAlt />
              </Button>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId={`stockName-${index}`}>
            <Form.Label>Stock Name</Form.Label>
            <Form.Control
              type="text"
              name="stock_name"
              value={trade.stock_name}
              onChange={(e) => handleTradeChange(index, e)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId={`quantity-${index}`}>
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={Math.abs(trade.quantity)}
              onChange={(e) => handleTradeChange(index, e)}
              min="1"
              required
            />
            <Form.Text className="text-muted">
              {trade.tradeType === 'SELL' 
                ? 'Quantity will be recorded as negative' 
                : ''}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId={`brokerName-${index}`}>
            <Form.Label>Broker Name</Form.Label>
            <Form.Control
              type="text"
              name="broker_name"
              value={trade.broker_name}
              onChange={(e) => handleTradeChange(index, e)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId={`price-${index}`}>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={trade.price}
              onChange={(e) => handleTradeChange(index, e)}
              step="0.01"
              min="0"
              required
            />
          </Form.Group>

          {trade.tradeType === 'SELL' && (
            <Form.Group className="mb-3" controlId={`method-${index}`}>
              <Form.Label>Matching Method</Form.Label>
              <Form.Select 
                value={trade.method}
                onChange={(e) => handleMethodChange(index, e.target.value)}
              >
                <option value="FIFO">FIFO (First In First Out)</option>
                <option value="LIFO">LIFO (Last In First Out)</option>
              </Form.Select>
            </Form.Group>
          )}
        </div>
      ))}

      <div className="d-flex justify-content-between mt-4">
        <Button 
          variant="primary" 
          onClick={addTrade}
          className="me-2"
        >
          <FaPlus /> Add Another Trade
        </Button>
        <Button 
          type="submit" 
          variant="success" 
          disabled={loading}
        >
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            `Submit All Trades (${trades.length})`
          )}
        </Button>
      </div>

      <div className="mt-3 text-muted">
        <small>
          <strong>Note:</strong> Each trade can be individually set as BUY or SELL. 
          SELL trades require method selection (FIFO/LIFO).
        </small>
      </div>
    </Form>
  );
};

export default BulkTradeForm;

