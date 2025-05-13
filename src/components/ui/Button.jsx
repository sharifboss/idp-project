export default function Button({ 
    children, 
    className = '', 
    variant = 'primary',
    size = 'md',
    ...props 
  }) {
    const sizeClasses = {
      sm: 'btn-sm',
      md: 'btn-md',
      lg: 'btn-lg'
    };
    
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      outline: 'btn-outline'
    };
    
    return (
      <button 
        className={`btn ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} 
        {...props}
      >
        {children}
      </button>
    );
  }