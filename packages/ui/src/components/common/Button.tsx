import { ButtonHTMLAttributes } from 'react';

type ButtonSize = 'sm' | 'md' | 'lg' | 'full';
type ButtonVariant = 'default' | 'outline' | 'ghost';

interface ButtonInterface extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const sizes = {
  sm: 'px-3 py-1 rounded-lg',
  md: 'px-5 py-2 rounded-lg',
  lg: 'px-6 py-3 rounded-xl',
  full: 'w-full rounded-2xl',
};

const variants = {
  default: 'bg-blue-500 hover:bg-blue-600 text-white',
  outline: 'bg-transparent hover:bg-blue-50 border border-blue-500 text-blue-500',
  ghost: 'bg-transparent hover:bg-blue-50 text-blue-500',
};

export function Button({ children, size = 'md', variant = 'default', ...props }: ButtonInterface) {
  return (
    <button
      {...props}
      className={`cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-200 hover-bg-smooth ${sizes[size]} ${variants[variant]} ${props.className}`}
    >
      {children}
    </button>
  );
}
