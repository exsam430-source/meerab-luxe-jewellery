import { Link } from 'react-router-dom'

const FooterLinks = ({ title, links }) => {
  return (
    <div>
      <h4
        className="font-semibold text-white mb-4 pb-2 border-b"
        style={{
          borderColor: '#3d3d3d',
          fontSize: '13px',
          letterSpacing: '1.5px',
        }}
      >
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.path || link.label}>
            {link.path ? (
              <Link
                to={link.path}
                className="text-sm text-[#a0a0a0] hover:text-[#d4af37] transition-colors duration-200 flex items-center gap-2 group"
              >
                <span
                  className="w-1 h-1 rounded-full flex-shrink-0 transition-colors duration-200 group-hover:bg-[#d4af37]"
                  style={{ background: '#3d3d3d' }}
                />
                {link.label}
              </Link>
            ) : link.href ? (
              <a
                href={link.href}
                target={link.external ? '_blank' : '_self'}
                rel={link.external ? 'noopener noreferrer' : ''}
                className="text-sm text-[#a0a0a0] hover:text-[#d4af37] transition-colors duration-200 flex items-center gap-2 group"
              >
                <span
                  className="w-1 h-1 rounded-full flex-shrink-0 transition-colors duration-200 group-hover:bg-[#d4af37]"
                  style={{ background: '#3d3d3d' }}
                />
                {link.label}
              </a>
            ) : (
              <span className="text-sm text-[#6b7280] flex items-center gap-2">
                <span
                  className="w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: '#3d3d3d' }}
                />
                {link.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FooterLinks