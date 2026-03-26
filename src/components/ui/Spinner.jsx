const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-4',
}

export default function Spinner({ size = 'md', color = 'text-funac-orange', className = '' }) {
  return (
    <div
      className={`${sizeClasses[size]} ${color} border-current border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Cargando"
    />
  )
}
