# Tabelul încrucișat

După ce ai cunoscut eșantionul pe baza celor mai importante caracteristici demografice, poți începe analiza întrebărilor de fond ale chestionarului.

Și aici merită să stabilești mai întâi ce nivel de măsurare are variabila cu care lucrezi. În cazul unei singure variabile poți realiza în continuare tabele simple de frecvență sau de distribuție procentuală, însă dacă te interesează relația dintre două variabile, tabelul încrucișat va fi unul dintre cele mai utile instrumente de analiză.

Cu ajutorul tabelului încrucișat poți examina, de exemplu:

- cât de des vizitează bărbații și femeile strada Piac,
- dacă opinia grupelor de vârstă despre un serviciu diferă,
- sau dacă se deosebesc răspunsurile grupurilor cu diferite niveluri de studii.

## Realizarea unui tabel încrucișat în Excel

În exemplu examinăm dacă există o legătură între sex și frecvența vizitării străzii Piac.

Pașii pentru realizarea tabelului pivot:

1. Selectează coloanele care conțin variabilele sex și frecvența vizitării străzii Piac.
2. Pe fila Inserare, alege opțiunea PivotTable, apoi fă clic pe butonul OK.
3. În panoul Câmpuri PivotTable:
	- trage variabila sex în zona Rânduri,
	- trage variabila frecvența vizitării străzii Piac în zona Coloane,
	- apoi trage aceeași variabilă și în zona Valori.

<figure>
	<img src="/help/sugo/elemzes-crosstab-setup.png" alt="Configurarea tabelului încrucișat" />
	<figcaption>Modul de configurare a tabelului încrucișat</figcaption>
</figure>

## Afișarea procentuală

În zona Valori, fă clic pe variabilă, apoi alege opțiunea Setări câmp valoric.

Pe fila Afișare valori ca, schimbă afișarea la opțiunea % din Total rând.

Astfel, suma fiecărui rând va fi 100%, ceea ce ușurează considerabil compararea grupurilor.

<figure>
	<img src="/help/sugo/elemzes-valuefield-settings.png" alt="Setări câmp valoric" />
	<figcaption>Modul de utilizare a opțiunii Setări câmp valoric</figcaption>
</figure>

## Interpretarea rezultatelor

Din tabelul obținut poți citi simultan:

- distribuția pentru întregul eșantion,
- precum și rezultatele fiecărui grup demografic.

<figure>
	<img src="/help/sugo/elemzes-crosstab-example.png" alt="Exemplu de tabel încrucișat" />
	<figcaption>Exemplu de tabel încrucișat care poate fi creat dintr-un PivotTable</figcaption>
</figure>

În exemplul nostru, pentru întregul eșantion se poate constata că:

- 24% vizitează zilnic strada Piac,
- 33,5% de mai multe ori pe săptămână,
- 18% o dată pe săptămână,
- iar 25% mai rar.

Din defalcarea pe sexe se vede că, în ansamblu, bărbații și femeile vizitează strada cu o frecvență similară, însă se pot observa mici diferențe.

**De exemplu:**

- 27% dintre bărbați vizitează zilnic strada Piac, în timp ce în rândul femeilor această proporție este de 21%;
- femeile merg în proporție mai mare o dată pe săptămână sau de mai multe ori pe săptămână (20%, respectiv 35%);
- proporția celor care o vizitează mai rar de o dată pe săptămână este aproape identică (bărbați: 26%, femei: 24%).

Astfel de comparații te ajută să descoperi în ce măsură un răspuns este legat de diferitele caracteristici demografice.
