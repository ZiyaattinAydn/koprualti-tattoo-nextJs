import { artistRoster } from "./artists";
export type StudioSlug = "alsancak" | "karsiyaka";
export const branchCategories = [
  "exterior",
  "entrance",
  "interior",
  "workspace",
  "details",
  "artists",
  "archive",
] as const;
export type BranchCategory = (typeof branchCategories)[number];
export type BranchImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  /** Existing selection, not a verified photograph of this particular branch. */
  provisional: boolean;
};
export type BranchArtist = {
  name: string;
  href: string;
  image?: BranchImage;
};
export type StoryEntry = {
  id: string;
  label: string; // FOUNDATION / EXPANSION / TODAY, when confirmed.
  text: string;
  date?: string; // Omit unknown dates rather than inventing them.
};
export type Studio = {
  slug: StudioSlug;
  number: string;
  name: string;
  district: string;
  city: string;
  address: string;
  intro: string;
  photo: string;
  photoAlt: string;
  hero: BranchImage;
  images: Record<BranchCategory, BranchImage[]>;
  artists: BranchArtist[];
  story: StoryEntry[];
  mapUrl: string;
};

const selection = (
  src: string,
  alt: string,
  caption: string,
  width = 1152,
  height = 1536,
): BranchImage => ({
  src: `/assets/${src}`,
  alt,
  caption,
  width,
  height,
  provisional: true,
});
const doktor = selection(
  "doctor-live-1200.webp",
  "Doktor dövme çalışırken",
  "Doktor / çalışma anı",
  1200,
  896,
);
const birsu = selection(
  "birsu-studio.jpeg",
  "Birsu stüdyoda çalışırken",
  "Birsu / çalışma anı",
  900,
  1600,
);

// Replace image paths here when branch-specific shoots arrive. Empty categories
// deliberately show a pending-photograph panel; they never borrow a wrong label.
export const studios: Studio[] = [
  {
    slug: "alsancak",
    number: "01",
    name: "Alsancak",
    district: "Konak",
    city: "İzmir",
    address: "İrfan Boyuer Sk. Kervan Pasajı No.5/22, 35220 Konak / İzmir",
    intro:
      "Köprüaltı’nın şehir merkezindeki köklü noktası. Dövme kültürü, stüdyo arşivi ve yıllar içinde oluşan kendine özgü atmosferiyle markanın ana duraklarından biri.",
    photo: "/assets/studio1.jpg",
    photoAlt: "Köprüaltı seçkisinden stüdyo duvarları ve mor merdiven",
    hero: selection(
      "studio1.jpg",
      "Köprüaltı seçkisinden stüdyo duvarları ve mor merdiven",
      "Köprüaltı / stüdyo seçkisi",
    ),
    images: {
      exterior: [],
      entrance: [],
      interior: [
        selection(
          "hero.jpg",
          "Stüdyo duvarındaki çerçeveli fotoğraflar",
          "Duvarların kendi dili var.",
        ),
      ],
      workspace: [doktor],
      details: [
        selection(
          "work2.jpg",
          "Stüdyo rafındaki küçük objeler",
          "Küçük şeyler, büyük karakter.",
        ),
      ],
      artists: [doktor, birsu],
      archive: [
        selection(
          "work3.jpg",
          "Stüdyo arşivindeki çerçeveler ve çizimler",
          "Çerçeveler arasında.",
        ),
        selection(
          "work4.jpg",
          "Duvarlardaki çizimler ve arşiv belgeleri",
          "Duvarlarda kalan izler.",
        ),
      ],
    },
    artists: artistRoster
      .filter((a) => a.branch === "alsancak")
      .map((a) => ({
        name: a.name,
        href: `/artists/${a.slug}/`,
        image:
          a.slug === "doktor" ? doktor : a.slug === "birsu" ? birsu : undefined,
      })),
    story: [],
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(
        "Köprüaltı Tattoo, İrfan Boyuer Sk. Kervan Pasajı No.5/22, 35220 Konak / İzmir",
      ),
  },
  {
    slug: "karsiyaka",
    number: "02",
    name: "Karşıyaka",
    district: "Karşıyaka",
    city: "İzmir",
    address: "Tuna, 1715 Sok 70/C, 35600 Karşıyaka / İzmir",
    intro:
      "Köprüaltı kültürünü İzmir’in karşı yakasına taşıyan ikinci lokasyon. Daha kompakt, kişisel ve kendi çevresini oluşturan bir stüdyo deneyimi.",
    photo: "/assets/studio2.jpg",
    photoAlt: "Köprüaltı seçkisinden mor merdiven ve duvar çizimleri",
    hero: selection(
      "studio2.jpg",
      "Köprüaltı seçkisinden mor merdiven ve duvar çizimleri",
      "Köprüaltı / stüdyo seçkisi",
    ),
    images: {
      exterior: [],
      entrance: [],
      interior: [
        selection(
          "work1.jpg",
          "Stüdyodaki büyük çerçeve ve fotoğraf seçkisi",
          "Aynı kültürün başka bir köşesi.",
        ),
      ],
      workspace: [], // No verified Cansın / Karşıyaka workspace photograph yet.
      details: [
        selection(
          "doctor.jpg",
          "Stüdyo duvarındaki çizim ve fotoğraf",
          "Her köşede bir iz.",
        ),
      ],
      artists: [],
      archive: [
        selection(
          "work2.jpg",
          "Stüdyo seçkisindeki objeler ve raflar",
          "Objelerin hafızası.",
        ),
        selection(
          "work4.jpg",
          "Arşivdeki çizimler ve belgeler",
          "Çizgiler ve hatıralar.",
        ),
      ],
    },
    artists: artistRoster
      .filter((a) => a.branch === "karsiyaka")
      .map((a) => ({ name: a.name, href: `/artists/${a.slug}/` })),
    story: [],
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(
        "Köprüaltı Tattoo, Tuna, 1715 Sok 70/C, 35600 Karşıyaka / İzmir",
      ),
  },
];

export function getStudio(slug: StudioSlug): Studio {
  const studio = studios.find((item) => item.slug === slug);
  if (!studio) throw new Error(`Unknown studio: ${slug}`);
  return studio;
}
