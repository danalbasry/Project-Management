import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full px-3 py-2 bg-cosmic-input border border-cosmic-border text-cosmic-text placeholder-cosmic-text-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-cosmic-primary transition-all duration-200 resize-vertical ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
