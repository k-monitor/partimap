# Cómo tratar las categorías con pocos casos

Al interpretar las tablas cruzadas, no solo debemos fijarnos en los porcentajes, sino también en el número de casos de cada categoría.

Antes vimos que, en la variable sexo, la categoría «otro» incluye solo a 6 encuestados. Con un número de casos tan bajo, las distribuciones porcentuales pueden ser fácilmente engañosas, ya que una sola respuesta puede provocar una diferencia porcentual considerable.

Como regla general, no conviene analizar por separado las categorías de menos de unas 30 personas, aunque el umbral exacto depende también del objetivo del análisis y del tamaño de la tabla cruzada.

En estos casos tenemos varias opciones:

- renunciamos a analizar por separado esa categoría,
- o la agrupamos con otra categoría de contenido similar.

## Agrupar categorías en Excel

En el ejemplo agrupamos las categorías «mujer» y «otro». Para ello, insertemos una columna nueva junto a la variable *sexo* y utilicemos la siguiente fórmula:

```
=SI(O(E2="Mujer";E2="Otro");"Mujer/otro";"Hombre")
```

Del mismo modo, en la variable frecuencia de visita a la calle Piac también conviene agrupar las categorías con muy pocos casos. En el ejemplo, la categoría «Nunca» incluye a un solo encuestado, por lo que es recomendable unirla a la categoría «Con menos frecuencia».

|  | A diario | Varias veces por semana | Una vez por semana | Con menos frecuencia | Total general |
| --- | --- | --- | --- | --- | --- |
| Muestra total | 24% | 34% | 18% | 25% | 100% |
| Hombre | 27% | 33% | 15% | 26% | 100% |
| Mujer/otro | 22% | 34% | 20% | 25% | 100% |
| Estudios básicos | 33% | 28% | 18% | 23% | 100% |
| Estudios secundarios | 29% | 34% | 16% | 21% | 100% |
| Estudios superiores | 20% | 34% | 19% | 27% | 100% |
| Vivimos cómodamente con nuestros ingresos actuales. | 18% | 36% | 20% | 25% | 100% |
| Nos alcanza con nuestros ingresos actuales. | 26% | 33% | 18% | 24% | 100% |
| Nos cuesta (mucho) llegar a fin de mes con nuestros ingresos actuales. | 22% | 31% | 16% | 31% | 100% |

## Comparar varias variables demográficas

El análisis con tablas cruzadas no solo sirve para comparar por sexo. Conviene incluir también otras variables demográficas, por ejemplo:

- edad,
- nivel de estudios,
- situación económica subjetiva.

Así obtendremos una visión más completa de en qué se diferencian las respuestas de los distintos grupos.

## Interpretación de los resultados

Las tablas cruzadas pueden interpretarse de varias maneras.

#### 1. Comparación con la muestra total

Podemos examinar en qué medida un grupo determinado se aleja de la distribución media de la muestra total.

Por ejemplo, el 33% de las personas con estudios básicos visita la calle Piac a diario, mientras que en la muestra total esta proporción es del 24%. Esto indica que la visita diaria es más frecuente entre las personas con estudios básicos.

#### 2. Comparación de grupos demográficos

También podemos comparar los grupos entre sí.

En el ejemplo se observa que los hombres visitan la calle Piac a diario en mayor proporción, mientras que las mujeres acuden a ella más bien con una periodicidad semanal.

#### 3. Búsqueda de tendencias

En las variables ordinales (que pueden ordenarse), no solo podemos buscar diferencias entre categorías, sino también tendencias generales.

En el ejemplo, según el nivel de estudios, se observa que cuanto más bajo es el nivel de estudios de los encuestados, mayor es la proporción de quienes visitan la calle Piac a diario.

Estos patrones ayudan a comprender más a fondo las relaciones entre los datos y pueden servir de base para conclusiones posteriores.

> 💡 **Importante:** Para afirmar con total seguridad que existe una relación estadística entre el nivel de estudios y la frecuencia de visita a la calle Piac, habría que examinar los datos con una prueba de chi cuadrado. Por razones de espacio no presentamos aquí la prueba de chi cuadrado, pero es importante señalar que, sin realizarla, no podemos descartar que las diferencias se deban al azar.
