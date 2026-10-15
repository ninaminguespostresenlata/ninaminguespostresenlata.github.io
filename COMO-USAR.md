# Menú digital · Nina Míngues Postres en Lata

Menú con fotos, carrito y pedido directo por WhatsApp.

## Qué hace

- Muestra todos los productos con foto, descripción, precio y etiquetas (¡Más vendido!, ¡Nuevo!).
- El cliente agrega latas al carrito (mínimo 4 por sabor; los extras desde 1).
- Con **15 latas o más** aplica solo el **precio de eventos** y muestra cuánto ahorra.
- Pide **nombre, celular, punto de entrega o domicilio, dirección, fecha y forma de pago**.
- La fecha respeta la anticipación (2 días, o 5 para eventos). Los domingos solo se aceptan pedidos de eventos.
- El cliente puede indicar el tipo de evento (boda, bautizo, XV años, cumpleaños...).
- Sección **Postres para tu evento** con botón para cotizar por WhatsApp.
- Baby Shower y Revelación de género muestran la foto azul y la rosa.
- Calcula el **anticipo del 50%**. El envío se cotiza por WhatsApp.
- Al terminar abre WhatsApp con el pedido ya escrito.
- Muestra si está **abierto o cerrado** según el horario de Colima.

## 1. Dónde está publicado

El menú vive en este repositorio y se publica solo en:
**https://ninamingues.com/**

Cada cambio que se guarde aquí se publica en 1 o 2 minutos.

## 2. Conectarlo a Instagram

- **Link en la bio:** Instagram → Editar perfil → *Enlaces* → Agregar enlace externo → pega el link del menú.
- **Historias:** usa el sticker **Enlace** con el link del menú y déjala en tus *Destacadas* como "Menú".
- **Botón de pedido:** en una cuenta profesional, Editar perfil → *Botones de acción* → *Pedir comida* / *Reservar* → link del menú.

## 3. Conectarlo a WhatsApp Business

- **Perfil:** WhatsApp Business → Herramientas para la empresa → Perfil de empresa → *Sitio web* → pega el link.
- **Mensaje de bienvenida:** Herramientas → Mensaje de bienvenida, por ejemplo:
  > ¡Hola! Gracias por escribir a Nina Míngues 💕 Mira nuestro menú y arma tu pedido aquí: https://ninamingues.com/
- **Mensaje de ausencia:** igual, con el link, para cuando estés fuera de horario.
- **Respuesta rápida:** crea `/menu` con el link para mandarlo con un toque.
- **Estados:** comparte el link en tus estados. Se ve con foto gracias a la vista previa.

## 4. Cambiar precios, productos o fotos

Todo está en **`datos.js`**. Ahí puedes:

- Cambiar un **precio**: edita el número en `precio:` o `precioEvento:`.
- Quitar o poner una **etiqueta**: `etiqueta: "Nuevo"` o `etiqueta: "Más vendido"`.
- Marcar algo como **agotado**: agrega `agotado: true,`.
- **Agregar un producto**: copia un bloque `{ ... }` completo y cambia sus datos.
- Cambiar el **horario**, el **WhatsApp** o el **Instagram**: están al inicio del archivo.

**Fotos por opción:** usa `fotosOpcion: { Azul: "img/...", Rosa: "img/..." }`.

**Tipos de evento:** edítalos en `tiposDeEvento`, al inicio del archivo.

**Fotos:** súbelas a `img/productos/` (formato .jpg, idealmente verticales 4:5 y de unos 800 px de ancho) y escribe su ruta en `foto:`. Los productos sin foto muestran el logo.

Desde la página de GitHub puedes editar `datos.js` (ícono del lápiz) y subir fotos (*Add file → Upload files*) sin instalar nada.

## 5. Opiniones de clientes

- En la sección **"Lo que dicen nuestros clientes"** hay un botón **"Deja tu opinión"**.
- El cliente elige estrellas, escribe su nombre, el sabor y su comentario. Al enviarlo **se abre WhatsApp y la opinión te llega a ti**; no se publica sola.
- Link directo para mandar al entregar un pedido: **https://ninamingues.com/#opinion** (abre el formulario de inmediato).
- Para publicar una opinión aprobada: en `datos.js`, dentro de `testimonios`, copia un bloque y cambia los datos:
  ```
  {
    texto: "Lo que escribió el cliente",
    nombre: "Ana",
    producto: "Chocolate & Nutella",
    estrellas: 5,
  },
  ```

## 6. Preguntas frecuentes

Están en `datos.js`, en `preguntas`. Para agregar o cambiar una, edita o copia un bloque:
```
{
  pregunta: "¿...?",
  respuesta: "...",
},
```

## 7. Aviso de temporada y contador de visitas

- **Aviso:** en `datos.js`, `aviso: { etiqueta, titulo, texto, boton, enlace }`. `etiqueta` es el texto chiquito de arriba ("Muy pronto" o "Ya disponible"); `boton` y `enlace` agregan un botón (ej. "Pedir ahora" → "#temporada"). Para ocultarlo, deja `titulo: ""`.
- **Contador de visitas (GoatCounter):** crea una cuenta gratis en goatcounter.com con el código `ninamingues` y escríbelo en `goatcounter: "ninamingues"`. Las visitas se ven en https://ninamingues.goatcounter.com. Cada pedido enviado por WhatsApp se cuenta como el evento "pedido-enviado".
- **Google Analytics:** ya está instalado (ID G-4MEQ9CV8V8). Cada pedido enviado se registra como el evento `pedido_enviado`, con el total y el número de latas.

## 8. Alérgenos y botón de compartir

- **Alérgenos:** en cada producto de `datos.js` puedes poner `alergenos: ["Contiene avellana"]` (o "Contiene alcohol", "Lleva nuez", etc.). Se muestran como etiqueta en la tarjeta.
- **Compartir menú:** botón arriba y al final de la página. En el celular abre el menú de compartir; en computadora abre WhatsApp con el link listo.

## 9. Chantilly o Betún de mantequilla

- Los productos con `cremas: true` (bizcochos, Revelación y Baby Shower) en `datos.js` piden elegir **Chantilly** o **Betún de mantequilla** al agregarlos.
- El costo extra está al inicio de `datos.js`, en `cremas` (`extra: 10`). Se suma por lata, en precio normal y de evento.
- Para quitar la opción en un sabor, borra su línea `cremas: true,`.
- El mínimo de 4 latas aplica por crema (4 con chantilly, 4 con betún).
- En Revelación y Baby Shower el cliente elige primero el color y después la crema.
- **Sabores de temporada:** están en la categoría "Temporada" al inicio de `CATEGORIAS` en `datos.js`. Para quitarlos al terminar la temporada, borra el producto (o marca `agotado: true`).
