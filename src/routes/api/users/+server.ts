import sql from "$lib/SQL";
import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import isAdmin from "$lib/admin-verify";

export async function GET({ cookies }) {
  if (await isAdmin(cookies)) {
    const db = await sql`SELECT username FROM admin_logins`;
    return json(db.length !== 0 ? { error: null, data: db.map((db) => db.username) } : { error: "no data" });
  }

  return error(401, { message: "Not Authorized" });
}
