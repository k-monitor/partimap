# Gestionarea categoriilor cu număr mic de cazuri

Când interpretezi tabelele încrucișate, trebuie să fii atent nu doar la procente, ci și la numărul de cazuri din fiecare categorie.

Am văzut mai devreme că, în cazul variabilei sex, în categoria „altele” se încadrează doar 6 respondenți. La un număr atât de mic de cazuri, distribuțiile procentuale pot fi ușor înșelătoare, deoarece chiar și un singur răspuns poate produce o diferență procentuală semnificativă.

Ca regulă generală, categoriile cu mai puțin de aproximativ 30 de persoane nu merită analizate separat, deși pragul exact depinde și de scopul analizei și de dimensiunea tabelului încrucișat.

În astfel de cazuri ai mai multe opțiuni:

- renunți la analiza separată a categoriei respective,
- sau o comasezi cu o altă categorie, similară ca conținut.

## Comasarea categoriilor în Excel

În exemplu comasăm categoriile femeie și altele. Pentru aceasta, inserează o coloană nouă lângă variabila *sex*, apoi folosește formula de mai jos:

```
=IF(OR(E2="Femeie";E2="Altele");"Femeie/altele";"Bărbat")
```

În mod similar, merită comasate și categoriile cu un număr foarte mic de cazuri ale variabilei frecvența vizitării străzii Piac. În exemplu, în categoria „Niciodată” se încadrează un singur respondent, de aceea este recomandat să fie unită cu categoria „Mai rar”.

|  | Zilnic | De mai multe ori pe săptămână | O dată pe săptămână | Mai rar | Total general |
| --- | --- | --- | --- | --- | --- |
| Întregul eșantion | 24% | 34% | 18% | 25% | 100% |
| Bărbat | 27% | 33% | 15% | 26% | 100% |
| Femeie/altele | 22% | 34% | 20% | 25% | 100% |
| Studii elementare | 33% | 28% | 18% | 23% | 100% |
| Studii medii | 29% | 34% | 16% | 21% | 100% |
| Studii superioare | 20% | 34% | 19% | 27% | 100% |
| Trăim confortabil din venitul actual. | 18% | 36% | 20% | 25% | 100% |
| Ne descurcăm cu venitul actual. | 26% | 33% | 18% | 24% | 100% |
| Ne descurcăm (foarte) greu cu venitul actual. | 22% | 31% | 16% | 31% | 100% |

## Compararea mai multor variabile demografice

Analiza cu tabele încrucișate poate fi folosită nu doar pentru comparații în funcție de sex. Merită să incluzi și alte variabile demografice, de exemplu:

- vârsta,
- nivelul de studii,
- situația financiară subiectivă.

Astfel poți obține o imagine mai cuprinzătoare despre felul în care diferă între ele răspunsurile grupurilor.

## Interpretarea rezultatelor

Tabelele încrucișate pot fi interpretate în mai multe moduri.

#### 1. Comparația cu întregul eșantion

Poți examina în ce măsură un anumit grup se abate de la distribuția medie a întregului eșantion.

De exemplu, 33% dintre persoanele cu studii elementare vizitează zilnic strada Piac, în timp ce în întregul eșantion această proporție este de 24%. Aceasta indică faptul că în rândul persoanelor cu studii elementare vizita zilnică este mai frecventă.

#### 2. Compararea grupurilor demografice

Poți compara grupurile și între ele.

În exemplu se observă că bărbații vizitează zilnic strada Piac în proporție mai mare, în timp ce femeile merg acolo mai degrabă săptămânal.

#### 3. Identificarea tendințelor

În cazul variabilelor ordinale (care pot fi ordonate), poți căuta nu doar diferențele dintre categorii, ci și tendințe generale.

În exemplu, pe baza nivelului de studii se vede că, cu cât nivelul de studii al respondenților este mai scăzut, cu atât mai mare este proporția celor care vizitează zilnic strada Piac.

Astfel de tipare ajută la înțelegerea mai profundă a legăturilor dintre date și pot fundamenta concluziile ulterioare.

> 💡 **Important:** Pentru a putea afirma cu deplină certitudine că există o legătură statistică între nivelul de studii și frecvența vizitării străzii Piac, datele ar trebui examinate cu testul chi-pătrat. Din motive de spațiu nu prezentăm aici testul chi-pătrat, dar este important de menționat că, fără efectuarea lui, nu se poate exclude ca diferențele să fie întâmplătoare.
