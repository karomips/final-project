import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tblTasks', {
    task: text('task').notNull(),
    reason: text('reason').notNull(),
    dueDate: text('dueDate').notNull(),
    petName: text('petName'),
});