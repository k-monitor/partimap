# Remarks on KML export/import

Partimap uses [OpenLayers' KML](https://openlayers.org/en/v6.15.1/apidoc/module-ol_format_KML-KML.html) export/import features (`readFeatures` and `writeFeatures` functions), although it additonally prepares the imported XML and post-process the exported XML.


## Post-processing the exported KML

Partimap, after calling OpenLayers' `writeFeatures` function, applies 2 modifications to each `Placemark` element in the KML:

1. It removes the `description` element and places the description content into `ExtendedData` with a data name of `partimapDescription`. This is needed because if you import the exported KML into Google MyMaps and export from there, the `description` element will contain every `ExtendedData` field and a localized title for the description, which makes the `description` element useless.
2. Adds `Style > IconStyle` for points, with the color and a blank Google MyMaps marker. This is needed because OpenLayers does not add a style for points, and the blank icon is necessary if we want to see the color in Google MyMaps.


## Preparing the imported KML

Partimap, before calling OpenLayers' `readFeatures` function applies the following modifications to each `Placemark` element in the KML:

1. If the placemark has no identifier, Partimap generates one. The ID will be `T-N+i`, where `T` is the starting timestamp of the import process, `N` is the total number of `Placemark` elements and `i` is the zero-based index of the current `Placemark`.
2. Follows `styleUrl` and attempts to parse color and width from a shared `Style` element, then attempts to parse these parameters from the `Placemark`'s own `Style` element, and finally saves this data into `ExtendedData`, overwriting `color` and `width` data there.
3. Reads `partimapDescription` from `ExtendedData`, then removes it. If it's not empty, overwrites the contents of the `description` elements. Please see the reason above.


## How things are imported

- Feature name is read from `name` element, by OpenLayers.
- Feature description is read from the following locations (first non-empty value will be read):
	- `ExtendedData > Data[name="partimapDescription"] > value`
	- `description`
- Feature color and width are read from the following locations (first non-empty value will be read):
	- `Document > Style[id="x"] > ...`, linked with `Placemark > styleUrl`)
	- `Style > ...`
	- `ExtendedData > Data[name="color|width"] > value`
- Feature line styling is read from `ExtendedData > Data[name="dash"] > value`, since it is not supported in KML. The value is a string containing comma-separated numbers, which represent line segment lengths. Possible values are:
	- `0` - continuous line
	- `1,1` - dotted line
	- `2,1` - dashed line (short segments)
	- `4,1` - dashed line (long segments)
	- `1,1,3,1` - dotted & dashed line


## Google MyMaps inconsistencies

- Google MyMaps removes feature IDs.
- Google MyMaps doesn't support width for points.
- Google MyMaps doesn't support line styles.
- Google MyMaps copies `ExtendedData` into `description` when exports KML.
