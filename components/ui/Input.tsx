import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-3 py-2 bg-cosmic-input border border-cosmic-border text-cosmic-text placeholder-cosmic-text-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-cosmic-primary transition-all duration-200 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
