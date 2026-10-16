/*
 * ============================================================
 *  DATOS DEL MENÚ — Nina Míngues Postres en Lata
 *  Este es el ÚNICO archivo que necesitas editar para cambiar
 *  precios, productos, fotos, horarios o datos de contacto.
 * ============================================================
 *
 *  Cómo agregar un producto: copia un bloque { ... } completo,
 *  pégalo debajo, y cambia sus datos. No olvides la coma entre bloques.
 *
 *  Campos de cada producto:
 *    id          → nombre corto sin espacios ni acentos (debe ser único)
 *    nombre      → como aparece en el menú
 *    descripcion → texto corto debajo del nombre
 *    precio      → precio normal por lata (solo el número)
 *    precioEvento→ precio por lata en pedidos de 15 latas o más (opcional)
 *    foto        → ruta de la foto dentro de la carpeta img/productos
 *                  (si no hay foto, borra la línea y se muestra el logo)
 *    etiqueta    → "Más vendido" o "Nuevo" (opcional)
 *    peso        → peso aproximado en gramos con envase (opcional)
 *    volumen     → mililitros de las bebidas, ej. 250 (opcional)
 *    opciones    → lista de opciones a elegir, ej. ["Azul", "Rosa"] (opcional)
 *    fotosOpcion → una foto por opción, ej. { Azul: "img/...", Rosa: "img/..." }
 *                  (opcional; la tarjeta muestra las fotos lado a lado)
 *    minimo      → cantidad mínima (4 latas del mismo sabor; 1 para extras)
 *    latas       → cuántas latas cuenta cada unidad para el descuento de
 *                  eventos (1 normalmente, 4 para la caja, 0 para extras)
 *    agotado     → pon true para ocultar temporalmente el botón de agregar
 *    proximamente→ pon true para mostrarlo con botón "Próximamente" (aún no se puede pedir)
 *    alergenos   → avisos que se muestran en la tarjeta, ej. ["Contiene avellana", "Contiene alcohol"]
 *    cremas      → pon true para que el cliente elija Chantilly o Betún de
 *                  mantequilla (las opciones y el costo extra están en NEGOCIO.cremas)
 */

