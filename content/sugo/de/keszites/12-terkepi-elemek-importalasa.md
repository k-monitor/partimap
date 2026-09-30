# Kartenelemente importieren

Im Menüpunkt [Karten](/de/admin/maps) lassen sich eigene Kartenmarkierungen (Shapefiles im .kml-Format) speichern und bearbeiten. Hier können Sie Ihre zuvor erstellten Karten Ihrer Stadt und Ihrer Umgebung sowie die aus Umfragen gesammelten Antworten zusammentragen und bearbeiten. Mithilfe von .kml-Dateien lassen sich die hier gespeicherten Elemente einfach in externe Kartenbearbeitungsprogramme exportieren und von dort Karten in PARTIMAP importieren.

PARTIMAP bietet derzeit keine grafischen Analysefunktionen, auf der eigenen Karte können die einzelnen Elemente jedoch bearbeitet werden: Neben Name und Beschreibung lässt sich auch ihr Aussehen (Farbe, Größe, bei Linien der Linienstil) individuell einstellen.

Eine neue eigene Karte erstellen:

- Auf der Seite [Karten](/de/admin/maps), indem Sie einen Namen unter „Name der neuen Karte“ eingeben und auf die Schaltfläche „Hinzufügen“ klicken. Hier können in der Bearbeitungsoberfläche Daten aus einer .kml-Datei geladen werden;
- Aus den Einsendungen der Teilnehmenden einer Umfrage über den Link „Markierung an eine Karte senden“, der auf dem Umfrage-Datenblatt in der Zeile des betreffenden Arbeitsblatts erscheint

Die .kml-Datei mit den Antworten einer PARTIMAP-Umfrage enthält den Typ der Markierungen als Kategorie, sodass sich die verschiedenen Markierungen mit einem externen Analyseprogramm oder durch [Umwandlung der .kml-Datei in eine Tabelle](https://mygeodata.cloud/converter/kml-to-xlsx) trennen und die Parameter der Elemente bearbeiten lassen.

Die von PARTIMAP erzeugten und verwendeten .kml-Dateien nutzen folgende Parameter, die auch die Kompatibilität mit Google Maps gewährleisten:

- Die x- und y-Koordinaten der Punkte, aus denen die Elemente bestehen;
- Die laufende Nummer (gid) und der Name (Name) des Elements;
- Die dem Element zugeordnete Kategorie (PARTIMAPCategory);
- Der Stil der Linie bzw. der Begrenzungslinie einer Fläche (PARTIMAPLineStyle), die Größe des Punktes (PARTIMAPPointSize), die Deckkraft des Elements (bzw. seiner Kontur) (PARTIMAPOpacity), bei Flächen die Deckkraft der Füllung (PARTIMAPFillOpacity) sowie weitere, von Google Maps automatisch eingelesene Parameter (Größe, Farbe) (ExtendedData);
- Der Inhalt des Beschreibungsfeldes, das PARTIMAP verwendet (PARTIMAPDescription);
- Die mit der Option „Antworten zur Kartenauswertung hinzufügen“ hinzugefügten Fragen und Antworten (PARTIMAPQuestion);
- Eine ausführlichere Beschreibung all dessen finden Sie auf der [GitHub-Seite](https://github.com/k-monitor/partimap/blob/master/KML.md) des Projekts.
