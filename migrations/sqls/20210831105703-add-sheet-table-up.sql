CREATE TABLE `sheet` (
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`projectId` INT(11) UNSIGNED NOT NULL,
	`ord` INT(11) UNSIGNED NOT NULL DEFAULT 0,
	`title` VARCHAR(255) NOT NULL,
	`description` TEXT NULL,
	`image` VARCHAR(255) NULL,
	`survey` TEXT NULL,
	`features` TEXT NULL,
	PRIMARY KEY (`id`),
	INDEX `projectId` (`projectId`)
)
COLLATE='utf8mb4_unicode_ci'
;
