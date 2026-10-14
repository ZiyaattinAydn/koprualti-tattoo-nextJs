import type { Metadata } from "next";
import { ServicesPage } from "@/components/ServicesPage";

export const metadata: Metadata = {
  title: "Piercing",
  description: "Köprüaltı Tattoo piercing türleri, hijyen, iyileşme, bakım ve randevu bilgileri.",
};

export default function PiercingServicePage() {
  return <ServicesPage initialService="piercing" />;
}
