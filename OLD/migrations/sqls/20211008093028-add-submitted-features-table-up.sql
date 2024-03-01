CREATE TABLE `submitted_features` (
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`submissionId` INT(11) UNSIGNED NOT NULL,
	`sheetId` INT(11) UNSIGNED NOT NULL,
	`features` TEXT NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `submissionId` (`submissionId`),
	INDEX `sheetId` (`sheetId`)
)
COLLATE='utf8mb4_unicode_ci'
;
