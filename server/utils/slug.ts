import slugify from 'slugify';
import * as pdb from '~/server/data/projects';

export async function generateValidSlug(seed: string, currentId?: number) {
	const slug = slugify(seed);
	const ep = await pdb.findBySlug(slug);
	if (!ep || ep.id === currentId) {
		// generated slug is not taken or it is the same as current
		return slug;
	}
	return generateValidSlug(slug + '-1', currentId);
}
