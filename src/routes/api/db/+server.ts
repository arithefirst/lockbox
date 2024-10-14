import sql from '$lib/SQL'
import {json} from "@sveltejs/kit";

export async function GET({ cookies }) {
    const adminToken = cookies.get("adminSessionToken");

    if (adminToken !== undefined) {
        let exists = await sql`SELECT * FROM adminkeys WHERE key = ${adminToken} LIMIT 1`
        if (exists.length !== 0) {
            const passwords = await sql`SELECT * FROM passwords`
            return json(passwords)
        }

        return json({"error": "Not Authorized"})
    }

    return json({"error": "Not Authorized"})
}
