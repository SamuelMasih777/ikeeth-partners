import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { path: "/about", label: "About" },
  { path: "/investment", label: "Investment" },
  { path: "/portfolio", label: "Portfolio" },
  { path: "/founders", label: "Founders" },
  { path: "/investors", label: "Investors" },
  { path: "/insights", label: "Insights" },
  { path: "/team", label: "Team" },
  { path: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="font-['Manrope'] text-2xl font-bold tracking-tight text-white"
            data-testid="logo-link"
          >
            IKTHEES
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors link-hover ${
                  location.pathname === link.path
                    ? "text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link
              to="/founders"
              className="bg-white text-black rounded-full px-6 py-2.5 text-sm font-semibold transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98]"
              data-testid="nav-cta-button"
            >
              Submit Pitch
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white"
            data-testid="mobile-menu-button"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0A0A0A] border-t border-zinc-800"
            data-testid="mobile-menu"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 text-lg font-medium ${
                    location.pathname === link.path
                      ? "text-white"
                      : "text-zinc-400"
                  }`}
                  data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/founders"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-white text-black rounded-full px-6 py-3 text-sm font-semibold mt-4"
                data-testid="mobile-cta-button"
              >
                Submit Pitch
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
