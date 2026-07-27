import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outline" | "ghost";
  hover?: boolean;
  padding?: boolean;
}

const baseStyles =
  "rounded-xl transition-all duration-200";

const variantStyles = {
  default: "bg-card border border-app shadow-sm",
  elevated: "bg-card border border-app shadow-md",
  outline: "bg-card border border-app",
  ghost: "bg-transparent border border-transparent",
};

const Card = ({
  children,
  className,
  variant = "default",
  hover = false,
  padding = true,
  ...props
}: CardProps) => {
  return (
    <div
      className={clsx(
        baseStyles,
        variantStyles[variant],
        hover && "hover:shadow-lg hover:-translate-y-0.5",
        padding && "p-6",
        className
      )}
      { ...props }
    >
      {children}
    </div>
  );
};

export default Card;

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className }: SectionProps) => (
  <div className={clsx("mb-4", className)}>
    {children}
  </div>
);

export const CardContent = ({ children, className }: SectionProps) => (
  <div className={clsx(className)}>
    {children}
  </div>
);

export const CardFooter = ({ children, className }: SectionProps) => (
  <div className={clsx("mt-4 pt-4 border-t border-app", className)}>
    {children}
  </div>
);