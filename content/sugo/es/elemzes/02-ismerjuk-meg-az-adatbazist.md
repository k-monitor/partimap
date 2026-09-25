# ¡Conozcamos la base de datos!

Una vez que disponemos de la base de datos de la encuesta, lo primero que conviene hacer es revisar su estructura.

Por lo general:

- una fila = un encuestado,
- una columna = una variable.

Las variables no solo pueden contener las preguntas del cuestionario, sino también distintas variables auxiliares, por ejemplo:

- la fecha y hora de la respuesta,
- el dispositivo utilizado para responder,
- u otra información técnica.

Conocer la estructura de la base de datos ayuda a orientarse con más facilidad entre los datos durante el análisis.

<figure>
	<img src="/help/sugo/elemzes-excel-rows.png" alt="Base de datos en Excel" />
	<figcaption>En Excel se puede ver que cada fila corresponde a un encuestado</figcaption>
</figure>

## ¡Determinemos el tamaño de la muestra!

El primer paso es averiguar cuántos encuestados contiene nuestra base de datos.

Es importante saber que no todas las preguntas reciben el mismo número de respuestas. Esto puede deberse a varios motivos:

- algunas preguntas solo se mostraron a determinados encuestados (por ejemplo, solo a las personas empleadas se les preguntó en qué sector trabajan),
- el encuestado pasó una pregunta sin responderla.

Para interpretarlo con precisión hay que conocer cómo se programó el cuestionario, aunque el número de respuestas también permite sacar conclusiones útiles.

### Cómo determinar el número de encuestados en Excel

Para averiguar el número de encuestados, busquemos una variable en la que **con toda seguridad** todos los encuestados tengan un valor, por ejemplo:

- la fecha y hora de la respuesta,
- el identificador del encuestado.

A continuación:

1. Seleccionemos la columna completa.
2. En la esquina inferior derecha de Excel aparecerá el número de celdas seleccionadas.
3. Si la base de datos incluye una fila de encabezado, restemos uno al número de celdas; así obtendremos el número de personas que han rellenado el cuestionario.

<figure>
	<img src="/help/sugo/elemzes-response-count.png" alt="Cálculo del número de respuestas" />
	<figcaption>Cálculo del número de respuestas</figcaption>
</figure>
