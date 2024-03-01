ALTER TABLE `project`
	ADD COLUMN `slug` VARCHAR(191) NULL AFTER `userId`,
	ADD COLUMN `password` VARCHAR(255) NULL AFTER `description`,
	ADD UNIQUE INDEX `slug` (`slug`),
	ADD INDEX `userId` (`userId`);
