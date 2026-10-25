CREATE TABLE `reflections` (
	`id` text PRIMARY KEY NOT NULL,
	`date` integer NOT NULL,
	`title` text NOT NULL,
	`firstCategory` text NOT NULL,
	`firstContent` text NOT NULL,
	`secondCategory` text NOT NULL,
	`secondContent` text NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reflections_date_unique` ON `reflections` (`date`);