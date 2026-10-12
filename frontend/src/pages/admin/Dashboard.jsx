import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiShoppingBag, FiUsers, FiPackage,
  FiTrendingUp, FiEye, FiArrowRight,
  FiRefreshCw, FiDollarSign,
} from 'react-icons/fi'
import StatsCard from '../../components/admin/StatsCard.jsx'
import OrderStatusBadge from '../../components/admin/OrderStatusBadge.jsx'
import { analyticsApi } from '../../api/analyticsApi.js'
import { orderApi } from '../../api/orderApi.js'
import { productApi } from '../../api/productApi.js'
import { formatPrice, formatDate } from '../../utils/helpers.js'
import Loader from '../../components/common/Loader.jsx'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    visitors: 0,
    views: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const [
        ordersRes,
        usersRes,
        productsRes,
        visitorsRes,
        overallRes,
      ] = await Promise.allSettled([
        orderApi.getAll(),
        analyticsApi.getTotalUsers(),
        productApi.getAll(),
        analyticsApi.getVisitors('7d'),
        analyticsApi.getOverallStats(),
      ])

      // Orders
      let orders = []
      let revenue = 0
      if (ordersRes.status === 'fulfilled' && ordersRes.value.data.success) {
        orders = ordersRes.value.data.orders || []
        revenue = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0)
        setRecentOrders(orders.slice(0, 8))
      }

      // Users
      let users = 0
      if (usersRes.status === 'fulfilled' && usersRes.value.data.success) {
        users = usersRes.value.data.totalUsers || 0
      }

      // Products
      let products = []
      if (productsRes.status === 'fulfilled' && productsRes.value.data.success) {
        products = productsRes.value.data.products || []
        const lowStock = products.filter(
          p => p.stockQuantity <= 5 && p.inStock
        )
        setLowStockProducts(lowStock.slice(0, 5))
      }

      // Visitors
      let visitors = 0
      if (visitorsRes.status === 'fulfilled' && visitorsRes.value.data.success) {
        visitors = visitorsRes.value.data.uniqueVisitors || 0
      }

      // Views
      let views = 0
      if (overallRes.status === 'fulfilled' && overallRes.value.data.success) {
        views = overallRes.value.data.views || 0
      }

      setStats({
        totalOrders: orders.length,
        totalUsers: users,
        totalProducts: products.length,
        totalRevenue: revenue,
        visitors,
        views,
      })
    } catch (error) {
      console.error('Dashboard load error:', error)
    } finally {
      setLoading(false)
    }
  }

  const STAT_CARDS = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: FiShoppingBag,
      color: '#d4af37',
      link: '/admin/orders',
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: FiDollarSign,
      color: '#10b981',
      prefix: '',
    },
    {
      title: 'Customers',
      value: stats.totalUsers,
      icon: FiUsers,
      color: '#3b82f6',
      link: '',
    },
    {
      title: 'Products',
      value: stats.totalProducts,
      icon: FiPackage,
      color: '#8b5cf6',
      link: '/admin/products',
    },
    {
      title: 'Visitors (7d)',
      value: stats.visitors,
      icon: FiEye,
      color: '#f59e0b',
    },
    {
      title: 'Product Views',
      value: stats.views,
      icon: FiTrendingUp,
      color: '#ec4899',
    },
  ]

  return (
    <div className="space-y-6">
      {/* ✅ Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-playfair font-bold text-white"
            style={{ fontSize: 'clamp(20px, 3vw, 28px)' }}
          >
            Dashboard
          </h1>
          <p className="text-[#6b7280] text-sm mt-0.5">
            Welcome back! Here's what's happening.
          </p>
        </div>
        <button
          onClick={loadDashboard}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
          style={{
            background: '#2d2d2d',
            color: '#a0a0a0',
            border: '1px solid #3d3d3d',
          }}
        >
          <FiRefreshCw
            size={15}
            className={loading ? 'animate-spin' : ''}
          />
          Refresh
        </button>
      </div>

      {/* ✅ Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            {card.link ? (
              <Link to={card.link}>
                <StatsCard
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  color={card.color}
                  loading={loading}
                  prefix={card.prefix}
                />
              </Link>
            ) : (
              <StatsCard
                title={card.title}
                value={card.value}
                icon={card.icon}
                color={card.color}
                loading={loading}
                prefix={card.prefix}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* ✅ Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="card-dark rounded-2xl overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: '#3d3d3d' }}
            >
              <h2 className="font-semibold text-white">Recent Orders</h2>
              <Link
                to="/admin/orders"
                className="flex items-center gap-1 text-xs text-[#d4af37] hover:text-[#f4e5c2] transition-colors"
              >
                View All
                <FiArrowRight size={13} />
              </Link>
            </div>

            {loading ? (
              <div className="p-8">
                <Loader center />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="p-8 text-center text-[#6b7280] text-sm">
                No orders yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => {
                      const id = String(order._id || order.id)
                      return (
                        <tr key={id}>
                          <td>
                            <Link
                              to={`/admin/orders/${id}`}
                              className="text-[#d4af37] hover:text-[#f4e5c2] font-medium transition-colors"
                            >
                              #{id.slice(-6).toUpperCase()}
                            </Link>
                          </td>
                          <td className="font-medium text-white">
                            {formatPrice(order.amount)}
                          </td>
                          <td>
                            <span className="text-xs">
                              {order.paymentMethod}
                            </span>
                          </td>
                          <td>
                            <OrderStatusBadge status={order.status} />
                          </td>
                          <td className="text-[#6b7280] text-xs">
                            {formatDate(order.date)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions + Low Stock */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="card-dark rounded-2xl p-5">
            <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                {
                  label: '+ Add New Product',
                  path: '/admin/products/add',
                  color: '#d4af37',
                  bg: 'rgba(212,175,55,0.1)',
                },
                {
                  label: '📦 Manage Orders',
                  path: '/admin/orders',
                  color: '#3b82f6',
                  bg: 'rgba(59,130,246,0.1)',
                },
                {
                  label: '🔄 View Returns',
                  path: '/admin/returns',
                  color: '#10b981',
                  bg: 'rgba(16,185,129,0.1)',
                },
                {
                  label: '💍 Custom Orders',
                  path: '/admin/custom-orders',
                  color: '#8b5cf6',
                  bg: 'rgba(139,92,246,0.1)',
                },
                {
                  label: '⚙️ Settings',
                  path: '/admin/settings',
                  color: '#f59e0b',
                  bg: 'rgba(245,158,11,0.1)',
                },
              ].map(action => (
                <Link
                  key={action.path}
                  to={action.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: action.bg,
                    color: action.color,
                    border: `1px solid ${action.color}20`,
                  }}
                  onMouseEnter={e =>
                    e.currentTarget.style.background = action.bg.replace('0.1', '0.2')
                  }
                  onMouseLeave={e =>
                    e.currentTarget.style.background = action.bg
                  }
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Low Stock */}
          {lowStockProducts.length > 0 && (
            <div className="card-dark rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
                ⚠️ Low Stock
              </h2>
              <div className="space-y-2">
                {lowStockProducts.map(p => (
                  <Link
                    key={p._id || p.id}
                    to={`/admin/products/edit/${p._id || p.id}`}
                    className="flex items-center justify-between py-2 text-sm hover:bg-[#2d2d2d] rounded-lg px-2 transition-colors"
                  >
                    <span className="text-[#e5e5e5] truncate pr-2">
                      {p.name}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                      style={{
                        background: p.stockQuantity === 0
                          ? 'rgba(239,68,68,0.1)'
                          : 'rgba(245,158,11,0.1)',
                        color: p.stockQuantity === 0 ? '#ef4444' : '#f59e0b',
                      }}
                    >
                      {p.stockQuantity} left
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard