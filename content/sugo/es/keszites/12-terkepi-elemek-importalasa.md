# Importación de elementos del mapa

En el menú [Mapas](/es/admin/maps) se pueden almacenar y editar marcas de mapa propias (shapefiles en formato .kml). Aquí se pueden reunir y editar los mapas que el usuario haya creado anteriormente sobre su ciudad o su entorno, así como las respuestas recogidas en las encuestas. Con los archivos en formato .kml, los elementos almacenados aquí se pueden exportar fácilmente a programas externos de edición de mapas, y desde ellos se pueden importar mapas a PARTIMAP.

Actualmente PARTIMAP no ofrece funciones de análisis gráfico, pero en el mapa propio se pueden editar los elementos individuales: además del nombre y la descripción, se puede personalizar su aspecto (color, tamaño y, en el caso de las líneas, el estilo de línea).

Para crear un mapa propio nuevo:

- En la página [Mapas](/es/admin/maps), indicando el Título del nuevo mapa y haciendo clic en el botón Agregar. Aquí se pueden cargar datos desde un archivo .kml en la interfaz de edición;
- A partir de las respuestas enviadas por los encuestados de una encuesta, con la opción Enviar características a un mapa que aparece en la fila de la hoja de trabajo correspondiente en la ficha de la encuesta

El archivo .kml con las respuestas de una encuesta de PARTIMAP incluye el tipo de marca como categoría, de modo que, con un programa de análisis externo o [convirtiendo el archivo .kml a formato de tabla](https://mygeodata.cloud/converter/kml-to-xlsx), se pueden separar las distintas marcas y editar los parámetros de los elementos.

Los archivos .kml generados y utilizados por PARTIMAP usan los siguientes parámetros, que también garantizan la interoperabilidad con Google Maps:

- Las coordenadas x e y de los puntos que forman los elementos;
- El número de orden (gid) y el nombre (Name) del elemento;
- La categoría asignada al elemento (PARTIMAPCategory);
- El estilo de la línea o del contorno del área (PARTIMAPLineStyle), el tamaño del punto (PARTIMAPPointSize), la opacidad del elemento (o de su contorno) (PARTIMAPOpacity), en el caso de las áreas la opacidad del relleno (PARTIMAPFillOpacity) y otros parámetros que Google Maps lee automáticamente (tamaño, color) (ExtendedData);
- El contenido del campo de descripción que utiliza PARTIMAP (PARTIMAPDescription);
- Las preguntas y respuestas añadidas con la opción Agregar respuestas a marcadores de mapas con fines de análisis (PARTIMAPQuestion);
- Encontrarás más información sobre todo esto en la [página de Github](https://github.com/k-monitor/partimap/blob/master/KML.md) del proyecto.
