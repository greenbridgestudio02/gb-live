export type AdvertisingMedia = {
  id: string;
  name: string;
  file: string;
  type: "image" | "video";
  duration: number;
};

export const ADVERTISING_LIBRARY: AdvertisingMedia[] = [
  {
    id: "kevin-poelees",
    name: "Poêlées Géantes & Rôtisseries - Kévin",
    file: "/publicites/kevin-poelees.png",
    type: "image",
    duration: 15,
  },
  {
    id: "dj-arno",
    name: "DJ Arno Animation",
    file: "/publicites/dj-arno.png",
    type: "image",
    duration: 15,
  },
  {
    id: "watacha",
    name: "Le WATACHA - Bar associatif",
    file: "/publicites/Watacha.jpg",
    type: "image",
    duration: 15,
  },
];

