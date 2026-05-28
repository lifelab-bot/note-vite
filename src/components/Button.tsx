import React from "react";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export default function Button({ onClick, children, variant = "primary", disabled = false }: ButtonProps) {
  return (
    <button className={`btn btn--${variant}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
