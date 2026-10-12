import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import ScrollToTop from './components/common/ScrollToTop.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import PageLoader from './components/common/PageLoader.jsx'

// Public Pages
const Home             = lazy(() => import('./pages/public/Home.jsx'))
const Shop             = lazy(() => import('./pages/public/Shop.jsx'))
const ProductDetail    = lazy(() => import('./pages/public/ProductDetail.jsx'))
const CategoryProducts = lazy(() => import('./pages/public/CategoryProducts.jsx'))
const Cart             = lazy(() => import('./pages/public/Cart.jsx'))
const Checkout         = lazy(() => import('./pages/public/Checkout.jsx'))
const OrderSuccess     = lazy(() => import('./pages/public/OrderSuccess.jsx'))
const OrderTrack       = lazy(() => import('./pages/public/OrderTrack.jsx'))  
const CustomOrder      = lazy(() => import('./pages/public/CustomOrder.jsx'))
const About            = lazy(() => import('./pages/public/About.jsx'))
const Login            = lazy(() => import('./pages/public/Login.jsx'))
const NotFound         = lazy(() => import('./pages/public/NotFound.jsx'))
// ✅ NEW
const VerifyEmail      = lazy(() => import('./pages/public/VerifyEmail.jsx'))
const ResetPassword    = lazy(() => import('./pages/public/ResetPassword.jsx'))

// Collection Pages
const NecklacesPage      = lazy(() => import('./pages/public/collections/NecklacesPage.jsx'))
const BanglesPage        = lazy(() => import('./pages/public/collections/BanglesPage.jsx'))
const UnderThousandPage  = lazy(() => import('./pages/public/collections/UnderThousandPage.jsx'))
const KundanPage         = lazy(() => import('./pages/public/collections/KundanPage.jsx'))
const BridalSetPage      = lazy(() => import('./pages/public/collections/BridalSetPage.jsx'))
const PartyJewelleryPage = lazy(() => import('./pages/public/collections/PartyJewelleryPage.jsx'))
const GoldJewelleryPage = lazy(() =>
  import('./pages/public/collections/GoldJewelleryPage.jsx')
)

// Admin Pages
const AdminLogin      = lazy(() => import('./pages/admin/AdminLogin.jsx'))
const Dashboard       = lazy(() => import('./pages/admin/Dashboard.jsx'))
const ProductList     = lazy(() => import('./pages/admin/products/ProductList.jsx'))
const AddProduct      = lazy(() => import('./pages/admin/products/AddProduct.jsx'))
const EditProduct     = lazy(() => import('./pages/admin/products/EditProduct.jsx'))
const OrderList       = lazy(() => import('./pages/admin/orders/OrderList.jsx'))
const OrderDetail     = lazy(() => import('./pages/admin/orders/OrderDetail.jsx'))
const CustomOrderList = lazy(() => import('./pages/admin/orders/CustomOrderList.jsx'))
const ReturnList      = lazy(() => import('./pages/admin/orders/ReturnList.jsx'))
const ReviewList      = lazy(() => import('./pages/admin/reviews/ReviewList.jsx'))
const StoreSettings   = lazy(() => import('./pages/admin/settings/StoreSettings.jsx'))
const GoldPriceManager = lazy(() => import('./pages/admin/GoldPrice/GoldPriceManager'))

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>

              {/* PUBLIC ROUTES */}
              <Route element={<PublicLayout />}>
                <Route path="/"                   element={<Home />} />
                <Route path="/shop"               element={<Shop />} />
                <Route path="/product/:id"        element={<ProductDetail />} />
                <Route path="/category/:category" element={<CategoryProducts />} />

                {/* Collection Routes */}
                <Route path="/collections/necklaces"       element={<NecklacesPage />} />
                <Route path="/collections/bangles"         element={<BanglesPage />} />
                <Route path="/collections/under-1000"      element={<UnderThousandPage />} />
                <Route path="/collections/kundan"          element={<KundanPage />} />
                <Route path="/collections/bridal-set"      element={<BridalSetPage />} />
                <Route path="/collections/party-jewellery" element={<PartyJewelleryPage />} />
                <Route path="/collections/gold-jewellery"  element={<GoldJewelleryPage />} />
                {/* Cart & Checkout */}
                <Route path="/cart"                   element={<Cart />} />
                <Route path="/checkout"               element={<Checkout />} />
                <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                <Route path="/track-order"            element={<OrderTrack />} />

                {/* Info Pages */}
                <Route path="/custom-order" element={<CustomOrder />} />
                <Route path="/about"        element={<About />} />
                <Route path="/login"        element={<Login />} />
              </Route>

              {/* ✅ Auth Pages - Outside PublicLayout (no navbar/footer) */}
              <Route path="/verify-email"   element={<VerifyEmail />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* ADMIN LOGIN */}
              <Route
                path="/admin/login"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <AdminLogin />
                  </Suspense>
                }
              />

              {/* ADMIN PROTECTED ROUTES */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard"         element={<Dashboard />} />
                <Route path="products"          element={<ProductList />} />
                <Route path="products/add"      element={<AddProduct />} />
                <Route path="products/edit/:id" element={<EditProduct />} />
                <Route path="orders"            element={<OrderList />} />
                <Route path="orders/:id"        element={<OrderDetail />} />
                <Route path="custom-orders"     element={<CustomOrderList />} />
                <Route path="returns"           element={<ReturnList />} />
                <Route path="reviews"           element={<ReviewList />} />
                <Route path="settings"          element={<StoreSettings />} />
                <Route path="gold-price"        element={<GoldPriceManager />} />
              </Route>

              {/* 404 */}
              <Route
                path="*"
                element={
                  <PublicLayout>
                    <NotFound />
                  </PublicLayout>
                }
              />

            </Routes>
          </Suspense>
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  )
}