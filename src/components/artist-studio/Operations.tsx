"use client";
import { useEffect, useState } from "react";
import {
  appointments,
  artistList,
  changeAppointment,
  inviteArtist,
  manageArtist,
} from "@/app/artist-studio/actions";
import { artistRoster, branchNames } from "@/data/artists";
import type { Account, Appointment } from "@/lib/studio/model";
import s from "./Studio.module.css";
const statuses: Record<string, string> = {
  new: "Yeni",
  claimed: "Alındı",
  confirmed: "Onaylandı",
  completed: "Tamamlandı",
  cancelled: "İptal",
};
export function Operations({
  account,
  mode,
  busy,
  run,
  notify,
}: {
  account: Account;
  mode: string;
  busy: boolean;
  run: (fn: () => Promise<void>) => Promise<void>;
  notify: (s: string) => void;
}) {
  const [booking, setBooking] = useState<Appointment[]>([]),
    [members, setMembers] = useState<Account[]>([]),
    [filter, setFilter] = useState("all"),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const manager = account.role === "manager";
  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const [a, m] = await Promise.all([
        mode === "appointments" ? appointments() : Promise.resolve(null),
        manager ? artistList() : Promise.resolve(null),
      ]);
      if (a?.ok) setBooking(a.data);
      else if (a) setError(a.error);
      if (m?.ok) setMembers(m.data);
      else if (m) setError(m.error);
    } catch {
      setError("Veriler yüklenemedi. Tekrar dene.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void refresh();
  }, [mode]); // Re-fetch when switching operations views.
  const person = (id: string | null) =>
    id === null
      ? "Fark Etmez"
      : (members.find((m) => m.id === id)?.display_name ??
        artistRoster.find((a) => a.id === id)?.name ??
        (id === account.id ? account.display_name : "Sanatçı"));
  const change = (id: string, action: string, target: string | null = null) =>
    run(async () => {
      const result = await changeAppointment(id, action, target);
      notify(result.ok ? "Randevu güncellendi." : result.error);
      await refresh();
    });
  return (
    <>
      <div className={s.filterRow}>
        {manager && mode === "appointments" && (
          <label>
            Sanatçı filtresi
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Tümü</option>
              {(members.length
                ? members
                : artistRoster.map((a) => ({ id: a.id, display_name: a.name }))
              ).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.display_name}
                </option>
              ))}
              <option value="shared">Fark Etmez</option>
            </select>
          </label>
        )}
        <button type="button" onClick={() => void refresh()} disabled={loading}>
          Yenile ↻
        </button>
      </div>
      {loading && <p role="status">Yükleniyor…</p>}
      {error && <p role="alert">{error}</p>}
      {mode === "appointments" && !loading && !error && (
        <>
          {!booking.length && <div className={s.empty}>Henüz randevu yok.</div>}
          {booking
            .filter(
              (a) =>
                filter === "all" ||
                (filter === "shared"
                  ? a.preferred_artist_id === null
                  : a.preferred_artist_id === filter ||
                    a.assigned_artist_id === filter),
            )
            .map((a) => (
              <article className={s.booking} key={a.id}>
                <div className={s.bookingHeader}>
                  <span>
                    {a.mode === "ataturk"
                      ? "ATATÜRK İMZASI"
                      : a.services.join(" + ").toUpperCase()}{" "}
                    / {branchNames[a.branch]}
                  </span>
                  <b>{statuses[a.status]}</b>
                </div>
                <h2>{a.customer_name}</h2>
                <p>
                  Tercih: <strong>{person(a.preferred_artist_id)}</strong>
                  {a.assigned_artist_id && (
                    <>
                      {" "}
                      · Üstlenen:{" "}
                      <strong>{person(a.assigned_artist_id)}</strong>
                    </>
                  )}
                </p>
                <p className={s.date}>
                  Talep:{" "}
                  {new Date(a.created_at).toLocaleString("tr-TR", {
                    timeZone: "Europe/Istanbul",
                  })}
                </p>
                {a.idea && <p>{a.idea}</p>}
                {a.placement && (
                  <p>
                    Yerleşim: {a.placement} · {a.size}
                  </p>
                )}
                {a.reference_url&&<a href={a.reference_url} target="_blank" rel="noopener noreferrer">Referans görselini aç ↗</a>}
                <div className={s.contact}>
                  <a href={`tel:${a.phone.replace(/[^+0-9]/g, "")}`}>
                    {a.phone}
                  </a>
                  {a.email && <a href={`mailto:${a.email}`}>{a.email}</a>}
                </div>
                {!["cancelled", "completed"].includes(a.status) && (
                  <div className={s.bookingActions}>
                    {!a.preferred_artist_id &&
                      !a.assigned_artist_id &&
                      a.status === "new" && (
                        <button
                          type="button"
                          className={s.primary}
                          onClick={() => change(a.id, "claim")}
                        >
                          Randevuyu al ↗
                        </button>
                      )}
                    {(manager ||
                      a.assigned_artist_id === account.id ||
                      (!a.assigned_artist_id &&
                        a.preferred_artist_id === account.id)) && (
                      <>
                        <label>
                          Durum
                          <select
                            aria-label={`${a.customer_name} randevu durumu`}
                            value={a.status}
                            onChange={(e) => void change(a.id, e.target.value)}
                          >
                            <option value={a.status}>
                              {statuses[a.status]}
                            </option>
                            {["confirmed", "completed", "cancelled"]
                              .filter((v) => v !== a.status)
                              .map((v) => (
                                <option key={v} value={v}>
                                  {statuses[v]}
                                </option>
                              ))}
                          </select>
                        </label>
                        {manager && (
                          <label>
                            Sanatçıya ata
                            <select
                              aria-label={`${a.customer_name} için sanatçı ata`}
                              value={a.assigned_artist_id ?? ""}
                              onChange={(e) => {
                                if (e.target.value)
                                  void change(a.id, "assign", e.target.value);
                              }}
                            >
                              <option value="">Sanatçı seç</option>
                              {members
                                .filter((m) => m.is_active)
                                .map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.display_name}
                                  </option>
                                ))}
                            </select>
                          </label>
                        )}
                      </>
                    )}
                  </div>
                )}
              </article>
            ))}
        </>
      )}
      {mode === "artists" && manager && (
        <>
          <div className={s.memberList}>
            {members.map((m) => (
              <article key={m.id}>
                <div>
                  <strong>{m.display_name}</strong>
                  <p>
                    {m.role === "manager"
                      ? "Manager"
                      : m.auth_user_id
                        ? "Hesap bağlı"
                        : "Davet bekliyor"}{" "}
                    · {m.is_active ? "Aktif" : "Pasif"}
                  </p>
                </div>
                {m.role !== "manager" ? (
                  <>
                    <label>
                      Şube
                      <select
                        aria-label={`${m.display_name} şubesi`}
                        value={m.branch}
                        onChange={(e) => {
                          const branch = e.target.value;
                          void run(async () => {
                            const result = await manageArtist(
                              m.id,
                              m.is_active,
                              branch,
                            );
                            notify(
                              result.ok ? "Şube güncellendi." : result.error,
                            );
                            await refresh();
                          });
                        }}
                      >
                        {Object.entries(branchNames).map(([id, name]) => (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        run(async () => {
                          const result = await manageArtist(
                            m.id,
                            !m.is_active,
                            m.branch,
                          );
                          notify(
                            result.ok ? "Hesap güncellendi." : result.error,
                          );
                          await refresh();
                        })
                      }
                    >
                      {m.is_active ? "Pasifleştir" : "Aktifleştir"}
                    </button>
                  </>
                ) : (
                  <small>{branchNames[m.branch]}</small>
                )}
              </article>
            ))}
          </div>
          <InviteForm
            busy={busy}
            members={members}
            onInvite={(data) =>
              run(async () => {
                const result = await inviteArtist(data);
                notify(result.ok ? "Davet gönderildi." : result.error);
                if (result.ok) await refresh();
              })
            }
          />
        </>
      )}
    </>
  );
}
function InviteForm({
  busy,
  members,
  onInvite,
}: {
  busy: boolean;
  members: Account[];
  onInvite: (data: {
    name: string;
    nickname: string;
    email: string;
    slug: string;
    branch: string;
  }) => Promise<void>;
}) {
  const [name, setName] = useState(""),
    [nickname, setNickname] = useState(""),
    [slug, setSlug] = useState(""),
    [branch, setBranch] = useState("alsancak");
  return (
    <form
      className={s.inviteForm}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        void onInvite({
          name,
          nickname,
          slug,
          branch,
          email: String(data.get("email")),
        });
      }}
    >
      <span className={s.eyebrow}>EKİBİ GENİŞLET</span>
      <h2>+ Sanatçı davet et</h2>
      <label>
        Profil
        <select
          defaultValue=""
          onChange={(e) => {
            const member = members.find((m) => m.slug === e.target.value);
            if (member) {
              setSlug(member.slug);
              setName(member.display_name);
              setBranch(member.branch);
            } else {
              setSlug("");
              setName("");
            }
          }}
        >
          <option value="">Yeni sanatçı</option>
          {members
            .filter((m) => !m.auth_user_id && m.role !== "manager")
            .map((m) => (
              <option value={m.slug} key={m.id}>
                {m.display_name} — mevcut profil
              </option>
            ))}
        </select>
      </label>
      <label>
        İsim
        <input
          required
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Lakap
        <input
          maxLength={100}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </label>
      <label>
        Profil adresi
        <input
          required
          pattern="[a-z][a-z0-9-]{1,59}"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <small>/artists/{slug || "sanatci-adi"}/</small>
      </label>
      <label>
        E-posta
        <input type="email" name="email" required maxLength={254} />
      </label>
      <label>
        Şube
        <select value={branch} onChange={(e) => setBranch(e.target.value)}>
          {Object.entries(branchNames).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className={s.primary} disabled={busy}>
        Davet gönder ↗
      </button>
    </form>
  );
}
