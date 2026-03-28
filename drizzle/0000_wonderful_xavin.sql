CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`color` text DEFAULT '#ffffff',
	`is_pinned` integer DEFAULT false,
	`is_archived` integer DEFAULT false,
	`reminder_at` text,
	`labels` text,
	`checklist` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`username` text NOT NULL,
	`avatar_url` text,
	`theme` text DEFAULT 'light',
	`label_definitions` text,
	`created_at` text NOT NULL
);
