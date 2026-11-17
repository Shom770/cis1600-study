"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavProgress from "./NavProgress";

const LINKS = [
  ["/practice", "Problem bank"],
  ["/quick", "Quick exam"],
  ["/proof", "Quick proof"],
  ["/mock", "Mock exam"],
  ["/flashcards", "Flashcards"],
];

function Logo() {
  // K4 minus an edge: the course in one small graph.
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <g stroke="#1c1f26" strokeWidth="1.4">
        <line x1="4" y1="4" x2="18" y2="4" />
        <line x1="4" y1="4" x2="4" y2="18" />
        <line x1="18" y1="4" x2="18" y2="18" />
        <line x1="4" y1="18" x2="18" y2="18" />
        <line x1="4" y1="4" x2="18" y2="18" />
      </g>
      <circle cx="4" cy="4" r="3" fill="#1c1f26" />
      <circle cx="18" cy="4" r="3" fill="#fff" stroke="#1c1f26" strokeWidth="1.4" />
      <circle cx="4" cy="18" r="3" fill="#fff" stroke="#1c1f26" strokeWidth="1.4" />
      <circle cx="18" cy="18" r="3" fill="#f4e94e" stroke="#1c1f26" strokeWidth="1.4" />
    </svg>
  );
}

export default function Nav() {
  const path = usePathname();
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="brand" aria-current={path === "/" ? "page" : undefined}>
          <Logo />
          <span>CIS 1600 <small>Midterm 2</small></span>
        </Link>
        <nav className="nav-links" aria-label="Main">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} aria-current={path.startsWith(href) ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <NavProgress />
      </div>
    </header>
  );
}
