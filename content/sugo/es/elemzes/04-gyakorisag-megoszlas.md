# Frecuencia y distribución

Uno de los pasos más sencillos y habituales del análisis de datos es el estudio de las frecuencias y las distribuciones. Con ellas podemos ver rápidamente cómo se reparten los encuestados entre las distintas opciones de respuesta.

Por ejemplo, podemos averiguar fácilmente:

- qué porcentaje de los encuestados son mujeres y qué porcentaje hombres,
- cómo es la distribución por edad,
- o qué nivel de estudios tienen los encuestados.

## Frecuencias y distribuciones con una tabla dinámica

En Excel, la forma más sencilla de elaborar tablas de frecuencias y de distribución porcentual es con una tabla dinámica (PivotTable).

Los pasos son los siguientes:

1. Seleccionemos la columna que contiene la variable que queremos analizar.
2. En la pestaña Insertar, elijamos la opción Tabla dinámica.
3. En la ventana emergente, hagamos clic en el botón Aceptar.

Excel creará una hoja de cálculo nueva con la tabla dinámica.

<figure>
	<img src="/help/sugo/elemzes-pivot-create.png" alt="Creación de una tabla dinámica en Excel" />
	<figcaption>Proceso de creación de una tabla dinámica</figcaption>
</figure>

## Configuración de la tabla dinámica

En el panel Campos de tabla dinámica que aparece a la derecha, arrastremos la variable elegida:

- una vez al área Filas (Eje),
- y otra vez al área Valores.

Aparecerá entonces la frecuencia de cada categoría, es decir, por ejemplo, el número de hombres y de mujeres que han respondido.

## Mostrar la distribución porcentual

Si, en lugar de los recuentos o además de ellos, también nos interesa la distribución porcentual:

1. hagamos clic en la opción Configuración de campo de valor,
2. elijamos la pestaña Mostrar valores como,
3. y en el menú desplegable seleccionemos % del total general.

<figure>
	<img src="/help/sugo/elemzes-pivot-percent.png" alt="Configuración de la distribución porcentual" />
	<figcaption>Configuración para mostrar la distribución porcentual</figcaption>
</figure>

## Frecuencia y porcentaje a la vez

Si queremos ver al mismo tiempo los recuentos y la distribución porcentual, arrastremos dos veces la misma variable al área Valores. Después, cambiemos solo uno de los campos al formato % del total general.

Así, la tabla mostrará a la vez el número de casos y el porcentaje de cada categoría.

## Interpretación de los resultados

Según los datos del ejemplo, la muestra incluye 594 encuestados, de los cuales:

- 367 son mujeres (62%),
- 221 son hombres (37%),
- 6 eligieron la categoría «otro» (1%).

<figure>
	<img src="/help/sugo/elemzes-pivot-table.png" alt="Ejemplo de tabla dinámica" />
	<figcaption>Ejemplo de un gráfico dinámico</figcaption>
</figure>

Conviene aplicar este mismo método de análisis a las demás variables demográficas básicas para obtener una visión global de la composición de los encuestados antes de empezar a analizar las preguntas de fondo del cuestionario.
