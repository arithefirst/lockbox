import sql from '$lib/SQL'
import {json} from "@sveltejs/kit";
import isAdmin from '$lib/admin-verify'

export async function GET({ cookies }) {
    if (await isAdmin(cookies)) {
        const db = await sql`SELECT * FROM passwords`
        return json({"error": null, "data": db})
    }

    return json({"error": "Not authorized"})
}
