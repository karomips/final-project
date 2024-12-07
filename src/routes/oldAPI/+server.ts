import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { RunnableQuery } from 'drizzle-orm/runnable-query';
import { sha512 } from 'js-sha512';
import CryptoJS from "crypto-js"

export const GET: RequestHandler = async () => {
    const results = await db.select().from(users)

    return json({data: results} );
};

export const POST: RequestHandler = async ({request}) => {
    const {username,password} = await request.json();

    if(!username || !password) {
        return json({message: 'Missing Values Found!'}, {status: 400});
    }
    
    const query = await db.insert(users).values({username: username, password: sha512(password) });

    return json({success: true});
   
};

export const PUT: RequestHandler = async ({request})=> {
    const {body,key} = await request.json();

    const decrypted = CryptoJS.AES.decrypt(body,key).toString(CryptoJS.enc.Utf8);

    let requestBody:any =  JSON.parse(decrypted);

    if(!requestBody.username || !requestBody.password) {
        return json({message: 'Missing Values Found!'}, {status: 400});
    }

    const query = await db.insert(users).values({username: requestBody.username, password: sha512(requestBody.password) });

    return json({success: query.changes > 0});
}