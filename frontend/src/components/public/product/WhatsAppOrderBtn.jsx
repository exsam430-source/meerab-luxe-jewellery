import { FaWhatsapp } from 'react-icons/fa'
import { createProductWhatsAppLink } from '../../../utils/whatsappLink.js'
import useSettings from '../../../hooks/useSettings.js'

const WhatsAppOrderBtn = ({ product, fullWidth = false, size = 'md' }) => {
  const { settings } = useSettings()

  const whatsappLink = createProductWhatsAppLink(
    product,
    settings?.whatsappNumber
  )

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-3.5 text-base',
  }

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`whatsapp-btn flex items-center justify-center gap-2 rounded-lg font-semibold transition-all ${sizes[size]} ${fullWidth ? 'w-full' : ''}`}
    >
      <FaWhatsapp size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />
      Order on WhatsApp
    </a>
  )
}

export default WhatsAppOrderBtn