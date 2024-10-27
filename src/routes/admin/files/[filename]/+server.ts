import fs from "node:fs/promises";
import { createReadStream } from "node:fs";
import isAdmin from "$lib/admin-verify";
import { error } from "@sveltejs/kit";

export async function GET({ cookies, params }) {
  if (await isAdmin(cookies)) {
    try {
      const file = await fs.readFile("/usr/share/lockbox/" + params.filename);
      return new Response(file);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message.includes("greater than 2 GiB")) {
          const fileStream = createReadStream("/usr/share/lockbox/" + params.filename);
          // @ts-ignore
          return new Response(fileStream, {
            status: 200,
            headers: {
              "Content-Type": "application/octet-stream",
              "Accept-Ranges": "bytes",
              "Cache-Control": "public, max-age=31536000",
            },
          });
        } else {
          return error(404, { message: e.message });
        }
      } else {
        return error(400);
      }
    }
  }
  return error(401, { message: "Not Authorized" });
}
