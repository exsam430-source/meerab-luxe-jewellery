import { SITE_URL, STORE_NAME } from './constants.js'

// ✅ JewelryStore Schema
export const getJewelryStoreSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'JewelryStore',
  name: STORE_NAME,
  alternateName: 'MeerabLuxe Jewellers',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/og-image.jpg`,
  description: `Premium gold jewellery shop in Sarafa Bazaar, Mingora Swat, Pakistan`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Sarafa Bazaar, Haji Baba Chowk',
    addressLocality: 'Mingora, Swat',
    addressCountry: 'PK',
  },
  telephone: '+923454777588',
  openingHours: 'Mo-Sa 09:00-21:00',
  priceRange: 'Rs.500 - Rs.50,000',
  paymentAccepted: 'Cash, EasyPaisa, Bank Transfer',
  currenciesAccepted: 'PKR',
  areaServed: 'Pakistan',
})

// ✅ Product Schema
export const getProductSchema = (product, reviews = []) => {
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images || [],
    brand: { '@type': 'Brand', name: STORE_NAME },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'PKR',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: STORE_NAME },
    },
  }

  if (avgRating && reviews.length > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return schema
}

// ✅ Breadcrumb Schema
export const getBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.url}`,
  })),
})

// ✅ FAQ Schema
export const getFAQSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you deliver all over Pakistan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We deliver all over Pakistan. Free delivery on orders above Rs.3000. Standard delivery charges are Rs.250.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Cash on Delivery (COD) available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Cash on Delivery is available all over Pakistan. You can also pay via Easypaisa or UBL Bank Transfer.',
      },
    },
    {
      '@type': 'Question',
      name: 'How to order on WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Simply click the WhatsApp button on any product page or contact us at +923184887631. Share the product name and your delivery address.",
      },
    },
    {
      '@type': 'Question',
      name: 'Are products real gold?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our products are premium quality gold jewellery. All material details are clearly mentioned on product pages.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the return policy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We accept returns within 7 days of delivery for defective or wrong items. Contact us via WhatsApp to initiate a return.',
      },
    },
  ],
})

// ✅ ItemList Schema for collections
export const getItemListSchema = (products, listName, url) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: listName,
  url: `${SITE_URL}${url}`,
  numberOfItems: products.length,
  itemListElement: products.slice(0, 10).map((product, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${SITE_URL}/product/${product._id || product.id}`,
    name: product.name,
  })),
})