ALTER TABLE `aircraft` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
ALTER TABLE `subscriptions` MODIFY COLUMN `end_date` datetime;--> statement-breakpoint
ALTER TABLE `test_attempts` MODIFY COLUMN `completed_at` datetime;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT (UUID());--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email_verified` datetime;