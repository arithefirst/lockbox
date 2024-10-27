import isAdmin from "$lib/admin-verify.js";
import sql from "$lib/SQL";
import { createHash } from "node:crypto";
import makeId from "$lib/makeid";
import { fail, redirect } from "@sveltejs/kit";

export async function load({ cookies }) {
  // If the user is logged in send them back to /admin
  if (await isAdmin(cookies)) {
    redirect(307, "/admin/");
  }
}

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = Object.fromEntries(await request.formData());

    const password = formData.password as string;
    const username = formData.username as string;

    const userinfo = await sql`SELECT * FROM admin_logins 
        WHERE username = ${username} LIMIT 1`;

    // If no username matches are found return a 401
    if (userinfo.length === 0) {
      return fail(401, {
        error: true,
        message: "Not Authorized",
      });
    }

    let hash = createHash("sha256")
      .update(userinfo[0]["salt"] + password)
      .digest("hex");
    // If calculated hash does not match stored hash return a 401
    if (userinfo[0]["hash"] != hash) {
      return fail(401, {
        error: true,
        message: "Not Authorized",
      });
    }

    // Create the session token
    let expiry = Math.floor(Date.now() / 1000) + 30 * 86400; // 30 * 86400 is 30 days
    let token = makeId(32);

    // Save token in DB
    const insert = await sql`INSERT INTO admin_keys (key, expires, username)
        VALUES (${token}, ${expiry}, ${username})`;

    // Add cookie to browser
    cookies.set("adminSessionToken", token, { path: "/" });
  },
};
