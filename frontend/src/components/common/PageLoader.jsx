const PageLoader = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          border: '3px solid #3d3d3d',
          borderTopColor: '#d4af37',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p
        style={{
          color: '#d4af37',
          fontFamily: "'Playfair Display', serif",
          fontSize: '16px',
          letterSpacing: '2px',
        }}
      >
        MEERAB LUXE JEWELLERS
      </p>
    </div>
  )
}

export default PageLoader