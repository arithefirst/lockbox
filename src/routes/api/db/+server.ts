import sql from '$lib/SQL'
import {json} from "@sveltejs/kit";
import isAdmin from '$lib/admin-verify'

export async function GET({ cookies }) {
    if (await isAdmin(cookies)) {
        const db = await sql`SELECT * FROM passwords ORDER BY date DESC`
        return json(db.length !== 0? {"error": null, "data": db}: {"error": "no data"})
    }

    return json({"error": "Not authorized"})
}
