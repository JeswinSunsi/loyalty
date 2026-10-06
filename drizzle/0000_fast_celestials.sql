CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone_hash` text NOT NULL,
	`birth_hash` text NOT NULL,
	`phone_last4` text NOT NULL,
	`card_token` text NOT NULL,
	`punches` integer DEFAULT 0 NOT NULL,
	`last_punch_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_phone_hash_unique` ON `customers` (`phone_hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `customers_card_token_unique` ON `customers` (`card_token`);