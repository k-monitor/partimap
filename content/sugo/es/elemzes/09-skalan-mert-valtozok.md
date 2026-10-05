# Análisis de variables medidas en escalas

En los cuestionarios encontramos a menudo preguntas en las que los encuestados deben dar su opinión en una escala de valoración. Por ejemplo, las escalas de satisfacción, de acuerdo o de importancia del 1 al 5 o del 1 al 10.

En este tipo de variables, además de las distribuciones porcentuales, también podemos calcular la media, que resume bien la opinión general de los encuestados.

Podemos calcular la media:

- para la muestra total,
- para distintos grupos demográficos (por ejemplo, por sexo, edad o nivel de estudios),
- y también para comparar varias preguntas distintas.

Con las medias podemos ver rápidamente qué grupos están más satisfechos con un servicio determinado o qué servicios obtienen mejores o peores resultados según la valoración de los encuestados.

**Ejemplo:**

Supongamos que en el cuestionario preguntamos por la valoración de 15 servicios distintos de la calle Piac.

Los encuestados valoraron cada servicio en una escala del 1 al 5, donde:

- 1 = nada satisfecho,
- 5 = totalmente satisfecho.

Comparando las puntuaciones medias de cada servicio, podemos ver fácilmente con qué servicios están más satisfechos los encuestados y qué ámbitos necesitan mejoras.

La siguiente tabla muestra los valores medios de satisfacción de los 15 servicios.

| Servicio | Media |
| --- | --- |
| Alumbrado público | 3,9 |
| Ubicación y diseño de los pasos de peatones | 3,3 |
| Estado de las aceras | 3,2 |
| Nivel de ruido | 3,1 |
| Seguridad ciudadana | 3,1 |
| Limpieza viaria | 3,1 |
| Estado de los edificios | 2,9 |
| Estado y número de bancos | 2,9 |
| Información sobre monumentos y lugares de interés | 2,7 |
| Oferta de comercios y servicios | 2,7 |
| Número de aparcabicis | 2,5 |
| Precios asequibles de la oferta comercial | 2,5 |
| Calidad del aire | 2,4 |
| Número de plazas de aparcamiento | 2,4 |
| Cantidad de vegetación | 2,2 |

Según los datos del ejemplo, los encuestados están más satisfechos con el alumbrado público. De acuerdo con las medias, también obtuvieron una valoración favorable:

- la ubicación y el diseño de los pasos de peatones,
- el estado de las aceras,
- el nivel de ruido,
- la seguridad ciudadana,
- la limpieza viaria.

En cambio, obtuvieron una valoración más baja:

- el estado de los edificios,
- el estado de los bancos,
- la información disponible,
- la oferta.

Y las medias más bajas correspondieron a:

- la calidad del aire,
- el número de plazas de aparcamiento,
- y la cantidad de vegetación,

es decir, estos son los ámbitos que más necesitan mejoras.

## Comparar medias entre grupos demográficos

Las medias no solo pueden calcularse para la muestra total, sino también para distintos grupos demográficos. Así podemos examinar fácilmente si la valoración de un servicio varía, por ejemplo, según el sexo, la edad o la situación económica.

Para ello, creemos una tabla dinámica como de costumbre y, a continuación:

1. seleccionemos el servicio que analizamos y la variable demográfica,
2. arrastremos la variable demográfica al área Filas,
3. y coloquemos la valoración del servicio solo en el área Valores.

Después, en la opción Configuración de campo de valor, en la pestaña Resumir valores por, elijamos la opción Promedio.

Podemos mejorar aún más la legibilidad de la tabla con formato condicional. Tras seleccionar la tabla, en Inicio → Formato condicional → Escalas de color podemos representar también la magnitud de los valores mediante colores.

| Grupo | Media |
| --- | --- |
| Muestra total | 3,1 |
| Hombre | 3,0 |
| Mujer/otro | 3,1 |
| 18-29 | 3,0 |
| 30-39 | 3,0 |
| 40-49 | 3,3 |
| 50-64 | 3,1 |
| 65+ | 3,1 |
| Vivimos cómodamente con nuestros ingresos actuales. | 3,3 |
| Nos alcanza con nuestros ingresos actuales. | 3,0 |
| Nos cuesta llegar a fin de mes con nuestros ingresos actuales. | 2,8 |
| Estudios básicos | 3,1 |
| Bachillerato | 3,0 |
| Estudios superiores (escuela universitaria, universidad) | 3,1 |

