import { Helmet } from 'react-helmet-async'
import { SITE_URL, STORE_NAME } from '../../utils/constants.js'

const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonical,
  structuredData,
  noIndex = false,
}) => {
  const fullTitle = title
    ? title.includes(STORE_NAME) ? title : `${title} | ${STORE_NAME}`
    : `${STORE_NAME} | Premium Gold Jewellery Pakistan`

  const pageUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL
  const imageUrl = ogImage || `${SITE_URL}/og-image.jpg`

  return (
    <Helmet>
      {/* ✅ Basic */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={pageUrl} />

      {/* ✅ Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={STORE_NAME} />
      <meta property="og:locale" content="en_PK" />

      {/* ✅ Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={imageUrl} />

      {/* ✅ JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}

export default SEO