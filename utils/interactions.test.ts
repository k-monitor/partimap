import { describe, expect, it } from 'vitest';
import { createInteractions, deserializeInteractions, serializeInteractions } from './interactions';

describe('general', () => {
	it('handles undefined sheet', () => {
		const di = deserializeInteractions(undefined);
		expect(typeof di).toBe('object');
	});

	it('handles null sheet', () => {
		const di = deserializeInteractions(null);
		expect(typeof di).toBe('object');
	});

	it('handles undefined interactions', () => {
		const sheet = { interactions: undefined };
		const di = deserializeInteractions(sheet);
		expect(typeof di).toBe('object');
	});

	it('handles malformed interactions', () => {
		const sheet = { interactions: 'foo' };
		const di = deserializeInteractions(sheet);
		expect(typeof di).toBe('object');
	});

	it('defaults to empty enabled array', () => {
		const di = deserializeInteractions(undefined);
		expect(di.enabled).toEqual([]);
	});

	it('default to empty enabled array when input is malformed', () => {
		const sheet = { interactions: '{ "enabled": ["Point"],' };
		const di = deserializeInteractions(sheet);
		expect(di.enabled).toEqual([]);
	});

	it('defaults to 5 stars', () => {
		const di = deserializeInteractions(undefined);
		expect(di.stars).toBe(5);
	});

	it('omits unknown fields', () => {
		const interactions = { foo: 'bar' };
		const sheet = { interactions: JSON.stringify(interactions) };
		const di = deserializeInteractions(sheet);
		expect(Object.keys(di).includes('foo')).toBe(false);
	});

	it('serializes consistently', () => {
		const interactions = createInteractions({ enabled: ['Point'], stars: 3 });
		const si = serializeInteractions(interactions);
		expect(si).toBe(JSON.stringify(interactions));
	});
});

describe('pre-#2346 compatibility', () => {
	it('handles empty array', () => {
		const array: any[] = [];
		const sheet = { interactions: JSON.stringify(array) };
		const interactions = deserializeInteractions(sheet);
		expect(typeof interactions).toBe('object');
	});

	it('moves into "enabled"', () => {
		const array = ['Point', 'Rating'];
		const sheet = { interactions: JSON.stringify(array) };
		const di = deserializeInteractions(sheet);
		expect(di.enabled).toEqual(array);
	});

	it('reads star count', () => {
		const array = JSON.stringify(['stars=3']);
		const sheet = { interactions: array };
		const di = deserializeInteractions(sheet);
		expect(di.enabled).toEqual([]);
		expect(di.stars).toBe(3);
	});
});

describe('pre-#2434 compatibility', () => {
	it('enables "ShowResultsOnly" from "survey"', () => {
		const survey = JSON.stringify({ showResultsOnly: true });
		const sheet = { survey };
		const di = deserializeInteractions(sheet);
		expect(di.enabled).toEqual(['ShowResultsOnly']);
	});
});

describe('pre-#2437 compatibility', () => {
	it('reads descriptionLabel from sheet', () => {
		const descriptionLabel = 'test';
		const sheet = { descriptionLabel };
		const di = deserializeInteractions(sheet);
		expect(di.descriptionLabels.Point).toBe(descriptionLabel);
		expect(di.descriptionLabels.LineString).toBe(descriptionLabel);
		expect(di.descriptionLabels.Polygon).toBe(descriptionLabel);
	});

	it('prefers new format', () => {
		const oldLabel = 'old';
		const newLabel = 'new';
		const descriptionLabels = { Point: newLabel };
		const interactions = { descriptionLabels };
		const sheet = {
			descriptionLabel: oldLabel,
			interactions: JSON.stringify(interactions),
		};
		const di = deserializeInteractions(sheet);
		expect(di.descriptionLabels.Point).toBe(newLabel);
		expect(di.descriptionLabels.LineString).toBe(oldLabel);
		expect(di.descriptionLabels.Polygon).toBe(oldLabel);
	});
});
