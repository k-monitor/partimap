ALTER TABLE rating CHANGE COLUMN featureId featureId BIGINT(20) UNSIGNED NOT NULL DEFAULT 0 COLLATE 'utf8mb4_unicode_ci' AFTER sheetId;
