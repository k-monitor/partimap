CREATE TABLE `submission` (
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`projectId` INT(11) UNSIGNED NOT NULL,
	`timestamp` BIGINT(20) UNSIGNED NOT NULL,
	`ip` VARCHAR(255) NOT NULL,
	`ua` VARCHAR(500) NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `projectId` (`projectId`)
)
COLLATE='utf8mb4_unicode_ci'
;
