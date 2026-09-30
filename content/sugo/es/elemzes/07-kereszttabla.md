# Tabla cruzada

Una vez que conocemos la muestra según sus principales características demográficas, podemos empezar a analizar las preguntas de fondo del cuestionario.

También aquí conviene determinar primero qué nivel de medición tiene la variable con la que trabajamos. Con una sola variable podemos seguir elaborando tablas sencillas de frecuencias o de distribución porcentual, pero si nos interesa la relación entre dos variables, la tabla cruzada será una de las herramientas de análisis más útiles.

Con una tabla cruzada podemos examinar, por ejemplo:

- con qué frecuencia visitan la calle Piac los hombres y las mujeres,
- si la opinión sobre un servicio difiere entre los grupos de edad,
- o si las respuestas varían según el nivel de estudios.

## Cómo crear una tabla cruzada en Excel

En el ejemplo analizamos si existe relación entre el sexo y la frecuencia con la que se visita la calle Piac.

Los pasos para crear la tabla dinámica son:

1. Seleccionemos las columnas que contienen las variables sexo y frecuencia de visita a la calle Piac.
2. En la pestaña Insertar, elijamos la opción Tabla dinámica y hagamos clic en el botón Aceptar.
3. En el panel Campos de tabla dinámica:
	- arrastremos la variable sexo al área Filas,
	- arrastremos la variable frecuencia de visita a la calle Piac al área Columnas,
	- y arrastremos también esa misma variable al área Valores.

<figure>
	<img src="/help/sugo/elemzes-crosstab-setup.png" alt="Configuración de la tabla cruzada" />
	<figcaption>Cómo configurar la tabla cruzada</figcaption>
</figure>

## Mostrar porcentajes

En el área Valores, hagamos clic en la variable y elijamos la opción Configuración de campo de valor.

En la pestaña Mostrar valores como, cambiemos la presentación a la opción % del total de filas.

Así, cada fila sumará el 100%, lo que facilita mucho la comparación entre grupos.

<figure>
	<img src="/help/sugo/elemzes-valuefield-settings.png" alt="Configuración de campo de valor" />
	<figcaption>Cómo configurar el campo de valor</figcaption>
</figure>

## Interpretación de los resultados

En la tabla resultante podemos leer a la vez:

- la distribución de la muestra total,
- y los resultados de cada grupo demográfico.

<figure>
	<img src="/help/sugo/elemzes-crosstab-example.png" alt="Ejemplo de tabla cruzada" />
	<figcaption>Ejemplo de tabla cruzada creada a partir de una tabla dinámica</figcaption>
</figure>

En nuestro ejemplo, para la muestra total se observa que:

- el 24% visita la calle Piac a diario,
- el 33,5%, varias veces por semana,
- el 18%, una vez por semana,
- y el 25%, con menos frecuencia.

El desglose por sexo muestra que, en conjunto, hombres y mujeres visitan la calle con una frecuencia similar, aunque se aprecian pequeñas diferencias.

**Por ejemplo:**

- el 27% de los hombres visita la calle Piac a diario, mientras que entre las mujeres esta proporción es del 21%;
- las mujeres acuden en mayor proporción una vez por semana o varias veces por semana (20% y 35%, respectivamente);
- la proporción de quienes la visitan menos de una vez por semana es casi idéntica (hombres: 26%, mujeres: 24%).

Este tipo de comparaciones ayuda a descubrir en qué medida una respuesta está relacionada con las distintas características demográficas.
