import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const Input = forwardRef(function Input(
  { label, error, icon: Icon, type = 'text', className = '', id, ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={16} className="text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={`
            w-full rounded-lg border px-4 py-2.5 text-sm transition-colors
            focus:outline-none focus:ring-2 focus:ring-funac-orange focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${Icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-10' : ''}
            ${error ? 'border-funac-red bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-funac-red">{error}</p>}
    </div>
  )
})

export default Input
