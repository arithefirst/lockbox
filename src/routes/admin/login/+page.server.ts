import isAdmin from "$lib/admin-verify.js";
import sql from "$lib/SQL";
import makeId from "$lib/makeid";
import { fail, redirect } from "@sveltejs/kit";
import userLogin from "$lib/userauth";

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

    if (!(await userLogin(username, password))) {
      return fail(401, {
        error: true,
        message: "Invalid username or password",
      });
    }

    // Create the session token
    let expiry = Math.floor(Date.now() / 1000) + 30 * 86400; // 30 * 86400 is 30 days
    let token = makeId();

    // Save token in DB
    const insert = await sql`INSERT INTO admin_keys (key, expires, username)
        VALUES (${token}, ${expiry}, ${username})`;

    // Add cookie to browser
    cookies.set("adminSessionToken", token, { path: "/" });
  },
};
