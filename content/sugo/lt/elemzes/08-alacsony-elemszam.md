# Kategorijų su mažu atvejų skaičiumi tvarkymas

Interpretuojant kryžmines lenteles reikia atsižvelgti ne tik į procentines dalis, bet ir į kiekvienos kategorijos atvejų skaičių.

Anksčiau matėme, kad lyties kintamojo kategorijai „kita“ priklauso vos 6 respondentai. Esant tokiam mažam atvejų skaičiui, procentiniai pasiskirstymai gali lengvai klaidinti, nes net vienas atsakymas gali lemti didelį procentinį skirtumą.

Bendroji taisyklė – mažesnių nei maždaug 30 asmenų kategorijų neverta analizuoti atskirai, nors tiksli riba priklauso ir nuo analizės tikslo bei kryžminės lentelės dydžio.

Tokiais atvejais turite kelias galimybes:

- atsisakyti atskiros tos kategorijos analizės,
- arba sujungti ją su kita, turiniu panašia kategorija.

## Kategorijų sujungimas „Excel“ programoje

Pavyzdyje sujungiame kategorijas „moteris“ ir „kita“. Tam šalia kintamojo *lytis* įterpkite naują stulpelį ir naudokite šią formulę:

```
=IF(OR(E2="Moteris";E2="Kita");"Moteris/kita";"Vyras")
```

Panašiai ir Piac gatvės lankymo dažnio kintamojo atveju verta sujungti labai mažo atvejų skaičiaus kategorijas. Pavyzdyje kategorijai „Niekada“ priklauso vos vienas respondentas, todėl ją tikslinga sujungti su kategorija „Rečiau“.

|  | Kasdien | Kelis kartus per savaitę | Kartą per savaitę | Rečiau | Bendroji suma |
| --- | --- | --- | --- | --- | --- |
| Visa imtis | 24% | 34% | 18% | 25% | 100% |
| Vyras | 27% | 33% | 15% | 26% | 100% |
| Moteris/kita | 22% | 34% | 20% | 25% | 100% |
| Pagrindinis išsilavinimas | 33% | 28% | 18% | 23% | 100% |
| Vidurinis išsilavinimas | 29% | 34% | 16% | 21% | 100% |
| Aukštasis išsilavinimas | 20% | 34% | 19% | 27% | 100% |
| Iš dabartinių pajamų gyvename patogiai. | 18% | 36% | 20% | 25% | 100% |
| Iš dabartinių pajamų pragyvename. | 26% | 33% | 18% | 24% | 100% |
| Iš dabartinių pajamų pragyvename (labai) sunkiai. | 22% | 31% | 16% | 31% | 100% |

## Kelių demografinių kintamųjų palyginimas

Kryžminių lentelių analizė tinka ne tik palyginimui pagal lytį. Verta įtraukti ir kitus demografinius kintamuosius, pavyzdžiui:

- amžių,
- išsilavinimą,
- subjektyvią pajamų padėtį.

Taip galima susidaryti išsamesnį vaizdą, kuo skiriasi atskirų grupių atsakymai.

## Rezultatų interpretavimas

Kryžmines lenteles galima interpretuoti keliais būdais.

#### 1. Palyginimas su visa imtimi

Galima nagrinėti, kiek tam tikra grupė skiriasi nuo vidutinio visos imties pasiskirstymo.

Pavyzdžiui, 33% pagrindinį išsilavinimą turinčių asmenų Piac gatvėje lankosi kasdien, o visoje imtyje ši dalis yra 24%. Tai rodo, kad tarp pagrindinį išsilavinimą turinčių asmenų kasdienis lankymasis yra dažnesnis.

#### 2. Demografinių grupių palyginimas

Atskiras grupes galima palyginti ir tarpusavyje.

Pavyzdyje matyti, kad didesnė vyrų dalis Piac gatvėje lankosi kasdien, o moterys ją dažniau aplanko kas savaitę.

#### 3. Tendencijų paieška

Ranginių (tvarka išdėstomų) kintamųjų atveju galima ieškoti ne tik skirtumų tarp atskirų kategorijų, bet ir bendrų tendencijų.

Pavyzdyje pagal išsilavinimą matyti, kad kuo žemesnis respondentų išsilavinimas, tuo didesnė jų dalis Piac gatvėje lankosi kasdien.

Tokie dėsningumai padeda giliau suprasti ryšius tarp duomenų ir gali pagrįsti vėlesnes išvadas.

> 💡 **Svarbu:** norint visiškai užtikrintai teigti, kad tarp išsilavinimo ir Piac gatvės lankymo dažnio yra statistinis ryšys, duomenis reikėtų patikrinti chi kvadrato testu. Dėl apimties chi kvadrato testo čia nepristatome, tačiau svarbu paminėti, kad jo neatlikus negalima atmesti galimybės, kad skirtumai yra atsitiktiniai.
