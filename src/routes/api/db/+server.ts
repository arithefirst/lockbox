import sql from '$lib/SQL'
import {json} from "@sveltejs/kit";

export async function GET({ cookies }) {
    const adminToken = cookies.get("adminSessionToken");

    if (adminToken !== undefined) {
        let keyRow = await sql`SELECT * FROM adminkeys WHERE key = ${adminToken} LIMIT 1`
        if (keyRow.length !== 0) {

            // Delete entry if expired
            if (keyRow[0]["expires"] < Date.now()) {
                const deleteRow = await sql`DELETE FROM adminkeys WHERE key = ${adminToken}`
                return json({"error": "Not Authorized"})
            }

            const passwords = await sql`SELECT * FROM passwords`
            return json(passwords)
        }

        return json({"error": "Not Authorized"})
    }

    return json({"error": "Not Authorized"})
}
