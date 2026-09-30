# Importing map elements

In the [Maps](/en/admin/maps) menu, you can store and edit your own map markings (shapefiles in .kml format). Here you can collect and edit the maps you made earlier of your city and its surroundings, as well as the responses collected through your surveys. Using .kml files, the elements stored here can easily be exported to external map editors, and maps can be imported from there into PARTIMAP.

PARTIMAP does not currently offer graphical analysis features, but individual elements can be edited on your own map: besides their name and description, their appearance (color, size, and line style for lines) can be set individually.

To create a new map of your own:

- On the [Maps](/en/admin/maps) page, enter a name in the Title of the new map field and click the Add button. In the editor, you can load data into the map from a .kml file;
- From the submissions of a survey's respondents, with Send features to a map, shown in the row of the relevant sheet on the survey data sheet

The .kml file containing the submissions of a PARTIMAP survey stores the type of marking as a category, so the different markings can be separated and the parameters of the elements edited, either with an external analysis program or by [converting the .kml file into a spreadsheet](https://mygeodata.cloud/converter/kml-to-xlsx).

The .kml files generated and used by PARTIMAP use the following parameters, which also ensure interoperability with Google Maps:

- The x and y coordinates of the points that make up the elements;
- The serial number (gid) and name (Name) of the element;
- The category assigned to the element (PARTIMAPCategory);
- The style of the line or of the line bounding an area (PARTIMAPLineStyle), the size of the point (PARTIMAPPointSize), the opacity of the element (or its outline) (PARTIMAPOpacity), for areas the opacity of the fill (PARTIMAPFillOpacity), and other parameters read automatically by Google Maps (size, color) (ExtendedData);
- The content of the description field used by PARTIMAP (PARTIMAPDescription);
- The questions and answers added with the Add responses to map markings for analysis purposes option (PARTIMAPQuestion);
- More details on all of this are available on the project's [GitHub page](https://github.com/k-monitor/partimap/blob/master/KML.md).
