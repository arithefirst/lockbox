import sql from "$lib/SQL";
import { createHash } from "node:crypto";

async function userLogin(username: string, password: string): Promise<boolean> {
  const userinfo = await sql`SELECT * FROM admin_logins WHERE username = ${username} LIMIT 1`;

  // If no username matches are found fail the login
  if (userinfo.length === 0) {
    return false;
  }

  const hash = createHash("sha256")
    .update(userinfo[0]["salt"] + password)
    .digest("hex");

  console.log(hash);
  console.log(userinfo[0]["salt"], userinfo[0]["hash"]);

  // If calculated hash does not match stored hash fail the login
  return userinfo[0]["hash"] == hash;
}

export default userLogin;
