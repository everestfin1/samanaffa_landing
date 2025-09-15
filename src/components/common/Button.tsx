import Link from "next/link";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-foreground text-background hover:bg-accent hover:text-accent-foreground focus:ring-foreground shadow-sm hover:shadow-md",
    secondary: "bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground focus:ring-muted-foreground border border-border",
    outline: "border-2 border-foreground text-foreground bg-transparent hover:bg-foreground hover:text-background focus:ring-foreground",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm font-medium",
    md: "px-6 py-3 text-base font-medium",
    lg: "px-8 py-4 text-lg font-semibold",
  };

  const buttonStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={buttonStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonStyles} {...props}>
      {children}
    </button>
  );
}
