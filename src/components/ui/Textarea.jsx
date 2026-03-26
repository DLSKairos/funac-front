import { forwardRef } from 'react'

const Textarea = forwardRef(function Textarea(
  { label, error, className = '', rows = 4, id, ...props },
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
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={`
          w-full rounded-lg border px-4 py-2.5 text-sm transition-colors resize-none
          focus:outline-none focus:ring-2 focus:ring-funac-orange focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-funac-red bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-funac-red">{error}</p>}
    </div>
  )
})

export default Textarea
