// schema.ts
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tblTasks', {
    task: text('task').notNull(),
    reason: text('reason').notNull(),
    dueDate: text('dueDate').notNull(), // Add dueDate field
    petName: text('petName'), // Add petName field
    // Remove petType field
});