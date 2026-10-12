import { SITE_URL, STORE_NAME } from './constants.js'

export const seoData = {
  home: {
    title: `${STORE_NAME} | Premium Gold Jewellery Pakistan`,
    description: `Shop premium gold jewellery at ${STORE_NAME}, Sarafa Bazaar Mingora Swat. Rings, necklaces, bridal sets, bangles, kundan. Free delivery above Rs.3000. Order on WhatsApp.`,
    keywords: 'gold jewellery pakistan, jewellery swat, bridal jewellery pakistan, gold necklaces, kundan jewellery, bangles online pakistan',
    ogImage: `${SITE_URL}/og-image.jpg`,
  },
  shop: {
    title: `Shop All Jewellery | ${STORE_NAME} Pakistan`,
    description: `Browse 100+ jewellery pieces at ${STORE_NAME}. Rings, necklaces, earrings, bangles. Affordable prices. COD available all over Pakistan.`,
    keywords: 'jewellery shop online pakistan, buy jewellery online, gold jewellery online',
    ogImage: `${SITE_URL}/og-image.jpg`,
  },
  necklaces: {
    title: `Gold Necklaces Online Pakistan | ${STORE_NAME}`,
    description: `Shop beautiful gold necklaces online at ${STORE_NAME}. Premium quality at affordable prices. Free delivery above Rs.3000. COD available.`,
    keywords: 'gold necklaces pakistan, necklaces online pakistan, gold necklace set, bridal necklace',
    ogImage: `${SITE_URL}/og-image.jpg`,
  },
  bangles: {
    title: `Gold Bangles & Bracelets | ${STORE_NAME} Pakistan`,
    description: `Explore stunning gold bangles collection at ${STORE_NAME}. Traditional & modern designs from Mingora Swat. Shop online with COD.`,
    keywords: 'gold bangles pakistan, bangles online pakistan, gold bracelets, kangan online',
    ogImage: `${SITE_URL}/og-image.jpg`,
  },
  under1000: {
    title: `Jewellery Under Rs.1000 | ${STORE_NAME} Pakistan`,
    description: `Beautiful affordable jewellery under Rs.1000 at ${STORE_NAME}. Rings, earrings, necklaces. Free delivery available on orders above Rs.3000.`,
    keywords: 'affordable jewellery pakistan, cheap jewellery online, jewellery under 1000',
    ogImage: `${SITE_URL}/og-image.jpg`,
  },
  kundan: {
    title: `Kundan Jewellery Online | ${STORE_NAME} Swat`,
    description: `Authentic kundan jewellery collection at ${STORE_NAME}. Bridal kundan sets, earrings, necklaces. Premium quality Pakistan. Order on WhatsApp.`,
    keywords: 'kundan jewellery pakistan, kundan set online, kundan necklace, bridal kundan',
    ogImage: `${SITE_URL}/og-image.jpg`,
  },
  contact: {
    title: `Contact Us | ${STORE_NAME} Mingora Swat`,
    description: `Contact ${STORE_NAME} in Sarafa Bazaar, Mingora Swat. WhatsApp: +923184887631. We're available Mon-Sat 9AM-9PM.`,
    keywords: 'contact meerabluxe jewellers, jewellery shop swat mingora, meerabluxe contact',
    ogImage: `${SITE_URL}/og-image.jpg`,
  },
  about: {
    title: `About Us | ${STORE_NAME} — Gold Jewellery Pakistan`,
    description: `Learn about ${STORE_NAME} — your trusted gold jewellery store in Sarafa Bazaar, Mingora Swat, Pakistan. Premium quality, affordable prices, fast delivery across Pakistan.`,
    keywords: 'about meerabluxe jewellers, gold jewellery swat, jewellery shop pakistan',
    ogImage: `${SITE_URL}/og-image.jpg`,
  },
}

// ✅ Dynamic product SEO
export const getProductSEO = (product) => ({
  title: `${product.name} | ${STORE_NAME} — Rs.${Number(product.price).toLocaleString()}`,
  description: `${product.description || product.name} Shop online at ${STORE_NAME}. Free delivery above Rs.3000. WhatsApp ordering available.`,
  keywords: `${product.name}, ${product.category}, ${product.subCategory}, jewellery pakistan`,
  ogImage: product.images?.[0] || `${SITE_URL}/og-image.jpg`,
  ogType: 'product',
})