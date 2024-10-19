import fs from 'node:fs/promises'
import isAdmin from "$lib/admin-verify";
import { error } from '@sveltejs/kit'

export async function GET({cookies, params}) {
    if (await isAdmin(cookies)) {
        try {
            const file = await fs.readFile("/usr/share/lockbox/" + params.filename)
            return new Response(file)
        }

        catch {
            return error(404, {message: `${params.filename} not found`})
        }
    }
    return error(401, {message: 'Not Authorized'})
}