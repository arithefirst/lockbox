import sql from '$lib/SQL'
import client from "$lib/redis";
import {json} from "@sveltejs/kit";

export async function GET({ cookies }) {
    await client.connect()
    const adminToken = cookies.get("adminSessionToken");

    if (adminToken !== undefined) {
        let exists: number = await client.exists(adminToken)

        if (exists === 1) {
            const passwords = await sql`SELECT * FROM passwords`
            await client.disconnect()
            return json(passwords)
        }

        await client.disconnect()
        return json({"error": "Not Authorized"})
    }

    await client.disconnect()
    return json({"error": "Not Authorized"})
}
