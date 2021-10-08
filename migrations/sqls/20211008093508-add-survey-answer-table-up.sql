CREATE TABLE `survey_answer` (
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`submissionId` INT(11) UNSIGNED NOT NULL,
	`sheetId` INT(11) UNSIGNED NOT NULL,
	`questionId` VARCHAR(191) NOT NULL,
	`answer` TEXT NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `submissionId` (`submissionId`),
	INDEX `sheetId` (`sheetId`),
	INDEX `questionId` (`questionId`)
)
COLLATE='utf8mb4_unicode_ci'
;
