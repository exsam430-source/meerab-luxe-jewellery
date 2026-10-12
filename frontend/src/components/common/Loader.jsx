const Loader = ({ size = 'md', center = false }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  }

  const spinner = (
    <div
      className={`${sizes[size]} rounded-full border-[#3d3d3d] border-t-[#d4af37] animate-spin`}
      style={{ borderTopColor: '#d4af37', borderColor: '#3d3d3d' }}
    />
  )

  if (center) {
    return (
      <div className="flex items-center justify-center w-full py-12">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default Loader