import type { Metadata } from "next";
import { ServicesPage } from "@/components/ServicesPage";

export const metadata: Metadata = {
  title: "Cover-Up",
  description: "Köprüaltı Tattoo cover-up değerlendirme, tasarım, portfolio ve randevu bilgileri.",
};

export default function CoverUpServicePage() {
  return <ServicesPage initialService="coverup" />;
}
