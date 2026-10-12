const ITEMS = [
  '✦ Free Delivery Above Rs.3,000',
  '✦ Premium Gold Jewellery',
  '✦ WhatsApp Ordering Available',
  '✦ Cash on Delivery',
  '✦ Easy Returns within 7 Days',
  '✦ Bridal Sets Available',
  '✦ Kundan & Meena Work',
  '✦ Shop from Swat, Mingora',
]

const MarqueeSection = () => {
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div
      className="overflow-hidden py-3 border-y select-none"
      style={{
        background: 'rgba(212,175,55,0.05)',
        borderColor: 'rgba(212,175,55,0.15)',
      }}
    >
      <div
        className="flex whitespace-nowrap animate-marquee"
        style={{ width: 'max-content' }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-block px-6 text-sm font-medium"
            style={{ color: '#d4af37', fontFamily: "'Cormorant Garamond', serif" }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default MarqueeSection