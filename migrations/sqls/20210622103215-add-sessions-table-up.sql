CREATE TABLE `sessions` (
	`session_id` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_bin',
	`expires` INT(10) UNSIGNED NOT NULL,
	`data` MEDIUMTEXT NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	PRIMARY KEY (`session_id`) USING BTREE
)
COLLATE='utf8mb4_unicode_ci'
;
