import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, iconPosition = 'left', className = '', ...props }, ref) => {
    const baseStyles = 'w-full px-4 py-2.5 border rounded-xl text-gray-900 transition-all duration-200 bg-gray-50 focus:bg-white';
    
    const stateStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
      : 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200';

    const paddingStyles = icon
      ? iconPosition === 'left'
        ? 'pl-10'
        : 'pr-10'
      : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{icon}</span>
            </div>
          )}
          <input
            ref={ref}
            className={`${baseStyles} ${stateStyles} ${paddingStyles} ${className}`}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{icon}</span>
            </div>
          )}
          {props.value && typeof props.value === 'string' && props.value.length > 0 && props.type !== 'password' && (
            <button
              type="button"
              onClick={() => {
                const target = document.querySelector(`[name="${props.name}"]`) as HTMLInputElement;
                if (target) {
                  const event = new Event('input', { bubbles: true });
                  target.value = '';
                  target.dispatchEvent(event);
                }
                if (props.onChange) {
                  const syntheticEvent = {
                    target: { value: '' },
                  } as React.ChangeEvent<HTMLInputElement>;
                  props.onChange(syntheticEvent);
                }
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';