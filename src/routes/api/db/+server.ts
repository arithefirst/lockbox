import sql from '$lib/SQL'
import {json} from "@sveltejs/kit";
import isAdmin from '$lib/admin-verify'

export async function GET({ cookies }) {
    return json({"admin": await isAdmin(cookies)})
}
