import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GlobalSidebar from "./components/GlobalSidebar";
import Home from "./pages/Home";
import Hello from "./pages/Hello";
import DocPage from "./pages/DocPage";

const MOBILE_BP = 768;

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= MOBILE_BP);

  useEffect(() => {
    function onResize() {
      setSidebarOpen(window.innerWidth >= MOBILE_BP);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const base = import.meta.env.BASE_URL;   // '/' 本機, '/note-vite/' production

  return (
    <BrowserRouter basename={base}>
      <div className="app">
        <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} sidebarOpen={sidebarOpen} />
        <div className="app__body">
          {/* Backdrop on mobile when sidebar open */}
          {sidebarOpen && window.innerWidth < MOBILE_BP && (
            <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
          )}
          <GlobalSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="app__content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hello" element={<Hello />} />
              <Route path="/docs/*" element={<DocPage />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
