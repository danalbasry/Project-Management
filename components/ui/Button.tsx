import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles =
      'font-medium rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-cosmic-dark-bg';

    const variantStyles = {
      primary: 'bg-cosmic-primary text-white hover:bg-cosmic-accent focus:ring-cosmic-primary-light',
      secondary:
        'bg-cosmic-input dark:bg-cosmic-dark-input text-cosmic-text dark:text-cosmic-dark-text hover:bg-cosmic-border dark:hover:bg-cosmic-dark-border focus:ring-cosmic-primary border border-cosmic-border dark:border-cosmic-dark-border',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;
