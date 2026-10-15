export const artistRoster = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    slug: "doktor",
    name: "Doktor",
    branch: "alsancak",
    image: "/assets/doctor-live.png",
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    slug: "su",
    name: "Su",
    branch: "alsancak",
    image: "",
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    slug: "birsu",
    name: "Birsu",
    branch: "alsancak",
    image: "/assets/birsu-studio.jpeg",
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    slug: "cansin",
    name: "Cansın",
    branch: "karsiyaka",
    image: "",
  },
] as const;
export const branchNames: Record<string, string> = {
  alsancak: "Alsancak",
  karsiyaka: "Karşıyaka",
};
