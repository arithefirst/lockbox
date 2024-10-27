import sql from "$lib/SQL";
import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import isAdmin from "$lib/admin-verify";

export async function GET({ cookies }) {
  if (await isAdmin(cookies)) {
    const adminToken = cookies.get("adminSessionToken")!;
    const user = await sql`SELECT username FROM admin_keys WHERE key = ${adminToken}`;
    return json(user[0]);
  }

  return error(401, { message: "Not Authorized" });
}
