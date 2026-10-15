/** Local protocol fixture only. Never imported by application code or deployed. */
import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { randomUUID } from "node:crypto";
import { testDatabase, userId } from "./database";
const port = 55440;
async function main() {
  const db = await testDatabase();
  const objects = new Map<string, Buffer>(),
    signed = new Map<string, string>();
  const users = [1, 2, 3, 4].map((n) => ({
    id: userId(n),
    aud: "authenticated",
    role: "authenticated",
    email: ["", "doktor", "su", "birsu", "cansin"][n] + "@fixture.invalid",
    email_confirmed_at: new Date().toISOString(),
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: {},
    identities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_anonymous: false,
  }));
  const tokens = new Map<string, (typeof users)[number]>();
  function session(user: (typeof users)[number]) {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const token = [
      { alg: "HS256", typ: "JWT" },
      {
        sub: user.id,
        role: "authenticated",
        aud: "authenticated",
        exp,
        iat: exp - 3600,
      },
      "fixture-signature",
    ]
      .map((v) =>
        Buffer.from(typeof v === "string" ? v : JSON.stringify(v)).toString(
          "base64url",
        ),
      )
      .join(".");
    tokens.set(token, user);
    return {
      access_token: token,
      refresh_token: randomUUID(),
      token_type: "bearer",
      expires_in: 3600,
      expires_at: exp,
      user,
    };
  }
  let queue = Promise.resolve();
  const send = (res: ServerResponse, value: unknown, status = 200) => {
    res.writeHead(status, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(JSON.stringify(value));
  };
  const read = async (req: IncomingMessage) => {
    const a: Buffer[] = [];
    for await (const chunk of req) a.push(Buffer.from(chunk));
    return Buffer.concat(a);
  };
  async function handle(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PATCH,DELETE,OPTIONS",
    );
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }
    const url = new URL(req.url ?? "/", `http://127.0.0.1:${port}`),
      path = url.pathname,
      raw = await read(req);
    const json = () => (raw.length ? JSON.parse(raw.toString()) : {});
    if (path === "/health") {
      send(res, { fixture: true });
      return;
    }
    const token = req.headers.authorization?.replace(/^Bearer /, "") ?? "",
      user = tokens.get(token),
      service = token === "fixture-service-key";
    if (path === "/auth/v1/token") {
      const body = json(),
        found = users.find((u) => u.email === body.email);
      if (!found || body.password !== "fixture-password") {
        send(res, { msg: "Invalid credentials" }, 400);
        return;
      }
      send(res, session(found));
      return;
    }
    if (path === "/auth/v1/user") {
      if (!user) {
        send(res, { msg: "Invalid token" }, 401);
        return;
      }
      send(res, user);
      return;
    }
    if (path === "/auth/v1/logout") {
      res.writeHead(204);
      res.end();
      return;
    }
    if (path.startsWith("/storage/v1/object/sign/") && req.method === "GET") {
      const key = signed.get(url.searchParams.get("token") ?? "");
      if (!key || !objects.has(key)) {
        send(res, { error: "Not found" }, 404);
        return;
      }
      res.writeHead(200, { "Content-Type": "image/webp" });
      res.end(objects.get(key));
      return;
    }
    await db.exec(
      `reset role;set role ${service ? "service_role" : user ? "authenticated" : "anon"};select set_config('request.jwt.claim.sub','${user?.id ?? ""}',false);`,
    );
    if (path.startsWith("/rest/v1/rpc/")) {
      const fn = path.split("/").pop()!;
      if (
        ![
          "studio_save_draft",
          "studio_publish",
          "studio_restore",
          "studio_appointment",
          "studio_manage_artist",
          "create_appointment",
        ].includes(fn)
      )
        throw Error("RPC not implemented");
      const args = json(),
        keys = Object.keys(args);
      const result = await db.query<{ result: unknown }>(
        `select public.${fn}(${keys.map((k, i) => `${k} => $${i + 1}`).join(",")}) as result`,
        Object.values(args),
      );
      send(res, result.rows[0]?.result ?? null);
      return;
    }
    if (path.startsWith("/rest/v1/")) {
      const table = path.split("/").pop()!;
      if (
        ![
          "artist_accounts",
          "artist_drafts",
          "artist_portfolio",
          "artist_public_profiles",
          "appointments",
        ].includes(table)
      )
        throw Error("Table not implemented");
      const select = url.searchParams.get("select") ?? "*";
      if (!/^[a-z_,*]+$/.test(select)) throw Error("Invalid columns");
      const values: unknown[] = [],
        conditions: string[] = [];
      for (const [key, value] of url.searchParams) {
        if (["select", "order", "limit"].includes(key)) continue;
        if (!/^[a-z_]+$/.test(key)) throw Error("Invalid filter");
        const [op, ...rest] = value.split(".");
        if (op === "eq") {
          values.push(rest.join("."));
          conditions.push(`${key}=$${values.length}`);
        } else if (op === "is" && rest[0] === "null")
          conditions.push(`${key} is null`);
        else throw Error("Filter not implemented");
      }
      const where = conditions.length
        ? " where " + conditions.join(" and ")
        : "";
      let sql: string;
      if (req.method === "GET")
        sql = `select ${select} from public.${table}${where}`;
      else if (req.method === "POST") {
        const payload = json(),
          keys = Object.keys(payload);
        if (keys.some((k) => !/^[a-z_]+$/.test(k)))
          throw Error("Invalid field");
        values.splice(0, values.length, ...Object.values(payload));
        sql = `insert into public.${table}(${keys.join(",")}) values(${keys.map((_, i) => "$" + (i + 1)).join(",")}) returning ${select}`;
      } else if (req.method === "PATCH") {
        const payload = json(),
          keys = Object.keys(payload);
        if (keys.some((k) => !/^[a-z_]+$/.test(k)))
          throw Error("Invalid field");
        const assignments = keys.map((k) => {
          values.push(payload[k]);
          return `${k}=$${values.length}`;
        });
        sql = `update public.${table} set ${assignments.join(",")}${where} returning ${select}`;
      } else if (req.method === "DELETE")
        sql = `delete from public.${table}${where} returning ${select}`;
      else throw Error("Method not implemented");
      const order = url.searchParams.get("order");
      if (req.method === "GET" && order) {
        const [column, dir] = order.split(".");
        if (!/^[a-z_]+$/.test(column)) throw Error("Invalid order");
        sql += ` order by ${column} ${dir === "desc" ? "desc" : "asc"}`;
      }
      if (req.method === "GET" && url.searchParams.has("limit"))
        sql += " limit " + Number(url.searchParams.get("limit"));
      const result = await db.query(sql, values);
      const single = String(req.headers.accept).includes("vnd.pgrst.object");
      send(res, single ? (result.rows[0] ?? null) : result.rows);
      return;
    }
    if (path.startsWith("/storage/v1/object/sign/")) {
      const rest = decodeURIComponent(
          path.slice("/storage/v1/object/sign/".length),
        ),
        [bucket, ...parts] = rest.split("/"),
        body = json();
      const paths = parts.length ? [parts.join("/")] : body.paths;
      const links = [];
      for (const name of paths) {
        const row = await db.query(
          "select id from storage.objects where bucket_id=$1 and name=$2",
          [bucket, name],
        );
        if (!row.rows.length) throw Error("Object forbidden");
        const key = bucket + "/" + name,
          nonce = randomUUID();
        signed.set(nonce, key);
        links.push({
          path: name,
          signedURL: `/object/sign/${key}?token=${nonce}`,
          error: null,
        });
      }
      send(res, parts.length ? links[0] : links);
      return;
    }
    if (path.startsWith("/storage/v1/object/") && req.method === "POST") {
      const rest = decodeURIComponent(path.slice("/storage/v1/object/".length)),
        [bucket, ...parts] = rest.split("/"),
        name = parts.join("/");
      await db.query(
        "insert into storage.objects(bucket_id,name) values($1,$2)",
        [bucket, name],
      );
      let content = raw;
      if (
        String(req.headers["content-type"]).startsWith("multipart/form-data")
      ) {
        const form = await new Request("http://fixture.invalid/", {
          method: "POST",
          headers: { "Content-Type": String(req.headers["content-type"]) },
          body: raw,
        }).formData();
        for (const value of form.values())
          if (value instanceof File)
            content = Buffer.from(await value.arrayBuffer());
      }
      objects.set(rest, content);
      send(res, { Key: rest, Id: randomUUID() });
      return;
    }
    if (path.startsWith("/storage/v1/object/") && req.method === "DELETE") {
      const bucket = path.split("/").pop()!,
        paths = json().prefixes;
      const deleted = [];
      for (const name of paths) {
        const result = await db.query(
          "delete from storage.objects where bucket_id=$1 and name=$2 returning id",
          [bucket, name],
        );
        if (result.rows.length) {
          objects.delete(bucket + "/" + name);
          deleted.push({ name });
        }
      }
      send(res, deleted);
      return;
    }
    throw Error("Fixture endpoint not implemented: " + path);
  }
  const server = createServer((req, res) => {
    queue = queue
      .then(() => handle(req, res))
      .catch((err) => {
        if (!res.headersSent)
          send(
            res,
            { message: err.message, code: err.code ?? "FIXTURE_ERROR" },
            400,
          );
        else res.end();
      });
  });
  server.listen(port, "127.0.0.1", () =>
    console.log("Local Supabase protocol fixture ready on " + port),
  );
  process.on("SIGTERM", () => {
    server.close();
    void db.close().then(() => process.exit(0));
  });
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
