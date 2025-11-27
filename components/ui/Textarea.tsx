import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full px-3 py-2 bg-cosmic-input dark:bg-cosmic-dark-input border border-cosmic-border dark:border-cosmic-dark-border text-cosmic-text dark:text-cosmic-dark-text placeholder-cosmic-text-muted dark:placeholder-cosmic-dark-text-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-cosmic-primary transition-all duration-200 resize-vertical ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
