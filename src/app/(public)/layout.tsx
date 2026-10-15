import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ImageLightbox } from "@/components/ImageLightbox";
import { DoodleLayer } from "@/components/DoodleLayer";
import { RevealObserver } from "@/components/RevealObserver";
import { PageTransition } from "@/components/PageTransition";
import { InteractionPolish } from "@/components/InteractionPolish";

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
  "motion-polish-v61.css",
  "sprint-03-final-v62.css",
];
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {sheets.map((file) => (
        <link key={file} rel="stylesheet" href={"/css/" + file} />
      ))}
      <div className="top" />
      <Header />
      {children}
      <Footer />
      <ImageLightbox />
      <RevealObserver />
      <DoodleLayer />
      <InteractionPolish />
      <PageTransition />
    </>
  );
}
