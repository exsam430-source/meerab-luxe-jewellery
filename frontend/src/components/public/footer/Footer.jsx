import { Link } from 'react-router-dom'
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa'
import {
  FiMapPin, FiPhone, FiMail,
  FiClock, FiShield, FiTruck,
} from 'react-icons/fi'
import { WHATSAPP_NUMBER } from '../../../utils/constants.js'
import NewsletterSection from '../home/NewsletterSection.jsx'

const Footer = () => {
  const year = new Date().getFullYear()

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Assalamu Alaikum! I have a query about your jewellery.")}`

  return (
    <footer style={{ background: '#111111', borderTop: '1px solid #2d2d2d' }}>

      {/* ✅ Newsletter */}
      <NewsletterSection />

      {/* ✅ Trust Bar */}
      <div
        className="border-y"
        style={{ borderColor: '#2d2d2d', background: '#161616' }}
      >
        <div className="container-custom py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: FiTruck,    label: 'Free Delivery',    desc: 'Above Rs.3000' },
              { icon: FiShield,   label: 'Secure Payment',   desc: 'Easypaisa & Bank' },
              { icon: FiClock,    label: 'Fast Dispatch',    desc: '1-2 Business Days' },
              { icon: FaWhatsapp, label: 'WhatsApp Support', desc: '9AM - 9PM Daily' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(212,175,55,0.1)' }}
                  >
                    <Icon size={18} style={{ color: '#d4af37' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.label}
                    </p>
                    <p className="text-xs text-[#a0a0a0]">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ✅ Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h3
                className="font-playfair font-bold gold-gradient-text mb-1"
                style={{ fontSize: '20px', letterSpacing: '1px' }}
              >
                MeerabLuxe Jewellers
              </h3>
              <p
                className="font-cormorant text-[#a0a0a0]"
                style={{ fontSize: '12px', letterSpacing: '3px' }}
              >
                GOLD SMITH
              </p>
            </div>
            <p className="text-sm text-[#a0a0a0] leading-relaxed mb-5">
              Premium quality gold jewellery from Sarafa Bazaar, Mingora Swat.
              Bringing elegance to every occasion at affordable prices.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                style={{ background: 'rgba(37,211,102,0.1)', color: '#25d366' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,211,102,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(37,211,102,0.1)'}
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,175,55,0.1)'}
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,175,55,0.1)'}
                aria-label="Facebook"
              >
                <FaFacebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="font-semibold text-white mb-4 pb-2 border-b"
              style={{ borderColor: '#3d3d3d', fontSize: '14px', letterSpacing: '1px' }}
            >
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Shop All',     path: '/shop' },
                { label: 'New Arrivals', path: '/shop?sort=newest' },
                { label: 'Best Sellers', path: '/shop?sort=featured' },
                { label: 'About Us',     path: '/about' },
                { label: 'Contact',      path: '/contact' },
                { label: 'Track Order',  path: '/track-order' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-[#a0a0a0] hover:text-[#d4af37] transition-colors flex items-center gap-2 group"
                  >
                    <span
                      className="w-1 h-1 rounded-full transition-colors group-hover:bg-[#d4af37]"
                      style={{ background: '#3d3d3d' }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4
              className="font-semibold text-white mb-4 pb-2 border-b"
              style={{ borderColor: '#3d3d3d', fontSize: '14px', letterSpacing: '1px' }}
            >
              COLLECTIONS
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Necklaces',        path: '/collections/necklaces' },
                { label: 'Bangles',          path: '/collections/bangles' },
                { label: 'Kundan Jewellery', path: '/collections/kundan' },
                { label: 'Under Rs.1000',    path: '/collections/under-1000' },
                { label: 'Ladies Jewellery', path: '/category/Ladies' },
                { label: 'Gents Jewellery',  path: '/category/Gents' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-[#a0a0a0] hover:text-[#d4af37] transition-colors flex items-center gap-2 group"
                  >
                    <span
                      className="w-1 h-1 rounded-full transition-colors group-hover:bg-[#d4af37]"
                      style={{ background: '#3d3d3d' }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              className="font-semibold text-white mb-4 pb-2 border-b"
              style={{ borderColor: '#3d3d3d', fontSize: '14px', letterSpacing: '1px' }}
            >
              CONTACT US
            </h4>
            <ul className="space-y-4">
              <li>
                <div className="flex gap-3">
                  <FiMapPin
                    size={16}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: '#d4af37' }}
                  />
                  <p className="text-sm text-[#a0a0a0] leading-relaxed">
                    Sarafa Bazaar, Haji Baba Chowk,
                    Mingora, Swat, Pakistan
                  </p>
                </div>
              </li>
              <li>
                <a
                  href="tel:+923454777588"
                  className="flex items-center gap-3 text-sm text-[#a0a0a0] hover:text-[#d4af37] transition-colors"
                >
                  <FiPhone size={16} style={{ color: '#d4af37' }} />
                  +92 345 4777588
                </a>
              </li>
              <li>
                <a
                  href="mailto:meerabluxejewellers@gmail.com"
                  className="flex items-center gap-3 text-sm text-[#a0a0a0] hover:text-[#d4af37] transition-colors"
                >
                  <FiMail size={16} style={{ color: '#d4af37' }} />
                  meerabluxejewellers@gmail.com
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-[#25d366] hover:text-[#128c7e] transition-colors"
                >
                  <FaWhatsapp size={16} />
                  WhatsApp Order
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiClock size={16} style={{ color: '#d4af37' }} />
                <p className="text-sm text-[#a0a0a0]">
                  Mon - Sat: 9AM - 9PM
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ✅ Bottom Bar */}
      <div className="border-t" style={{ borderColor: '#2d2d2d' }}>
        <div className="container-custom py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#6b7280] text-center sm:text-left">
              © {year} MeerabLuxe Jewellers. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#6b7280]">
                Made with ❤️ in Pakistan
              </span>
              <div className="flex items-center gap-3">
                {['COD', 'Easypaisa', 'Bank'].map(method => (
                  <span
                    key={method}
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      background: '#2d2d2d',
                      color: '#a0a0a0',
                      border: '1px solid #3d3d3d',
                    }}
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer