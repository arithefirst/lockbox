import { fail } from '@sveltejs/kit';
import sql from '$lib/SQL'
import makeId from '$lib/makeid'
import { writeFileSync, existsSync } from 'node:fs';

export const actions = {
    default: async ({ request }) => {
        const formData = Object.fromEntries(await request.formData());
        if (!(formData.file as File).name || (formData.file as File).name === 'undefined') {
            return fail(400, {
                error: true,
                message: 'You must provide a file to upload'
            });
        }

        const {file} = formData as { file: File };
        const pass = formData.password as string;

        // Query for the password
        const query = await sql`SELECT * FROM passwords WHERE password = ${pass}`;

        // If it doesn't exist don't save the file
        if (query.length === 0) {
            return fail(401, {
                error: true,
                message: 'Not Authorized'
            })
        }

        // Create prefix that gets added if a file already exists
        const prefix = existsSync("/usr/share/lockbox/" + file.name)? makeId(5)+"-": ""

        // If the password is at max uses
        if (query[0]["max_uses"] < query[0]["times_used"]+1) {
            return fail(401, {
                error: true,
                message: 'Not Authorized: Password Expired'
            })
        } else {
            // Else append to uploads, add 1 to times used
            const update = await sql`UPDATE passwords SET times_used = ${query[0]["times_used"]+1},
            uploads=array_append(uploads, ${prefix+file.name}) WHERE password = ${pass}`
        }

        // Write the file to the /usr/share/lockbox dir, write it to 1-{filename}
        writeFileSync(`/usr/share/lockbox/${prefix+file.name}`, Buffer.from(await file.arrayBuffer()));

        return {
            success: true,
            filename: file.name
        };
    }
};