window.NEGOCIO = {
  nombre: "Nina Míngues",
  subtitulo: "Postres en lata",
  eslogan: "Postres en lata que celebran grandes momentos",

  // WhatsApp: código de país (52 = México) + 10 dígitos, sin espacios ni signos.
  whatsapp: "523351447649",
  instagram: "ninaminguespostresenlata",
  // Link completo de la página de Facebook
  facebook: "https://www.facebook.com/share/1HumMBvGny/",
  ciudad: "Colima, México",

  moneda: "$",

  // Aviso destacado arriba del menú. Para ocultarlo, deja titulo: "".
  // etiqueta (opcional): texto chiquito de arriba, ej. "Muy pronto" o "Ya disponible".
  // boton y enlace (opcionales): botón dentro del aviso, ej. enlace "#temporada".
  aviso: {
    etiqueta: "Ya disponible",
    titulo: "Chocolate Abuelita",
    texto: "🍫 Nuestro sabor de temporada para Día de Muertos ya está disponible. Y en el menú navideño ya puedes pedir Chocolate & Bombón; Rompope & Canela y Red Velvet llegan muy pronto 🎄",
    boton: "Pedir ahora",
    enlace: "#temporada",
  },

  // Contador de visitas (GoatCounter, gratis). Pon aquí el código de tu cuenta,
  // por ejemplo "ninamingues" si tu panel es https://ninamingues.goatcounter.com
  goatcounter: "",

  // Test "¿No sabes qué pedir?". Cada opción lleva a otra pregunta o a un
  // resultado (el id de un producto). Si el producto está agotado o
  // próximamente, se recomienda el más vendido.
  test: {
    pregunta: "¿Qué se te antoja hoy?",
    opciones: [
      {
        texto: "🍫 Chocolate",
        pregunta: "¿Cómo te gusta el chocolate?",
        opciones: [
          { texto: "Intenso, muy chocolatoso", resultado: "doble-chocolate" },
          { texto: "Con su canelita, como el de la abuela", resultado: "chocolate-abuelita" },
          { texto: "Con crema blanca, como el pastelito de niños", resultado: "chocolate-bombon" },
          { texto: "Con Nutella", resultado: "chocolate-nutella" },
          { texto: "Con galleta Oreo", resultado: "chocolate-oreo" },
          { texto: "Clásico, con dulce de leche", resultado: "chocolate-tradicional" },
        ],
      },
      {
        texto: "🍰 Algo clásico y dulcecito",
        pregunta: "¿Cuál va más contigo?",
        opciones: [
          { texto: "Vainilla con dulce de leche", resultado: "vainilla-dulce" },
          { texto: "Algo divertido y de colores", resultado: "cake-party" },
          { texto: "Con un toque de café", resultado: "espresso-dulce" },
        ],
      },
      {
        texto: "🍋 Algo cremoso o fresco",
        pregunta: "¿Qué prefieres?",
        opciones: [
          { texto: "Pay de queso cremoso", resultado: "pay-nina" },
          { texto: "Pay de queso con dulce de leche", resultado: "pay-nina-dulce" },
          { texto: "Fresco, con limón", resultado: "carlota-limon" },
          { texto: "Con café", resultado: "carlota-cafe" },
        ],
      },
      { texto: "🤷 ¡No me decido!", resultado: "chocolate-tradicional" },
    ],
    porDefecto: "chocolate-tradicional",
  },

  // Opciones de crema para los productos con cremas: true.
  // extra = pesos que se suman por lata (en precio normal y de evento).
  cremas: [
    { nombre: "Chantilly", extra: 0 },
    { nombre: "Betún de mantequilla", extra: 10 },
  ],

  // Reglas de pedido
  minimoLatas: 4,             // por sabor
  latasParaEvento: 15,        // a partir de aquí aplica el precio de eventos
  minimoPorSaborEvento: 5,    // en eventos, mínimo de latas por sabor (receta completa)
  diasAnticipacion: 2,        // pedidos normales
  diasAnticipacionEvento: 5,  // pedidos de eventos (15+ latas)
  domingoSoloEventos: true,   // domingo cerrado, pero sí se entregan eventos
  anticipo: 50,               // % de anticipo para apartar

  formasDePago: ["Transferencia", "Efectivo"],

  // Tipos de evento que aparecen en la sección de eventos y en el pedido
  tiposDeEvento: [
    "Boda", "Bautizo", "XV años", "Cumpleaños", "Baby shower",
    "Revelación de género", "Primera comunión", "Graduación", "Evento de empresa", "Otro",
  ],

  // Horario (0 = domingo, 1 = lunes ... 6 = sábado). null = cerrado.
  zonaHoraria: "America/Mexico_City",
  horario: {
    0: null,
    1: ["09:00", "20:00"],
    2: ["09:00", "20:00"],
    3: ["09:00", "20:00"],
    4: ["09:00", "20:00"],
    5: ["09:00", "20:00"],
    6: ["10:00", "19:00"],
  },
  horarioTexto: [
    "Lunes a viernes · 9:00 am – 8:00 pm",
    "Sábado · 10:00 am – 7:00 pm",
    "Domingo · cerrado (solo entregas de eventos)",
  ],

  notas: [
    "Cada lata es una porción generosa e individual",
    "Precio por lata · 9 cm de alto y 250 ml (postres y bebidas)",
    "Pedido mínimo: 4 latas del mismo sabor",
    "Pedidos con 2 días de anticipación (eventos: 5 días, también en domingo)",
    "Precio especial en pedidos de 15 latas o más (mínimo 5 latas por sabor)",
    "50% de anticipo para apartar tu pedido",
    "El costo de envío depende de tu dirección",
    "Elaborado de forma artesanal con ingredientes de calidad",
    "Nuestros postres contienen lácteos, huevo y gluten, y pueden contener trazas de nuez y cacahuate",
  ],

  // Mensaje que se abre al tocar "Cotizar mi evento"
  cotizacionEvento: [
    "Tipo de evento:",
    "Fecha del evento:",
    "Número de latas:",
    "Sabor de latas:",
    "¿Le gustaría sticker o diseño personalizado?:",
    "Lugar de entrega:",
    "¿Montaje en mesa de postres o en hielera? (la hielera es renta con costo extra):",
  ],

  // Preguntas frecuentes (aparecen en la sección "Preguntas frecuentes").
  // Para agregar una: copia un bloque { pregunta: "...", respuesta: "..." }.
  preguntas: [
    {
      pregunta: "¿Cuánto dura mi postre?",
      respuesta: "Hasta 7 días en refrigerador sin abrir. Una vez abierta la lata, hasta 2 días en refrigerador con la tapa sobrepuesta.",
    },
    {
      pregunta: "¿Cambia el sabor con los días?",
      respuesta: "El sabor casi no cambia, pero con los días el bizcocho va perdiendo humedad. Para disfrutar esa textura húmeda que nos encanta, te recomendamos comerlo en los primeros días.",
    },
    {
      pregunta: "¿Cuánto tiempo aguanta fuera del refrigerador?",
      respuesta: "Máximo 4 horas. Para eventos al aire libre te recomendamos montarlo en hielera con mucho hielo.",
    },
    {
      pregunta: "¿Se puede congelar?",
      respuesta: "No lo recomendamos: la crema y el pan cambian de textura, y el material de la lata no es apto para congelar.",
    },
    {
      pregunta: "¿Qué alérgenos contienen?",
      respuesta: "Todos nuestros postres llevan lácteos, huevo y gluten. El Ferrero & Nutella y el Chocolate & Nutella llevan avellana. Todos pueden contener trazas de cacahuate y nuez.",
    },
    {
      pregunta: "¿Tienen opciones sin azúcar, sin gluten o veganas?",
      respuesta: "Por ahora solo nuestro Latte Helado sin azúcar añadida. ¡Estamos trabajando en más opciones muy pronto!",
    },
    {
      pregunta: "¿Puedo cambiar o cancelar mi pedido?",
      respuesta: "Una vez confirmado, el pedido ya no tiene cambios. En pedidos de evento puedes cancelar o hacer cambios hasta 4 días antes de la entrega. En todos los casos el anticipo no es reembolsable, porque con él compramos los ingredientes de tu pedido.",
    },
    {
      pregunta: "¿Hasta dónde entregan?",
      respuesta: "Hacemos envíos en Colima, Villa de Álvarez y Comala (el costo depende de tu dirección). Si eliges punto de entrega, nos vemos en Walmart Tercer Anillo o en el Oxxo pasando la glorieta de Los Perritos.",
    },
    {
      pregunta: "¿Tienen local o punto de venta?",
      respuesta: "Por el momento no. Todos los pedidos se hacen por WhatsApp desde este menú.",
    },
    {
      pregunta: "¿Los pedidos para eventos incluyen decoración?",
      respuesta: "No incluyen decoración. Los stickers personalizados con nombre, fecha o mensaje tienen un costo adicional.",
    },
    {
      pregunta: "¿Incluyen cucharas y servilletas?",
      respuesta: "No, los desechables no están incluidos.",
    },
    {
      pregunta: "¿La lata es reciclable?",
      respuesta: "¡Sí! Y además la puedes reutilizar como maceta para plantas pequeñas 🌱",
    },
  ],

  // Galería de eventos (fotos en img/eventos)
  // Testimonios de clientes (sin fotos). "producto", "ocasion" y "estrellas" (1 a 5,
  // si no se pone son 5) son opcionales. Las opiniones nuevas llegan por WhatsApp desde
  // el botón "Deja tu opinión"; para publicarlas, copia un bloque y pega aquí sus datos.
  testimonios: [
    {
      texto: "Súper ricos, a los niños les encantaron. La verdad es una muy buena idea para fiestas en las escuelitas. A las maestras les encantó el concepto, ya que no se hace cochinero con los pastelitos.",
      nombre: "Viviana",
      ocasion: "Fiesta escolar",
    },
    {
      texto: "Sí están buenos los postres, es una opción diferente para los invitados.",
      nombre: "Gris",
      ocasion: "Evento",
    },
    {
      texto: "10000/10 💎 Ya me había dicho quien me lo recomendó que estaban muuuy buenos y no se equivocó.",
      nombre: "César",
      producto: "Pay Nina & Dulce",
    },
    {
      texto: "El de Ferrero, por cierto, ¡está SÚPER DELICIOSO! Me gustó mucho.",
      nombre: "Karina",
      producto: "Ferrero & Nutella",
    },
    {
      texto: "Quedaron súper bellas, muy muy bonitas. Las abrimos para probarlas mis hijas y yo y son una súper mega delicia. El concepto súper padre, súper original, y sobre todo muy rico.",
      nombre: "Paulina",
    },
    {
      texto: "¡Delicioso! En serio, todo súper delicioso.",
      nombre: "Mónica",
      producto: "Doble Chocolate",
    },
    {
      texto: "Muy ricos, los recomendaría sin duda alguna.",
      nombre: "María",
    },
  ],

  galeriaEventos: [
    { foto: "img/eventos/boda-torre.jpg", texto: "Boda · torre de latas con etiqueta personalizada" },
    { foto: "img/eventos/boda-mesa.jpg", texto: "Boda · una lata en cada lugar" },
    { foto: "img/eventos/boda-lattes-hielera.jpg", texto: "Boda · lattes personalizados en hielera" },
    { foto: "img/eventos/mesa-postres.jpg", texto: "Mesa de postres" },
    { foto: "img/eventos/cumple-30.jpg", texto: "Cumpleaños 30" },
    { foto: "img/eventos/cumple-luciana.jpg", texto: "Cumpleaños infantil con sticker personalizado" },
    { foto: "img/eventos/cumple-infantil.jpg", texto: "Cumpleaños · Cake Party" },
    { foto: "img/eventos/boda-detalle.jpg", texto: "Recuerdo de boda" },
    { foto: "img/eventos/hielera-postres.jpg", texto: "Postres en hielera con mucho hielo" },
    { foto: "img/eventos/tina-bebidas-jardin.jpg", texto: "Bebidas heladas en tina" },
    { foto: "img/eventos/hielera-postres-2.jpg", texto: "Listos para llevar a tu evento" },
    { foto: "img/eventos/tina-bebidas.jpg", texto: "Barra de bebidas heladas" },
    { foto: "img/eventos/regalo-maestro.jpg", texto: "Regalo con tarjeta personalizada" },
  ],
};

