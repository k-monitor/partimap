# Remarks on KML export/import

Partimap uses [OpenLayers' KML](https://openlayers.org/en/v6.15.1/apidoc/module-ol_format_KML-KML.html) export/import features (`readFeatures` and `writeFeatures` functions), although it additonally prepares the imported XML and post-processes the exported XML.


## Post-processing the exported KML

Partimap, after calling OpenLayers' `writeFeatures` function, applies the following modifications to each `Placemark` element in the KML:

1. For points, adds `Style > IconStyle` with the color and a blank Google MyMaps marker. This is needed because OpenLayers does not add a style for points, and the blank icon is necessary if we want to see the color in Google MyMaps.
2. For points, adds an `ExtendedData` entry named `partimapPointSize` with the `width` value. This is needed because Google MyMaps / KML does not support size for points and also we remove redundant data entries (`width` is redundant for lines and polygons as they are in `Style`).
3. Renames the `dash` data entry in `ExtendedData` to `partimapLineStyle` for ease of understanding outside Partimap.
4. It removes the `description` element and places the description content into an `ExtendedData` entry named `partimapDescription`. This is needed because if you import the exported KML into Google MyMaps and export from there, the `description` element will contain every `ExtendedData` field and a localized title for the description, which makes the `description` element useless.
5. Removes all data entries from `ExtendedData` except the ones listed below. This is to avoid bloating `ExtendedData` (and so Goolge MyMaps feature cards) with irrelevant, redundant or non-functioning data fields, this way avoiding confusion. (For example `color` and `width` of lines/polygons are handled in `Style`.)
	- `partimapDescription`
	- `partimapLineStyle`
	- `partimapPointSize`



## Preparing the imported KML

Partimap, before calling OpenLayers' `readFeatures` function, applies the following modifications to each `Placemark` element in the KML:

1. If the placemark has no identifier, Partimap generates one. The ID will be `T-N+i`, where `T` is the starting timestamp of the import process, `N` is the total number of `Placemark` elements and `i` is the zero-based index of the current `Placemark`.
2. Follows `styleUrl` and attempts to parse color and width from a shared `Style` element, then attempts to parse these parameters from the `Placemark`'s own `Style` element, and finally saves this data into `ExtendedData`, overwriting `color` and `width` data there, from where OpenLayers' `readFeatures` will pick up the values.
3. Reads `partimapDescription` from `ExtendedData`, then removes it. If it's not empty, overwrites the contents of the `description` elements. Please see the reason above.
4. Renames `partimapLineStyle` back to `dash` so Partimap can use this value for line styling.


## How things are imported

- Feature name is read from `name` element, by OpenLayers.
- Feature description is read from the following locations (first non-empty value will be read):
	- `ExtendedData > Data[name="partimapDescription"] > value`
	- `description`
- Feature category is read from `ExtendedData > Data[name="partimapCategory"] > value`.
- Feature color and width are read from the following locations (first non-empty value will be read):
	- `Document > Style[id="x"] > ...`, linked with `Placemark > styleUrl` (`styleUrl` must contain `#x`)
	- `Style > ...`
- Please note that alpha channel information of colors is not read from imported KMLs, opacity of imported colors will all be FF (fully opaque). This is because opacity of features is handled dynamically in Partimap for certain functions.
- For feature width it also checks `ExtendedData > Data[name="partimapPointSize"] > value`.
- Feature line styling is read from `ExtendedData > Data[name="partimapLineStyle"] > value`, since it is not supported in KML. The value is a string containing comma-separated numbers, which represent line segment lengths. Possible values are:
	- `0` - continuous line
	- `1,1` - dotted line
	- `2,1` - dashed line (short segments)
	- `4,1` - dashed line (long segments)
	- `1,1,3,1` - dotted & dashed line


## Google MyMaps inconsistencies

- Google MyMaps removes feature IDs.
- Google MyMaps copies `ExtendedData` into `description` when exports KML.
- Google MyMaps / KML doesn't support width for points.
- Google MyMaps / KML doesn't support line styles.
