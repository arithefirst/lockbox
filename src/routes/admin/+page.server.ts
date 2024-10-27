import makeId from "$lib/makeid";
import { createHash } from "node:crypto";
import { error, fail, redirect } from "@sveltejs/kit";
import sql from "$lib/SQL";
import isAdmin from "$lib/admin-verify.js";

export async function load({ cookies }) {
  if (!(await isAdmin(cookies))) {
    // If the user is not logged in send them to login
    cookies.delete("adminSessionToken", { path: "/" });
    redirect(307, "/admin/login");
  }
}

export const actions = {
  addPassword: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());

    const password = formData.password as string;
    const maxuses = formData.maxuses as string;

    // If maxuses is 0 or negative return an error
    if (+maxuses <= 0) {
      return fail(400, {
        error: true,
        message: "Max Uses cannot be less than 1",
      });
    }

    try {
      // Try to insert the new password into the table
      const insert = await sql`INSERT INTO passwords (password, max_uses, times_used, date)
            VALUES (${password}, ${+maxuses}, 0, ${Math.floor(Date.now() / 1000)})`;

      return { success: true, message: "Success", password: password, form: "newPassword" };
    } catch (error) {
      // If the password already exists return an error
      if (error instanceof Error) {
        if (error.message === 'duplicate key value violates unique constraint "passwords_pkey"') {
          return fail(400, {
            error: true,
            message: `Password "${password}" already exists`,
            form: "newPassword",
          });
        }
      }
    }
  },
  addUser: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());

    const username = formData.username as string;
    const password = formData.password as string;
    const salt = makeId(16);
    try {
      // Try to insert the new password into the table
      const insert = await sql`INSERT INTO admin_logins (username, salt, hash)
            VALUES (${username}, ${salt}, ${createHash("sha256")
              .update(salt + password)
              .digest("hex")})`;

      return { success: true, message: "Success", user: username, form: "newUser" };
    } catch (error) {
      // If the password already exists return an error
      if (error instanceof Error) {
        if (error.message === 'duplicate key value violates unique constraint "admin_logins_pkey"') {
          return fail(400, {
            error: true,
            message: `User "${username}" already exists`,
            form: "newUser",
          });
        }
      }
    }
  },
  logout: async ({ cookies }) => {
    const removeToken = await sql`DELETE FROM admin_keys`;

    cookies.delete("adminSessionToken", { path: "/" });
    redirect(307, "/admin/login");
  },
  edit: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());
    const username = formData.username as string;

    return { success: true, user: username, form: "edit" };
  },
  delete: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());
    const username = formData.username as string;

    return { success: true, user: username, form: "delete" };
  },
};
