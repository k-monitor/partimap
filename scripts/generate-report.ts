import slugify from 'slugify';
import * as pdb from '~/server/data/projects';
import generateReport from '~/server/utils/generateReport';
import nuxtConfig from '~/nuxt.config';

const locales = (nuxtConfig.i18n?.locales || []).map((loc) =>
	typeof loc === 'string' ? loc : loc.code,
);

function printUsageAnExit() {
	console.log(`Usage: pnpm report <projectID> <${locales.join('|')}>`);
	process.exit(0);
}

const projectId: number = Number(process.argv[2]);
if (!projectId) printUsageAnExit();

const lang: string = process.argv[3];
if (!locales.includes(lang)) printUsageAnExit();

const project = await pdb.findById(projectId);
if (!project) {
	console.error(`Project ${projectId} not found`);
	process.exit(1);
}

console.time('Export generated in');
const wb = await generateReport(project, lang);
const filename = `${slugify(project.title || 'export')}.xlsx`;
console.timeEnd('Export generated in');
wb.write(filename);
console.log('Export written to', filename);
process.exit(0); // release database connections
