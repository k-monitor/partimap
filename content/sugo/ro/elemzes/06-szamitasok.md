# Calcule pentru variabilele cu nivel de măsurare ridicat

În cercetările sociologice pe bază de chestionar, variabilele măsurate pe scala de raport apar mai rar. Majoritatea întrebărilor sunt nominale sau ordinale, iar variabilele de interval sunt de regulă diverse scale de evaluare (de exemplu scale de satisfacție de la 1 la 5 sau de la 1 la 10).

Unul dintre cele mai frecvente exemple de scală de raport este vârsta exactă, dacă respondentul nu a indicat o grupă de vârstă, ci și-a dat vârsta în cifre.

Pentru astfel de variabile poți calcula în Excel mai mulți indicatori de statistică descriptivă.

## Media

Media arată valoarea medie aritmetică a datelor, de exemplu vârsta medie a respondenților.

Formula Excel: `=AVERAGE()`

> 💡 **Important:** Media poate fi influențată semnificativ de valorile extreme.

## Abaterea standard

Abaterea standard arată cât de mult se abat datele de la medie.

- În cazul unei abateri standard mici, răspunsurile sunt apropiate de medie.
- În cazul unei abateri standard mari, răspunsurile sunt mai dispersate.

Formula Excel: `=STDEV()`

## Percentila

Percentila arată sub ce valoare se situează un anumit procent dintre respondenți.

De exemplu, dacă percentila 25 a vârstei este 40 de ani, aceasta înseamnă că:

- 25% dintre respondenți sunt mai tineri de 40 de ani,
- iar 75% dintre respondenți au 40 de ani sau mai mult.

Formula Excel: `=PERCENTILE.EXC()`

## Transformarea vârstei în grupe de vârstă

În analiză este adesea mai util să împarți vârsta pe grupe de vârstă, deoarece astfel poți realiza mai simplu distribuții și tabele încrucișate.

De exemplu, poți crea următoarele categorii:

- 18–29 de ani,
- 30–39 de ani,
- 40–49 de ani,
- 50–64 de ani,
- peste 65 de ani.

Pentru aceasta poți folosi funcția IF() din Excel:

```
=IF(A2<=29;"18-29"; IF(A2<=39;"30-39"; IF(A2<=49;"40-49"; IF(A2<=64;"50-64";"65+"))))
```

Variabila de grupă de vârstă creată astfel poate fi considerată deja o variabilă ordinală, care poate fi folosită cu succes:

- pentru realizarea unor distribuții procentuale simple,
- în tabele pivot,
- precum și pentru analize cu tabele încrucișate.
