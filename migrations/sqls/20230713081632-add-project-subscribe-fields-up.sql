ALTER TABLE `project`
	ADD COLUMN `subscribe` VARCHAR(1) NOT NULL DEFAULT 'N' AFTER `views`,
	ADD COLUMN `unsubscribeToken` VARCHAR(255) NULL AFTER `subscribe`,
	ADD COLUMN `lastSent` BIGINT(20) NOT NULL DEFAULT 0 AFTER `unsubscribeToken`;
