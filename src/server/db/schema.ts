import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/*
 * The database tables, described in TypeScript. `yarn db:generate` turns a change here into an SQL
 * migration in drizzle/, which is applied when the app starts (see src/instrumentation.ts).
 * Property names are camelCase, columns snake_case (casing: "snake_case" in db and drizzle.config).
 */

// Timestamps with the time zone, so the server's zone never shifts them.
const createdAt = () =>
  timestamp({ withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

/*
 * Login (Better Auth, src/server/auth.ts). The fields follow Better Auth's core schema; it writes
 * and reads these tables itself.
 */

export const users = pgTable("users", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

// A signed-in browser. The token is in the session cookie; deleting the row signs it out.
export const sessions = pgTable(
  "sessions",
  {
    id: text().primaryKey(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    token: text().notNull().unique(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index().on(table.userId)],
);

// A way to sign in: Google, or a magic link ("credential" accounts are not used – no passwords).
export const accounts = pgTable(
  "accounts",
  {
    id: text().primaryKey(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ withTimezone: true }),
    refreshTokenExpiresAt: timestamp({ withTimezone: true }),
    scope: text(),
    password: text(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index().on(table.userId)],
);

// Short-lived tokens, e.g. the magic links sent by e-mail.
export const verifications = pgTable(
  "verifications",
  {
    id: text().primaryKey(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index().on(table.identifier)],
);

/*
 * Progress. Courses, modules and lessons are identified by their folder and file names in content/
 * (course.slug, module.slug, lesson.slug) – the same in every language, unlike the URLs.
 */

// A lesson the user marked as done.
export const lessonProgress = pgTable(
  "lesson_progress",
  {
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    course: text().notNull(),
    lesson: text().notNull(),
    completedAt: createdAt(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.course, table.lesson] }),
  ],
);

// The result of a module's quiz: the best and the last attempt.
export const quizResults = pgTable(
  "quiz_results",
  {
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    course: text().notNull(),
    module: text().notNull(),
    // Number of questions when the quiz was taken – the quiz can grow later.
    total: integer().notNull(),
    bestCorrect: integer().notNull(),
    lastCorrect: integer().notNull(),
    attempts: integer().notNull().default(1),
    // When the best result was reached – the date of a "perfect quiz" badge.
    bestAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.course, table.module] }),
  ],
);
