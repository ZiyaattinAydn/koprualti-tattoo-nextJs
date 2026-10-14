import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ImageLightbox } from "@/components/ImageLightbox";
import { DoodleLayer } from "@/components/DoodleLayer";
import { RevealObserver } from "@/components/RevealObserver";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = {
  title: {
    default: "Köprüaltı Tattoo & Piercing",
    template: "%s | Köprüaltı Tattoo & Piercing",
  },
  description: "Köprüaltı Tattoo & Piercing, İzmir Alsancak ve Karşıyaka.",
};
const sheets = [
  "style.css",
  "polish-september.css",
  "design-v33.css",
  "footer-v37.css",
  "header-v38.css",
  "ambient-v40.css",
  "tipografi-v44.css",
  "fix-v45.css",
  "doodles-v50.css",
  "basliklar-rye-v53.css",
  "hizmetler-font-v52.css",
  "portfolio-lightbox-v54.css",
  "branches-v55.css",
  "tattoo-cursor-v55.css",
  "final-responsive-v56.css",
  "artist-photo-v57.css",
  "mobile-visuals-v58.css",
  "page-transition-v59.css",
  "sprint-03-services-appointment.css",
  "sprint-03-hotfix.css",
  "sprint-03-ui-polish.css",
];
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Rye&display=swap"
          rel="stylesheet"
        />
        {sheets.map((file) => (
          <link key={file} rel="stylesheet" href={"/css/" + file} />
        ))}
      </head>
      <body>
        <div className="top" />
        <Header />
        {children}
        <Footer />
        <ImageLightbox />
        <RevealObserver />
        <DoodleLayer />
        <PageTransition />
      </body>
    </html>
  );
}
