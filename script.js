// ===== Configuración =====
const MENSAJE_SIEMPRE = {
  titulo: "¡Atrapado en mi telaraña!",
  texto: "Yeefercito, no hay villano, ni multiverso, ni distancia que nos separe. Quedaste pegado a mi corazón y no pienso soltarte: siempre te amaré. — Tu Luanita 🕸️💙"
};

// Cada clic en "Una razón para amarte" muestra una razón distinta
const RAZONES = [
  "Porque contigo hasta los días más enredados se sienten como un buen salto entre edificios.",
  "Porque eres mi héroe de todos los días, con o sin traje.",
  "Porque tu sonrisa es mi sentido arácnido: siempre sé cuándo estás cerca.",
  "Porque contigo todo gran poder trae una gran felicidad.",
  "Porque en cualquier universo, tu Luanita te elegiría a ti."
];

// Mensajes de los dos primeros intentos de terminar
const INTENTOS = [
  { titulo: "¡Botón atrapado!", texto: "El botón quedó pegado en una telaraña y no se puede presionar. Inténtalo otra vez..." },
  { titulo: "¡Sentido arácnido!", texto: "El sentido arácnido de Luanita dice que esto no está bien. Una vez más y te escucho..." }
];

// Pestaña que se abre al tercer intento
const PESTANA = {
  titulo: "¿Así que me quieres terminar?",
  subtitulo: "¿A tu Luanita? Mmm... no sé, Yeefercito 😤🕸️",
  segundos: 10,
  botonPerdon: "Perdón, Luanita 🥺",
  botonTerminar: "Sí, quiero terminar",
  esquivar: ["¿Segurito?", "Mejor no...", "Ni lo intentes 🕸️", "Luanita dice que no"],
  perdon: {
    titulo: "¡Sentido arácnido!",
    mensaje: "Perdonado, Yeefercito 💙 Tu Luanita te quiere más que a todas las telarañas del multiverso."
  },
  tarde: {
    titulo: "¡Muy tarde!",
    mensaje: "Quedaste atrapado en la telaraña de Luanita para siempre 🕸️ No hay escapatoria, Yeefercito."
  }
};

// Arañitas que cuelgan de la parte de arriba
const ARANAS = [
  { x: "8%",  largo: "26vh", d: ".6s" },
  { x: "90%", largo: "34vh", d: "1.1s" },
  { x: "73%", largo: "14vh", d: "1.6s" }
];

// ===== Telaraña dibujada con código =====
// Dibuja un cuarto de telaraña (esquina) con hilos curvados y gotas de rocío
function generarTela() {
  const R = 198;
  const espigas = 8;
  const anillos = [0.15, 0.28, 0.42, 0.57, 0.73, 0.9];
  let semilla = 11;
  const azar = () => (semilla = (semilla * 9301 + 49297) % 233280) / 233280;
  const angulo = (i) => (i * Math.PI / 2) / (espigas - 1);
  const punto = (i, r) => [r * Math.cos(angulo(i)), r * Math.sin(angulo(i))];
  const n = (v) => v.toFixed(1);

  let svg = "";

  // hilos que salen de la esquina
  for (let i = 0; i < espigas; i++) {
    const [x, y] = punto(i, R);
    svg += `<path pathLength="1" d="M0 0 L${n(x)} ${n(y)}"/>`;
  }

  // anillos con curva (la tela "cuelga" un poco hacia el centro)
  const filas = [];
  anillos.forEach((a) => {
    const r0 = R * a;
    const fila = [];
    let d = "";
    for (let i = 0; i < espigas; i++) {
      const r = r0 * (1 + (azar() - 0.5) * 0.07);
      const [x, y] = punto(i, r);
      fila.push([x, y]);
      if (i === 0) {
        d += `M${n(x)} ${n(y)}`;
      } else {
        const [cx, cy] = punto(i - 0.5, r0 * 0.9);
        d += ` Q${n(cx)} ${n(cy)} ${n(x)} ${n(y)}`;
      }
    }
    svg += `<path pathLength="1" d="${d}"/>`;
    filas.push(fila);
  });

  // gotas de rocío que brillan
  for (let k = 0; k < 9; k++) {
    const fila = filas[Math.floor(azar() * filas.length)];
    const [x, y] = fila[Math.floor(azar() * fila.length)];
    const dur = (1.8 + azar() * 2).toFixed(1);
    svg += `<circle cx="${n(x)}" cy="${n(y)}" r="1.8" fill="#fff" stroke="none">` +
           `<animate attributeName="opacity" values=".3;1;.3" dur="${dur}s" repeatCount="indefinite"/></circle>`;
  }
  return svg;
}

