import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({request,params}) => {
    const {username} = params;

    const {password} = await request.json();

    const query = await db.insert(users).values({username: username!, password: password!});

    return json({success: query.changes > 0});
};