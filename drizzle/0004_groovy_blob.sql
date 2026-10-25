PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_journals` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`oneEntry` integer DEFAULT false NOT NULL,
	`locked` integer DEFAULT false NOT NULL,
	`notificationTime` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_journals`("id", "name", "icon", "color", "oneEntry", "locked", "notificationTime", "createdAt", "updatedAt") SELECT "id", "name", "icon", "color", "oneEntry", "locked", "notificationTime", "createdAt", "updatedAt" FROM `journals`;--> statement-breakpoint
DROP TABLE `journals`;--> statement-breakpoint
ALTER TABLE `__new_journals` RENAME TO `journals`;--> statement-breakpoint
PRAGMA foreign_keys=ON;