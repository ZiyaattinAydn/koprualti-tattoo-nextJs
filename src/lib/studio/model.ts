import { z } from "zod";
export const themes = ["archive", "darkroom", "chaos"] as const;
const localAppointment = z
  .string()
  .max(300)
  .regex(/^$|^\/appointment\/([?][A-Za-z0-9_%=&.-]*)?$/);
const media = z
  .string()
  .max(300)
  .regex(
    /^$|^\/assets\/[A-Za-z0-9_.-]+$|^artists\/[a-f0-9-]+\/(profile|covers|portfolio)\/[a-f0-9-]+\.(webp|jpg|png)$/,
  );
export const profileSchema = z
  .object({
    display_name: z.string().trim().min(1).max(100),
    nickname: z.string().max(100),
    bio: z.string().max(3000),
    specialties: z.array(z.string().max(80)).max(20),
    styles: z.array(z.string().max(80)).max(20),
    instagram_url: z
      .string()
      .max(200)
      .regex(/^$|^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+\/?$/),
    appointment_url: localAppointment,
    profile_image: media,
    cover_image: media,
    theme: z.enum(themes),
  })
  .strict();
export const workSchema = z.object({
  id: z.uuid(),
  storage_path: media.refine((s) => s.startsWith("artists/")),
  title: z.string().max(140),
  description: z.string().max(1000),
  style: z.string().max(100),
  featured: z.boolean(),
  sort_order: z.number().int().min(0),
});
export type Profile = z.infer<typeof profileSchema>;
export type Work = z.infer<typeof workSchema>;
export type Account = {
  id: string;
  auth_user_id: string | null;
  slug: string;
  display_name: string;
  branch: string;
  role: "manager" | "artist";
  is_active: boolean;
};
export type StudioDraft = {
  profile: Profile;
  works: Work[];
  version: number;
  published_version: number;
  updated_at: string;
};
export type LiveProfile = {
  artist_id: string;
  slug: string;
  profile: Profile & { branch: string };
  works: Work[];
  published_at: string;
};
export type Appointment = {
  reference_path: string | null;
  reference_url?: string;
  id: string;
  preferred_artist_id: string | null;
  assigned_artist_id: string | null;
  branch: string;
  mode: string;
  services: string[];
  customer_name: string;
  phone: string;
  email: string;
  idea: string;
  placement: string;
  size: string;
  status: string;
  created_at: string;
};
export type Result<T = undefined> =
  { ok: true; data: T } | { ok: false; error: string };
export const appointmentSchema = z.object({
  request_id: z.uuid(),
  preferred_artist_id: z.uuid().nullable(),
  branch: z.enum(["alsancak", "karsiyaka"]),
  mode: z.enum(["standard", "ataturk"]),
  services: z
    .array(z.enum(["tattoo", "piercing", "coverup"]))
    .min(1)
    .max(3),
  customer_name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[+()\d\s-]{7,30}$/),
  email: z.union([z.literal(""), z.email()]).default(""),
  idea: z.string().max(2000),
  placement: z.string().max(200),
  size: z.string().max(100),
  website: z.string().max(0).optional(),
});
export function blankProfile(name: string): Profile {
  return {
    display_name: name,
    nickname: "",
    bio: "",
    specialties: [],
    styles: [],
    instagram_url: "",
    appointment_url: "/appointment/",
    profile_image: "",
    cover_image: "",
    theme: "archive",
  };
}
