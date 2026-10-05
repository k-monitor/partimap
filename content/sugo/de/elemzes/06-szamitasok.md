# Berechnungen bei Variablen mit hohem Messniveau

In sozialwissenschaftlichen Fragebogenstudien begegnet man verhältnisskalierten Variablen eher selten. Die meisten Fragen sind nominal oder ordinal, und intervallskalierte Variablen sind typischerweise verschiedene Bewertungsskalen (zum Beispiel Zufriedenheitsskalen von 1 bis 5 oder von 1 bis 10).

Eines der häufigsten Beispiele für eine Verhältnisskala ist das konkrete Alter, sofern die befragte Person nicht eine Altersgruppe, sondern ihr Alter als Zahl angegeben hat.

Bei solchen Variablen können Sie mit Excel mehrere deskriptive statistische Kennzahlen berechnen.

## Mittelwert

Der Mittelwert gibt das arithmetische Mittel der Daten an, zum Beispiel das Durchschnittsalter der Befragten.

Excel-Formel: `=MITTELWERT()`

> 💡 **Wichtig:** Der Mittelwert kann durch Extremwerte stark beeinflusst werden.

## Standardabweichung

Die Standardabweichung zeigt, wie stark die Daten vom Mittelwert abweichen.

- Bei einer kleinen Standardabweichung liegen die Antworten nahe am Mittelwert.
- Bei einer großen Standardabweichung streuen die Antworten stärker.

Excel-Formel: `=STABW()`

## Perzentil

Das Perzentil gibt an, unter welchem Wert ein bestimmter Prozentsatz der Befragten liegt.

Wenn zum Beispiel das 25. Perzentil des Alters bei 40 Jahren liegt, bedeutet das:

- 25 % der Befragten sind jünger als 40 Jahre,
- 75 % der Befragten sind 40 Jahre oder älter.

Excel-Formel: `=QUANTIL.EXKL()`

## Alter in Altersgruppen umwandeln

Bei der Analyse ist es oft sinnvoller, das Alter in Altersgruppen einzuteilen, weil sich so Verteilungen und Kreuztabellen einfacher erstellen lassen.

Zum Beispiel können Sie folgende Kategorien bilden:

- 18–29 Jahre,
- 30–39 Jahre,
- 40–49 Jahre,
- 50–64 Jahre,
- über 65 Jahre.

Dazu können Sie die Excel-Funktion WENN() verwenden:

```
=WENN(A2<=29;"18-29"; WENN(A2<=39;"30-39"; WENN(A2<=49;"40-49"; WENN(A2<=64;"50-64";"65+"))))
```

Die so erstellte Altersgruppen-Variable kann als ordinalskalierte Variable betrachtet werden, die sich gut verwenden lässt:

- für einfache prozentuale Verteilungen,
- in Pivot-Tabellen,
- sowie für Kreuztabellenanalysen.
