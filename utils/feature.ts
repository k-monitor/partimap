/**
 * Determines if "pointer" cursor is needed above feature.
 */
export function isFeatureActive(
	featureProperties: Record<string, any>,
	isOnEditorView: boolean,
	isOnInteractiveSheet: boolean,
) {
	// admin can always select features
	if (isOnEditorView) return true;

	// visitors...

	if (isOnInteractiveSheet) {
		// ...on interactive sheets
		// can select their own features
		if (featureProperties.visitorFeature) return true;

		// or can open bubbles on static features
		if (!isFeatureDescriptionEmpty(featureProperties.description)) return true;
	} else {
		// ...on static sheets
		// can select non-hidden features
		if (!featureProperties.hidden) return true;
	}

	return false;
}

export function isFeatureDescriptionEmpty(description?: string) {
	return !(description || '')
		.replace(/<iframe.*?>/, 'iframe')
		.replace(/<.*?>/g, '')
		.trim();
}
