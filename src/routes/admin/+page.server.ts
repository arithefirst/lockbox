import isAdmin from "$lib/admin-verify.js";
import {redirect} from "@sveltejs/kit";

export async function load( {cookies} ) {
    if (!await isAdmin(cookies)) {
        // If the user is not logged in send them to login
        cookies.delete('adminSessionToken', {path: '/'});
        redirect(307, "/admin/login")
    }
}