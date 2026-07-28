import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "light";
}

const Input = ({
  variant = "default",
  className,
  ...props
}: InputProps) => {
  return (
    <input
      className={clsx(
        "w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-1",
        variant === "default" &&
          "bg-card border-app text-app focus:ring-primary/30",
        variant === "light" &&
          "bg-white border-slate-300 text-slate-900 focus:ring-primary/30",
        className
      )}
      {...props}
    />
  );
};

export default Input;