## Interpretación de los resultados

En el ejemplo hemos comparado la valoración media de la seguridad ciudadana entre distintos grupos demográficos.

Según los datos, se observa que:

- quienes se encuentran en una situación económica difícil son los que peor valoraron la seguridad ciudadana;
- quienes viven cómodamente y el grupo de 40 a 49 años fueron los más satisfechos.

Sin embargo, es importante tener presente que la media, por sí sola, no ofrece una imagen completa de las respuestas.

Por ejemplo, puede ocurrir que dos grupos tengan la misma media aunque la distribución de sus respuestas sea completamente distinta. Una media de 3,0 puede darse porque la mayoría eligió el valor central, pero también porque la mitad de los encuestados marcó el valor más bajo y la otra mitad, el más alto.

Por eso siempre conviene complementar la interpretación de las medias con el estudio de la distribución de las respuestas. En el siguiente paso veremos cómo se distribuyen las valoraciones de la seguridad ciudadana entre los distintos grupos de edad.

|  | 1 - Nada satisfecho | 2 | 3 | 4 | 5 - Totalmente satisfecho | Total general |
| --- | --- | --- | --- | --- | --- | --- |
| 18-29 | 6% | 21% | 42% | 25% | 6% | 100% |
| 30-39 | 11% | 23% | 31% | 23% | 12% | 100% |
| 40-49 | 12% | 13% | 24% | 38% | 13% | 100% |
| 50-64 | 8% | 26% | 28% | 30% | 9% | 100% |
| 65+ | 5% | 23% | 37% | 28% | 7% | 100% |

Se ve claramente que la media, por sí sola, no siempre refleja la distribución real de las respuestas. Aunque en el ejemplo anterior la media más alta era la del grupo de 40 a 49 años, la distribución detallada revela que este grupo de edad también tiene la mayor proporción de personas que dieron un 1, es decir, que marcaron el nivel de satisfacción más bajo.

> 💡 **Importante:** Para poder hablar de diferencias estadísticamente significativas, es decir, para poder descartar que la diferencia entre las medias de dos grupos se deba simplemente al azar, es necesario aplicar una prueba t, que por razones de espacio no presentamos aquí.

Esto indica que la opinión de los encuestados de 40 a 49 años está dividida: la mayoría está más bien satisfecha con la seguridad ciudadana, pero una minoría considerable (12%) no se siente en absoluto segura en la calle Piac.

Esto demuestra que siempre conviene complementar la interpretación de las medias con el estudio de la distribución de las respuestas.

## Simplificar las escalas

Al analizar escalas de valoración de cinco puntos, a menudo es útil simplificar las categorías de respuesta. Una forma habitual de hacerlo es:

- agrupar los valores 1 y 2 en la categoría «más bien insatisfecho»,
- agrupar los valores 4 y 5 en la categoría «más bien satisfecho»,
- y mantener el valor 3 como categoría neutral independiente.

Así, en lugar de la escala original de cinco puntos, obtenemos una escala de tres categorías más fácil de interpretar.

## Saldo de satisfacción

Para simplificar aún más los datos también puede utilizarse el llamado saldo de satisfacción. Para calcularlo, se resta la proporción de personas más bien insatisfechas de la proporción de personas más bien satisfechas.

El indicador resultante muestra rápidamente si, en un grupo determinado, la valoración del servicio es más bien positiva o más bien negativa.

La interpretación de los valores es sencilla:

- valor positivo: hay más personas satisfechas que insatisfechas;
- valor negativo: hay más personas insatisfechas que satisfechas;
- valor cercano a 0: la proporción de personas satisfechas e insatisfechas es casi la misma.

Este indicador es especialmente útil cuando queremos comparar rápidamente muchos grupos demográficos, ya que permite identificar a primera vista los grupos más positivos y los más críticos.

Aunque el saldo de satisfacción facilita el análisis y la comparación, al presentar los resultados conviene volver a la escala original de cinco puntos o a la de tres puntos derivada de ella. Resulta mucho más fácil de interpretar para los lectores.

Por ejemplo, en lugar del saldo, es preferible formular los resultados así:

*Los encuestados están divididos en su valoración de la seguridad ciudadana: el 37% está más bien satisfecho, mientras que el 30% está más bien insatisfecho.*
