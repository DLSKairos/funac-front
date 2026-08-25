const variantMap = {
  // Volunteer statuses
  nuevo: 'bg-primary/10 text-primary',
  contactado: 'bg-yellow-100 text-yellow-700',
  aprobado: 'bg-green-100 text-green-700',
  rechazado: 'bg-red-100 text-red-700',
  // Donation statuses
  exitosa: 'bg-green-100 text-green-700',
  pendiente: 'bg-yellow-100 text-yellow-700',
  fallida: 'bg-red-100 text-red-700',
  // Generic
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-primary/10 text-primary',
  default: 'bg-gray-100 text-gray-700',
}

const labelMap = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  exitosa: 'Exitosa',
  pendiente: 'Pendiente',
  fallida: 'Fallida',
}

export default function Badge({ variant = 'default', label, className = '' }) {
  const classes = variantMap[variant] || variantMap.default
  const displayLabel = label || labelMap[variant] || variant

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes} ${className}`}
    >
      {displayLabel}
    </span>
  )
}
