import React from "react";

type Variant = "title" | "subtitle" | "body" | "label";

interface TextProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

export default function Text({ variant = "body", children, className }: TextProps) {
  const base = `text text--${variant}`;
  const cls = className ? `${base} ${className}` : base;
  if (variant === "title") return <h1 className={cls}>{children}</h1>;
  if (variant === "subtitle") return <h2 className={cls}>{children}</h2>;
  if (variant === "label") return <span className={cls}>{children}</span>;
  return <p className={cls}>{children}</p>;
}
