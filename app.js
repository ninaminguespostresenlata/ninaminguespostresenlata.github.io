(function () {
  "use strict";

  const N = window.NEGOCIO;
  const CATS = window.CATEGORIAS;
  const CLAVE = "nina-pedido-v1";

  const productos = {};
  CATS.forEach(c => c.productos.forEach(p => {
    p.minimo = p.minimo ?? N.minimoLatas;
    p.latas = p.latas ?? 1;
    if (p.cremas && N.cremas && !p.opciones) p.opciones = N.cremas.map(c => c.nombre);
    productos[p.id] = p;
  }));

  const $ = sel => document.querySelector(sel);
  const dinero = n => N.moneda + n.toLocaleString("es-MX");
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // ---------- Estado del pedido ----------
  // carrito: { "id|opcion": cantidad }
  let carrito = {};
  try { carrito = JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) { carrito = {}; }
  Object.keys(carrito).forEach(k => { if (!productos[k.split("|")[0]]) delete carrito[k]; });
  // Pedidos guardados antes de las opciones de crema → Chantilly
  const nombresCrema = (N.cremas || []).map(c => c.nombre);
  const cremaDe = opcion => (opcion || "").split(" · ").pop();
  Object.keys(carrito).forEach(k => {
    const [id, op] = k.split("|");
    const p = productos[id];
    if (!p || !p.cremas || !nombresCrema.length || nombresCrema.includes(cremaDe(op))) return;
    const n = `${id}|${op ? `${op} · ` : ""}${nombresCrema[0]}`;
    carrito[n] = (carrito[n] || 0) + carrito[k]; delete carrito[k];
  });
  // Costo extra por lata según la opción (ej. Betún de mantequilla +$10)
  const extraDe = (p, opcion) => {
    if (!p.cremas || !N.cremas) return 0;
    const c = N.cremas.find(x => x.nombre === cremaDe(opcion));
    return c ? c.extra || 0 : 0;
  };

  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(carrito)); } catch (e) { /* sin almacenamiento */ }
  }

  function calcular() {
    const lineas = Object.entries(carrito).map(([clave, cant]) => {
      const [id, opcion] = clave.split("|");
      return { clave, p: productos[id], opcion: opcion || "", cant };
    });
    const latas = lineas.reduce((s, l) => s + l.cant * l.p.latas, 0);
    const evento = latas >= N.latasParaEvento;
    let subtotal = 0, normal = 0;
    lineas.forEach(l => {
      const extra = extraDe(l.p, l.opcion);
      l.unit = (evento && l.p.precioEvento ? l.p.precioEvento : l.p.precio) + extra;
      l.total = l.unit * l.cant;
      subtotal += l.total;
      normal += (l.p.precio + extra) * l.cant;
    });
    const piezas = lineas.reduce((s, l) => s + l.cant, 0);
    // En eventos cada sabor necesita un mínimo de latas (receta completa)
    const porSabor = {};
    lineas.forEach(l => { if (l.p.latas === 1) porSabor[l.p.id] = (porSabor[l.p.id] || 0) + l.cant; });
    const cortos = evento && N.minimoPorSaborEvento
      ? Object.keys(porSabor).filter(id => porSabor[id] < N.minimoPorSaborEvento).map(id => productos[id].nombre)
      : [];
    return { lineas, latas, evento, subtotal, ahorro: normal - subtotal, piezas, cortos };
  }

  function fotoDe(p, opcion) {
    return (p.fotosOpcion && p.fotosOpcion[(opcion || "").split(" · ")[0]]) || p.foto || "";
  }

  function cantidadDe(id) {
    return Object.entries(carrito).reduce((s, [k, c]) => s + (k.split("|")[0] === id ? c : 0), 0);
  }

  function cambiar(clave, delta) {
    const p = productos[clave.split("|")[0]];
    const actual = carrito[clave] || 0;
    let nueva = actual === 0 && delta > 0 ? p.minimo : actual + delta;
    if (nueva < p.minimo) {
      nueva = 0;
      if (actual > 0 && p.minimo > 1) aviso(`Mínimo ${p.minimo} latas por sabor`);
    }
    if (nueva > 0) carrito[clave] = nueva; else delete carrito[clave];
    if (actual === 0 && nueva > 0) aviso(`${p.nombre} agregado${p.minimo > 1 ? ` (${p.minimo} latas)` : ""}`);
    guardar();
    actualizar();
  }

  // ---------- Encabezado e información ----------
  $("#eslogan").textContent = N.eslogan;
  $("#link-wa").href = `https://wa.me/${N.whatsapp}?text=${encodeURIComponent(`¡Hola ${N.nombre}! Vi su menú y tengo una pregunta.`)}`;
  $("#link-ig").href = `https://instagram.com/${N.instagram}`;
  $("#link-fb").href = N.facebook;
  $("#ciudad").textContent = "📍 " + N.ciudad;
  $("#notas").innerHTML = N.notas.map(t => `<li>${esc(t)}</li>`).join("");
  $("#horario").innerHTML = N.horarioTexto.map(t => `<li>${esc(t)}</li>`).join("");
  $("#tipo-evento").insertAdjacentHTML("beforeend", N.tiposDeEvento.map(t => `<option>${esc(t)}</option>`).join(""));
  $("#eventos-tipos").innerHTML = N.tiposDeEvento.filter(t => t !== "Otro").map(t => `<li>${esc(t)}</li>`).join("");
  $("#eventos-min").textContent = N.latasParaEvento;
  $("#eventos-sabor").textContent = N.minimoPorSaborEvento;
  $("#eventos-dias").textContent = N.diasAnticipacionEvento;
  $("#link-evento").href = `https://wa.me/${N.whatsapp}?text=${encodeURIComponent(
    `¡Hola ${N.nombre}! Quiero cotizar latas para un evento 🎉\n\n` + N.cotizacionEvento.join("\n"))}`;

  // Galería de eventos con visor
  $("#galeria").innerHTML = N.galeriaEventos.map((g, i) =>
    `<button type="button" class="galeria__item" data-foto="${i}"><img src="${esc(g.foto)}" alt="${esc(g.texto)}" loading="lazy"><span>${esc(g.texto)}</span></button>`).join("");
  $("#galeria").addEventListener("click", e => {
    const b = e.target.closest("[data-foto]");
    if (!b) return;
    const g = N.galeriaEventos[b.dataset.foto];
    $("#visor-img").src = g.foto;
    $("#visor-img").alt = g.texto;
    $("#visor-texto").textContent = g.texto;
    $("#visor").hidden = false;
  });
  $("#visor").addEventListener("click", () => { $("#visor").hidden = true; });
  // Testimonios
  $("#lista-testimonios").innerHTML = (N.testimonios || []).map(t => `
    <figure class="testimonio">
      <div class="testimonio__estrellas" aria-label="${t.estrellas || 5} estrellas">${"★".repeat(t.estrellas || 5)}${"☆".repeat(5 - (t.estrellas || 5))}</div>
      <blockquote>“${esc(t.texto)}”</blockquote>
      <figcaption>— ${esc(t.nombre)}${t.producto ? ` · <span>${esc(t.producto)}</span>` : t.ocasion ? ` · <span>${esc(t.ocasion)}</span>` : ""}</figcaption>
    </figure>`).join("");
  $("#link-testimonios").href = `https://instagram.com/${N.instagram}`;
  // Compartir menú
  document.querySelectorAll("[data-compartir]").forEach(b => b.addEventListener("click", async () => {
    const url = "https://ninamingues.com/";
    const texto = `Mira el menú de ${N.nombre} · ${N.subtitulo} 🍫 Puedes armar tu pedido aquí:`;
    try { window.gtag && window.gtag("event", "compartir_menu"); } catch (e) {}
    if (navigator.share) {
      try { await navigator.share({ title: `${N.nombre} · ${N.subtitulo}`, text: texto, url }); return; }
      catch (e) { if (e && e.name === "AbortError") return; }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`, "_blank", "noopener");
  }));

  // Aviso de temporada
  if (N.aviso && N.aviso.titulo) {
    $("#aviso-titulo").textContent = N.aviso.titulo.replace(/^Próximamente:\s*/i, "");
    $("#aviso-texto").textContent = N.aviso.texto || "";
    $("#aviso-temporada").hidden = false;
  }

  // Contador de visitas (GoatCounter)
  const contar = (path, datos) => {
    try { window.goatcounter && window.goatcounter.count && window.goatcounter.count({ path, event: true }); } catch (e) {}
    try { window.gtag && window.gtag("event", path.replace(/-/g, "_"), datos || {}); } catch (e) {}
  };
  if (N.goatcounter) {
    const sc = document.createElement("script");
    sc.async = true; sc.src = "https://gc.zgo.at/count.js";
    sc.dataset.goatcounter = `https://${N.goatcounter}.goatcounter.com/count`;
    document.head.appendChild(sc);
  }

  // Preguntas frecuentes
  $("#lista-preguntas").innerHTML = (N.preguntas || []).map(q => `
    <details class="faq__item">
      <summary>${esc(q.pregunta)}</summary>
      <p>${esc(q.respuesta)}</p>
    </details>`).join("");
  $("#preguntas").hidden = !(N.preguntas || []).length;
  $("#link-faq").href = `https://wa.me/${N.whatsapp}?text=${encodeURIComponent(`¡Hola ${N.nombre}! Tengo una pregunta:`)}`;

  // La sección siempre se muestra para que el botón de opinión esté disponible
  $("#testimonios").hidden = false;
  $("#lista-testimonios").hidden = !(N.testimonios || []).length;

  // ---------- Dejar opinión (llega por WhatsApp; se publica a mano en datos.js) ----------
  $("#opinion-producto").insertAdjacentHTML("beforeend",
    Object.values(productos).filter(p => p.latas === 1 && !p.agotado)
      .map(p => `<option>${esc(p.nombre)}</option>`).join("") + `<option>Varios sabores</option>`);
  $("#btn-opinion").addEventListener("click", () => abrir($("#opinion")));
  $("#form-opinion").addEventListener("submit", e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const err = !(d.nombre || "").trim() ? "Escribe tu nombre."
      : (d.texto || "").trim().length < 5 ? "Escribe tu comentario." : "";
    $("#error-opinion").textContent = err;
    if (err) return;
    const n = +d.estrellas || 5;
    const msg = [
      `⭐ *Opinión para la página de ${N.nombre}*`,
      ``,
      `Calificación: ${"★".repeat(n)}${"☆".repeat(5 - n)} (${n}/5)`,
      `Nombre: ${d.nombre.trim()}`,
      d.producto ? `Probé: ${d.producto}` : null,
      `Comentario: ${d.texto.trim()}`,
      ``,
      `Autorizo que publiquen mi opinión con mi nombre en su página.`,
    ].filter(l => l !== null).join("\n");
    window.open(`https://wa.me/${N.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
    e.target.reset();
    cerrar($("#opinion"));
    aviso("¡Gracias! Envía el mensaje en WhatsApp 💕");
  });
  // Link directo para clientes: ninamingues.com/#opinion
  if (location.hash === "#opinion") setTimeout(() => {
    $("#testimonios").scrollIntoView();
    abrir($("#opinion"));
  }, 300);

  $("#pagos").insertAdjacentHTML("beforeend", N.formasDePago.map((f, i) =>
    `<label class="chip"><input type="radio" name="pago" value="${esc(f)}" ${i === 0 ? "required" : ""}> ${esc(f)}</label>`).join(""));

  function ahoraLocal() {
    const partes = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
      timeZone: N.zonaHoraria, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
      year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(new Date()).map(x => [x.type, x.value]));
    const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(partes.weekday);
    return { dia, hhmm: `${partes.hour}:${partes.minute}`, fecha: `${partes.year}-${partes.month}-${partes.day}` };
  }

  (function estado() {
    try {
      const { dia, hhmm } = ahoraLocal();
      const h = N.horario[dia];
      const abierto = h && hhmm >= h[0] && hhmm < h[1];
      const el = $("#estado");
      el.textContent = abierto ? `Abierto ahora · hasta las ${formatoHora(h[1])}` : "Cerrado ahora · deja tu pedido por WhatsApp";
      el.classList.toggle("abierto", !!abierto);
      el.hidden = false;
    } catch (e) { /* navegador sin soporte de zona horaria */ }
  })();

  function formatoHora(hhmm) {
    let [h, m] = hhmm.split(":").map(Number);
    const suf = h >= 12 ? "pm" : "am";
    h = h % 12 || 12;
    return m ? `${h}:${String(m).padStart(2, "0")} ${suf}` : `${h} ${suf}`;
  }

  // ---------- Menú ----------
  const nav = $("#categorias");
  const menu = $("#menu");
  const logoSinFoto = `<div class="tarjeta__sinfoto"><img src="img/logo.png" alt="" loading="lazy"></div>`;

  nav.innerHTML = CATS.map(c => `<a href="#${slug(c.nombre)}">${esc(c.nombre)}</a>`).join("") +
    `<a href="#eventos">Eventos ✨</a>` +
    `<a href="#preguntas">Preguntas</a>`;
  menu.innerHTML = CATS.map(c => `
    <section class="seccion" id="${slug(c.nombre)}">
      <h2 class="titulo-script seccion__titulo">${esc(c.nombre)}</h2>
      ${c.productos.some(p => p.latas === 1) ? `<p class="seccion__nota">Precio por lata · mínimo ${N.minimoLatas} del mismo sabor</p>` : ""}
      <div class="grid">
        ${c.productos.map(tarjeta).join("")}
      </div>
    </section>`).join("");

  function tarjeta(p) {
    return `
      <article class="tarjeta" data-id="${p.id}">
        <div class="tarjeta__foto">
          ${p.fotosOpcion
            ? `<div class="tarjeta__duo">${Object.entries(p.fotosOpcion).map(([o, f]) =>
                `<figure><img src="${esc(f)}" alt="${esc(p.nombre)} ${esc(o)}" loading="lazy"><figcaption>${esc(o)}</figcaption></figure>`).join("")}</div>`
            : p.foto ? `<img src="${esc(p.foto)}" alt="${esc(p.nombre)}" loading="lazy">` : logoSinFoto}
          ${p.etiqueta ? `<span class="etiqueta">¡${esc(p.etiqueta)}!</span>` : ""}
        </div>
        <div class="tarjeta__info">
          <h3 class="tarjeta__nombre">${esc(p.nombre)}</h3>
          <p class="tarjeta__desc">${esc(p.descripcion)}</p>
          ${p.cremas && N.cremas ? `<p class="cremas">Elige: ${N.cremas.map(c => `${esc(c.nombre)}${c.extra ? ` <b>+${dinero(c.extra)}</b>` : ""}`).join(" o ")}</p>` : ""}
          ${(p.alergenos || []).length ? `<p class="alergenos">${p.alergenos.map(a => `<span>${esc(a)}</span>`).join("")}</p>` : ""}
          <div class="tarjeta__precios">
            <span class="precio">${dinero(p.precio)}${p.latas === 1 ? " <small>c/u</small>" : ""}</span>
            ${p.precioEvento ? `<span class="precio-evento">${dinero(p.precioEvento)} en pedidos de ${N.latasParaEvento}+</span>` : ""}
            ${p.peso ? `<span class="peso">Aprox. ${p.peso} g con envase</span>` : ""}
            ${p.volumen ? `<span class="peso">${p.volumen} ml</span>` : ""}
          </div>
          <div class="control"></div>
        </div>
      </article>`;
  }

  function pintarControles() {
    document.querySelectorAll(".tarjeta").forEach(t => {
      const p = productos[t.dataset.id];
      const ctrl = t.querySelector(".control");
      if (p.agotado) { ctrl.innerHTML = `<button class="agregar" disabled>Agotado</button>`; return; }
      if (p.opciones) {
        const n = cantidadDe(p.id);
        ctrl.innerHTML = `<button class="agregar" data-elegir="${p.id}">${n ? `Agregar otro · ${n} en pedido` : "Elegir y agregar"}</button>`;
        return;
      }
      const n = carrito[p.id] || 0;
      ctrl.innerHTML = n
        ? `<div class="contador"><button data-menos="${p.id}" aria-label="Quitar uno">−</button><span>${n}</span><button data-mas="${p.id}" aria-label="Agregar uno">+</button></div>`
        : `<button class="agregar" data-mas="${p.id}">Agregar${p.minimo > 1 ? ` ${p.minimo}` : ""}</button>`;
    });
  }

  document.addEventListener("click", e => {
    const b = e.target.closest("button, [data-cerrar]");
    if (!b) return;
    if (b.dataset.mas) cambiar(b.dataset.mas, +1);
    else if (b.dataset.menos) cambiar(b.dataset.menos, -1);
    else if (b.dataset.elegir) abrirSelector(productos[b.dataset.elegir]);
    else if (b.hasAttribute("data-cerrar")) cerrar(b.closest(".panel"));
  });

  // Resaltar la categoría visible
  const enlaces = [...nav.querySelectorAll("a")];
  const obs = new IntersectionObserver(entradas => {
    entradas.forEach(en => {
      if (!en.isIntersecting) return;
      enlaces.forEach(a => {
        const activa = a.getAttribute("href") === "#" + en.target.id;
        a.classList.toggle("activa", activa);
        // Mover solo la barra de pestañas (scrollIntoView también movía la página y frenaba el scroll)
        if (activa) nav.scrollLeft = a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2;
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll(".seccion, #eventos").forEach(s => obs.observe(s));

  // ---------- Selector de opciones ----------
  // Productos con color y crema (Revelación, Baby Shower): primero el color, luego la crema
  function abrirSelector(p, base) {
    const pideCrema = p.cremas && nombresCrema.length && !nombresCrema.includes(p.opciones[0]);
    const lista = base ? nombresCrema : p.opciones;
    const ayuda = $("#selector .ayuda");
    if (ayuda) ayuda.textContent = base ? "Ahora elige la crema" : pideCrema ? "Elige el color" : "Elige una opción";
    $("#selector-titulo").textContent = base ? `${p.nombre} · ${base}` : p.nombre;
    const fotos = !base && !!p.fotosOpcion;
    $("#selector-opciones").classList.toggle("con-fotos", fotos);
    const precioOp = o => p.cremas && (base || !pideCrema)
      ? `<small>${dinero(p.precio + extraDe(p, o))} c/u${p.precioEvento ? ` · ${dinero(p.precioEvento + extraDe(p, o))} en eventos` : ""}</small>` : "";
    $("#selector-opciones").innerHTML = lista.map(o => `<button type="button" data-opcion="${esc(o)}">${
      fotos && p.fotosOpcion[o] ? `<img src="${esc(p.fotosOpcion[o])}" alt="">` : ""}<span>${esc(o)}</span>${precioOp(o)}</button>`).join("");
    $("#selector-opciones").onclick = e => {
      const b = e.target.closest("[data-opcion]");
      if (!b) return;
      if (pideCrema && !base) { abrirSelector(p, b.dataset.opcion); return; }
      cambiar(`${p.id}|${base ? `${base} · ` : ""}${b.dataset.opcion}`, +1);
      cerrar($("#selector"));
    };
    abrir($("#selector"));
  }

  // ---------- Paneles ----------
  let ultimoFoco = null;
  function abrir(panel) {
    if (panel.hidden) ultimoFoco = document.activeElement;
    panel.hidden = false;
    document.body.style.overflow = "hidden";
    const foco = panel.querySelector("button, input");
    if (foco) foco.focus({ preventScroll: true });
  }
  function cerrar(panel) {
    if (!panel) return;
    panel.hidden = true;
    if ($("#panel").hidden && $("#selector").hidden && $("#opinion").hidden) document.body.style.overflow = "";
    if (ultimoFoco) ultimoFoco.focus({ preventScroll: true });
  }
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (!$("#visor").hidden) { $("#visor").hidden = true; return; }
    if (!$("#opinion").hidden) cerrar($("#opinion"));
    else if (!$("#selector").hidden) cerrar($("#selector"));
    else if (!$("#panel").hidden) cerrar($("#panel"));
  });
  $("#carrito-btn").addEventListener("click", () => abrir($("#panel")));

  // ---------- Lista del pedido ----------
  function actualizar() {
    const r = calcular();
    pintarControles();

    $("#carrito-btn").hidden = r.piezas === 0;
    $("#carrito-cant").textContent = r.piezas;
    $("#carrito-total").textContent = dinero(r.subtotal);

    $("#lista").innerHTML = r.lineas.length ? r.lineas.map(l => `
      <li class="item">
        ${fotoDe(l.p, l.opcion) ? `<img src="${esc(fotoDe(l.p, l.opcion))}" alt="">` : `<div class="item__sinfoto"></div>`}
        <div>
          <p class="item__nombre">${esc(l.p.nombre)}${l.opcion ? ` · ${esc(l.opcion)}` : ""}</p>
          <p class="item__detalle">${dinero(l.unit)} c/u · <strong>${dinero(l.total)}</strong></p>
        </div>
        <div class="contador"><button data-menos="${esc(l.clave)}" aria-label="Quitar uno">−</button><span>${l.cant}</span><button data-mas="${esc(l.clave)}" aria-label="Agregar uno">+</button></div>
      </li>`).join("") : `<li class="ayuda centrado">Tu pedido está vacío. Agrega tus postres favoritos 💕</li>`;

    const faltan = N.latasParaEvento - r.latas;
    $("#aviso-evento").innerHTML = !r.latas ? "" : r.evento
      ? (r.cortos.length
        ? `⚠️ En pedidos de evento cada sabor lleva mínimo <strong>${N.minimoPorSaborEvento} latas</strong>. Sube a ${N.minimoPorSaborEvento}: ${r.cortos.map(esc).join(", ")}.`
        : `🎉 <strong>¡Precio de evento aplicado!</strong> (${r.latas} latas). Los pedidos de evento se hacen con ${N.diasAnticipacionEvento} días de anticipación.`)
      : `Llevas <strong>${r.latas} latas</strong>. Con ${faltan} más obtienes el precio especial de eventos.`;

    $("#subtotal").textContent = dinero(r.subtotal);
    $("#fila-ahorro").hidden = r.ahorro <= 0;
    $("#ahorro").textContent = "−" + dinero(r.ahorro);
    $("#total").textContent = dinero(r.subtotal) + ($("#form").entrega.value === "Domicilio" ? " + envío" : "");
    $("#anticipo-txt").textContent = `Anticipo ${N.anticipo}% para apartar`;
    $("#anticipo").textContent = dinero(Math.ceil(r.subtotal * N.anticipo / 100));

    actualizarFecha(r.evento);
    if (!r.piezas && !$("#panel").hidden) cerrar($("#panel"));
  }

  // ---------- Formulario ----------
  const form = $("#form");

  function sumarDias(fechaISO, dias) {
    const d = new Date(fechaISO + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + dias);
    return d.toISOString().slice(0, 10);
  }
  function hoyISO() {
    try { return ahoraLocal().fecha; } catch (e) { return new Date().toISOString().slice(0, 10); }
  }
  function diaDisponible(iso, evento) {
    const dia = new Date(iso + "T12:00:00Z").getUTCDay();
    return !!N.horario[dia] || (evento && dia === 0 && N.domingoSoloEventos);
  }
  function fechaMinima(evento) {
    let f = sumarDias(hoyISO(), evento ? N.diasAnticipacionEvento : N.diasAnticipacion);
    while (!diaDisponible(f, evento)) f = sumarDias(f, 1);
    return f;
  }
  function actualizarFecha(evento) {
    const min = fechaMinima(evento);
    form.fecha.min = min;
    const domingo = evento && N.domingoSoloEventos ? "Eventos: también entregamos en domingo" : "Domingo no hay entregas (solo eventos de 15+ latas)";
    $("#fecha-ayuda").textContent = `Con ${evento ? N.diasAnticipacionEvento : N.diasAnticipacion} días de anticipación · ${domingo} · Primera fecha disponible: ${fechaBonita(min)}`;
  }
  function fechaBonita(iso) {
    return new Date(iso + "T12:00:00Z").toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
  }

  form.addEventListener("change", e => {
    if (e.target.name === "entrega") {
      const dom = form.entrega.value === "Domicilio";
      $("#campo-direccion").hidden = !dom;
      $("#envio-txt").textContent = dom ? "Se cotiza por WhatsApp según tu dirección" : "Sin costo · te compartimos el punto de encuentro por WhatsApp";
      actualizar();
    }
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const r = calcular();
    const d = Object.fromEntries(new FormData(form));
    const err = validar(r, d);
    $("#error").textContent = err;
    if (err) return;

    const lineas = r.lineas.map(l =>
      `• ${l.cant} × ${l.p.nombre}${l.opcion ? ` (${l.opcion})` : ""} — ${dinero(l.total)}`);
    const msg = [
      `¡Hola ${N.nombre}! 👋 Quiero hacer un pedido:`,
      "",
      "*PEDIDO*",
      ...lineas,
      "",
      r.evento ? `🎉 Precio de evento (${r.latas} latas)` : null,
      `*Total: ${dinero(r.subtotal)}*${d.entrega === "Domicilio" ? " + envío" : ""}`,
      `Anticipo ${N.anticipo}%: ${dinero(Math.ceil(r.subtotal * N.anticipo / 100))}`,
      "",
      "*MIS DATOS*",
      `Nombre: ${d.nombre.trim()}`,
      `Celular: ${d.celular.trim()}`,
      `Entrega: ${d.entrega === "Domicilio" ? "Envío a domicilio" : "Punto de entrega (acordar lugar por WhatsApp)"}`,
      d.entrega === "Domicilio" ? `Dirección: ${d.direccion.trim()}` : null,
      d.evento ? `Evento: ${d.evento}` : null,
      `Fecha: ${fechaBonita(d.fecha)}`,
      `Pago: ${d.pago}`,
      d.notas && d.notas.trim() ? `Notas: ${d.notas.trim()}` : null,
    ].filter(x => x !== null).join("\n");

    contar("pedido-enviado", { value: r.subtotal, currency: "MXN", latas: r.latas });
    window.open(`https://wa.me/${N.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  });

  function validar(r, d) {
    if (!r.piezas) return "Agrega al menos un producto.";
    if (r.cortos.length) return `En pedidos de evento cada sabor lleva mínimo ${N.minimoPorSaborEvento} latas. Sube a ${N.minimoPorSaborEvento}: ${r.cortos.join(", ")}.`;
    if (!d.nombre || !d.nombre.trim()) return "Escribe tu nombre.";
    if ((d.celular || "").replace(/\D/g, "").length < 10) return "Escribe tu celular a 10 dígitos.";
    if (!d.entrega) return "Elige punto de entrega o envío a domicilio.";
    if (d.entrega === "Domicilio" && !(d.direccion || "").trim()) return "Escribe la dirección de entrega.";
    if (!d.fecha) return "Elige la fecha de entrega.";
    if (d.fecha < fechaMinima(r.evento)) return `La primera fecha disponible es ${fechaBonita(fechaMinima(r.evento))}.`;
    if (!diaDisponible(d.fecha, r.evento)) return `Los domingos solo entregamos eventos (${N.latasParaEvento} latas o más). Elige otro día.`;
    if (!d.pago) return "Elige la forma de pago.";
    return "";
  }

  // ---------- Avisos ----------
  let tAviso;
  function aviso(texto) {
    const t = $("#toast");
    t.textContent = texto;
    t.classList.add("visible");
    clearTimeout(tAviso);
    tAviso = setTimeout(() => t.classList.remove("visible"), 2200);
  }

  actualizar();
})();
