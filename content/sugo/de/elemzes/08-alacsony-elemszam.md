# Umgang mit Kategorien mit geringer Fallzahl

Bei der Interpretation von Kreuztabellen müssen Sie nicht nur auf die prozentualen Anteile, sondern auch auf die Fallzahl der einzelnen Kategorien achten.

Wie wir bereits gesehen haben, gehören bei der Variable Geschlecht nur 6 Befragte zur Kategorie „divers“. Bei einer so geringen Fallzahl können prozentuale Verteilungen leicht irreführend sein, da schon eine einzige Antwort eine erhebliche prozentuale Abweichung verursachen kann.

Als Faustregel gilt, dass Kategorien mit weniger als etwa 30 Personen nicht eigenständig analysiert werden sollten, wobei der genaue Grenzwert auch vom Ziel der Analyse und von der Größe der Kreuztabelle abhängt.

In solchen Fällen gibt es mehrere Möglichkeiten:

- Sie verzichten auf eine eigenständige Analyse der betreffenden Kategorie,
- oder Sie fassen sie mit einer anderen, inhaltlich ähnlichen Kategorie zusammen.

## Kategorien in Excel zusammenfassen

Im Beispiel fassen wir die Kategorien „Frau“ und „divers“ zusammen. Fügen Sie dazu neben der Variable *Geschlecht* eine neue Spalte ein und verwenden Sie folgende Formel:

```
=WENN(ODER(E2="Frau";E2="Divers");"Frau/divers";"Mann")
```

Auf ähnliche Weise sollten Sie auch bei der Variable Häufigkeit der Besuche in der Piac utca die Kategorien mit sehr geringer Fallzahl zusammenfassen. Im Beispiel gehört zur Kategorie „Nie“ nur eine befragte Person, daher ist es sinnvoll, sie mit der Kategorie „Seltener“ zusammenzulegen.

|  | Täglich | Mehrmals pro Woche | Einmal pro Woche | Seltener | Gesamtergebnis |
| --- | --- | --- | --- | --- | --- |
| Gesamtstichprobe | 24 % | 34 % | 18 % | 25 % | 100 % |
| Mann | 27 % | 33 % | 15 % | 26 % | 100 % |
| Frau/divers | 22 % | 34 % | 20 % | 25 % | 100 % |
| Grundbildung | 33 % | 28 % | 18 % | 23 % | 100 % |
| Mittlere Bildung | 29 % | 34 % | 16 % | 21 % | 100 % |
| Hochschulbildung | 20 % | 34 % | 19 % | 27 % | 100 % |
| Wir kommen mit unserem jetzigen Einkommen bequem aus. | 18 % | 36 % | 20 % | 25 % | 100 % |
| Wir kommen mit unserem jetzigen Einkommen aus. | 26 % | 33 % | 18 % | 24 % | 100 % |
| Wir kommen mit unserem jetzigen Einkommen (sehr) schwer aus. | 22 % | 31 % | 16 % | 31 % | 100 % |

## Vergleich mehrerer demografischer Variablen

Die Kreuztabellenanalyse eignet sich nicht nur für den Vergleich nach Geschlecht. Es lohnt sich, auch andere demografische Variablen einzubeziehen, zum Beispiel:

- Alter,
- Bildungsabschluss,
- subjektive Einkommenssituation.

So erhalten Sie ein umfassenderes Bild davon, worin sich die Antworten der einzelnen Gruppen voneinander unterscheiden.

## Interpretation der Ergebnisse

Kreuztabellen lassen sich auf verschiedene Weise interpretieren.

#### 1. Vergleich mit der Gesamtstichprobe

Sie können untersuchen, inwieweit eine bestimmte Gruppe von der durchschnittlichen Verteilung der Gesamtstichprobe abweicht.

Zum Beispiel besuchen 33 % der Personen mit Grundbildung die Piac utca täglich, während dieser Anteil in der Gesamtstichprobe bei 24 % liegt. Das deutet darauf hin, dass tägliche Besuche unter Personen mit Grundbildung häufiger sind.

#### 2. Vergleich demografischer Gruppen

Sie können die einzelnen Gruppen auch miteinander vergleichen.

Im Beispiel ist zu beobachten, dass Männer die Piac utca häufiger täglich besuchen, während Frauen sie eher wöchentlich aufsuchen.

#### 3. Suche nach Tendenzen

Bei ordinalen (in eine Reihenfolge bringbaren) Variablen können Sie nicht nur nach Unterschieden zwischen den einzelnen Kategorien, sondern auch nach allgemeinen Tendenzen suchen.

Im Beispiel zeigt sich beim Bildungsabschluss: Je niedriger der Bildungsabschluss der Befragten, desto häufiger besuchen sie die Piac utca täglich.

Solche Muster helfen, die Zusammenhänge in den Daten besser zu verstehen, und können spätere Schlussfolgerungen untermauern.

> 💡 **Wichtig:** Um mit Sicherheit sagen zu können, dass ein statistischer Zusammenhang zwischen dem Bildungsabschluss und der Häufigkeit der Besuche in der Piac utca besteht, müssten die Daten mit einem Chi-Quadrat-Test untersucht werden. Aus Platzgründen verzichten wir hier auf die Darstellung des Chi-Quadrat-Tests; wichtig ist jedoch der Hinweis, dass ohne diesen Test nicht ausgeschlossen werden kann, dass die Unterschiede zufällig sind.
