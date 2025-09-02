CREATE TABLE sheet_time (
	submissionId INT NOT NULL,
	sheetId INT NOT NULL,
	spentTimeMs INT NOT NULL,
	PRIMARY KEY (submissionId, sheetId),
	INDEX idx_sheetId (sheetId)
);
