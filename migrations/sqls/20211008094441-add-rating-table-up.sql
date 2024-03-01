CREATE TABLE `rating` (
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`submissionId` INT(11) UNSIGNED NOT NULL,
	`sheetId` INT(11) UNSIGNED NOT NULL,
	`featureId` BIGINT(20) UNSIGNED NOT NULL,
	`rating` TINYINT(2) UNSIGNED NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `submissionId` (`submissionId`),
	INDEX `sheetId` (`sheetId`),
	INDEX `featureId` (`featureId`)
)
COLLATE='utf8mb4_unicode_ci'
;
