import Spinner from './Spinner'

const variantClasses = {
  primary:
    'bg-funac-orange text-white hover:bg-[#A8461F] shadow-sm',
  secondary:
    'bg-funac-navy text-white hover:bg-blue-900 shadow-md hover:shadow-lg',
  outline:
    'border-2 border-funac-navy text-funac-navy bg-transparent hover:bg-funac-navy hover:text-white',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100',
  danger:
    'bg-funac-red text-white hover:bg-red-600 shadow-md hover:shadow-lg',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon = null,
  children,
  className = '',
  type = 'button',
  ...props
}) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-md
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-funac-orange focus:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" color={variant === 'outline' || variant === 'ghost' ? 'text-funac-orange' : 'text-white'} />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      ) : null}
      {children}
    </button>
  )
}
