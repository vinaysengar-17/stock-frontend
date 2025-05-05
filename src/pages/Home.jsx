import React from 'react';
import { Card } from 'react-bootstrap';

const Home = () => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Welcome to Stock Trading App</Card.Title>
        <Card.Text>
          Use the navigation bar to view trades, lots, or to create a new trade.
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Home;