// Las 4 esquinas: el mismo dibujo, volteado con transform dentro del SVG
const ESQUINAS = [
  ["sup-izq", ""],
  ["sup-der", "translate(200,0) scale(-1,1)"],
  ["inf-izq", "translate(0,200) scale(1,-1)"],
  ["inf-der", "translate(200,200) scale(-1,-1)"]
];

function ponerEsquinas(contenedor) {
  contenedor.innerHTML = ESQUINAS.map(([clase, t]) =>
    `<svg class="web ${clase}" viewBox="0 0 200 200" aria-hidden="true">` +
    `<use href="#web" width="200" height="200" transform="${t}"/></svg>`
  ).join("");
}

function ponerTelaCentro(svg) {
  svg.innerHTML =
    `<use href="#web" width="200" height="200"/>` +
    `<use href="#web" width="200" height="200" transform="translate(400,0) scale(-1,1)"/>` +
    `<use href="#web" width="200" height="200" transform="translate(0,400) scale(1,-1)"/>` +
    `<use href="#web" width="200" height="200" transform="translate(400,400) scale(-1,-1)"/>`;
}

// ===== Elementos =====
const panel = document.getElementById("panel");
const titulo = document.getElementById("titulo");
const texto = document.getElementById("texto");
const corazones = document.getElementById("corazones");
const cerrar = document.getElementById("cerrar");
const alarma = document.getElementById("alarma");
const alarmaTexto = document.getElementById("alarma-texto");
const btnTerminar = document.getElementById("btn-terminar");

let intentos = 0;
let razonActual = 0;
let ocupado = false;

// ===== Armado inicial =====
document.getElementById("web").innerHTML = generarTela();
ponerEsquinas(document.getElementById("telas-fondo"));
ponerEsquinas(document.getElementById("telas-panel"));
ponerTelaCentro(document.getElementById("tela-centro"));

document.getElementById("aranas").innerHTML = ARANAS.map((a) =>
  `<div class="arana" style="--x:${a.x};--largo:${a.largo};--d:${a.d}"><i></i><b>🕷️</b></div>`
).join("");

// Título con letras que hacen la ola
const h1 = document.getElementById("titulo-principal");
const palabra = h1.textContent;
h1.setAttribute("aria-label", palabra);
h1.innerHTML = [...palabra].map((c, i) =>
  `<span style="--i:${i}" aria-hidden="true">${c}</span>`
).join("");

// ===== Panel =====
function abrir(modo, t, p) {
  panel.dataset.modo = modo;
  titulo.textContent = t;
  texto.textContent = p;
  panel.classList.add("abierto");
  cerrar.focus();
}

function cerrarPanel() {
  panel.classList.remove("abierto");
}

function lluviaDeCorazones() {
  corazones.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    const c = document.createElement("span");
    c.className = "corazon";
    c.textContent = i % 5 === 0 ? "💙" : "♥";
    c.style.left = Math.random() * 94 + "%";
    c.style.animationDelay = (Math.random() * 3).toFixed(2) + "s, 0s";
    c.style.fontSize = (1.5 + Math.random() * 1.8).toFixed(1) + "rem";
    c.style.color = i % 3 === 0 ? "var(--azul)" : "var(--rojo)";
    corazones.appendChild(c);
  }
}

// ===== Onomatopeyas (¡THWIP!) =====
function onomatopeya(evento, palabras) {
  let x = evento.clientX;
  let y = evento.clientY;
  if (!x && !y) { // clic con teclado: usar el centro del botón
    const r = evento.currentTarget.getBoundingClientRect();
    x = r.left + r.width / 2;
    y = r.top + r.height / 2;
  }
  const o = document.createElement("span");
  o.className = "onoma";
  o.textContent = palabras[Math.floor(Math.random() * palabras.length)];
  o.style.left = x + "px";
  o.style.top = y + "px";
  document.body.appendChild(o);
  setTimeout(() => o.remove(), 900);
}

