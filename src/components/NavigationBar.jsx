import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom"; // Use Link from react-router-dom

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Link to="/" className="navbar-brand">
          Stock Trading App
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Link to="/trades" className="nav-link">
              Trades
            </Link>
            <Link to="/lots" className="nav-link">
              Lots
            </Link>
            <Link to="/create-trade" className="nav-link">
              Create Trade
            </Link>
            <Link to="/bulk-trade" className="nav-link">
              Bulk Trade
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
