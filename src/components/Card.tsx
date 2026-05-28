import React, { useState } from "react";
import Text from "./Text";

interface CardProps {
  index: number;
  icon: string;
  title: string;
  children: React.ReactNode;
  tips: string;
}

export default function Card({ index, icon, title, children, tips }: CardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`card ${isOpen ? "card--open" : ""}`}>
      <button
        className="card__header"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <div className="card__header-left">
          <Text variant="label" className="card__index">
            {String(index).padStart(2, "0")}
          </Text>
          <span className="card__icon">{icon}</span>
          <Text variant="subtitle" className="card__title">
            {title}
          </Text>
        </div>
        <span className="card__chevron">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="card__body">
          <Text variant="body" className="card__desc">
            {children}
          </Text>
          <div className="card__tips">
            <Text variant="label" className="card__tips-label">
              💡 小技巧
            </Text>
            <Text variant="body" className="card__tips-text">
              {tips}
            </Text>
          </div>
        </div>
      )}
    </div>
  );
}
