import { Link } from "react-router";
import { ExternalLink, Share2, Globe } from "lucide-react";

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/" },
      { label: "How It Works", href: "/" },
      { label: "Pricing", href: "/" },
      { label: "API Access", href: "/" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/" },
      { label: "Career Guide", href: "/" },
      { label: "Resume Tips", href: "/" },
      { label: "FAQ", href: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Contact", href: "/" },
      { label: "Press", href: "/" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Service", href: "/" },
      { label: "Cookie Policy", href: "/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      className="w-full"
      style={{
        backgroundColor: "#0B0E14",
        borderTop: "1px solid rgba(148, 163, 184, 0.08)",
      }}
    >
      <div
        className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: "80px", paddingBottom: "40px" }}
      >
        {/* 4-column grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-0 text-xl font-bold tracking-tight"
            >
              <span style={{ color: "#F5F7FA" }}>CareerSync</span>
              <span style={{ color: "#00C9FF" }}>AI</span>
            </Link>
            <p
              className="mt-4 max-w-xs text-sm leading-relaxed"
              style={{ color: "#94A3B8" }}
            >
              AI-powered job matching and application generation. Upload your
              resume, get interviewed by AI, and receive 100 tailored job
              applications.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200"
                style={{ color: "#94A3B8" }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "#00C9FF";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "#94A3B8";
                }}
              >
                <ExternalLink size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200"
                style={{ color: "#94A3B8" }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "#00C9FF";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "#94A3B8";
                }}
              >
                <Share2 size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200"
                style={{ color: "#94A3B8" }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "#00C9FF";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "#94A3B8";
                }}
              >
                <Globe size={20} />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {footerColumns.map(col => (
            <div key={col.title}>
              <h4
                className="text-sm font-semibold"
                style={{ color: "#F5F7FA" }}
              >
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-2">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "#94A3B8" }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = "#00C9FF";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = "#94A3B8";
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-16 flex flex-col items-center justify-between gap-4 sm:flex-row"
          style={{
            borderTop: "1px solid rgba(148, 163, 184, 0.08)",
            paddingTop: "24px",
          }}
        >
          <p className="text-xs" style={{ color: "#64748B" }}>
            &copy; 2025 CareerSync AI. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "#64748B" }}>
            Built with AI-powered precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
