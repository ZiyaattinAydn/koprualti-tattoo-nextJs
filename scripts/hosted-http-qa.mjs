// Dedicated-project integration test. Requires the hosted SQL QA fixtures.
// Passwords and JWTs stay in ignored scratch/process memory and are never printed.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import assert from "node:assert/strict";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
  key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
assert.equal(
  new URL(url).hostname,
  "jofmntiixdcyuxmmkgut.supabase.co",
  "Dedicated QA project required",
);
const { password } = JSON.parse(
  readFileSync(".qa-runtime/hosted-auth.json", "utf8"),
);
const make = () =>
  createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
const clients = [make(), make()],
  anon = make(),
  paths = [];
try {
  for (const [i, name] of ["su", "birsu"].entries()) {
    const { error } = await clients[i].auth.signInWithPassword({
      email: `sprint05-${name}-qa@example.invalid`,
      password,
    });
    assert.equal(error, null, error?.message);
    const { data, error: e } = await clients[i]
      .from("artist_accounts")
      .select("id,slug,role");
    assert.equal(e, null, e?.message);
    assert.deepEqual(
      data.map((a) => a.slug),
      [name],
    );
    assert.equal(data[0].role, "artist");
  }
  console.log("PASS: real Supabase Auth sessions and owner-only account reads");
  const { error: anonRead } = await anon.from("appointments").select("id");
  assert.ok(anonRead, "Anonymous appointment read must fail");
  const bytes = readFileSync("public/assets/doctor-live-1200.webp");
  const path = `artists/10000000-0000-4000-8000-000000000002/portfolio/${randomUUID()}.webp`;
  const { error: uploadError } = await clients[0].storage
    .from("artist-media")
    .upload(path, bytes, { contentType: "image/webp", upsert: false });
  assert.equal(uploadError, null, uploadError?.message);
  paths.push(path);
  const { error: foreignUpload } = await clients[1].storage
    .from("artist-media")
    .upload(
      `artists/10000000-0000-4000-8000-000000000002/portfolio/${randomUUID()}.webp`,
      bytes,
      { contentType: "image/webp", upsert: false },
    );
  assert.ok(foreignUpload);
  const { error: foreignRead } = await clients[1].storage
    .from("artist-media")
    .download(path);
  assert.ok(foreignRead);
  const { error: anonymousAsset } = await anon.storage
    .from("artist-media")
    .download(path);
  assert.ok(anonymousAsset);
  const { error: ownRead } = await clients[0].storage
    .from("artist-media")
    .download(path);
  assert.equal(ownRead, null, ownRead?.message);
  await clients[1].storage.from("artist-media").remove([path]);
  const { error: stillOwned } = await clients[0].storage
    .from("artist-media")
    .download(path);
  assert.equal(stillOwned, null, "Foreign delete must not remove owner object");
  const { error: ownDelete } = await clients[0].storage
    .from("artist-media")
    .remove([path]);
  assert.equal(ownDelete, null, ownDelete?.message);
  const folder = path.slice(0, path.lastIndexOf("/")),
    filename = path.slice(path.lastIndexOf("/") + 1);
  const { data: afterDelete, error: listError } = await clients[0].storage
    .from("artist-media")
    .list(folder, { search: filename });
  assert.equal(listError, null);
  assert.equal(
    afterDelete.length,
    0,
    "Deleted object metadata must be absent (immutable download URLs may be cached)",
  );
  console.log(
    "PASS: actual Storage upload/read/delete, cross-artist write/delete/read denial and private anonymous denial",
  );
  const race = await Promise.all(
    clients.map(async (client) => {
      const { data, error } = await client.rpc("studio_qa_claim");
      assert.equal(error, null, error?.message);
      return data;
    }),
  );
  assert.equal(race.filter((r) => r.outcome === "claimed").length, 1);
  assert.equal(race.filter((r) => r.outcome === "conflict").length, 1);
  assert.notEqual(race[0].backend_pid, race[1].backend_pid);
  const overlap =
    Math.max(...race.map((r) => Date.parse(r.started_at))) <
    Math.min(...race.map((r) => Date.parse(r.finished_at)));
  assert.ok(
    overlap,
    "Database transactions must overlap to count as a concurrency test",
  );
  const appointment = "b6000000-0000-4000-8000-000000000001";
  for (const [i, result] of race.entries()) {
    const { data, error } = await clients[i]
      .from("appointments")
      .select("id,assigned_artist_id,status")
      .eq("id", appointment);
    assert.equal(error, null);
    assert.equal(data.length, result.outcome === "claimed" ? 1 : 0);
    if (data.length) assert.equal(data[0].status, "claimed");
  }
  console.log(
    JSON.stringify(
      {
        result: "PASS",
        concurrent: true,
        distinctConnections: true,
        singleWinner: true,
        sharedPoolIsolation: true,
        race,
      },
      null,
      2,
    ),
  );
} finally {
  if (paths.length) await clients[0].storage.from("artist-media").remove(paths);
  await Promise.all(clients.map((client) => client.auth.signOut()));
}
