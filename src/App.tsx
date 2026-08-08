import { Route, Routes } from 'react-router';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Policy from './pages/Policy';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import CheckoutPending from './pages/CheckoutPending';
import Account from './pages/Account';
import Empty from './components/Empty';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/checkout" element={<CheckoutPending />} />
        <Route path="/account" element={<Account />} />

        {/* Fallback routes */}
        <Route path="/wishlist" element={<Empty />} />
        <Route path="*" element={<Empty />} />
      </Routes>
    </Layout>
  );
}

export default App;
