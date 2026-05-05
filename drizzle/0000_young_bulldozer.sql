CREATE TABLE `entries` (
	`id` text PRIMARY KEY NOT NULL,
	`journalId` text NOT NULL,
	`bookmark` integer DEFAULT false NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`journalId`) REFERENCES `journals`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `entry_values` (
	`id` text PRIMARY KEY NOT NULL,
	`entryId` text NOT NULL,
	`fieldId` text NOT NULL,
	`value` text,
	FOREIGN KEY (`entryId`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`fieldId`) REFERENCES `fields`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `entry_field_unique` ON `entry_values` (`entryId`,`fieldId`);--> statement-breakpoint
CREATE TABLE `fields` (
	`id` text PRIMARY KEY NOT NULL,
	`journalId` text NOT NULL,
	`type` text NOT NULL,
	`label` text NOT NULL,
	`sortOrder` integer NOT NULL,
	FOREIGN KEY (`journalId`) REFERENCES `journals`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `journals` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