window.CATEGORIAS = [
  {
    nombre: "Temporada",
    productos: [
      {
        id: "chocolate-abuelita",
        nombre: "Chocolate Abuelita",
        descripcion: "Bizcocho de Doble Chocolate con Ganache de Chocolate Abuelita.",
        precio: 85, precioEvento: 80, peso: 201,
        foto: "img/productos/chocolate-abuelita.jpg",
        etiqueta: "Temporada",
      },
    ],
  },
  {
    nombre: "Navidad",
    productos: [
      {
        id: "chocolate-bombon",
        nombre: "Chocolate & Bombón (Estilo Pastelito)",
        descripcion: "Bizcocho de Doble Chocolate relleno de suave crema de bombón. Inspirado en ese pastelito de chocolate con crema blanca que comíamos de niños.",
        precio: 85, precioEvento: 80,
        foto: "img/productos/chocolate-bombon.jpg?v=2",
        etiqueta: "Nuevo",
      },
      {
        id: "rompope-canela",
        nombre: "Rompope & Canela",
        descripcion: "Bizcocho de vainilla con canela y rompope, remojado en rompope, relleno de dulce de leche y chantilly de vainilla.",
        precio: 85, precioEvento: 80,
        alergenos: ["Contiene alcohol"],
        foto: "img/productos/rompope-canela.jpg",
        etiqueta: "Próximamente",
        proximamente: true,
      },
      {
        id: "red-velvet",
        nombre: "Red Velvet",
        descripcion: "Bizcocho Red Velvet con Betún de Queso Crema.",
        precio: 85, precioEvento: 80,
        foto: "img/productos/red-velvet.jpg",
        etiqueta: "Próximamente",
        proximamente: true,
      },
    ],
  },
  {
    nombre: "Bizcochos",
    productos: [
      {
        id: "vainilla-dulce",
        nombre: "Vainilla & Dulce de Leche",
        descripcion: "Bizcocho de Vainilla con Chantilly de Vainilla, relleno de Dulce de Leche.",
        precio: 80, precioEvento: 75, peso: 182,
        cremas: true,
        foto: "img/productos/vainilla-dulce-de-leche.jpg",
      },
      {
        id: "chocolate-tradicional",
        nombre: "Chocolate & Dulce de Leche",
        descripcion: "Bizcocho de Chocolate con Chantilly de Chocolate, relleno de Dulce de Leche.",
        precio: 80, precioEvento: 75, peso: 182,
        cremas: true,
        foto: "img/productos/chocolate-tradicional.jpg",
        etiqueta: "Más vendido",
      },
      {
        id: "espresso-dulce",
        nombre: "Espresso & Dulce de Leche",
        descripcion: "Bizcocho de Espresso, Chantilly de Café, relleno de Dulce de Leche.",
        precio: 80, precioEvento: 75, peso: 182,
        cremas: true,
        foto: "img/productos/espresso-dulce-de-leche.jpg",
      },
      {
        id: "ferrero-nutella",
        nombre: "Ferrero & Nutella",
        descripcion: "Bizcocho de Chocolate (Tipo Brownie), Chantilly de Chocolate con Nutella, relleno de Nutella y trozos de Ferrero.",
        precio: 90, precioEvento: 85, peso: 210,
        cremas: true,
        alergenos: ["Contiene avellana"],
        foto: "img/productos/ferrero-nutella.jpg",
        etiqueta: "Agotado",
        agotado: true,
      },
      {
        id: "chocolate-nutella",
        nombre: "Chocolate & Nutella",
        descripcion: "Bizcocho de Chocolate, Chantilly de Chocolate, relleno de Nutella.",
        precio: 85, precioEvento: 80, peso: 182,
        cremas: true,
        alergenos: ["Contiene avellana"],
        foto: "img/productos/chocolate-nutella.jpg",
        etiqueta: "Nuevo",
      },
      {
        id: "doble-chocolate",
        nombre: "Doble Chocolate (Estilo Matilda)",
        descripcion: "Bizcocho de Chocolate Húmedo con Ganache de Chocolate semiamargo.",
        precio: 85, precioEvento: 80, peso: 201,
        foto: "img/productos/doble-chocolate.jpg",
        etiqueta: "Nuevo",
      },
      {
        id: "chocolate-oreo",
        nombre: "Chocolate & Oreo",
        descripcion: "Bizcocho de Chocolate, Chantilly de Chocolate con trozos de Oreo.",
        precio: 85, precioEvento: 80, peso: 182,
        cremas: true,
        foto: "img/productos/chocolate-oreo.jpg",
        etiqueta: "Nuevo",
      },
      {
        id: "cake-party",
        nombre: "Cake Party",
        descripcion: "Bizcocho de Vainilla con Sprinkles, Chantilly de Vainilla con Sprinkles, relleno de Dulce de Leche.",
        precio: 80, precioEvento: 75, peso: 182,
        cremas: true,
        foto: "img/productos/cake-party.jpg",
      },
    ],
  },
  {
    nombre: "Pay & Cremosos",
    productos: [
      {
        id: "pay-nina",
        nombre: "Pay Nina Míngues",
        descripcion: "Tradicional Pay de Queso & Chantilly de Vainilla.",
        precio: 95, precioEvento: 90, peso: 190,
        foto: "img/productos/pay-nina.jpg",
      },
      {
        id: "pay-nina-dulce",
        nombre: "Pay Nina & Dulce",
        descripcion: "Tradicional Pay de Queso, Chantilly de Vainilla, relleno de Dulce de Leche.",
        precio: 95, precioEvento: 90, peso: 223,
        foto: "img/productos/pay-nina-dulce.jpg",
        etiqueta: "Más vendido",
      },
      {
        id: "carlota-cafe",
        nombre: "Carlota de Café",
        descripcion: "Capas de Galleta María, Crema de Café & Queso Crema.",
        precio: 90, precioEvento: 85, peso: 190,
        foto: "img/productos/carlota-cafe.jpg",
      },
      {
        id: "carlota-limon",
        nombre: "Carlota de Limón",
        descripcion: "Capas de Galleta María, Crema Suave de Limón & Limón Rallado.",
        precio: 90, precioEvento: 85, peso: 190,
        foto: "img/productos/carlota-limon.jpg",
      },
    ],
  },
  {
    nombre: "Latas Especiales",
    productos: [
      {
        id: "caja-regalo-4",
        nombre: "Caja de Regalo",
        descripcion: "Caja de regalo con 4 latas del mismo sabor: Vainilla, Chocolate o Espresso.",
        precio: 340,
        foto: "img/productos/caja-kraft.jpg",
        opciones: ["Vainilla", "Chocolate", "Espresso"],
        minimo: 1, latas: 4,
      },
      {
        id: "caja-para-dos",
        nombre: "Caja para Dos",
        descripcion: "Caja de regalo con 2 latas de postre del mismo sabor y 2 Lattes Helados Sin Azúcar Añadida. Postre: Vainilla, Chocolate o Espresso, todos con Dulce de Leche.",
        precio: 290,
        foto: "img/productos/caja-para-dos.jpg?v=2",
        opciones: ["Vainilla & Dulce de Leche", "Chocolate & Dulce de Leche", "Espresso & Dulce de Leche"],
        minimo: 1, latas: 4,
        etiqueta: "Nuevo",
      },
      {
        id: "revelacion",
        nombre: "Revelación de Género",
        descripcion: "Bizcocho de Vainilla con Relleno Sorpresa.",
        precio: 80, precioEvento: 75, peso: 182,
        cremas: true,
        opciones: ["Azul", "Rosa"],
        fotosOpcion: {
          Azul: "img/productos/revelacion-azul.jpg",
          Rosa: "img/productos/revelacion-rosa.jpg",
        },
      },
      {
        id: "baby-shower",
        nombre: "Baby Shower",
        descripcion: "Bizcocho de Vainilla, Chantilly de Vainilla (Azul o Rosa), relleno de Dulce de Leche.",
        precio: 80, precioEvento: 75, peso: 182,
        cremas: true,
        opciones: ["Azul", "Rosa"],
        fotosOpcion: {
          Azul: "img/productos/baby-shower-azul.jpg",
          Rosa: "img/productos/baby-shower-rosa.jpg",
        },
      },
    ],
  },
  {
    nombre: "Bebidas Heladas",
    productos: [
      {
        id: "latte-sin-azucar",
        nombre: "Latte Helado Sin Azúcar Añadida",
        descripcion: "Café con leche bien frío, sin azúcar añadida.",
        precio: 55, precioEvento: 50, volumen: 250,
        foto: "img/productos/latte-sin-azucar.jpg",
        etiqueta: "Más vendido",
      },
      {
        id: "latte-moca",
        nombre: "Latte Moca Helado",
        descripcion: "Café con leche y chocolate, helado.",
        precio: 59, precioEvento: 54, volumen: 250,
        foto: "img/productos/latte-moca.jpg",
      },
      {
        id: "te-negro",
        nombre: "Té Negro con Limón Helado",
        descripcion: "Té negro frío con un toque de limón.",
        precio: 45, precioEvento: 40, volumen: 250,
        foto: "img/productos/te-negro-limon.jpg",
      },
      {
        id: "te-verde",
        nombre: "Té Verde con Limón Helado",
        descripcion: "Té verde frío con un toque de limón.",
        precio: 45, precioEvento: 40, volumen: 250,
        foto: "img/productos/te-verde-limon.jpg",
      },
    ],
  },
  {
    nombre: "Extras",
    productos: [
      {
        id: "sticker",
        nombre: "Sticker personalizado",
        descripcion: "Sticker de 5 cm con tu diseño o mensaje. Cuéntanos qué quieres en las notas del pedido.",
        precio: 10,
        foto: "img/productos/sticker.jpg",
        minimo: 1, latas: 0,
      },
      {
        id: "caja-extra",
        nombre: "Caja de regalo",
        descripcion: "Caja kraft para 4 latas, lista para regalar.",
        precio: 30,
        foto: "img/productos/caja-regalo-mano.jpg",
        minimo: 1, latas: 0,
      },
    ],
  },
];
