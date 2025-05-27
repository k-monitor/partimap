import { inTransaction, query } from '~/server/utils/database';

/*
	In the past we had a bug which caused project.views value to reset when a
	project was modified.

	This resulted in view counts lower than submission counts for some projects.

	Since we have no information about when the view counters were reset and
	how many views were lost, we can only patch the views to match the
	submission counts.
*/

async function main() {
	const rows = await query(`
		SELECT p.id projectId, COUNT(s.id) submissions, p.views
		FROM project p
		INNER JOIN submission s ON s.projectId = p.id
		GROUP BY p.id
		HAVING views < submissions
	`);
	for (const row of rows) {
		const { projectId, submissions, views } = row;
		await inTransaction(async (connection) => {
			const modifiedViews = submissions;
			console.log('Patching project', projectId, 'views from', views, 'to', modifiedViews);
			await connection.execute('UPDATE project SET views = ? WHERE id = ?', [
				modifiedViews,
				projectId,
			]);
			await connection.execute('INSERT INTO project_views_patches VALUES (?, ?, ?, ?, ?)', [
				projectId,
				Date.now(),
				submissions,
				views,
				modifiedViews,
			]);
		});
	}
}

main().then(() => process.exit(0));
