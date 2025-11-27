import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-3 py-2 bg-cosmic-input dark:bg-cosmic-dark-input border border-cosmic-border dark:border-cosmic-dark-border text-cosmic-text dark:text-cosmic-dark-text placeholder-cosmic-text-muted dark:placeholder-cosmic-dark-text-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-cosmic-primary transition-all duration-200 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
