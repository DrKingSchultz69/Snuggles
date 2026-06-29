import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Policy from './pages/Policy';
import CheckoutPending from './pages/CheckoutPending';
import Empty from './components/Empty';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/checkout" element={<CheckoutPending />} />
        
        {/* Fallback routes */}
        <Route path="/account" element={<Empty />} />
        <Route path="/wishlist" element={<Empty />} />
        <Route path="*" element={<Empty />} />
      </Routes>
    </Layout>
  );
}

export default App;