// ===== Alarma roja =====
function mostrarAlarma(frase, duracion, nivel) {
  alarmaTexto.innerHTML = "";
  [...frase].forEach((c, i) => {
    if (c === " ") {
      alarmaTexto.appendChild(document.createTextNode(" "));
      return;
    }
    const s = document.createElement("span");
    s.textContent = c;
    s.style.setProperty("--d", (i * 0.04).toFixed(2) + "s");
    s.style.setProperty("--r", (Math.random() * 8 - 4).toFixed(1) + "deg");
    alarmaTexto.appendChild(s);
  });

  alarma.className = "alarma activa nivel" + nivel;
  document.body.classList.add("temblor");
  if (navigator.vibrate) {
    navigator.vibrate(nivel === 1 ? [200, 80, 200] : [300, 100, 300, 100, 600]);
  }

  return new Promise((resolver) => {
    setTimeout(() => {
      alarma.className = "alarma";
      document.body.classList.remove("temblor");
      resolver();
    }, duracion);
  });
}

// ===== Página que se abre en otra pestaña (sin archivo extra) =====
function paginaTerminar() {
  return `<!DOCTYPE html>
<html lang="es"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>¿Así que me quieres terminar?</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
[hidden]{display:none!important}
body{min-height:100vh;display:grid;place-items:center;padding:20px;font-family:Impact,"Arial Black","Arial Narrow",sans-serif;letter-spacing:1px;color:#fff;overflow-x:hidden;background:radial-gradient(circle,#ff2b2b,#8b0000 70%,#2b0000);animation:latido 1.4s ease-in-out infinite alternate}
@keyframes latido{from{filter:brightness(1)}to{filter:brightness(.65)}}
.arana{position:fixed;top:0;left:50%;display:flex;flex-direction:column;align-items:center;transform-origin:50% 0;animation:bal 2.4s ease-in-out infinite alternate}
.arana i{width:2px;height:18vh;background:#fff}
.arana b{font-size:2rem;font-weight:400}
@keyframes bal{from{rotate:-8deg}to{rotate:8deg}}
.caja{position:relative;z-index:2;margin-top:14vh;width:min(94vw,520px);background:#fff;color:#0a0a12;border:6px solid #0a0a12;box-shadow:12px 12px 0 #2b3784;padding:30px 24px;text-align:center;animation:pop .6s cubic-bezier(.2,1.6,.4,1) both}
@keyframes pop{from{transform:scale(.3) rotate(-8deg)}to{transform:scale(1) rotate(-1deg)}}
h1{font-size:clamp(2rem,9vw,3rem);font-weight:400;color:#e23636;text-shadow:3px 3px 0 #2b3784;margin-bottom:8px;animation:tiembla .12s linear infinite alternate}
@keyframes tiembla{from{translate:-2px 0}to{translate:2px 0}}
p{font-family:"Trebuchet MS",Arial,sans-serif;letter-spacing:0;margin-bottom:14px;line-height:1.5;font-size:1.1rem}
.reloj span{display:inline-block;font-size:5rem;line-height:1;color:#e23636;text-shadow:3px 3px 0 #2b3784;animation:latir 1s ease-in-out infinite}
@keyframes latir{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}
.barra{height:16px;border:3px solid #0a0a12;background:#fff;margin:6px 0 18px;overflow:hidden}
.barra i{display:block;height:100%;background:#e23636;transform-origin:left;animation:barra linear forwards}
@keyframes barra{from{transform:scaleX(1)}to{transform:scaleX(0)}}
.btn{display:block;width:100%;margin-top:12px;padding:12px;font-family:inherit;font-size:1.25rem;letter-spacing:1px;text-align:center;text-decoration:none;color:#fff;background:#e23636;border:4px solid #0a0a12;box-shadow:5px 5px 0 #0a0a12;cursor:pointer;transition:transform .15s,translate .2s}
.btn:hover{transform:translate(-2px,-3px) rotate(-1deg)}
.btn:active{transform:translate(3px,3px);box-shadow:1px 1px 0 #0a0a12}
.btn.azul{background:#2b3784}
.btn.negro{background:#0a0a12}
.c{position:fixed;bottom:-60px;z-index:1;pointer-events:none;animation:sube 3.8s linear forwards}
@keyframes sube{0%{transform:translateY(0) scale(.6);opacity:0}15%{opacity:1}100%{transform:translateY(-115vh) scale(1.3) rotate(18deg);opacity:0}}
</style></head>
<body>
<div class="arana"><i></i><b>🕷️</b></div>
<main class="caja">
  <h1 id="titulo"></h1>
  <p id="sub"></p>
  <div class="reloj" id="reloj"><span id="num"></span></div>
  <p id="aviso"></p>
  <div class="barra" id="barra-caja"><i id="barra"></i></div>
  <button class="btn" id="perdon"></button>
  <button class="btn negro" id="terminar"></button>
  <p id="mensaje" hidden></p>
  <button class="btn azul" id="volver" hidden>Volver al inicio</button>
</main>
<script>
var T = ${JSON.stringify(PESTANA)};
var $ = function (id) { return document.getElementById(id); };
var restante = T.segundos;
var terminado = false;
var veces = 0;

$("titulo").textContent = T.titulo;
$("sub").textContent = T.subtitulo;
$("aviso").textContent = "Tienes " + T.segundos + " segundos para pedir perdón antes de que te atrape mi telaraña.";
$("perdon").textContent = T.botonPerdon;
$("terminar").textContent = T.botonTerminar;
$("num").textContent = restante;
$("barra").style.animationDuration = T.segundos + "s";

var reloj = setInterval(function () {
  restante--;
  $("num").textContent = restante;
  if (restante <= 0) finalizar(T.tarde, ["🕸️", "🕷️"]);
}, 1000);

function lluvia(emojis) {
  for (var i = 0; i < 28; i++) {
    var c = document.createElement("span");
    c.className = "c";
    c.textContent = emojis[i % emojis.length];
    c.style.left = Math.random() * 94 + "%";
    c.style.fontSize = (1.4 + Math.random() * 1.8) + "rem";
    c.style.animationDelay = (Math.random() * 2.5) + "s";
    document.body.appendChild(c);
  }
}

function finalizar(f, emojis) {
  if (terminado) return;
  terminado = true;
  clearInterval(reloj);
  ["reloj", "aviso", "barra-caja", "sub", "perdon", "terminar"].forEach(function (id) { $(id).hidden = true; });
  $("titulo").textContent = f.titulo;
  $("mensaje").textContent = f.mensaje;
  $("mensaje").hidden = false;
  $("volver").hidden = false;
  lluvia(emojis);
}

$("perdon").onclick = function () { finalizar(T.perdon, ["❤️", "💙"]); };

// "Sí, quiero terminar" se escapa y no se puede presionar
function esquivar(e) {
  e.preventDefault();
  veces++;
  $("terminar").style.translate = (Math.random() * 80 - 40) + "px " + (Math.random() * 90 - 45) + "px";
  $("terminar").textContent = T.esquivar[veces % T.esquivar.length];
}
$("terminar").addEventListener("pointerenter", esquivar);
$("terminar").addEventListener("pointerdown", esquivar);
$("terminar").addEventListener("click", esquivar);

$("volver").onclick = function () {
  if (window.opener) { window.close(); } else { history.back(); }
};
<\/script>
</body></html>`;
}

