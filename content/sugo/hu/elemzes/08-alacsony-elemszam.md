# Alacsony elemszámú kategóriák kezelése

A kereszttáblák értelmezésekor nemcsak a százalékos arányokra, hanem az egyes kategóriák elemszámára is figyelnünk kell.

Korábban láttuk, hogy a nem változó esetében az „egyéb” kategóriába mindössze 6 válaszadó tartozik. Ilyen alacsony elemszám mellett a százalékos megoszlások könnyen félrevezetőek lehetnek, hiszen már egyetlen válasz is jelentős százalékos eltérést okozhat.

Általános szabályként elmondható, hogy körülbelül 30 fő alatti kategóriákat nem érdemes önállóan elemezni, bár a pontos határérték az elemzés céljától és a kereszttábla méretétől is függ.

Ilyen esetekben több lehetőségünk is van:

- eltekintünk az adott kategória önálló elemzésétől,
- vagy összevonjuk egy másik, tartalmilag hasonló kategóriával.

## Kategóriák összevonása Excelben

A példában a nő és az egyéb kategóriát vonjuk össze. Ehhez szúrjunk be egy új oszlopot a *nem* változó mellé, majd használjuk az alábbi képletet:

```
=HA(VAGY(E2="Nő";E2="Egyéb");"Nő/egyéb";"Férfi")
```

Hasonló módon a Piac utca látogatásának gyakorisága változónál is érdemes összevonni a nagyon alacsony elemszámú kategóriákat. A példában a „Soha” kategóriába mindössze egy válaszadó tartozik, ezért célszerű ezt a „Ritkábban” kategóriával egyesíteni.

|  | Naponta | Hetente többször | Hetente egyszer | Ritkábban | Végösszeg |
| --- | --- | --- | --- | --- | --- |
| Teljes minta | 24% | 34% | 18% | 25% | 100% |
| Férfi | 27% | 33% | 15% | 26% | 100% |
| Nő/egyéb | 22% | 34% | 20% | 25% | 100% |
| Alapfokú végzettség | 33% | 28% | 18% | 23% | 100% |
| Középfokú végzettség | 29% | 34% | 16% | 21% | 100% |
| Felsőfokú végzettség | 20% | 34% | 19% | 27% | 100% |
| Kényelmesen megélünk a jelenlegi jövedelmünkből. | 18% | 36% | 20% | 25% | 100% |
| Megélünk a jelenlegi jövedelmünkből. | 26% | 33% | 18% | 24% | 100% |
| (Nagyon) nehezen élünk meg a jelenlegi jövedelmünkből. | 22% | 31% | 16% | 31% | 100% |

## Több demográfiai változó összehasonlítása

A kereszttáblás elemzés nemcsak a nem szerinti összehasonlításra használható. Érdemes más demográfiai változókat is bevonni, például:

- életkor,
- iskolai végzettség,
- szubjektív jövedelmi helyzet.

Így átfogóbb képet kaphatunk arról, hogy az egyes csoportok válaszai miben térnek el egymástól.

## Az eredmények értelmezése

A kereszttáblák többféleképpen is értelmezhetők.

#### 1. Összehasonlítás a teljes mintával

Vizsgálhatjuk, hogy egy adott csoport mennyiben tér el a teljes minta átlagos megoszlásától.

Például az alapfokú végzettségűek 33%-a naponta látogatja a Piac utcát, míg ez az arány a teljes mintában 24%. Ez arra utal, hogy az alapfokú végzettségűek körében gyakoribb a napi látogatás.

#### 2. Demográfiai csoportok összehasonlítása

Összevethetjük az egyes csoportokat egymással is.

A példában megfigyelhető, hogy a férfiak nagyobb arányban látogatják naponta a Piac utcát, míg a nők inkább heti rendszerességgel keresik fel.

#### 3. Tendenciák keresése

Az ordinális (sorrendbe rendezhető) változók esetében nemcsak az egyes kategóriák közötti különbségeket, hanem általános tendenciákat is kereshetünk.

A példában az iskolai végzettség alapján az látható, hogy minél alacsonyabb a válaszadók iskolai végzettsége, annál nagyobb arányban látogatják naponta a Piac utcát.

Az ilyen mintázatok segítenek mélyebben megérteni az adatok közötti összefüggéseket, és megalapozhatják a későbbi következtetéseket.

> 💡 **Fontos:** Ahhoz, hogy teljes bizonyossággal kijelenthessük, hogy statisztikai kapcsolat áll fenn az iskolai végzettség és a Piac utca látogatásának gyakorisága között, khi-négyzet próbával lenne szükséges megvizsgálni az adatokat. A khi-négyzet próba bemutatásától terjedelmi okokból most eltekintünk, fontos azonban megemlíteni, hogy ennek elvégzése nélkül nem zárhatjuk ki, hogy a különbségek véletlenszerűek.
