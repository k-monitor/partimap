# Hoja de trabajo de tipo Preguntas

La hoja de trabajo de tipo Preguntas sirve para crear encuestas con cuestionarios tradicionales. Con ella puedes añadir a la encuesta preguntas de distintos tipos y controlar cómo se muestran y se responden, así como la visualización de los resultados.

En la hoja de trabajo de tipo Preguntas se pueden editar los siguientes elementos:

**Título de la hoja de trabajo** – aparece en el encabezado de la encuesta pública, así que conviene poner un título que no te importe que vean tus encuestados.

**Descripción de la hoja de trabajo** – el texto informativo que aparece al principio de la encuesta, al que se puede dar formato. En la descripción de la hoja de trabajo puedes:

- Insertar imágenes
- Añadir un enlace a un texto
- Insertar vídeos
- Dar formato al texto: negrita y cursiva
- Insertar distintos tipos de encabezado
- Crear listas
- Centrar el texto o alinearlo a la derecha o a la izquierda.

**Encuesta** – aquí se añaden y se editan las preguntas de la encuesta.

**Mostrar resultados a los visitantes después de enviar la hoja de trabajo** – después de responder, los encuestados pueden ver en forma de gráfico los resultados agregados de cada pregunta.

**Mostrar solo los resultados** – cierra la encuesta, de modo que ya no se pueden enviar respuestas nuevas y solo se pueden consultar los resultados.

**Imagen de fondo** – configuración de la imagen de fondo que aparece detrás de la hoja de trabajo.

**Hoja de trabajo ancha** – Con esta opción, el creador de la encuesta puede ofrecer a los encuestados una interfaz más ancha para rellenar la encuesta.

**Compartir página en redes sociales** – activación y desactivación de los botones que facilitan compartir la encuesta.

> ⚠️ **Importante:** Los cambios solo se registran al hacer clic en el botón **Guardar**. Los cambios guardados aparecen inmediatamente en la encuesta pública.

<figure>
	<img src="/help/sugo/keszites-question-sheet.png" alt="Interfaz de la hoja de trabajo de tipo Preguntas" />
	<figcaption>Interfaz de la hoja de trabajo de tipo Preguntas</figcaption>
</figure>

## Gestión de las preguntas

En el bloque Encuesta, las preguntas:

- Se pueden eliminar con el icono de la papelera
- Se pueden mover a otra hoja de trabajo con el icono de mover
- Se pueden reordenar arrastrando y soltando mediante el asa de la pregunta
- Pueden configurarse con la opción Pregunta obligatoria, de modo que el encuestado solo pueda continuar después de responder.
- Si marcas la opción Agregar respuestas a marcadores de mapas con fines de análisis, la respuesta se incluye en las exportaciones de mapa (.kml), de modo que los datos del mapa se pueden filtrar y analizar más adelante.

<figure>
	<img src="/help/sugo/keszites-question-actions.png" alt="Interacciones relacionadas con las preguntas" />
	<figcaption>Interacciones relacionadas con las preguntas: copiar, mover, eliminar</figcaption>
</figure>

<figure>
	<img src="/help/sugo/keszites-question-modal.png" alt="Ventana de edición de una pregunta" />
	<figcaption>Interacciones relacionadas con las preguntas: hacerlas obligatorias, función SI</figcaption>
</figure>

## Tipos de preguntas disponibles

### Cuadro de texto (breve)

El encuestado puede escribir libremente una respuesta de texto. El informe contiene el texto introducido.

Si marcas la opción Texto multilínea, el cuadro que contiene el texto pasa a tener dos líneas.

> 💡 **Consejo:** Si quieres recoger varias respuestas de texto breves (por ejemplo, tres palabras clave), usa varios campos de respuesta de texto seguidos.

### Cuadro de texto numérico

El encuestado puede escribir un número. También se pueden establecer un valor mínimo y uno máximo.

### Control deslizante numérico

El encuestado puede indicar un valor numérico mediante un control deslizante. Además del valor mínimo y el máximo, también se puede dar un nombre en texto a los dos extremos de la escala.

### Casillas de verificación

El encuestado puede seleccionar varias opciones de respuesta.

Se puede configurar:

- Cualquier número de opciones de respuesta
- El número máximo de respuestas que se pueden seleccionar
- Una opción de respuesta «Otro...» con respuesta de texto propia
- También es posible mezclar las opciones

### Selección múltiple

El encuestado puede elegir una de las opciones de respuesta indicadas.

Se puede configurar:

- Cualquier número de opciones de respuesta
- Una opción de respuesta «Otro...» con respuesta de texto propia
- También es posible mezclar las opciones

### Desplegable (una respuesta)

El encuestado elige una opción de una lista desplegable.

También es posible añadir una respuesta «Otro...».

### Calificación por estrellas (1-5)

El encuestado puede valorar la pregunta o afirmación con 1–5 estrellas.

### Matriz de opciones múltiples

Tipo de pregunta formado por varias filas y columnas.

- Las filas son los elementos que se deben valorar.
- Las columnas, las opciones de respuesta.
- En cada fila se puede marcar una respuesta.
- Se puede exigir que se indique al menos una respuesta en cada fila.

### Matriz de casillas de verificación

Versión ampliada de la matriz de opciones múltiples.

- Las filas son los elementos que se deben valorar.
- Las columnas, las opciones de respuesta.
- En cada fila se pueden seleccionar varias respuestas.
- Se puede exigir que se indique al menos una respuesta en cada fila.

### Asignación de unidades (ponderación)

El encuestado debe repartir un número predeterminado de puntos o unidades entre las opciones de respuesta.

Este tipo de pregunta es especialmente adecuado para:

- evaluar prioridades,
- establecer un orden de importancia,
- ponderar temas o problemas.

### Ordenación

El encuestado puede ordenar los elementos indicados según su importancia, sus preferencias u otro criterio. Por lo general, el orden de los elementos se cambia arrastrando y soltando (drag and drop).

Este tipo de pregunta es especialmente adecuado para:

- establecer prioridades,
- clasificar las opciones favoritas,
- determinar el orden de importancia de las necesidades de desarrollo o de los problemas.

El informe contiene el orden indicado por el encuestado.

## Preguntas condicionales

Que una pregunta aparezca o no puede depender de la respuesta dada a una pregunta anterior. Esto es válido para todos los tipos de pregunta.

La condición se establece en la ventana de edición de la pregunta, con la opción «Mostrar solamente si...».

Con las preguntas condicionales:

- la encuesta puede ser más corta,
- los encuestados solo ven las preguntas relevantes para ellos,
- se mejora la experiencia de respuesta.

**Ejemplo:** Las preguntas sobre el uso del coche solo aparecen para quienes hayan indicado antes que tienen coche.

> ⚠️ **Importante:** Una vez creada una relación condicional, el orden de las preguntas y de las hojas de trabajo afectadas solo se puede modificar de forma limitada, y tampoco se pueden cambiar las opciones de respuesta de las preguntas que definen la condición.
