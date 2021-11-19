ALTER TABLE `project`
	ADD COLUMN `thanks` TEXT NULL AFTER `privacyPolicy`,
	ADD COLUMN `thanksUrl` VARCHAR(255) NULL AFTER `thanks`,
	ADD COLUMN `thanksSocial` TINYINT(1) NULL AFTER `thanksUrl`;
