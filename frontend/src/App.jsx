import React from 'react'
import { BrowserRouter as Router, Routes, Route , Navigate } from 'react-router-dom';
import Menu from './pages/Menu';
import Cart from './pages/Cart.jsx';
import Order from './pages/Order.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/menu" />} />
        <Route path="/menu/cart" element={<Cart />}/>
        <Route path="/menu" element={<Menu />}/>
        <Route path="/menu/cart/order" element={<Order />}/>
      </Routes>
    </Router>
  )
}

export default App