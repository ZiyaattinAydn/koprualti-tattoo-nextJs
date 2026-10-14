"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  ["/", "Anasayfa"],
  ["/portfolio/", "Portfolyo"],
  ["/artists/", "Sanatçılar"],
  ["/about/", "Hakkımızda"],
  ["/ataturk/", "Atam"],
  ["/studios/", "Şubeler"],
  ["/services/", "Hizmetler"],
] as const;

export function Header() {
  const [menu, setMenu] = useState(false);
  const path = usePathname();
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMenu(false);
  }, [path]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !menu) return;
      setMenu(false);
      menuButton.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menu]);

  return (
    <header className="header header-v38">
      <div className="container head">
        <Link className="brand" href="/" aria-label="Köprüaltı ana sayfa">
          <span className="brand-logo-crop">
            <img
              src="/assets/koprualti-original-logo.png"
              alt="Köprüaltı Tattoo & Piercing"
            />
          </span>
        </Link>

        <button
          ref={menuButton}
          className="mobile"
          type="button"
          aria-expanded={menu}
          aria-controls="site-main-nav"
          onClick={() => setMenu((current) => !current)}
        >
          MENÜ
        </button>

        <nav
          className={"nav" + (menu ? " open" : "")}
          id="site-main-nav"
          aria-label="Ana menü"
          onClick={(event) => {
            if ((event.target as Element).closest("a")) setMenu(false);
          }}
        >
          {links.map(([href, title]) => (
            <Link
              key={href}
              className={
                path === href.replace(/\/$/, "") ||
                path === href ||
                (href !== "/" && path.startsWith(href))
                  ? "active"
                  : ""
              }
              href={href}
            >
              {title}
            </Link>
          ))}

          <Link
            className={"cta-link" + (path === "/appointment" ? " active" : "")}
            href="/appointment/"
          >
            Randevu Al
          </Link>
        </nav>
      </div>
    </header>
  );
}
