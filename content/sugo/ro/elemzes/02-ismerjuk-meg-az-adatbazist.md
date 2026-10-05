# Cunoaște baza de date!

Când ai la dispoziție baza de date a sondajului, merită mai întâi să-i analizezi structura.

De regulă:

- un rând = un respondent,
- o coloană = o variabilă.

Variabilele pot conține nu doar întrebările chestionarului, ci și diverse variabile auxiliare, de exemplu:

- momentul completării,
- dispozitivul folosit pentru completare,
- sau alte informații tehnice.

Cunoașterea structurii bazei de date te ajută să te orientezi mai ușor printre date în timpul analizei.

<figure>
	<img src="/help/sugo/elemzes-excel-rows.png" alt="Baza de date în Excel" />
	<figcaption>În Excel se vede că fiecare rând reprezintă câte un respondent</figcaption>
</figure>

## Stabilește numărul de cazuri!

Primul pas este să stabilești câți respondenți conține baza de date.

Este important de știut că nu la toate întrebările se primește același număr de răspunsuri. Acest lucru poate avea mai multe cauze:

- unele întrebări au fost adresate doar anumitor respondenți (de exemplu, doar angajații au fost întrebați în ce sector lucrează),
- respondentul a trecut mai departe de o întrebare fără să răspundă.

Pentru interpretarea exactă a acestora trebuie să cunoști programarea chestionarului, însă și din numărul de răspunsuri poți trage concluzii utile.

### Stabilirea numărului de respondenți în Excel

Pentru a stabili numărul de respondenți, caută o variabilă în care **sigur** există o valoare pentru fiecare respondent, de exemplu:

- momentul completării,
- identificatorul respondentului.

Apoi:

1. Selectează întreaga coloană.
2. În colțul din dreapta jos al ferestrei Excel apare numărul celulelor selectate.
3. Dacă baza de date conține și un rând de antet, scade unu din numărul de celule; astfel obții numărul respondenților chestionarului.

<figure>
	<img src="/help/sugo/elemzes-response-count.png" alt="Calcularea numărului de completări" />
	<figcaption>Calcularea numărului de completări</figcaption>
</figure>
