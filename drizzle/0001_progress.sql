CREATE TABLE "lesson_progress" (
	"user_id" text NOT NULL,
	"course" text NOT NULL,
	"lesson" text NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lesson_progress_user_id_course_lesson_pk" PRIMARY KEY("user_id","course","lesson")
);
--> statement-breakpoint
CREATE TABLE "quiz_results" (
	"user_id" text NOT NULL,
	"course" text NOT NULL,
	"module" text NOT NULL,
	"total" integer NOT NULL,
	"best_correct" integer NOT NULL,
	"last_correct" integer NOT NULL,
	"attempts" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quiz_results_user_id_course_module_pk" PRIMARY KEY("user_id","course","module")
);
--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_results" ADD CONSTRAINT "quiz_results_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;