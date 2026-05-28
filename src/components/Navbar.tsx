import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [dark, setDark] = useState(
    () => document.documentElement.getAttribute("data-theme") === "dark"
  );
  const navigate = useNavigate();

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  }

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <button className="navbar__brand" onClick={() => navigate("/")}>
          <img src={`${import.meta.env.BASE_URL}img/noteweb.svg`} alt="Logo" className="navbar__logo" />
          <span className="navbar__title">Note Space</span>
        </button>

        <div className="navbar__actions">
          <a
            href="https://github.com/lifelab-bot"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__ext-link"
          >
            My GitHub
          </a>
          <button
            className="navbar__theme-toggle"
            onClick={toggleDark}
            aria-label="切換深色模式"
            title={dark ? "切換淺色模式" : "切換深色模式"}
          >
            {dark ? "🌞" : "🌜"}
          </button>
          <button
            className="navbar__menu-toggle"
            onClick={onMenuClick}
            aria-label="開關目錄"
          >
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
}
