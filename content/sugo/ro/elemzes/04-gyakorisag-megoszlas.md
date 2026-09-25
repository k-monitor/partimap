# Frecvență și distribuție

Unul dintre cei mai simpli și mai des folosiți pași ai analizei datelor este examinarea frecvențelor și a distribuțiilor. Cu ajutorul lor poți vedea rapid cum se distribuie respondenții între variantele de răspuns.

De exemplu, poți stabili ușor:

- ce procent dintre respondenți sunt femei și ce procent sunt bărbați,
- cum arată distribuția pe vârste,
- sau ce nivel de studii au respondenții.

## Realizarea frecvențelor și distribuțiilor cu un tabel pivot

În Excel, cel mai simplu mod de a realiza tabele de frecvență și de distribuție procentuală este cu ajutorul unui tabel pivot (PivotTable).

Pașii sunt următorii:

1. Selectează coloana care conține variabila pe care vrei să o analizezi.
2. Pe fila Inserare, alege opțiunea PivotTable.
3. În fereastra care apare, fă clic pe butonul OK.

Excel creează o foaie de lucru nouă cu tabelul pivot.

<figure>
	<img src="/help/sugo/elemzes-pivot-create.png" alt="Crearea unui PivotTable în Excel" />
	<figcaption>Procesul de creare a unui PivotTable</figcaption>
</figure>

## Configurarea tabelului pivot

În panoul Câmpuri PivotTable, care apare în partea dreaptă, trage variabila selectată:

- o dată în zona Rânduri (Axă),
- iar o dată în zona Valori.

Astfel apare frecvența fiecărei categorii, adică, de exemplu, numărul respondenților bărbați și femei.

## Afișarea distribuției procentuale

Dacă, în locul numerelor absolute sau pe lângă ele, te interesează și distribuția procentuală:

1. fă clic pe opțiunea Setări câmp valoric,
2. alege fila Afișare valori ca,
3. apoi, în meniul derulant, setează afișarea % din Total general.

<figure>
	<img src="/help/sugo/elemzes-pivot-percent.png" alt="Setarea distribuției procentuale" />
	<figcaption>Setarea afișării distribuției procentuale</figcaption>
</figure>

## Frecvență și procent în același timp

Dacă vrei să vezi simultan numerele absolute și distribuția procentuală, trage aceeași variabilă de două ori în zona Valori. Apoi schimbă afișarea doar pentru unul dintre câmpuri în formatul % din Total general.

Astfel, în tabel apar simultan numărul de cazuri și ponderea procentuală a fiecărei categorii.

## Interpretarea rezultatelor

Pe baza datelor din exemplu, eșantionul cuprinde 594 de respondenți, dintre care:

- 367 de femei (62%),
- 221 de bărbați (37%),
- 6 persoane au ales categoria „altele” (1%).

<figure>
	<img src="/help/sugo/elemzes-pivot-table.png" alt="Exemplu de PivotTable" />
	<figcaption>Exemplu de diagramă PivotChart</figcaption>
</figure>

Merită să aplici aceeași metodă de analiză și celorlalte variabile demografice de bază, pentru a obține o imagine de ansamblu asupra compoziției respondenților înainte de a începe analiza întrebărilor de fond ale chestionarului.
