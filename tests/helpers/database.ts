import { PGlite } from "@electric-sql/pglite";
import { readdir, readFile } from "node:fs/promises";
export async function testDatabase() {
  const db = new PGlite();
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
 create schema auth;create table auth.users(id uuid primary key);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth to anon,authenticated,service_role;grant execute on function auth.uid() to anon,authenticated,service_role;
 create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text,unique(bucket_id,name));
 alter table storage.objects enable row level security;
 grant usage on schema storage to anon,authenticated,service_role;
 grant select,insert,update,delete on storage.objects to anon,authenticated,service_role;
 grant all on storage.buckets to service_role;`);
  const directory = new URL("../../supabase/migrations/", import.meta.url);
  for (const file of (await readdir(directory))
    .filter((f) => f.endsWith(".sql"))
    .sort()) {
    await db.exec(await readFile(new URL(file, directory), "utf8"));
  }
  for (let i = 1; i <= 4; i++)
    await db.exec(
      `insert into auth.users values ('20000000-0000-4000-8000-00000000000${i}');update public.artist_accounts set auth_user_id='20000000-0000-4000-8000-00000000000${i}' where id='10000000-0000-4000-8000-00000000000${i}';`,
    );
  return db;
}
export const artistId = (n: number) =>
  `10000000-0000-4000-8000-00000000000${n}`;
export const userId = (n: number) => `20000000-0000-4000-8000-00000000000${n}`;
