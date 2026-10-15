import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";
import { appointmentSchema } from "@/lib/studio/model";
export async function POST(request: NextRequest) {
  let source: URL;
  try {
    source = new URL(request.headers.get("origin") ?? "");
  } catch {
    return NextResponse.json({ error: "Geçersiz kaynak." }, { status: 403 });
  }
  if (source.host !== request.headers.get("host"))
    return NextResponse.json({ error: "Geçersiz kaynak." }, { status: 403 });
  if (Number(request.headers.get("content-length")) > 4 * 1024 * 1024)
    return NextResponse.json({ error: "Talep çok büyük." }, { status: 413 });
  let body: unknown,
    reference: File | null = null;
  try {
    if (
      request.headers.get("content-type")?.startsWith("multipart/form-data")
    ) {
      const form = await request.formData(),
        value = form.get("payload"),
        file = form.get("reference");
      if (typeof value !== "string" || value.length > 16000) throw Error();
      body = JSON.parse(value);
      if (file instanceof File && file.size) reference = file;
    } else {
      const raw = await request.text();
      if (raw.length > 16000) throw Error();
      body = JSON.parse(raw);
    }
  } catch {
    return NextResponse.json({ error: "Geçersiz talep." }, { status: 400 });
  }
  const parsed = appointmentSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: "İsim, telefon ve tercihlerini kontrol et." },
      { status: 400 },
    );
  if (
    reference &&
    (reference.type !== "image/webp" || reference.size > 3 * 1024 * 1024)
  )
    return NextResponse.json(
      { error: "Referans görselini kontrol et." },
      { status: 400 },
    );
  try {
    const db = adminClient();
    const ip = process.env.VERCEL
      ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
      : "local";
    if (!ip)
      return NextResponse.json(
        { error: "Talep doğrulanamadı." },
        { status: 400 },
      );
    const hash = createHash("sha256")
      .update(ip + process.env.SUPABASE_SERVICE_ROLE_KEY)
      .digest("hex");
    const referencePath = reference
      ? `requests/${crypto.randomUUID()}.webp`
      : null;
    if (reference && referencePath) {
      const bytes = Buffer.from(await reference.arrayBuffer());
      if (
        bytes.toString("ascii", 0, 4) !== "RIFF" ||
        bytes.toString("ascii", 8, 12) !== "WEBP"
      )
        return NextResponse.json(
          { error: "Geçersiz görsel dosyası." },
          { status: 400 },
        );
      const { error } = await db.storage
        .from("appointment-references")
        .upload(referencePath, bytes, {
          contentType: "image/webp",
          upsert: false,
        });
      if (error)
        return NextResponse.json(
          { error: "Referans yüklenemedi. Tekrar dene." },
          { status: 503 },
        );
    }
    const { data, error } = await db.rpc("create_appointment", {
      payload: { ...parsed.data, reference_path: referencePath },
      client_hash: hash,
    });
    if (error) {
      if (referencePath)
        await db.storage.from("appointment-references").remove([referencePath]);
      return NextResponse.json(
        {
          error:
            error.code === "54000"
              ? "Çok fazla talep. Lütfen daha sonra tekrar dene."
              : "Talep kaydedilemedi. Sanatçı ve şube seçimini kontrol et.",
        },
        { status: error.code === "54000" ? 429 : 400 },
      );
    }
    if (referencePath) {
      const { data: row } = await db
        .from("appointments")
        .select("reference_path")
        .eq("id", data)
        .single();
      if (row?.reference_path !== referencePath)
        await db.storage.from("appointment-references").remove([referencePath]);
    }
    return NextResponse.json({ id: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        error:
          "Randevu gönderimi şu anda kullanılamıyor. Lütfen stüdyoyla iletişime geç.",
      },
      { status: 503 },
    );
  }
}
