## Ayuda para crear una encuesta {#adminsugo}

A continuación se describe cómo funciona la interfaz de administración.

### Registro {#registration}

Después de [registrarse](/register), cualquier persona puede utilizar la aplicación con acceso completo a sus funciones y de forma gratuita. PARTIMAP está actualmente disponible en húngaro e inglés, y puede cambiar entre los idiomas haciendo click en el botón en la esquina superior derecha (<i class="fas fa-globe fa-fw"></i>). Si desea utilizar el programa en otro idioma y ayudar con la traducción, ¡contáctenos en <**hello@partimap.eu**>!

En la interfaz de administración, puede crear nuevas encuestas, modificar las anteriores ([**Proyectos**](/admin/projects)) y editar mapas relacionados con las encuestas ([**Mapas**](/admin/maps)).

### Crear nuevo proyecto y gestionar los anteriores {#ujprojekt}

Un nuevo proyecto se puede crear ingresando **el nombre del proyecto** en la página de Proyectos después de iniciar sesión y haciendo click en el botón _Agregar_.

<div class="row mb-5">
	<div class="col-12 col-lg-10 mx-auto mt-4">
		<figure class="figure">
			<img
				alt="Create project"
				class="figure-img img-fluid rounded shadow-sm"
				src="/help/project-en.png"
			>
			<figcaption class="figure-caption text-center">
				Creando un proyecto
			</figcaption>
		</figure>
	</div>
</div>

En el menú Proyecto puede encontrar una lista de sus propios proyectos. Aquí puede ver el número de vistas y respuestas, y haciendo click en **Generar informe** puede descargar el informe generado a partir de las completaciones en formato .xlsx.

Los datos, preguntas y contenido relacionado con la encuesta se pueden ingresar en la hoja de datos del proyecto después de que se haya creado el proyecto. Al hacer clic en la función «Transferir a otro usuario», los cuestionarios se pueden compartir para su edición con otro usuario registrado.

Encontrará un botón **⋮** junto a cada uno de los proyectos que le permitirá **Eliminar** los que ya no necesite. Si selecciona **Duplicar**, podrá replicar y publicar su proyecto sin las respuestas ficticias de la fase de prueba.

### Datos del Proyecto {#project data sheet}

Desde el menú [Proyectos](/admin/projects), haga click en el nombre del proyecto en la lista o cree un nuevo proyecto para ir a la página de detalles del proyecto.

Está dividido en dos partes: la parte superior de la página proporciona información general sobre la encuesta y la segunda parte le permite crear y editar las Hojas de Trabajo.

En los datos y ajustes relacionados, tiene la opción de

