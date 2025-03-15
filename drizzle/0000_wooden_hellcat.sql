CREATE TABLE `aircraft` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	CONSTRAINT `aircraft_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `options` (
	`id` varchar(36) NOT NULL,
	`question_id` varchar(36) NOT NULL,
	`content` text NOT NULL,
	`is_correct` boolean NOT NULL DEFAULT false,
	CONSTRAINT `options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` varchar(36) NOT NULL,
	`content` text NOT NULL,
	`subject_id` varchar(36) NOT NULL,
	`explanation` text,
	`difficulty` enum('easy','medium','hard') DEFAULT 'medium',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`aircraft_id` varchar(36) NOT NULL,
	CONSTRAINT `subjects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`aircraft_id` varchar(36) NOT NULL,
	`start_date` timestamp NOT NULL DEFAULT (now()),
	`end_date` timestamp,
	`active` boolean DEFAULT true,
	`payment_id` varchar(255),
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `test_attempts` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`test_id` varchar(36) NOT NULL,
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	`score` int,
	`total_questions` int NOT NULL,
	CONSTRAINT `test_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `test_questions` (
	`id` varchar(36) NOT NULL,
	`test_id` varchar(36) NOT NULL,
	`question_id` varchar(36) NOT NULL,
	`order` int NOT NULL,
	CONSTRAINT `test_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tests` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`time_limit` int,
	`is_published` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_answers` (
	`id` varchar(36) NOT NULL,
	`test_attempt_id` varchar(36) NOT NULL,
	`question_id` varchar(36) NOT NULL,
	`option_id` varchar(36) NOT NULL,
	`is_correct` boolean NOT NULL,
	CONSTRAINT `user_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`email_verified` timestamp,
	`password` varchar(255),
	`image` varchar(255),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
