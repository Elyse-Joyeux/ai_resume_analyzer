import { Link } from "react-router";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("resumind-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const next =
      stored === "dark" || (!stored && prefersDark) ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.classList.toggle("light", next === "light");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("resumind-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.classList.toggle("light", next === "light");
  };

  return (
    <nav className="navbar">
      <div className="flex items-center gap-4">
        <Link to="/">
          <p className="text-2xl font-bold text-gradient">RESUMIND</p>
        </Link>
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/wipe" className="nav-link">
          Wipe Data
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button className="theme-toggle" onClick={toggleTheme} type="button">
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <Link to="/upload" className="primary-button w-fit">
          Upload Resume
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
