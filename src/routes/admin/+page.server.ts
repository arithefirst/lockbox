import isAdmin from "$lib/admin-verify.js";
import sql from '$lib/SQL'
import {fail, redirect} from "@sveltejs/kit";

export async function load( {cookies} ) {
    if (!await isAdmin(cookies)) {
        // If the user is not logged in send them to login
        cookies.delete('adminSessionToken', {path: '/'});
        redirect(307, "/admin/login")
    }
}

export const actions = {
    addPassword: async ({request}) => {
        const formData = Object.fromEntries(await request.formData());

        const password = formData.password as string;
        const maxuses = formData.maxuses as string;

        if (+maxuses <= 0) {
            return fail(400, {
                error: true,
                message: 'Max Uses cannot be less than 1'
            })
        }

        const insert = await sql`INSERT INTO passwords (password, max_uses, times_used, date)
        VALUES (${password}, ${+maxuses}, 0, ${Math.floor(Date.now() / 1000)})`

        return { success: true, message: "Success", password: password };
    },
};
