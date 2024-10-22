import {error, json, type RequestHandler} from '@sveltejs/kit';
import makeId from "$lib/makeid";
import sql from '$lib/SQL'
import fs from "node:fs";

export const POST = (async ({ params, request, url }) => {
    // ----------------
    //  Authentication
    // ----------------
    let password = url.searchParams.get('pw');
    const query = await sql`SELECT * FROM passwords WHERE password = ${password}`;
    if (query.length === 0) {
        return error(401, {message: 'Not Authorized'})
    }

    // Create prefix that gets added if a file already exists
    const filename = params.file;
    const stream = request.body;
    const prefix = fs.existsSync("/usr/share/lockbox/" + filename)? makeId(5)+"-": ""

    // Data validation
    if (!filename) return error(400, 'No path received');
    if (!stream) return error(400, 'No body received');

    // If the password is at max uses
    if (query[0]["max_uses"] < query[0]["times_used"]+1) {
        return error(401, {message: 'Not Authorized: Password Expired'})
    } else {
        // Else append to uploads, add 1 to times used
        const update = await sql`UPDATE passwords SET times_used = ${query[0]["times_used"]+1},
        uploads=array_append(uploads, ${prefix+filename}) WHERE password = ${password}`
    }

    // -------------------------
    //  File stream downloading
    // -------------------------
    const diskStream = fs.createWriteStream(`/usr/share/lockbox/${prefix+filename}`);
    diskStream.on('error', (err) => {
        console.log(`Stream error: ${err}`);
    });

    const writeableStream = new WritableStream<Uint8Array>({
        write(chunk: Uint8Array) {
            diskStream.write(chunk);
        },
        close() {
            diskStream.end();
        },
        abort(err) {
            diskStream.end();
            // Delete unfinished file
            fs.rmSync(`/usr/share/lockbox/${prefix+filename}`, {
                force: true,
            });

            return err
        },
    });

    let errormsg: any
    // Promisify and wait for stream to finish
    const success = await new Promise<boolean>((resolve) =>
        stream
            .pipeTo(writeableStream) // Pipe it!
            .then(() => resolve(true))
            .catch((err) => {
                errormsg = err
                console.error(`Error during piping: ${err}`);
                resolve(false)
            })
    );

    if (!success) {
        return error(500, {message: errormsg});
    } else {
        return json({filename: prefix+filename});
    }
}) satisfies RequestHandler;