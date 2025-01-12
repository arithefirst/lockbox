import makeId from "$lib/makeid";
import { createHash } from "node:crypto";
import { fail, redirect } from "@sveltejs/kit";
import sql from "$lib/SQL";
import isAdmin from "$lib/admin-verify.js";
import userLogin from "$lib/userauth";
import fs from "node:fs";
import type { Row } from "postgres";

export async function load({ cookies }) {
  if (!(await isAdmin(cookies))) {
    // If the user is not logged in, send them to the login page
    cookies.delete("adminSessionToken", { path: "/" });
    redirect(307, "/admin/login");
  }

  async function getUsers(): Promise<any[] | 'Not Authorized'> {
    if (await isAdmin(cookies)) {
      const db = await sql`SELECT username FROM admin_logins`;
      return db.map((db) => db.username)
    }
    return 'Not Authorized';
  }

  async function getCurrentUser(): Promise<Row | 'Not Authorized'> {
    if (await isAdmin(cookies)) {
      const adminToken = cookies.get('adminSessionToken')!;
      const user = await sql`SELECT username FROM admin_keys WHERE key = ${adminToken}`;
      return user[0]
    }
    return 'Not Authorized';
  }

  return {
    users: await getUsers(),
    current: await getCurrentUser()
  };
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
    const salt = makeId();
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

    // Current Creds
    const password = formData.currentPassword as string;
    const username = formData.currentUsername as string;

    // Updated Creds
    const newUsername = formData.newUsername as string;
    const newPassword = formData.newPassword as string;

    if (!(await userLogin(username, password))) {
      console.log("Wrong password");
      return fail(401, {
        error: true,
        form: "edit",
        success: false,
        user: username,
        message: "Invalid username or password",
      });
    }

    // Evaluate the inputs and update the database
    if (newUsername !== "" && newPassword == "") {
      const updateUser = await sql`UPDATE admin_logins SET username = ${newUsername} WHERE username = ${username}`;
      return { success: true, user: username, form: "edit" };
    } else if (newPassword !== "" && newUsername == "") {
      const salt = makeId();
      const updateUser = await sql`UPDATE admin_logins SET salt = ${salt}, hash = ${createHash("sha256")
        .update(salt + newPassword)
        .digest("hex")} WHERE username = ${username}`;
      return { success: true, user: username, form: "edit" };
    } else if (newPassword !== "" && newPassword !== "") {
      const salt = makeId();
      const updateUser = await sql`UPDATE admin_logins SET salt = ${salt}, hash = ${createHash("sha256")
        .update(salt + newPassword)
        .digest("hex")}, username = ${newUsername} WHERE username = ${username}`;
      return { success: true, user: username, form: "edit" };
    } else {
      return fail(400, {
        error: true,
        form: "edit",
        success: false,
        user: username,
        message: "1+ Fields must be filled.",
      });
    }
  },
  delete: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());
    const username = formData.username as string;
    const deleteUser = await sql`DELETE FROM admin_logins WHERE username = ${username}`;
    return { success: true, user: username, form: "delete" };
  },
  deletePassword: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());
    const password = formData.password as string;

    try {
      const fileRequest = await sql`SELECT uploads FROM passwords WHERE password = ${password} LIMIT 1`;
      const files = fileRequest[0]["uploads"];

      if (files !== null) {
        for (const file of files) {
          fs.rmSync("/usr/share/lockbox/" + file, { force: true });
        }
      }

      const delPassword = await sql`DELETE FROM passwords WHERE password = ${password}`;
    } catch (e) {
      return fail(500, {
        success: false,
        message: "Something went wrong server side",
      });
    }

    return { success: true };
  },
};
