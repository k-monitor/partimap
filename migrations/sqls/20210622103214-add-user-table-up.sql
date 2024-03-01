CREATE TABLE `user` (
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`email` VARCHAR(191) NOT NULL,
	`password` VARCHAR(255) NOT NULL,
	`name` VARCHAR(255) NOT NULL,
	`registered` BIGINT(20) NOT NULL,
	`instId` INT(11) UNSIGNED NULL,
	`isAdmin` TINYINT(1) NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`),
	UNIQUE INDEX `email` (`email`)
)
COLLATE='utf8mb4_unicode_ci'
;
