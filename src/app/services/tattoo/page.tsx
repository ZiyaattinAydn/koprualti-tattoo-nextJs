import type { Metadata } from "next";
import { ServicesPage } from "@/components/ServicesPage";

export const metadata: Metadata = {
  title: "Tattoo",
  description: "Köprüaltı Tattoo tattoo süreci, stiller, bakım ve randevu bilgileri.",
};

export default function TattooServicePage() {
  return <ServicesPage initialService="tattoo" />;
}