function abrirPestana() {
  const url = URL.createObjectURL(new Blob([paginaTerminar()], { type: "text/html" }));
  const nueva = window.open(url, "_blank");
  if (!nueva) window.location.href = url; // si el navegador bloquea la pestaña, abre en la misma
}

// ===== Botón 1: telaraña gigante =====
document.getElementById("btn-siempre").addEventListener("click", (e) => {
  onomatopeya(e, ["¡THWIP!", "¡SPLAT!", "¡THWIP!"]);
  abrir("telarana", MENSAJE_SIEMPRE.titulo, MENSAJE_SIEMPRE.texto);
});

// ===== Botón 2: corazones =====
document.getElementById("btn-razon").addEventListener("click", (e) => {
  onomatopeya(e, ["♥", "¡AWW!", "💙"]);
  lluviaDeCorazones();
  abrir("corazones", "Una razón para amarte", RAZONES[razonActual]);
  razonActual = (razonActual + 1) % RAZONES.length;
});

// ===== Botón 3: no se puede terminar =====
btnTerminar.addEventListener("click", async (e) => {
  if (ocupado) return;
  ocupado = true;

  onomatopeya(e, ["¡NO!", "¡ZAP!", "¡CRASH!"]);
  btnTerminar.classList.remove("shake");
  void btnTerminar.offsetWidth; // reinicia la animación
  btnTerminar.classList.add("shake");

  intentos++;
  if (intentos === 1) {
    await mostrarAlarma("¿POR QUÉ QUIERES TERMINAR?", 2300, 1);
    abrir("no", INTENTOS[0].titulo, INTENTOS[0].texto);
  } else if (intentos === 2) {
    await mostrarAlarma("¡NO, NO, NO, YEEFERCITO!", 2900, 2);
    abrir("no", INTENTOS[1].titulo, INTENTOS[1].texto);
  } else {
    await mostrarAlarma("¿A TU LUANITA? ...", 1500, 2);
    intentos = 0;
    abrirPestana();
  }
  ocupado = false;
});

// ===== Cerrar =====
cerrar.addEventListener("click", cerrarPanel);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarPanel();
});