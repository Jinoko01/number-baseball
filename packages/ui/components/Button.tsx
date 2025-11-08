import { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'default' | 'outline' | 'ghost';

interface ButtonInterface extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
}

const variants = {
  default: 'bg-orange-500 text-white',
  outline: 'bg-transparent border border-orange-500 text-orange-500',
  ghost: 'bg-transparent text-orange-500',
};

export function Button({ children, variant = 'default', ...props }: ButtonInterface) {
  return (
    <button {...props} className={`${variants[variant]} ${props.className}`}>
      {children}
    </button>
  );
}
