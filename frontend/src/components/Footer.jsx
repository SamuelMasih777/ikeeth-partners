import { Link } from "react-router-dom";
import { Linkedin, Twitter } from "lucide-react";

const footerLinks = {
  company: [
    { label: "About", path: "/about" },
    { label: "Team", path: "/team" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Insights", path: "/insights" },
  ],
  engage: [
    { label: "For Founders", path: "/founders" },
    { label: "For Investors", path: "/investors" },
    { label: "Contact", path: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", path: "#" },
    { label: "Terms of Use", path: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-[#030303] border-t border-zinc-900" data-testid="footer">
      {/* Large background text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[20vw] font-['Manrope'] font-extrabold text-zinc-900/50 whitespace-nowrap select-none">
          IKTHEES
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="font-['Manrope'] text-3xl font-bold text-white">
                IKTHEES
              </span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              Backing visionary founders.<br />
              Building enduring companies.
            </p>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 transition-colors"
                data-testid="footer-linkedin"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 transition-colors"
                data-testid="footer-twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-zinc-600 mb-6">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-zinc-400 hover:text-white transition-colors text-sm"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Engage Links */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-zinc-600 mb-6">
              Engage
            </h4>
            <ul className="space-y-3">
              {footerLinks.engage.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-zinc-400 hover:text-white transition-colors text-sm"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-zinc-600 mb-6">
              Contact
            </h4>
            <div className="space-y-3 text-sm">
              <p className="text-zinc-400">Houston, Texas</p>
              <a
                href="mailto:contact@ischus.com"
                className="block text-zinc-400 hover:text-white transition-colors"
                data-testid="footer-email"
              >
                contact@ischus.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} IKTHEES LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-zinc-600 text-xs">
              Designed & Developed by{" "}
              <a
                href="https://pankajmaurya.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                data-testid="footer-developer-credit"
              >
                Pankaj Maurya
              </a>
            </span>
            {footerLinks.legal.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-zinc-600 hover:text-zinc-400 transition-colors text-xs"
                data-testid={`footer-legal-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
