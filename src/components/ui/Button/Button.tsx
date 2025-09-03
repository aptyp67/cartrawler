import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import "./Button.css";

type Variant = "primary" | "secondary";

export type ButtonProps = {
  to: string;
  children: ReactNode;
  variant?: Variant;
  leftIcon?: string;
  className?: string;
} & Omit<React.ComponentProps<typeof Link>, "to" | "className" | "children">;

export default function Button({
  to,
  children,
  variant = "secondary",
  leftIcon,
  className,
  ...rest
}: ButtonProps) {
  const classStr = ["btn", `btn--${variant}`, className]
    .filter(Boolean)
    .join(" ");
  return (
    <Link to={to} className={classStr} {...rest}>
      {leftIcon && (
        <img className="btn-icon" src={leftIcon} alt="" aria-hidden="true" />
      )}
      <span className="btn-label">{children}</span>
    </Link>
  );
}

