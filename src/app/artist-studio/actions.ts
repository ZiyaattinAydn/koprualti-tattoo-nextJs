"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { serverClient } from "@/lib/supabase/server";
import { adminClient, siteUrl } from "@/lib/supabase/admin";
import { requireStudio } from "@/lib/studio/session";
import {
  profileSchema,
  workSchema,
  blankProfile,
  type Result,
  type StudioDraft,
  type Appointment,
  type Account,
} from "@/lib/studio/model";
import { mediaUrls } from "@/lib/studio/public";
function failure(error: { code?: string } | null): Result<never> {
  return {
    ok: false,
    error:
      error?.code === "40001"
        ? "Kayıt başka bir oturumda değişti. Yenileyip tekrar dene."
        : "İşlem tamamlanamadı. Bilgilerini ve bağlantını kontrol et.",
  };
}
export async function login(email: string, password: string): Promise<Result> {
  if (
    !z.email().safeParse(email).success ||
    password.length < 8 ||
    password.length > 200
  )
    return { ok: false, error: "E-posta ve şifreni kontrol et." };
  try {
    const db = await serverClient();
    const { data, error } = await db.auth.signInWithPassword({
      email,
      password,
    });
    if (error)
      return {
        ok: false,
        error: "Giriş yapılamadı. E-posta ve şifreni kontrol et.",
      };
    const { data: account } = await db
      .from("artist_accounts")
      .select("id")
      .eq("auth_user_id", data.user.id)
      .eq("is_active", true)
      .maybeSingle();
    if (!account) {
      await db.auth.signOut();
      return {
        ok: false,
        error: "Bu hesap için aktif Studio erişimi bulunamadı.",
      };
    }
  } catch {
    return { ok: false, error: "Studio bağlantısı henüz hazır değil." };
  }
  redirect("/artist-studio/");
}
export async function logout() {
  const db = await serverClient();
  await db.auth.signOut();
  redirect("/artist-studio/login/");
}
export async function resetPassword(email: string): Promise<Result> {
  if (!z.email().safeParse(email).success)
    return { ok: false, error: "Geçerli bir e-posta yaz." };
  try {
    const db = await serverClient();
    const { error } = await db.auth.resetPasswordForEmail(email, {
      redirectTo: siteUrl() + "/artist-studio/auth/callback/",
    });
    if (error)
      return {
        ok: false,
        error: "Şifre yenileme şu anda kullanılamıyor. Daha sonra tekrar dene.",
      };
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: "Şifre yenileme şu anda kullanılamıyor." };
  }
}
export async function updatePassword(password: string): Promise<Result> {
  await requireStudio();
  if (password.length < 12 || password.length > 128)
    return { ok: false, error: "Şifren 12–128 karakter olmalı." };
  const db = await serverClient();
  const { error } = await db.auth.updateUser({ password });
  if (error) return failure(error);
  return { ok: true, data: undefined };
}
export async function loadDraft(): Promise<
  Result<StudioDraft & { urls: Record<string, string> }>
