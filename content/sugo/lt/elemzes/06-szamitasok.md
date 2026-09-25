# Skaičiavimai su aukšto matavimo lygio kintamaisiais

Sociologiniuose klausimynų tyrimuose santykių skalės kintamieji pasitaiko rečiau. Dauguma klausimų yra nominalieji arba ranginiai, o intervalinio matavimo lygio kintamieji paprastai yra įvairios vertinimo skalės (pavyzdžiui, pasitenkinimo skalės nuo 1 iki 5 ar nuo 1 iki 10).

Vienas dažniausių santykių skalės pavyzdžių – tikslus amžius, jei respondentas nurodė ne amžiaus grupę, o savo amžių skaičiais.

Su tokiais kintamaisiais „Excel“ programoje galima apskaičiuoti kelis aprašomosios statistikos rodiklius.

## Vidurkis

Vidurkis rodo duomenų aritmetinį vidurkį, pavyzdžiui, respondentų vidutinį amžių.

„Excel“ formulė: `=AVERAGE()`

> 💡 **Svarbu:** vidurkiui didelę įtaką gali daryti kraštutinės reikšmės.

## Standartinis nuokrypis

Standartinis nuokrypis rodo, kiek duomenys nukrypsta nuo vidurkio.

- Kai standartinis nuokrypis mažas, atsakymai yra arti vidurkio.
- Kai standartinis nuokrypis didelis, atsakymai labiau išsibarstę.

„Excel“ formulė: `=STDEV()`

## Procentilis

Procentilis rodo, žemiau kurios reikšmės yra tam tikra procentinė respondentų dalis.

Pavyzdžiui, jei amžiaus 25-asis procentilis yra 40 metų, tai reiškia, kad:

- 25% respondentų yra jaunesni nei 40 metų,
- o 75% respondentų yra 40 metų ar vyresni.

„Excel“ formulė: `=PERCENTILE.EXC()`

## Amžiaus pavertimas amžiaus grupėmis

Analizuojant dažnai naudingiau amžių suskirstyti į amžiaus grupes, nes taip paprasčiau sudaryti pasiskirstymus ir kryžmines lenteles.

Pavyzdžiui, galima sudaryti šias kategorijas:

- 18–29 metai,
- 30–39 metai,
- 40–49 metai,
- 50–64 metai,
- 65 metai ir daugiau.

Tam galite naudoti „Excel“ funkciją IF():

```
=IF(A2<=29;"18-29"; IF(A2<=39;"30-39"; IF(A2<=49;"40-49"; IF(A2<=64;"50-64";"65+"))))
```

Taip sukurtas amžiaus grupės kintamasis jau laikomas ranginio matavimo lygio kintamuoju, kurį patogu naudoti:

- paprastiems procentiniams pasiskirstymams sudaryti,
- suvestinėse lentelėse,
- taip pat kryžminių lentelių analizei.
