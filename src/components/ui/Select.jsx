import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(function Select(
  { label, error, options = [], className = '', id, placeholder, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-lg border px-4 py-2.5 text-sm appearance-none cursor-pointer transition-colors
            focus:outline-none focus:ring-2 focus:ring-funac-orange focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-funac-red bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-funac-red">{error}</p>}
    </div>
  )
})

export default Select
