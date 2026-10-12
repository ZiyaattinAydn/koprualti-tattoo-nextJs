import Link from "next/link";
const links = [
  ["/", "Anasayfa"],
  ["/portfolio/", "Portfolyo"],
  ["/artists/", "Sanatçılar"],
  ["/about/", "Hakkımızda"],
  ["/ataturk/", "Atam"],
  ["/studios/", "Şubeler"],
  ["/services/", "Hizmetler"],
  ["/appointment/", "Randevu Al"],
] as const;
export function Footer() {
  return (
    <footer
      className="footer footer-classic footer-v37"
      aria-label="Site alt bilgisi"
    >
      <div className="container footer-v37-top">
        <div className="footer-v37-identity">
          <img
            src="/assets/koprualti-original-logo.png"
            alt="Köprüaltı Tattoo & Piercing"
            className="footer-v37-logo"
            loading="lazy"
          />
          <p>1993'ten beri aynı ruh, yeni izler.</p>
        </div>
        <div className="footer-v37-panel">
          <div className="footer-v37-kicker">
            <span className="footer-v37-dash" /> KÖPRÜALTI / KEŞFET
          </div>
          <nav className="footer-v37-nav" aria-label="Footer menüsü">
            {links.map(([href, title]) => (
              <Link
                key={href}
                href={href}
                className={
                  href === "/appointment/"
                    ? "footer-v37-appointment"
                    : undefined
                }
              >
                {title}
              </Link>
            ))}
          </nav>
          <div className="footer-v37-details">
            <span>
              Köprüaltı Tattoo & Piercing <em>·</em> 1993'ten beri
            </span>
            <span>
              ALSANCAK <em>/</em> KARŞIYAKA <em>·</em> İZMİR
            </span>
          </div>
        </div>
      </div>
      <div className="container footer-v37-bottom">
        <span>© 2026 Köprüaltı Tattoo & Piercing</span>
        <span>
          İZMİR <i aria-hidden="true">✳</i> TÜRKİYE
        </span>
      </div>
    </footer>
  );
}
