import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

type ButtonVariant = "primary" | "outline" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, className = "", type = "button", ...props }, ref) => (
    <button
      {...props}
      ref={ref}
      type={type}
      className={`ui-button ui-button--${variant} ${className}`.trim()}
    />
  ),
);

Button.displayName = "Button";

export default Button;
