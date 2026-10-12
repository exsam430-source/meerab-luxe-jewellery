import { Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'

const FooterBottom = () => {
  const year = new Date().getFullYear()

  const paymentMethods = [
    { label: 'COD',       color: '#10b981' },
    { label: 'Easypaisa', color: '#7c3aed' },
    { label: 'UBL Bank',  color: '#d4af37' },
    { label: 'WhatsApp',  color: '#25d366' },
  ]

  const bottomLinks = [
    { label: 'Privacy Policy',  path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Return Policy',   path: '/returns' },
  ]

  return (
    <div
      className="border-t"
      style={{ borderColor: '#2d2d2d', background: '#0d0d0d' }}
    >
      <div className="container-custom py-5">

        {/* ✅ Top row - Payment methods */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="text-xs text-[#6b7280] mr-1">
            We Accept:
          </span>
          {paymentMethods.map((method) => (
            <span
              key={method.label}
              className="text-xs px-2.5 py-1 rounded-md font-medium"
              style={{
                background: `${method.color}15`,
                color: method.color,
                border: `1px solid ${method.color}30`,
              }}
            >
              {method.label}
            </span>
          ))}
        </div>

        {/* ✅ Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Copyright */}
          <p className="text-xs text-[#6b7280] text-center sm:text-left flex items-center gap-1 flex-wrap justify-center sm:justify-start">
            © {year} MeerabLuxe Jewellers. All rights reserved.
            <span className="flex items-center gap-1 ml-1">
              Made with
              <FiHeart
                size={12}
                style={{ color: '#ef4444', fill: '#ef4444' }}
              />
              in Pakistan
            </span>
          </p>

          {/* Bottom Links */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {bottomLinks.map((link, i) => (
              <span key={link.path} className="flex items-center gap-4">
                <Link
                  to={link.path}
                  className="text-xs text-[#6b7280] hover:text-[#d4af37] transition-colors duration-200"
                >
                  {link.label}
                </Link>
                {i < bottomLinks.length - 1 && (
                  <span
                    className="w-px h-3"
                    style={{ background: '#3d3d3d' }}
                  />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* ✅ Store Address */}
        <div className="mt-4 pt-4 border-t text-center" style={{ borderColor: '#2d2d2d' }}>
          <p className="text-xs text-[#4a4a4a]">
            📍 Sarafa Bazaar, Haji Baba Chowk, Mingora, Swat, Pakistan
            &nbsp;|&nbsp;
            📞 <a href="tel:+923454777588" className="hover:text-[#6b7280] transition-colors">+92 345 4777588</a>
            &nbsp;|&nbsp;
            ✉️ <a href="mailto:meerabluxejewellers@gmail.com" className="hover:text-[#6b7280] transition-colors">meerabluxejewellers@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default FooterBottom