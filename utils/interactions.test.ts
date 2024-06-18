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

	it('converts old array format', () => {
		const array = ['Point', 'Rating'];
		const sheet = { interactions: JSON.stringify(array) };
		const di = deserializeInteractions(sheet);
		expect(di.drawing.length).toBe(1);
		expect(di.drawing[0].id).toBe('Point');
		expect(di.drawing[0].type).toBe('Point');
		expect(di.enabled).toEqual(['Rating']);
	});

	it('reads star count', () => {
		const array = ['stars=3'];
		const sheet = { interactions: JSON.stringify(array) };
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
		const interactions: Partial<Interactions> = {
			drawing: [{ id: 'Point', type: 'Point' }],
		};
		const sheet = { descriptionLabel, interactions: JSON.stringify(interactions) };
		const di = deserializeInteractions(sheet);
		expect(di.drawing[0].descriptionLabel).toBe(descriptionLabel);
	});

	it('prefers new format', () => {
		const oldLabel = 'old';
		const newLabel = 'new';
		const interactions: Partial<Interactions> = {
			drawing: [{ id: 'Point', type: 'Point', descriptionLabel: newLabel }],
		};
		const sheet = {
			descriptionLabel: oldLabel,
			interactions: JSON.stringify(interactions),
		};
		const di = deserializeInteractions(sheet);
		expect(di.drawing[0].descriptionLabel).toBe(newLabel);
	});
});

describe('pre-#2841 compatibility', () => {
	it('converts from "enabled" to "drawing"', () => {
		const interactions: Partial<Interactions> = {
			enabled: ['Polygon', 'Point', 'Rating'],
			buttonLabels: {
				Point: '',
				LineString: '',
				Polygon: 'label',
			},
		};
		const sheet = { interactions: JSON.stringify(interactions) };
		const di = deserializeInteractions(sheet);
		expect(di.drawing.length).toBe(2);
		expect(di.drawing[0].id).toBe('Polygon');
		expect(di.drawing[0].type).toBe('Polygon');
		expect(di.drawing[0].buttonLabel).toBe('label');
		expect(di.drawing[1].id).toBe('Point');
		expect(di.drawing[1].type).toBe('Point');
		expect(di.enabled).toEqual(['Rating']);
	});
});
