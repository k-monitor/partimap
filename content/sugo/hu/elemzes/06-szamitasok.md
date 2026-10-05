# Számítások magas mérési szintű változók esetében

A szociológiai kérdőíves kutatásokban ritkábban találkozunk arányskála mérési szintű változókkal. A legtöbb kérdés nominális vagy ordinális, az intervallum mérési szintű változók pedig jellemzően különböző értékelő skálák (például 1–5-ig vagy 1–10-ig terjedő elégedettségi skálák).

Az arányskála egyik leggyakoribb példája a konkrét életkor, amennyiben a válaszadó nem korcsoportot, hanem életkorát számokban adta meg.

Az ilyen változóknál az Excel segítségével több leíró statisztikai mutatót is kiszámíthatunk.

## Átlag

Az átlag az adatok számtani középértékét mutatja meg, például a válaszadók átlagéletkorát.

Excel képlet: `=ÁTLAG()`

> 💡 **Fontos:** Az átlagot az extrém értékek jelentősen befolyásolhatják.

## Szórás

A szórás azt mutatja meg, hogy az adatok mennyire térnek el az átlagtól.

- Kis szórás esetén a válaszok közel vannak az átlaghoz.
- Nagy szórás esetén a válaszok jobban szétszóródnak.

Excel képlet: `=SZÓRÁS()`

## Percentilis

A percentilis azt mutatja meg, hogy a válaszadók egy adott százaléka melyik érték alatt helyezkedik el.

Például ha az életkor 25. percentilise 40 év, akkor ez azt jelenti, hogy:

- a válaszadók 25%-a fiatalabb 40 évesnél,
- a válaszadók 75%-a pedig 40 éves vagy idősebb.

Excel képlet: `=PERCENTILIS.KIZÁR()`

## Életkor átalakítása korcsoportokká

Az elemzés során gyakran hasznosabb az életkort korcsoportokra bontani, mert így egyszerűbben készíthetünk megoszlásokat és kereszttáblákat.

Például az alábbi kategóriákat alakíthatjuk ki:

- 18–29 év,
- 30–39 év,
- 40–49 év,
- 50–64 év,
- 65 év felett.

Ehhez az Excel HA() függvényét használhatjuk:

```
=HA(A2<=29;"18-29"; HA(A2<=39;"30-39"; HA(A2<=49;"40-49"; HA(A2<=64;"50-64";"65+"))))
```

Az így létrehozott korcsoport-változó már ordinális mérési szintű változónak tekinthető, amely jól használható:

- egyszerű százalékos megoszlások készítésére,
- Pivot-táblákban,
- valamint kereszttáblás elemzésekhez is.
