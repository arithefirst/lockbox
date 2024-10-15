import {type Cookies, json} from "@sveltejs/kit";
import sql from "$lib/SQL";

async function isAdmin(cookies: Cookies) :Promise<boolean> {
    const adminToken = cookies.get("adminSessionToken");
    if (adminToken !== undefined) {
        const keyRow = await sql`SELECT * FROM admin_keys WHERE key = ${adminToken} LIMIT 1`
        console.log(keyRow);
        if (keyRow.length !== 0) {
            // Delete entry if expired
            if (keyRow[0]["expires"] < Math.floor(Date.now() / 1000)) {
                console.log(`Deleting: Diff = ${Date.now() - keyRow[0]["expires"]}`);
                console.log(`Time = ${Date.now()}, Storedtime = ${keyRow[0]["expires"]}`);
                const deleteRow = await sql`DELETE FROM admin_keys WHERE key = ${adminToken}`
                return false
            }
            return true
        }
        return false
    }
    return false
}
export default isAdmin;