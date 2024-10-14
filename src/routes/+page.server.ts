import { fail } from '@sveltejs/kit';
import sql from '$lib/SQL'
import { writeFileSync, existsSync } from 'fs';

function makeId(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

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
        console.log(query);

        // If it doesn't exist don't save the file
        if (query.length === 0) {
            return fail(401, {
                error: true,
                message: 'Not Authorized'
            })
        }

        // Create prefix that gets added if a file already exists
        const prefix = existsSync("src/routes/admin/files/" + file.name)? makeId(5)+"-": ""

        // If the password is at it's max uses
        if (query[0]["max_uses"] == query[0]["times_used"]+1) {
            // Delete the row
            const update = await sql`DELETE FROM passwords WHERE password = ${pass}`;
        } else {
            // Else append to uploads, add 1 to times used
            const update = await sql`UPDATE passwords SET times_used = ${query[0]["times_used"]+1},
            uploads=array_append(uploads, ${prefix+file.name})`
        }

        // Write the file to the src/routes/admin/files folder, write it to 1-{filename}
        writeFileSync(`src/routes/admin/files/${prefix+file.name}`, Buffer.from(await file.arrayBuffer()));

        return {
            success: true
        };
    }
};