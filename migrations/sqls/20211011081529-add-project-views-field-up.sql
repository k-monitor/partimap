ALTER TABLE `project`
	ADD COLUMN `views` INT(11) NOT NULL DEFAULT 0 AFTER `password`;