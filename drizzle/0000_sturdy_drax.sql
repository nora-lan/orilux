CREATE TABLE `community_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`article_id` text NOT NULL,
	`owner_hash` text NOT NULL,
	`nickname` text NOT NULL,
	`body` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `comments_article_created` ON `community_comments` (`article_id`,`created_at`,`id`);--> statement-breakpoint
CREATE TABLE `comment_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_hash` text NOT NULL,
	`client_request_id` text NOT NULL,
	`ip_hash` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `submissions_owner_request` ON `comment_submissions` (`owner_hash`,`client_request_id`);--> statement-breakpoint
CREATE INDEX `submissions_owner_created` ON `comment_submissions` (`owner_hash`,`created_at`);--> statement-breakpoint
CREATE INDEX `submissions_ip_created` ON `comment_submissions` (`ip_hash`,`created_at`);--> statement-breakpoint
CREATE INDEX `submissions_created` ON `comment_submissions` (`created_at`);