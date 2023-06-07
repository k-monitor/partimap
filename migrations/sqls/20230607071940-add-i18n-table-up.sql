CREATE TABLE `i18n` (
	`lang` VARCHAR(2) NOT NULL,
	`key` VARCHAR(100) NOT NULL,
	`value` LONGTEXT NOT NULL,
	UNIQUE INDEX `uniq` (`lang`, `key`)
)
COLLATE='utf8mb4_unicode_ci'
;
