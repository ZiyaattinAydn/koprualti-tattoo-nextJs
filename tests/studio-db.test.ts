import assert from "node:assert/strict";
import { testDatabase, artistId, userId } from "./helpers/database";
async function main() {
  const db = await testDatabase();
  async function role(n: number | "anon" | "service") {
    await db.exec(
      `reset role;set role ${typeof n === "number" ? "authenticated" : n === "anon" ? "anon" : "service_role"};select set_config('request.jwt.claim.sub','${typeof n === "number" ? userId(n) : ""}',false);`,
    );
  }
  const scalar = async (sql: string, params: unknown[] = []) =>
    Object.values(
      (await db.query<Record<string, unknown>>(sql, params)).rows[0] ?? {},
    )[0];
  async function denied(fn: () => Promise<unknown>) {
    await assert.rejects(fn);
  }
  let checks = 0;
  function pass(label: string) {
    console.log(`PASS ${++checks}: ${label}`);
  }
  try {
    await role(2);
    assert.deepEqual(
      (await db.query("select slug from public.artist_accounts")).rows,
      [{ slug: "su" }],
    );
    await denied(() =>
      db.exec(
        `update public.artist_accounts set role='manager' where id='${artistId(2)}'`,
      ),
    );
    await denied(() =>
      db.exec(
        `update public.artist_drafts set profile='{}' where artist_id='${artistId(3)}'`,
      ),
    );
    await denied(() =>
      db.exec(
        `insert into public.artist_accounts(slug,display_name,branch) values('attacker','Attacker','alsancak')`,
      ),
    );
    await denied(() =>
      db.query("select public.studio_manage_artist($1,false,$2)", [
        artistId(3),
        "alsancak",
      ]),
    );
    pass("Artist ownership, role escalation and manager operations blocked");
    const p = JSON.parse(
      String(await scalar(`select profile::text from public.artist_drafts`)),
    );
    p.bio = "PRIVATE UNSAVED LIVE TEST";
    p.theme = "darkroom";
    assert.equal(
      await scalar("select public.studio_save_draft($1,$2,0)", [p, []]),
      1,
    );
    await role("anon");
    assert.notEqual(
      await scalar(
        `select profile->>'bio' from public.artist_public_profiles where slug='su'`,
      ),
      p.bio,
    );
    await denied(() => db.exec("select * from public.artist_drafts"));
    await denied(() => db.exec("select * from public.appointments"));
    await denied(() => db.query("select public.studio_publish(1)"));
    pass(
      "Draft never leaks to anonymous/live reads; no anonymous appointments",
    );
    await role(2);
    await denied(() =>
      db.query("select public.studio_save_draft($1,$2,0)", [p, []]),
    );
    await db.exec("select public.studio_publish(1)");
    await role("anon");
    assert.equal(
      await scalar(
        `select profile->>'bio' from public.artist_public_profiles where slug='su'`,
      ),
      p.bio,
    );
    pass("Version conflicts and atomic publish");
    await role(2);
    p.bio = "new draft";
    await db.query("select public.studio_save_draft($1,$2,1)", [p, []]);
    await db.exec("select public.studio_restore(2)");
    assert.equal(
      await scalar(`select profile->>'bio' from public.artist_drafts`),
      "PRIVATE UNSAVED LIVE TEST",
    );
    pass("Restore last published profile and version");
    const path = `artists/${artistId(2)}/portfolio/30000000-0000-4000-8000-000000000001.webp`;
    const otherPath = `artists/${artistId(3)}/portfolio/30000000-0000-4000-8000-000000000002.webp`;
    await db.query(
      "insert into storage.objects(bucket_id,name) values($1,$2)",
      ["artist-media", path],
    );
    await denied(() =>
      db.query("insert into storage.objects(bucket_id,name) values($1,$2)", [
        "artist-media",
        otherPath,
      ]),
    );
    const work = {
      id: "40000000-0000-4000-8000-000000000001",
      storage_path: path,
      title: "Work",
      description: "",
      style: "Blackwork",
      featured: true,
      sort_order: 0,
    };
    await db.query("select public.studio_save_draft($1,$2,3)", [p, [work]]);
    await role("anon");
    assert.equal(
      await scalar("select count(*) from storage.objects where name=$1", [
        path,
      ]),
      0,
    );
    await role(2);
    await db.exec("select public.studio_publish(4)");
    await role("anon");
    assert.equal(
      await scalar("select count(*) from storage.objects where name=$1", [
        path,
      ]),
      1,
    );
    await role(3);
    assert.equal(
      (
        await db.query(
          "delete from storage.objects where name=$1 returning id",
          [path],
        )
      ).rows.length,
      0,
    );
    await role(2);
    assert.equal(
      (
        await db.query(
          "delete from storage.objects where name=$1 returning id",
          [path],
        )
      ).rows.length,
      0,
    );
    assert.equal(
      (
        await db.query(
          "update storage.objects set name=$1 where name=$2 returning id",
          [otherPath, path],
        )
      ).rows.length,
      0,
    );
    pass("Storage ownership; unpublished read denied; live objects immutable");
    await db.query("select public.studio_save_draft($1,$2,4)", [p, []]);
    await db.exec("select public.studio_publish(5)");
    assert.equal(
      (
        await db.query(
          "delete from storage.objects where name=$1 returning id",
          [path],
        )
      ).rows.length,
      1,
    );
    pass("Portfolio deletion and Storage cleanup after publish");
    await role(2);
    const malicious = { ...p, appointment_url: "javascript:alert(1)" };
    await denied(() =>
      db.query("select public.studio_save_draft($1,$2,5)", [malicious, []]),
    );
    await denied(() =>
      db.query("select public.studio_save_draft($1,$2,5)", [
        { ...p, role: "manager" },
        [],
      ]),
    );
    await denied(() =>
      db.query("select public.studio_save_draft($1,$2,5)", [
        { ...p, profile_image: otherPath },
        [],
      ]),
    );
    pass(
      "Unsafe links, injected fields and foreign assets rejected by database",
    );
    await role("service");
    const base = {
      branch: "alsancak",
      mode: "standard",
      services: ["tattoo"],
      customer_name: "Test Person",
      phone: "05555555555",
      email: "",
      idea: "test",
      placement: "",
      size: "",
    };
    const ids: string[] = [];
    for (let n = 1; n <= 4; n++)
      ids.push(
        String(
          await scalar("select public.create_appointment($1,$2)", [
            {
              ...base,
              branch: n === 4 ? "karsiyaka" : "alsancak",
              request_id: `50000000-0000-4000-8000-00000000000${n}`,
              preferred_artist_id: artistId(n),
            },
            "a".repeat(64),
          ]),
        ),
      );
    ids.push(
      String(
        await scalar("select public.create_appointment($1,$2)", [
          {
            ...base,
            request_id: "50000000-0000-4000-8000-000000000005",
            preferred_artist_id: null,
          },
          "a".repeat(64),
        ]),
      ),
    );
    assert.equal(
      await scalar("select public.create_appointment($1,$2)", [
        {
          ...base,
          request_id: "50000000-0000-4000-8000-000000000005",
          preferred_artist_id: null,
        },
        "a".repeat(64),
      ]),
      ids[4],
    );
    await denied(() =>
      db.query("select public.create_appointment($1,$2)", [
        { ...base, request_id: crypto.randomUUID(), preferred_artist_id: null },
        "a".repeat(64),
      ]),
    );
    pass("Public request validation, idempotency and persistent rate limit");
    for (let n = 2; n <= 4; n++) {
      await role(n);
      const visible = (
        await db.query<{ id: string }>("select id from public.appointments")
      ).rows.map((x) => x.id);
      assert.deepEqual(new Set(visible), new Set([ids[n - 1], ids[4]]));
    }
    await role(1);
    assert.equal(await scalar("select count(*) from public.appointments"), 5);
    pass("Doktor sees all; Su, Birsu and Cansın each see own + shared only");
    await role(2);
    await denied(() =>
      db.query("select public.studio_appointment($1,$2,null)", [
        ids[2],
        "confirmed",
      ]),
    );
    await denied(() =>
      db.query("select public.studio_appointment($1,$2,$3)", [
        ids[4],
        "assign",
        artistId(2),
      ]),
    );
    await db.query("select public.studio_appointment($1,$2,null)", [
      ids[4],
      "claim",
    ]);
    await role(3);
    await denied(() =>
      db.query("select public.studio_appointment($1,$2,null)", [
        ids[4],
        "claim",
      ]),
    );
    assert.equal(
      await scalar("select count(*) from public.appointments where id=$1", [
        ids[4],
      ]),
      0,
    );
    await role(2);
    assert.equal(
      await scalar(
        "select assigned_artist_id from public.appointments where id=$1",
        [ids[4]],
      ),
      artistId(2),
    );
    pass(
      "Conditional atomic claim has a single winner; shared pool hides claimed row",
    );
    await role(1);
    await db.query("select public.studio_appointment($1,$2,$3)", [
      ids[4],
      "assign",
      artistId(3),
    ]);
    await db.query("select public.studio_manage_artist($1,false,$2)", [
      artistId(3),
      "alsancak",
    ]);
    await role(3);
    assert.equal(await scalar("select count(*) from public.appointments"), 0);
    await denied(() => db.exec("select public.studio_publish(0)"));
    await denied(() =>
      db.query("insert into storage.objects(bucket_id,name) values($1,$2)", [
        "artist-media",
        otherPath,
      ]),
    );
    await role("anon");
    assert.equal(
      await scalar(
        `select count(*) from public.artist_public_profiles where slug='birsu'`,
      ),
      0,
    );
    pass(
      "Manager assignment/deactivation immediately revokes data and upload access",
    );
    await role("service");
    const reference = "requests/60000000-0000-4000-8000-000000000001.webp";
    await db.query(
      "insert into storage.objects(bucket_id,name) values($1,$2)",
      ["appointment-references", reference],
    );
    await db.query(
      "update public.appointments set reference_path=$1 where id=$2",
      [reference, ids[1]],
    );
    for (const [actor, count] of [
      ["anon", 0],
      [1, 1],
      [2, 1],
      [4, 0],
    ] as const) {
      await role(actor);
      assert.equal(
        await scalar("select count(*) from storage.objects where name=$1", [
          reference,
        ]),
        count,
      );
    }
    pass(
      "Appointment reference files follow appointment RLS and are never anonymous",
    );
    await role("anon");
    await denied(() =>
      db.query("select public.create_appointment($1,$2)", [
        base,
        "a".repeat(64),
      ]),
    );
    await db.exec("reset role");
    const enabled = (
      await db.query<{ relname: string; relrowsecurity: boolean }>(
        `select relname,relrowsecurity from pg_class where relname in ('artist_accounts','artist_drafts','artist_portfolio','artist_public_profiles','appointments')`,
      )
    ).rows;
    assert.equal(enabled.length, 5);
    assert.ok(enabled.every((t) => t.relrowsecurity));
    pass(
      "All exposed application tables have RLS; public create is server-only",
    );
    console.log(
      `${checks} database security scenarios passed (local PGlite PostgreSQL; not a hosted Supabase integration test).`,
    );
  } finally {
    await db.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
