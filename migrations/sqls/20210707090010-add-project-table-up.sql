CREATE TABLE `project` (
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`instId` INT(11) UNSIGNED NOT NULL,
	`title` VARCHAR(255) NOT NULL,
	`description` TEXT NULL,
	PRIMARY KEY (`id`)
)
COLLATE='utf8mb4_unicode_ci'
;
