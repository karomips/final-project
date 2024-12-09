import { db } from '$lib/server/db';
import { tasks } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    const { task, reason, dueDate, petName } = await request.json(); // Remove petType

    const query = await db.insert(tasks).values({
        task: task!,
        reason: reason!,
        dueDate: dueDate!,
        petName: petName || null,
    });

    return json({ success: query.changes > 0 });
};

export const GET: RequestHandler = async () => {
    const allTasks = await db.select().from(tasks);
    return json(allTasks);
};