import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

const typeConfig = {
  success: {
    icon: CheckCircle,
    classes: 'bg-green-50 border-green-200 text-green-800',
    iconClass: 'text-green-500',
  },
  error: {
    icon: AlertCircle,
    classes: 'bg-red-50 border-red-200 text-red-800',
    iconClass: 'text-red-500',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    iconClass: 'text-yellow-500',
  },
  info: {
    icon: Info,
    classes: 'bg-blue-50 border-blue-200 text-blue-800',
    iconClass: 'text-blue-500',
  },
}

export default function Alert({ type = 'info', title, message, onClose, className = '' }) {
  const config = typeConfig[type] || typeConfig.info
  const Icon = config.icon

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${config.classes} ${className}`}
      role="alert"
    >
      <Icon size={18} className={`${config.iconClass} mt-0.5 shrink-0`} />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm">{title}</p>}
        {message && <p className="text-sm mt-0.5 opacity-90">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Cerrar alerta"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
