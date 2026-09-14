# Ismerjük meg az adatbázist!

Ha már rendelkezésünkre áll a kérdőíves felmérés adatbázisa, elsőként érdemes áttekinteni annak felépítését.

Általában:

- egy sor = egy válaszadó,
- egy oszlop = egy változó.

A változók nemcsak a kérdőív kérdéseit tartalmazhatják, hanem különböző segédváltozókat is, például:

- a kitöltés időpontját,
- a kitöltéshez használt eszközt,
- vagy más technikai információkat.

Az adatbázis szerkezetének megismerése segít abban, hogy az elemzés során könnyebben eligazodjunk az adatok között.

<figure>
	<img src="/help/sugo/elemzes-excel-rows.png" alt="Adatbázis Excelben" />
	<figcaption>Az excelben láthatjuk, hogy minden sor egy-egy válaszadót jelöl</figcaption>
</figure>

## Határozzuk meg az elemszámot!

Az első lépés annak megállapítása, hogy hány válaszadót tartalmaz az adatbázisunk.

Fontos tudni, hogy nem minden kérdésre érkezik ugyanannyi válasz. Ennek több oka is lehet:

- egyes kérdéseket csak bizonyos válaszadók kaptak meg (például csak a munkavállalóktól kérdezték meg, hogy melyik szektorban dolgoznak),
- a kitöltő válasz nélkül továbblépett egy kérdésen.

Ezek pontos értelmezéséhez ismerni kell a kérdőív programozását, ugyanakkor a válaszok számából is hasznos következtetéseket vonhatunk le.

### A kitöltők számának meghatározása Excelben

A kitöltők számának megállapításához keressünk egy olyan változót, amelyben **biztosan** minden válaszadónak van értéke, például:

- a kitöltés időpontja,
- a válaszadó azonosítója.

Ezután:

1. Jelöljük ki a teljes oszlopot.
2. Az Excel jobb alsó sarkában megjelenik a kijelölt cellák száma.
3. Ha az adatbázis fejlécsort is tartalmaz, akkor a cellák számából vonjunk ki egyet, így megkapjuk a kérdőív kitöltőinek számát.

<figure>
	<img src="/help/sugo/elemzes-response-count.png" alt="Kitöltések számának kiszámítása" />
	<figcaption>Kitöltések számának kiszámítása</figcaption>
</figure>
