// +server.ts
import { db } from '$lib/server/db';
import { tasks } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';

// Handle POST request to add a new task
export const POST: RequestHandler = async ({ request }) => {
    const { task, reason, dueDate, petName } = await request.json(); // Remove petType

    // Ensure dueDate is included in the insert
    const query = await db.insert(tasks).values({
        task: task!,
        reason: reason!,
        dueDate: dueDate!, // Include dueDate in the insert
        petName: petName || null, // Include petName in the insert
        // Remove petType from the insert
    });

    return json({ success: query.changes > 0 });
};

// Handle GET request to fetch all tasks
export const GET: RequestHandler = async () => {
    const allTasks = await db.select().from(tasks);
    return json(allTasks);
};