import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Trades from './pages/Trades';
import Lots from './pages/Lots';
import CreateTrade from './pages/CreateTrade';
import BulkTrade from './pages/BulkTrade';

const App = () => {
  return (
    <>
      <NavigationBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trades" element={<Trades />} />
          <Route path="/lots" element={<Lots />} />
          <Route path="/create-trade" element={<CreateTrade />} />
          <Route path="/bulk-trade" element={<BulkTrade />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
