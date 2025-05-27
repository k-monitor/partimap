CREATE TABLE project_views_patches (
	projectId INT UNSIGNED NOT NULL,
	timestamp BIGINT(20) UNSIGNED NOT NULL,
	submissions INT NOT NULL DEFAULT 0,
	views INT NOT NULL DEFAULT 0,
	modifiedViews INT NOT NULL DEFAULT 0,
	PRIMARY KEY (projectId, timestamp)
);
