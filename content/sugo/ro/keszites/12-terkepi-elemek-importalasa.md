# Importarea elementelor de hartă

În meniul [Hărți](/ro/admin/maps) pot fi stocate și editate marcaje cartografice proprii (fișiere shapefile în format .kml). Aici pot fi colectate și editate hărțile realizate anterior de utilizator despre orașul sau împrejurimile sale, precum și răspunsurile colectate din chestionare. Cu ajutorul fișierelor în format .kml, elementele stocate aici pot fi exportate simplu în programe externe de editare a hărților, iar de acolo pot fi importate hărți în PARTIMAP.

În prezent, PARTIMAP nu oferă funcții grafice de analiză, dar pe harta proprie elementele individuale pot fi editate: pe lângă nume și descriere, aspectul lor (culoare, mărime, iar în cazul liniilor, stilul liniei) poate fi setat individual.

Crearea unei noi hărți proprii:

- Pe pagina [Hărți](/ro/admin/maps), completând câmpul Titlu hartă nouă și făcând clic pe butonul Adăugare. Aici se pot încărca date dintr-un fișier .kml în interfața de editare;
- Din trimiterile respondenților unui sondaj, cu linkul Trimiteți elementele pe o hartă, afișat în fișa chestionarului, pe rândul paginii respective

Fișierul .kml care conține completările unui sondaj PARTIMAP include tipul marcajelor ca categorie, astfel încât, cu ajutorul unui program extern de analiză sau [convertind fișierul .kml în format tabelar](https://mygeodata.cloud/converter/kml-to-xlsx), diferitele marcaje pot fi separate, iar parametrii elementelor pot fi editați.

Fișierele .kml generate și folosite de PARTIMAP utilizează următorii parametri, care asigură compatibilitatea și cu Google Maps:

- Coordonatele x și y ale punctelor care alcătuiesc elementele;
- Numărul de ordine (gid) și numele (Name) elementului;
- Categoria atribuită elementului (PARTIMAPCategory);
- Stilul liniei sau al liniei care delimitează zona (PARTIMAPLineStyle), mărimea punctului (PARTIMAPPointSize), opacitatea elementului (a conturului său) (PARTIMAPOpacity), în cazul zonelor opacitatea umplerii (PARTIMAPFillOpacity) și alți parametri citiți automat de Google Maps (mărime, culoare) (ExtendedData);
- Conținutul câmpului de descriere, folosit de PARTIMAP (PARTIMAPDescription);
- Întrebările și răspunsurile adăugate cu opțiunea Adaugă mențiuni la simbolurile de pe hartă pentru analiză (PARTIMAPQuestion);
- O descriere mai detaliată a tuturor acestora este disponibilă pe [pagina GitHub](https://github.com/k-monitor/partimap/blob/master/KML.md) a proiectului.