> {
  const { db, account } = await requireStudio();
  const [{ data: d, error }, { data: w, error: we }] = await Promise.all([
    db
      .from("artist_drafts")
      .select("profile,version,published_version,updated_at")
      .eq("artist_id", account.id)
      .single(),
    db
      .from("artist_portfolio")
      .select("id,storage_path,title,description,style,featured,sort_order")
      .eq("artist_id", account.id)
      .order("sort_order"),
  ]);
  if (error || we || !d) return failure(error || we);
  const draft = { ...d, works: w ?? [] } as StudioDraft;
  try {
    return {
      ok: true,
      data: {
        ...draft,
        urls: await mediaUrls(
          [
            draft.profile.profile_image,
            draft.profile.cover_image,
            ...draft.works.map((w) => w.storage_path),
          ],
          true,
        ),
      },
    };
  } catch {
    return { ok: false, error: "Taslak görselleri yüklenemedi. Tekrar dene." };
  }
}
export async function saveDraft(input: unknown): Promise<Result<number>> {
  const { db } = await requireStudio();
  const parsed = z
    .object({
      profile: profileSchema,
      works: z.array(workSchema).max(100),
      version: z.number().int().min(0),
    })
    .safeParse(input);
  if (!parsed.success)
    return {
      ok: false,
      error:
        "Alanları kontrol et. Instagram tam profil adresi olmalı; randevu bağlantısı /appointment/ ile başlamalı.",
    };
  const { data, error } = await db.rpc("studio_save_draft", {
    p: parsed.data.profile,
    w: parsed.data.works,
    expected_version: parsed.data.version,
  });
  if (error) return failure(error);
  return { ok: true, data: data as number };
}
export async function publishDraft(version: number): Promise<Result> {
  const { db, account } = await requireStudio();
  if (!Number.isSafeInteger(version) || version < 0) return failure(null);
  const { error } = await db.rpc("studio_publish", {
    expected_version: version,
  });
  if (error) return failure(error);
  revalidatePath("/artists/");
  revalidatePath(`/artists/${account.slug}/`);
  revalidatePath("/portfolio/");
  return { ok: true, data: undefined };
}
export async function restoreDraft(version: number): Promise<Result> {
  const { db } = await requireStudio();
  if (!Number.isSafeInteger(version) || version < 0) return failure(null);
  const { error } = await db.rpc("studio_restore", {
    expected_version: version,
  });
  return error ? failure(error) : { ok: true, data: undefined };
}
export async function appointments(): Promise<Result<Appointment[]>> {
  const { db } = await requireStudio();
  const { data, error } = await db
    .from("appointments")
    .select(
      "id,preferred_artist_id,assigned_artist_id,branch,mode,services,customer_name,phone,email,idea,placement,size,status,created_at,reference_path",
    )
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return failure(error);
  const rows = (data ?? []) as Appointment[];
  const paths = rows.flatMap((a) =>
    a.reference_path ? [a.reference_path] : [],
  );
  const { data: links, error: signError } = paths.length
    ? await db.storage
        .from("appointment-references")
        .createSignedUrls(paths, 900)
    : { data: [], error: null };
  if (signError)
    return {
      ok: false,
      error: "Referans görselleri yüklenemedi. Tekrar dene.",
    };
  return {
    ok: true,
    data: rows.map((a) => ({
      ...a,
      reference_url:
        links?.find((l) => l.path === a.reference_path)?.signedUrl ?? undefined,
    })),
  };
}
export async function changeAppointment(
  id: string,
  action: string,
  target: string | null = null,
): Promise<Result> {
  const { db, account } = await requireStudio();
  if (
    !z.uuid().safeParse(id).success ||
    !["claim", "assign", "confirmed", "completed", "cancelled"].includes(
      action,
    ) ||
    (target && !z.uuid().safeParse(target).success)
  )
    return failure(null);
  if (action === "assign" && account.role !== "manager")
    return { ok: false, error: "Bu işlem için yetkin yok." };
  const { error } = await db.rpc("studio_appointment", {
    appointment_id: id,
    action,
    target_artist: target,
  });
  return error ? failure(error) : { ok: true, data: undefined };
}
export async function artistList(): Promise<Result<Account[]>> {
  const { db, account } = await requireStudio();
  if (account.role !== "manager")
    return { ok: false, error: "Bu işlem için yetkin yok." };
  const { data, error } = await db
    .from("artist_accounts")
    .select("id,auth_user_id,slug,display_name,branch,role,is_active")
    .order("created_at");
  return error ? failure(error) : { ok: true, data: (data ?? []) as Account[] };
}
export async function manageArtist(
  id: string,
  active: boolean,
  branch: string,
): Promise<Result> {
  const { db, account } = await requireStudio();
  if (account.role !== "manager")
    return { ok: false, error: "Bu işlem için yetkin yok." };
  if (
    !z.uuid().safeParse(id).success ||
    !["alsancak", "karsiyaka"].includes(branch)
  )
    return failure(null);
  const { error } = await db.rpc("studio_manage_artist", {
    artist_id: id,
    active,
    new_branch: branch,
  });
  if (error) return failure(error);
  revalidatePath("/artists/");
  return { ok: true, data: undefined };
}
export async function inviteArtist(input: unknown): Promise<Result> {
  const { account } = await requireStudio();
  if (account.role !== "manager")
    return { ok: false, error: "Bu işlem için yetkin yok." };
  const p = z
    .object({
      name: z.string().trim().min(1).max(100),
      nickname: z.string().max(100),
      email: z.email(),
      slug: z.string().regex(/^[a-z][a-z0-9-]{1,59}$/),
      branch: z.enum(["alsancak", "karsiyaka"]),
    })
    .safeParse(input);
  if (!p.success)
    return {
      ok: false,
      error: "İsim, e-posta, profil adresi ve şubeyi kontrol et.",
    };
  try {
    const callback = siteUrl() + "/artist-studio/auth/callback/";
    const db = adminClient();
    const { data: existing, error: lookupError } = await db
      .from("artist_accounts")
      .select("id,auth_user_id,role")
      .eq("slug", p.data.slug)
      .maybeSingle();
    if (lookupError) return failure(lookupError);
    if (existing && (existing.auth_user_id || existing.role === "manager"))
      return {
        ok: false,
        error: "Bu profil zaten bağlı veya davet edilemiyor.",
      };
    const id = existing?.id ?? crypto.randomUUID();
    if (!existing) {
      const { error } = await db
        .from("artist_accounts")
        .insert({
          id,
          slug: p.data.slug,
          display_name: p.data.name,
          branch: p.data.branch,
          role: "artist",
        });
      if (error) return failure(error);
      const { error: d } = await db
        .from("artist_drafts")
        .insert({
          artist_id: id,
          profile: { ...blankProfile(p.data.name), nickname: p.data.nickname },
        });
      if (d) {
        await db
          .from("artist_accounts")
          .delete()
          .eq("id", id)
          .is("auth_user_id", null);
        return failure(d);
      }
    }
    // Reserve the account before sending mail. Two concurrent requests cannot
    // attach separate identities to the same artist. Never delete auth users
    // during compensation: an existing identity may belong to another flow.
    const nonce = crypto.randomUUID();
    const { data: reserved, error: reserveError } = await db
      .from("artist_accounts")
      .update({ invitation_token: nonce })
      .eq("id", id)
      .is("auth_user_id", null)
      .is("invitation_token", null)
      .select("id")
      .maybeSingle();
    if (reserveError || !reserved)
      return {
        ok: false,
        error: "Bu profil için başka bir davet işlemi sürüyor.",
      };
    try {
      const { data, error } = await db.auth.admin.inviteUserByEmail(
        p.data.email,
        { redirectTo: callback },
      );
      if (error || !data.user)
        return {
          ok: false,
          error:
            "Davet gönderilemedi. E-posta teslimat ayarlarını ve adresi kontrol et.",
        };
      const { data: linked, error: linkError } = await db
        .from("artist_accounts")
        .update({ auth_user_id: data.user.id, invitation_token: null })
        .eq("id", id)
        .eq("invitation_token", nonce)
        .is("auth_user_id", null)
        .select("id")
        .single();
      if (linkError || !linked)
        return {
          ok: false,
          error:
            "Davet gönderildi fakat hesap bağlanamadı. Sistem yöneticisi hesap eşleştirmesini kontrol etmeli.",
        };
      return { ok: true, data: undefined };
    } finally {
      await db
        .from("artist_accounts")
        .update({ invitation_token: null })
        .eq("id", id)
        .eq("invitation_token", nonce);
    }
  } catch {
    return { ok: false, error: "Davet servisi henüz yapılandırılmadı." };
  }
}
