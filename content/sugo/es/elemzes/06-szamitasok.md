# Cálculos con variables de nivel de medición alto

En las encuestas sociológicas es menos frecuente encontrar variables con un nivel de medición de razón. La mayoría de las preguntas son nominales u ordinales, y las variables de intervalo suelen ser distintas escalas de valoración (por ejemplo, escalas de satisfacción del 1 al 5 o del 1 al 10).

Uno de los ejemplos más habituales de escala de razón es la edad exacta, siempre que el encuestado no haya indicado un grupo de edad, sino su edad en números.

Con este tipo de variables, Excel nos permite calcular varios indicadores estadísticos descriptivos.

## Media

La media muestra el valor medio aritmético de los datos, por ejemplo, la edad media de los encuestados.

Fórmula de Excel: `=PROMEDIO()`

> 💡 **Importante:** La media puede verse muy influida por los valores extremos.

## Desviación estándar

La desviación estándar muestra en qué medida se alejan los datos de la media.

- Con una desviación estándar pequeña, las respuestas están cerca de la media.
- Con una desviación estándar grande, las respuestas están más dispersas.

Fórmula de Excel: `=DESVEST()`

## Percentil

El percentil indica por debajo de qué valor se sitúa un determinado porcentaje de los encuestados.

Por ejemplo, si el percentil 25 de la edad es 40 años, esto significa que:

- el 25% de los encuestados tiene menos de 40 años,
- y el 75% tiene 40 años o más.

Fórmula de Excel: `=PERCENTIL.EXC()`

## Transformar la edad en grupos de edad

Durante el análisis, a menudo resulta más útil dividir la edad en grupos de edad, porque así es más fácil elaborar distribuciones y tablas cruzadas.

Por ejemplo, podemos crear las siguientes categorías:

- 18–29 años,
- 30–39 años,
- 40–49 años,
- 50–64 años,
- más de 65 años.

Para ello podemos usar la función SI() de Excel:

```
=SI(A2<=29;"18-29"; SI(A2<=39;"30-39"; SI(A2<=49;"40-49"; SI(A2<=64;"50-64";"65+"))))
```

La variable de grupo de edad creada de esta forma puede considerarse ya una variable de nivel de medición ordinal, muy útil:

- para elaborar distribuciones porcentuales sencillas,
- en tablas dinámicas,
- y también para análisis con tablas cruzadas.
