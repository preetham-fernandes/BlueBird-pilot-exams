// src/lib/db/schema.ts
import { relations } from 'drizzle-orm';
import { 
  mysqlTable, varchar, int, timestamp, datetime, boolean, 
  primaryKey as pk, text, mysqlEnum as mysqlEnum 
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { v4 as uuidv4 } from "uuid";

// Users table
export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()), // Uses JS-generated UUID
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: datetime('email_verified'),
  password: varchar('password', { length: 255 }),
  image: varchar('image', { length: 255 }),
  role: mysqlEnum('role', ['user', 'admin']).default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Subject categories
export const subjects = mysqlTable('subjects', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  aircraftId: varchar('aircraft_id', { length: 36 }).notNull(),
});

// Aircraft table
export const aircraft = mysqlTable('aircraft', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
});

// Questions table
export const questions = mysqlTable('questions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  content: text('content').notNull(),
  subjectId: varchar('subject_id', { length: 36 }).notNull(),
  explanation: text('explanation'),
  difficulty: mysqlEnum('difficulty', ['easy', 'medium', 'hard']).default('medium'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Multiple choice options
export const options = mysqlTable('options', {
  id: varchar('id', { length: 36 }).primaryKey(),
  questionId: varchar('question_id', { length: 36 }).notNull(),
  content: text('content').notNull(),
  isCorrect: boolean('is_correct').default(false).notNull(),
});

// Tests table
export const tests = mysqlTable('tests', {
  id: varchar('id', { length: 36 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  timeLimit: int('time_limit'), // in minutes
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Test questions join table
export const testQuestions = mysqlTable('test_questions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  testId: varchar('test_id', { length: 36 }).notNull(),
  questionId: varchar('question_id', { length: 36 }).notNull(),
  order: int('order').notNull(),
});

// User test attempts
export const testAttempts = mysqlTable('test_attempts', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  testId: varchar('test_id', { length: 36 }).notNull(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: datetime('completed_at'),
  score: int('score'),
  totalQuestions: int('total_questions').notNull(),
});

// User answers
export const userAnswers = mysqlTable('user_answers', {
  id: varchar('id', { length: 36 }).primaryKey(),
  testAttemptId: varchar('test_attempt_id', { length: 36 }).notNull(),
  questionId: varchar('question_id', { length: 36 }).notNull(),
  optionId: varchar('option_id', { length: 36 }).notNull(),
  isCorrect: boolean('is_correct').notNull(),
});

// Subscriptions

export const subscriptions = mysqlTable('subscriptions', {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 }).notNull(),
    aircraftId: varchar('aircraft_id', { length: 36 }).notNull(),
    startDate: timestamp('start_date').defaultNow().notNull(),
    // Change this line:
    endDate: datetime('end_date'), // Use datetime instead of timestamp
    active: boolean('active').default(true),
    paymentId: varchar('payment_id', { length: 255 }),
  });

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  attempts: many(testAttempts),
  subscriptions: many(subscriptions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [questions.subjectId],
    references: [subjects.id],
  }),
  options: many(options),
}));

// Add more relations as needed