- ingresar el nombre del proyecto, que aparecerá en el título de la página del navegador y al compartir en redes sociales, además de la interfaz de administración;
- editar su ruta (URL - <code>https://partimap.eu/p/*</code>),
- establecer una protección con contraseña para restringir quién puede completarla. En este caso, al navegar a la URL del cuestionario se solicitará una contraseña, que luego se puede usar para completar el cuestionario. Si no desea recibir más completaciones, también puede desactivar el cuestionario estableciendo una contraseña;
- Agregar una descripción única de metadatos (texto de vista previa) para compartir en Facebook, cargar una imagen única para compartir en Facebook;
- Proporcionar los detalles de contacto del responsable de los datos, que aparecerá en la declaración de privacidad;
- Proporcione un mensaje único de agradecimiento y un enlace para continuar la navegación (Siguiente URL) al final de la completación (después del envío) y para activar/desactivar los botones (Facebook, Twitter, correo electrónico) al final de la completación, invitando al encuestado a compartir la encuesta.

### Hojas de Trabajo

Cada Proyecto se divide en hojas de trabajo. Las Hojas de Trabajo son las páginas de tu encuesta. En la interfaz de edición de cada hoja de trabajo, puede configurar diferentes preguntas del cuestionario, textos informativos y elementos de mapa que promuevan la interacción de los encuestados.

Las hojas de trabajo se pueden editar en la configuración general de la encuesta. Para un nuevo proyecto, esta sección está vacía, y puede comenzar a editar el contenido de la encuesta haciendo click en el botón _Agregar nueva hoja de trabajo_. También está disponible aquí una vista de lista de las hojas de trabajo ya creadas.

<div class="row mb-5">
	<div class="col-12 col-lg-10 mx-auto mt-4">
		<figure class="figure">
			<img
				alt="Lista de hojas de trabajo"
				class="figure-img img-fluid rounded shadow-sm"
				src="/help/sheets-en.png"
			>
			<figcaption class="figure-caption text-center">
				Lista de hojas de trabajo
			</figcaption>
		</figure>
	</div>
</div>

Si ya hay varias hojas de trabajo en el proyecto, se pueden utilizar las flechas arriba y abajo para cambiar el orden de las hojas de trabajo, y el ícono de papelera elimina la hoja de trabajo innecesaria.

Puede seleccionar el tipo de hoja de trabajo (_Texto_, _Encuesta_, _Mapa estático_ o _Mapa interactivo_) haciendo click en los pictogramas.

<div class="row mb-5">
	<div class="col-12 col-lg-10 mx-auto mt-4">
		<figure class="figure">
			<img
				alt="Agregar una nueva hoja de trabajo"
				class="figure-img img-fluid rounded shadow-sm"
				src="/help/newsheet-en.png"
			>
			<figcaption class="figure-caption text-center">
				Agregar una nueva hoja de trabajo
			</figcaption>
		</figure>
	</div>
</div>

En la primera hoja de trabajo, los encuestados deben aceptar los términos de uso y la política de privacidad. Como primera hoja de trabajo, es útil proporcionar una hoja de trabajo tipo “Texto” en la que se pueda aclarar el alcance (por ejemplo, longitud esperada de la encuesta) y el propósito de la encuesta.

Al hacer click en el botón **Ver Proyecto** en la esquina superior derecha de la Hoja de Datos del Proyecto, puede ir directamente al cuestionario en construcción, siguiendo los cambios que ha guardado. Al editar el cuestionario, es una buena idea rastrear los cambios aquí en paralelo con la interfaz del editor.

### Tipos de hojas de trabajo {#worksheets}

#### Text worksheet {#soveges}

Una hoja de trabajo con texto e imágenes, que se puede utilizar para describir, entre otras cosas, los objetivos de la encuesta, las actividades de la organización o institución que realiza la encuesta, el contexto de la situación de decisión. Se pueden proporcionar cuando se edita la hoja de trabajo:

- El _Título de la hoja de trabajo_, que también aparecerá en la encuesta pública;
- La _Descripción de la hoja de trabajo_, que es el texto principal del cuadro de diálogo que aparece. El texto se puede personalizar con opciones de formato básico, con la posibilidad de insertar un enlace o una imagen (proporcionando un enlace de origen externo);
- Su _Imagen de fondo_, que llena el espacio detrás del cuadro de diálogo;
- Botones para compartir la encuesta.
- Modo Quiz: al activarlo, los participantes solo pueden pasar de una hoja de trabajo a otra si el administrador les da permiso para ello.

Para guardar los cambios, presione el botón _Guardar_, y aparecerá una ventana emergente que le advertirá cuando navegue a otra página. Las flechas azules derecha/izquierda en la parte inferior de la página se utilizan para navegar entre las hojas de trabajo en edición.

Desde la interfaz de edición de hojas de trabajo, también puede volver a la hoja del proyecto haciendo click en el icono de PARTIMAP (_Volver al proyecto_) en la esquina superior izquierda.

#### Hoja de trabajo de tipo Encuesta {#kerdoiv}

La hoja de trabajo de tipo Encuesta le permite crear encuestas de cuestionario tradicionales. Se pueden ingresar al editar la hoja de trabajo:

- El título de la hoja de trabajo, que también aparecerá en la encuesta pública;
- La descripción de la hoja de trabajo, que aparece en la parte superior del cuadro de diálogo. El texto se puede personalizar con opciones de formato básico, con la posibilidad de insertar un enlace o una imagen, similar a la hoja de trabajo de Texto. Al agregar una imagen, es posible condicionar las preguntas a la imagen;
- Encuesta: para la hoja de trabajo, aquí está la posibilidad de agregar preguntas de cuestionario, cuyas propiedades se pueden editar en el cuadro de diálogo que aparece;
- Mostrar resultados a los visitantes después de enviar la hoja de trabajo: si está marcado, después de continuar a la siguiente página, se muestra al visitante una estadística agregada simple de las respuestas hasta ahora en un gráfico de barras;
- Mostrar solo los resultados: si está marcado, se cierran las preguntas de la hoja de trabajo, ya no se recopilan más respuestas. En esta hoja de trabajo, solo los resultados de respuestas anteriores serán visibles para los visitantes. Esto le da la oportunidad de convertir la encuesta cerrada en un proyecto que muestre el resultado de la encuesta manteniendo el mismo enlace;
- Suministrar imagen de fondo, que llena el espacio detrás del cuadro de diálogo;
- Botones para compartir la encuesta. Esto es útil para la última hoja de trabajo, que a menudo contiene preguntas demográficas.

Los siguientes tipos de preguntas se pueden agregar al bloque de Encuesta especificando el texto de la pregunta:

_Cuadro de texto_: un cuadro de texto permite al encuestado escribir cualquier respuesta. El informe incluirá esta respuesta de texto.

_Cuadro de texto numérico_: el campo se puede completar escribiendo un número. Puede establecer el valor mínimo y máximo de la respuesta que se puede dar. El informe contiene la respuesta en formato numérico.

_Control deslizante numerico_: aquí el encuestado puede establecer una respuesta numérica sin escribir, utilizando un control deslizante. Aquí también puede especificar el valor mínimo y máximo de la respuesta. Los dos extremos también se pueden nombrar en texto, que aparecerá en ambos lados del control deslizante en el cuestionario, formando una escala. El informe contiene la respuesta en formato numérico.

_Casillas de verificación_: en la sección Opciones, haga click en el botón Nueva opción para ingresar cualquier número de opciones de respuesta, a las que el encuestado puede responder individualmente marcando la casilla. Se puede establecer el número máximo de respuestas que se pueden seleccionar. Al marcar la casilla de opción Agregar otro, se agregará una opción Otro... a la lista de respuestas, lo que permitirá al encuestado ingresar su propia respuesta de texto a la pregunta. El informe contendrá el nombre de las opciones de respuesta seleccionadas y la otra respuesta dada, separados por punto y coma.

_Selección múltiple_: en la sección Opciones, al hacer click en el botón Nueva opción, puede seleccionar cualquier número de opciones, de las cuales el encuestado puede elegir una. El informe contendrá el nombre de la opción de respuesta en forma de texto.

_Desplegable (una respuesta)_: al igual que en la elección múltiple, el encuestado puede seleccionar una de las Opciones dadas en una lista desplegable. Además de las Opciones, también puede especificar una opción Otro... El informe contendrá el nombre de la opción de respuesta en forma de texto.

_Calificación por estrellas (1-5)_: el encuestado puede dar una calificación de 1 a 5 estrellas a la pregunta simplemente haciendo click en ella. El informe contiene la respuesta en formato numérico.

_Matriz de casillas de verificación_: similar al tipo de pregunta de elección múltiple, pero se pueden ingresar varias filas, para las cuales se pide al encuestado que elija una de las opciones de respuesta (Columna). Se pueden ingresar cualquier número de filas y columnas para la pregunta. Si una respuesta es obligatoria, se debe seleccionar una opción para cada fila. El informe contendrá el nombre de la opción de respuesta en forma de texto, desglosado por línea.

_Matriz de opciones múltiples_: Al igual que el tipo de pregunta de casillas de verificación, el encuestado puede seleccionar más de una opción de respuesta para una fila, que se puede configurar haciendo click en el botón Nueva columna. Puede agregar cualquier número de filas y columnas a una pregunta. Si una respuesta es obligatoria, al menos una opción debe seleccionarse para cada fila. El informe contendrá los nombres de las opciones de respuesta en forma de texto, separados por punto y coma.

_Asignación de unidades (ponderación):_ este tipo de pregunta pide al encuestado que distribuya un número determinado de unidades (Número de unidades a asignar), que puede especificarse en el texto de la pregunta, entre las opciones dadas. El encuestado debe asignar todas las unidades. El informe contendrá los valores por opción. El tipo de pregunta puede utilizarse para evaluar con precisión (ponderar) la importancia de diferentes áreas, temas o cuestiones.

Cada pregunta se puede hacer obligatoria marcando la casilla de _Pregunta obligatoria_, sin la cual el encuestado no podrá avanzar ni enviar su respuesta.

En el bloque Preguntas (en la lista de preguntas) de la interfaz de edición de la hoja de trabajo, las preguntas se pueden eliminar haciendo clic en el icono de la papelera, se pueden mover a otra hoja de trabajo con la flecha bidireccional situada junto a ellas, y se puede modificar su orden haciendo clic en la casilla de la pregunta y arrastrándola.

#### Hoja de trabajo de tipo Mapa estático {#static}

La hoja de trabajo se puede utilizar para crear una encuesta basada en mapas que se puede utilizar para presentar un desarrollo o plan completado, y para recopilar evaluaciones y comentarios al respecto. Aquí, se les pide a los encuestados que respondan preguntas relacionadas con lo que ven en el mapa, pero a diferencia de la hoja de trabajo de mapa interactivo, no se les permite dibujar en el mapa.

Al crear la hoja de trabajo del Mapa, puede importar el contenido del mapa de un mapa existente almacenado en el menú Mapas (_Copiar características de este mapa_) o cargarlo directamente desde una fuente externa (por ejemplo, Google Maps) utilizando un archivo .kml. Para obtener más información sobre cómo mover el mapa, consulte la introducción en la subsección sobre Mapas.
Al marcar los límites del mapa, podemos especificar el área en la que el usuario puede moverse y ampliar el mapa.

Elementos que se pueden definir al editar la hoja de trabajo:

- El _Título de la Hoja de Trabajo_, que también aparecerá en la encuesta pública;
- La _Descripción de la Hoja de Trabajo_, que aparece en la parte superior del cuadro de diálogo. Aquí es útil explicar de manera concisa lo que se espera que haga el encuestado en la hoja de trabajo. El texto se puede personalizar con opciones de formato básico, y también existe la posibilidad de insertar enlaces e imágenes.
- _Encuesta_: también es posible agregar preguntas de cuestionario aquí para toda la hoja de trabajo, que se pueden editar en el cuadro de diálogo, de manera similar a la hoja de trabajo del Cuestionario. Las preguntas del cuestionario se muestran en la barra lateral debajo de la descripción para aquellos que completan la encuesta.
- _Mostrar resultados a los visitantes después de enviar la hoja de trabajo_: si está marcado, después de continuar a la siguiente página, se muestra al visitante una estadística agregada simple de las respuestas hasta ahora en un gráfico de barras, y el promedio de las puntuaciones asignadas a los elementos;
- _Mostrar solo los resultados_: si está marcado, se cierran las preguntas de la hoja de trabajo, ya no se recopilan más respuestas. En esta hoja de trabajo, solo los resultados de respuestas anteriores serán visibles para los visitantes. Esto le da la oportunidad de convertir la encuesta cerrada en un proyecto que muestre el resultado de la encuesta manteniendo el mismo enlace;

- Interacciones del encuestado: si se marca _Calificar características estáticas_, los encuestados pueden calificar los elementos que se muestran en el mapa. Se pueden seleccionar dos tipos de calificación:
    - Estrellas: el encuestado puede calificar el elemento con estrellas haciendo click en él. Se puede configurar el número de estrellas (1-10), pero si se selecciona una sola estrella, se puede usar como respuesta de sí/no. La calificación no incluye una pregunta a nivel de hoja de trabajo, las instrucciones para esto deben proporcionarse de manera exhaustiva en la descripción de la hoja de trabajo o individualmente en la descripción del elemento. Si se establece la estadística de respuesta, se mostrará el número promedio de estrellas y el número de calificaciones para los elementos después de continuar a la siguiente página; esto se muestra de manera predeterminada en la interfaz de administración.
    - Me gusta/no me gusta: el encuestado puede dar a los elementos una calificación positiva (👍) o negativa (👎). Si se establece la estadística de respuesta, se mostrará el número de calificaciones positivas y negativas para los elementos después de continuar a la siguiente página; esto se muestra de manera predeterminada en la interfaz de administración.
      El informe muestra los datos de calificación en una hoja de trabajo de Calificaciones separada, que incluye el identificador de encuestado utilizado para asociar la calificación con otras respuestas, el nombre del elemento calificado y la calificación en formato numérico (número de estrellas, [1, -1]). Además, el informe generado también muestra el número total y el promedio de calificaciones en una hoja de trabajo de Calificaciones Agregadas.

- _Mapa base predeterminado_: aquí puede establecer el mapa base que se mostrará detrás de los elementos dibujados en el mapa base (por ejemplo, red de carreteras, satélite, blanco y negro, carriles para bicicletas, topográfico, etc.). Los encuestados pueden cambiar la visualización ellos mismos.
- _Puntos en el mapa_: aquí se muestran los elementos dibujados en el mapa base. El contenido que se muestra a los encuestados cuando hacen click en el elemento o el cajón se puede editar en los cajones de los elementos. En el cajón del elemento, puede configurar el nombre, el color, el tamaño, el estilo y la descripción de la imagen.
    - Al completar el campo de _Nombre de categoría_, se pueden filtrar los elementos del mapa por esa categoría. Al establecer una categoría, se pueden separar diferentes elementos y analizarlos con mayor facilidad.
    - Al marcar la casilla _Ocultar de la lista de características_, el elemento aparecerá en el mapa, pero no se podrá interactuar con él: no aparecerá como cajón entre los elementos del Mapa y no se podrá hacer click en él en el mapa. Esto es útil al dibujar un elemento auxiliar en el mapa que solo orienta a los encuestados, por ejemplo, el límite de una ciudad.

- Usando los botones KML encima de la lista de elementos, es posible cargar un mapa creado en otra interfaz de edición (<i class="fas fa-fw fa-upload"></i>) o descargar elementos de mapa (<i class="fas fa-fw fa-download"></i>).

También puede usar los botones de _punto_, _línea_ y _polígono_ en la esquina superior derecha de la interfaz de edición de la hoja de trabajo del mapa estático para dibujar elementos directamente en el mapa que se muestra en la hoja de trabajo. Se pueden dibujar cualquier cantidad de elementos en el mapa. Puede acercar el mapa utilizando los botones +/- o utilizando la función de zoom de dos dedos.

\*Dibujar un punto> (rojo): haga click en el pin blanco sobre el fondo rojo para colocar un marcador de punto. El marcador se puede colocar con un solo click.

_Dibujar una línea_ (azul): haga click en la línea blanca sobre el fondo azul para dibujar una línea. Haga click una vez para colocar el punto de inicio de la línea en el mapa, haga click nuevamente para marcar los puntos intermedios de la línea y haga doble click para marcar el punto final.

<div class="row mb-5">
	<div class="col-12 col-lg-10 mx-auto mt-4">
		<figure class="figure">
			<img alt="Draw line" class="figure-img img-fluid rounded shadow-sm" src="/help/line-en.png">
			<figcaption class="figure-caption text-center">
				Dibujar una línea
			</figcaption>
		</figure>
	</div>
</div>

- _Dibujar un polígono_ (verde): haga click en el contorno blanco sobre el fondo verde para dibujar un área (polígono). Haga click una vez para colocar el punto de inicio de la forma en el mapa, haga click nuevamente para marcar los límites y luego haga click nuevamente en el punto de inicio para finalizar el dibujo.
- _Vista móvil_: si está utilizando la interfaz de edición en una tableta o teléfono móvil, puede alternar entre el panel de preguntas y el mapa presionando los botones ocultar (<<) y abrir (>>) para las hojas de trabajo de mapas. Los botones de dibujo están disponibles en la vista de mapa al ocultar la barra lateral.

#### Hoja de trabajo de tipo Mapa Interactivo {#interaktiv}

La hoja de trabajo del Mapa interactivo es una versión más avanzada de la hoja de trabajo del Mapa, ya que permite a los encuestados dibujar en el mapa. "Al igual que con el mapa estático, el administrador tiene la opción de dibujar elementos en el mapa para orientar a los encuestados o para esperar marcas en relación con él. Sin embargo, no se pueden añadir preguntas de cuestionario ni calificaciones a la hoja de trabajo y sus elementos aquí.

_El título de la hoja de trabajo_ y _la descripción de la hoja de trabajo_ deben contener información que ayude al encuestado a dar una respuesta precisa a la pregunta formulada.

El menú de interacciones con el encuestado le permite establecer el tipo de marcado (punto, línea, área) que se recopila del encuestado. Puede solicitar varios tipos de marcado en una hoja de trabajo, pero solo se puede asignar una tarea a un tipo de elemento. Por ejemplo, se pueden especificar varias tareas diferentes para la representación de puntos (lugares favoritos y lugares desagradables) en hojas de trabajo interactivas separadas.

Para los elementos seleccionados, el cuadro de texto Instrucción para marcar punto/línea/área le permite especificar exactamente lo que los encuestados deben marcar (por ejemplo, ¿Cuál es su lugar favorito? [punto], ¿Cómo viaja al trabajo? [línea], ¿Dónde le gustaría tener más espacio verde? [área]). Este texto aparecerá en la barra lateral junto al botón que inicia el dibujo. Si el encuestado dibuja algo en el mapa, puede añadir texto a su respuesta. Puede introducir las instrucciones correspondientes en el campo Pregunta asignada a elementos dibujados, orientando así la respuesta.

_Puntos en el Mapa_ contienen una lista de elementos añadidos (dibujados o cargados) en el área de administración, similar a un mapa estático. Cabe destacar que la descripción que se les asigna no se muestra al encuestado; estos elementos solo aparecen en el mapa como elementos ocultos del mapa estático. Los elementos dibujados se pueden utilizar aquí para orientar a los encuestados, y se puede ajustar su color, tamaño y estilo. También se pueden utilizar para indicar el área o zonas en las que se espera que se dibujen los elementos. Además, son útiles porque el mapa se acerca automáticamente a estos elementos.

Si los elementos dibujados por los encuestados ya se han enviado a un mapa interactivo, se pueden exportar a un mapa personal haciendo clic en el enlace 'Enviar a mi mapa' junto a la hoja de trabajo en la lista de la hoja de datos del proyecto, donde se pueden consultar, editar o descargar en formato .kml para uso externo. El informe .xlsx también contiene los datos de los elementos enviados (identificador de relleno, coordenadas, descripción)."

### Crear mapas y gestionar historiales {#terkepekek}

En el menú <a href="/admin/maps" target="_blank">Mapas,</a> puedes almacenar y editar tus propios dibujos de mapas (.kml, formato de archivos shapefiles). Aquí puedes recopilar y editar mapas de la ciudad del usuario y sus alrededores que se hayan creado previamente, así como las respuestas recopiladas de los cuestionarios. Utilizando archivos en formato .kml, es fácil exportar los elementos almacenados aquí a editores de mapas externos e importar mapas desde allí a PARTIMAP. También es fácil moverse entre el menú Mapas y los proyectos: puedes trasladar el contenido de tus propios mapas a hojas de trabajo (Copiar elementos de mapas desde aquí).

Actualmente, PARTIMAP no ofrece funciones de análisis gráfico, pero puedes editar elementos individuales en tu propio mapa: además de su nombre y descripción, puedes personalizar su apariencia (color, tamaño, estilo de línea en el caso de las líneas).

Para crear tu propio mapa nuevo:

- En la página de [Mapas](/admin/maps), ingresa el nombre del nuevo mapa y haz clic en el botón Agregar. Aquí puedes cargar datos desde un archivo .kml en la interfaz del editor;
- Desde las respuestas de los encuestados en una encuesta, con el botón _Enviar a Nuevo Mapa Propio_ en la fila de la hoja de trabajo correspondiente en la hoja de datos del proyecto.

Puedes editar los siguientes detalles de tu propio mapa en una interfaz similar a las hojas de trabajo:

- Nombre del mapa
- Elementos del mapa: aquí se muestran los objetos dibujados en el mapa base. Utilizando los botones de exportación/importación KML en la parte inferior de la página, puedes importar un mapa creado en otra interfaz de editor al mapa base y guardar los elementos del mapa en formato .kml.

El archivo .kml que contiene las completaciones de la encuesta de PARTIMAP contiene el tipo de marcadores como una categoría, por lo que puedes utilizar un programa de análisis externo o convertir el archivo .kml en una [hoja de cálculo](https://mygeodata.cloud/converter/kml-to-xlsx) para separar los diferentes marcadores y editar los parámetros de los elementos.

Los archivos .kml generados y utilizados por PARTIMAP utilizan los siguientes parámetros, que también proporcionan interoperabilidad con Google Maps:

- Las coordenadas x e y de los puntos que componen los elementos;
- El número de serie del elemento (gid) y su nombre (Nombre);
- La categoría asignada al elemento (partimapCategoría);
- El estilo de la línea o el límite del área (partimapEstiloDeLínea), el tamaño del punto (partimapTamañoDePunto) y otros parámetros (tamaño, color) leídos automáticamente por Google Maps (ExtendedData);
- El contenido del campo de descripción utilizado por PARTIMAP (partimapDescripción);
- Más información sobre esto está disponible en la [página de Github](https://github.com/k-monitor/partimap/blob/master/KML.md) del proyecto.

### Report and results {#riport}

Puedes descargar una encuesta en formato .xlsx desde la vista de lista de [Proyectos](/admin/projects). El informe contiene los resultados en el formato detallado anteriormente. Los elementos del mapa se pueden vincular a las respuestas a las preguntas de la encuesta, como los datos demográficos de los encuestados, mediante números de identificación. Una vez que los datos están vinculados, los marcadores espaciales se pueden analizar con mayor profundidad, filtrándolos en cada grupo de encuestados.

### Consejos para crear una encuesta {#tips}

Antes de empezar a compilar el cuestionario, debemos tener claro la decisión o actividad que queremos que los encuestados respalden. Tiene sentido centrarse en un tema, ya que si el enfoque del cuestionario es demasiado amplio, las respuestas serán menos precisas y los encuestados pueden desanimarse si tienen que responder a demasiadas preguntas o preguntas que no les son relevantes. Si se enfoca adecuadamente, los grupos objetivos también pueden identificarse y alcanzarse con mayor facilidad.

**¡Planifica a quién quieres llegar con tu cuestionario y cómo!**
Un cuestionario sobre parques infantiles, por ejemplo, debería enviarse a un grupo de Facebook de madres locales, pero si quieres preguntar a jóvenes locales sobre un tema que les concierne, debes llegar a ellos a través de las plataformas o instituciones que utilizan a diario.

Enfócate en los grupos sociales más difíciles de alcanzar. Los cuestionarios en línea tienden a llegar a encuestados jóvenes o de mediana edad con ingresos y educación más altos. Sin embargo, con un diseño adecuado y diferentes herramientas (incluso fuera de línea), podemos asegurarnos de que todos tengan la oportunidad de expresar sus opiniones. Coloca el cuestionario en papel en la biblioteca, coloca un código QR que apunte al cuestionario en espacios comunitarios, ¡anima a las ONG a compartir el cuestionario con sus clientes y seguidores!

También vale la pena saber qué datos ya están disponibles sobre el tema que quieres mapear. ¡No hagas preguntas cuyas respuestas ya conocemos o que se pueden averiguar fácilmente sin preguntar!

**¡El cuestionario debe ser conciso!**

A medida que se realiza una encuesta, surgen nuevas ideas sobre el tema, y se buscan más y más detalles. Sin embargo, los encuestados no están tan comprometidos y pueden abandonar si ven una encuesta larga. Recomendamos que no utilices más de 6-8 hojas de trabajo en una encuesta. ¡Mide el tiempo que se tarda en completar una encuesta y no la hagas más larga de 10-12 minutos!

Indica el tiempo estimado de finalización en la primera hoja de trabajo de la encuesta. Si el número de personas que completan la encuesta es mucho menor que el número de visitas (por ejemplo, solo una de cada diez visitas resultará en la finalización completa de la encuesta), es probable que tu encuesta sea demasiado larga.

¡Intenta dar una explicación precisa de las tareas, resaltando el texto, utilizando iconos emotivos y de la manera más concisa posible!

**¡Revisa tu trabajo!**

Debido a la complejidad de una encuesta que consta de varias hojas de trabajo con una serie de preguntas e información, pueden pasar errores y errores tipográficos a pesar de todos los cuidados y la atención. Si se hacen preguntas incorrectas, las respuestas serán inútiles.

Paralelamente a la edición en la interfaz de administración, debes realizar un seguimiento de los cambios en la interfaz pública. Los cambios realizados en el editor se actualizan en la interfaz pública después de guardar. Una vez que se ha lanzado la encuesta, el cuestionario solo debe modificarse si está justificado, ya que los resultados de las preguntas modificadas no serán comparables con las respuestas de las versiones anteriores. Comprueba los resultados recibidos para ver si se pueden analizar y utilizar para el propósito previsto.

**¡Prepara la estructura de los datos entrantes!**

Una vez que hayas recibido un número suficiente de respuestas y haya terminado la campaña, deberás procesar los datos recibidos. Piensa de antemano en el tipo de respuestas que esperas, el formato, las interfaces y las herramientas que planeas utilizar para presentar los resultados.

- Puede ser una buena idea utilizar preguntas abiertas, expositivas, pero no es una buena idea hacer más de 1 o 2 de estas en un cuestionario. Las preguntas abiertas también son más exigentes para que los encuestados respondan, y es mucho más difícil analizar las respuestas de texto al procesar los datos que si los encuestados eligen entre las opciones proporcionadas.

- PARTIMAP permite la posibilidad de aceptar otras respuestas de los encuestados a una pregunta con múltiples opciones o un número fijo de opciones. Esto hace que la mayoría de las preguntas abiertas sean redundantes. Sin embargo, al final del cuestionario, vale la pena dar al encuestado la oportunidad de escribir en texto cualquier aspecto del tema que se haya dejado fuera del cuestionario.

- Para preguntas de opción múltiple, es importante que las opciones sean claras y distinguibles. La diferencia entre "Raramente" y "A veces" puede no ser obvia para todos los encuestados.

- Para todos los tipos de preguntas, es crucial que la pregunta formulada no sea sugestiva y no influya en los encuestados, ya que esto llevará a resultados sesgados.

- No hagas dos preguntas diferentes dentro de la misma pregunta y evita preguntas similares o repetitivas, ya que esto también puede desanimar a los encuestados.

- Puedes hacer algunas preguntas obligatorias si crees que sus respuestas son importantes, pero demasiadas preguntas obligatorias pueden llevar a que los encuestados abandonen.

- En la interacción con el mapa, siempre debes animar a los encuestados a proporcionar justificaciones textuales significativas, sin las cuales solo puedes adivinar por qué se marca el lugar en el mapa.

- En la mayoría de los casos, es importante recopilar datos sociodemográficos (edad, género, ingresos, nivel educativo), ya que esto te ayudará a determinar quiénes fueron tus encuestados, si fueron representativos de la población en general o solo constituyen un grupo estrecho de encuestados. Sin embargo, recopila datos personales solo en la medida necesaria y sé claro sobre cómo se utilizan (en línea con los términos de uso). Si publicas datos, debes ocultar cualquier dato personal sensible (por ejemplo, datos proporcionados en una respuesta de texto, lugar de residencia marcado en un mapa).

- ¡Establece tasas de finalización objetivo antes de lanzar la encuesta y sigue cuántas respuestas se han recopilado! Si no alcanzas los objetivos, realiza esfuerzos adicionales para difundir el cuestionario.

**¡Haz que tu cuestionario sea único y reconocible!**

En la sección Usuarios, puedes agregar un mini logotipo y una dirección web para tu perfil, que aparecerán en la parte superior de cada hoja de trabajo, indicando quién es el propietario del cuestionario. También puedes personalizar las hojas de trabajo con imágenes de fondo individuales. ¡Mantenlo simple, limpio y coherente!

También puedes colocar imágenes en los campos de descripción, pero debes almacenar la imagen en un repositorio externo o encontrar una ilustración de uso gratuito y libre de derechos de autor. Estas imágenes pueden hacer que la decisión sea más tangible para la persona que completa el formulario.

Puedes colorear los puntos y líneas de la hoja de trabajo de mapa estático para que coincidan con el color de tu organización. También puedes agregar descripciones e imágenes a los elementos del mapa, lo que facilita la identificación de los lugares que has marcado.

Puedes agregar tu propia URL y opciones de uso compartido en Facebook al cuestionario en la interfaz de edición del proyecto. Esto es importante, ya que la forma más fácil de distribuir el cuestionario es a través de las redes sociales. Si agregas detalles de vista previa en Facebook después de que se haya compartido el cuestionario, la vista previa no se actualizará con la que hayas configurado. En ese caso, debes indicárselo a [Facebook](https://developers.facebook.com/tools/debug/), que luego actualizará la imagen y el título.

El cuestionario se puede incrustar en tu sitio web colocando el siguiente código en el código HTML de la página, con el enlace al proyecto en el lugar adecuado.

```
<embed src="https://partimap.eu/hu/p/példa" style="width:100%; height:550px;">
```

El ancho (_width_) y la altura (_height_) del elemento incrustado se pueden ajustar.
