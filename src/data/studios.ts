export type Studio = {
  slug: "alsancak" | "karsiyaka";
  name: string;
  district: string;
  address: string;
  intro: string;
  photo: string;
  photoAlt: string;
  mapUrl: string;
};

// Locations and photographs carried from the approved v58 branch pages.
export const studios: Studio[] = [
  {
    slug: "alsancak",
    name: "Alsancak",
    district: "Konak / İzmir",
    address: "İrfan Boyuer Sk. Kervan Pasajı No.5/22, 35220 Konak / İzmir",
    intro:
      "Kervan Pasajı içindeki Köprüaltı. Şehrin hareketinin arasından stüdyonun kendi dünyasına açılan bir durak.",
    photo: "/assets/studio1.jpg",
    photoAlt: "Köprüaltı stüdyosunun duvar fotoğrafı",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=K%C3%B6pr%C3%BCalt%C4%B1%20Tattoo%20%26%20Piercing%2C%20Alsancak%2C%20%C4%B0rfan%20Boyuer%20Sk.%20Kervan%20Pasaj%C4%B1%20No.5/22%2C%2035220%20Konak/%C4%B0zmir",
  },
  {
    slug: "karsiyaka",
    name: "Karşıyaka",
    district: "Karşıyaka / İzmir",
    address: "Tuna, 1715 Sok 70/C, 35600 Karşıyaka / İzmir",
    intro:
      "Karşıyaka’da Köprüaltı’nın ikinci durağı. Duvarlardaki izler ve stüdyo hafızası burada başka bir sokakta devam ediyor.",
    photo: "/assets/studio2.jpg",
    photoAlt: "Köprüaltı stüdyosunun iç mekân fotoğrafı",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=K%C3%B6pr%C3%BCalt%C4%B1%20Tattoo%2C%20Tuna%2C%201715%20Sok%2070/C%2C%2035600%20Kar%C5%9F%C4%B1yaka/%C4%B0zmir",
  },
];

export function getStudio(slug: Studio["slug"]): Studio {
  const studio = studios.find((item) => item.slug === slug);
  if (!studio) throw new Error(`Unknown studio: ${slug}`);
  return studio;
}
