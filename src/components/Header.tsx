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
] as const;
export function Header() {
  const [menu, setMenu] = useState(false),
    [dropdown, setDropdown] = useState(false),
    path = usePathname(),
    root = useRef<HTMLElement>(null),
    menuButton = useRef<HTMLButtonElement>(null),
    servicesButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setMenu(false);
    setDropdown(false);
  }, [path]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const menuWasOpen = root.current?.querySelector(".nav.open");
        const dropdownWasOpen = root.current?.querySelector(".dd.open");
        setMenu(false);
        setDropdown(false);
        if (menuWasOpen) menuButton.current?.focus();
        else if (dropdownWasOpen) servicesButton.current?.focus();
      }
    };
    const outside = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setDropdown(false);
    };
    document.addEventListener("keydown", key);
    document.addEventListener("click", outside);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("click", outside);
    };
  }, []);
  return (
    <header ref={root} className="header header-v38">
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
          onClick={() => {
            setMenu(!menu);
            setDropdown(false);
          }}
        >
          MENÜ
        </button>
        <nav
          className={"nav" + (menu ? " open" : "")}
          id="site-main-nav"
          aria-label="Ana menü"
          onClick={(event) => {
            if ((event.target as Element).closest("a")) {
              setMenu(false);
              setDropdown(false);
            }
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
          <div className={"dd" + (dropdown ? " open" : "")}>
            <button
              ref={servicesButton}
              type="button"
              aria-expanded={dropdown}
              aria-haspopup="true"
              onClick={() => setDropdown(!dropdown)}
            >
              Hizmetler ▾
            </button>
            <div className="ddmenu">
              <Link href="/services/">Tüm Hizmetler</Link>
              <Link href="/services/#tattoo">Tattoo</Link>
              <Link href="/services/#piercing">Piercing</Link>
              <Link href="/services/#coverup">Cover-Up</Link>
            </div>
          </div>
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
