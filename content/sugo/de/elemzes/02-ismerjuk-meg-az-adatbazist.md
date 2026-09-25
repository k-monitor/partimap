# Lernen Sie die Datenbank kennen!

Sobald Ihnen die Datenbank der Fragebogenerhebung vorliegt, sollten Sie sich zunächst ihren Aufbau ansehen.

In der Regel gilt:

- eine Zeile = eine befragte Person,
- eine Spalte = eine Variable.

Die Variablen können nicht nur die Fragen des Fragebogens enthalten, sondern auch verschiedene Hilfsvariablen, zum Beispiel:

- den Zeitpunkt des Ausfüllens,
- das zum Ausfüllen verwendete Gerät,
- oder andere technische Informationen.

Wenn Sie die Struktur der Datenbank kennen, finden Sie sich bei der Analyse leichter in den Daten zurecht.

<figure>
	<img src="/help/sugo/elemzes-excel-rows.png" alt="Datenbank in Excel" />
	<figcaption>In Excel ist zu sehen, dass jede Zeile für eine befragte Person steht</figcaption>
</figure>

## Bestimmen Sie die Fallzahl!

Im ersten Schritt stellen Sie fest, wie viele Befragte Ihre Datenbank enthält.

Beachten Sie, dass nicht auf jede Frage gleich viele Antworten eingehen. Dafür kann es mehrere Gründe geben:

- einige Fragen wurden nur bestimmten Befragten gestellt (zum Beispiel wurden nur Erwerbstätige gefragt, in welchem Sektor sie arbeiten),
- die teilnehmende Person hat eine Frage übersprungen, ohne sie zu beantworten.

Um dies genau zu interpretieren, muss man die Programmierung des Fragebogens kennen; aber auch aus der Anzahl der Antworten lassen sich nützliche Schlüsse ziehen.

### Die Anzahl der Teilnehmenden in Excel bestimmen

Um die Anzahl der Teilnehmenden zu ermitteln, suchen Sie eine Variable, in der **garantiert** jede befragte Person einen Wert hat, zum Beispiel:

- den Zeitpunkt des Ausfüllens,
- die ID der befragten Person.

Danach:

1. Markieren Sie die gesamte Spalte.
2. Unten rechts in Excel wird die Anzahl der markierten Zellen angezeigt.
3. Wenn die Datenbank eine Kopfzeile enthält, ziehen Sie von der Anzahl der Zellen eins ab – so erhalten Sie die Anzahl der Teilnehmenden am Fragebogen.

<figure>
	<img src="/help/sugo/elemzes-response-count.png" alt="Berechnung der Anzahl der Antworten" />
	<figcaption>Berechnung der Anzahl der Antworten</figcaption>
</figure>
