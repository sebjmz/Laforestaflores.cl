window.stopAutoPlay = null;
window.descuentoPuntos = 0;
window.maxPuntosCanjeables = 0;
window.tierDiscount = 0;

let mapasCargados = false;
let pasarelasCargadas = false;

function cargarMapasYAbrirModal() {
    if (mapasCargados) {
        openCoverageModal();
    } else {
        let e = document.createElement("link");
        e.rel = "stylesheet";
        e.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(e);

        let t = document.createElement("script");
        t.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        t.onload = () => {
            mapasCargados = true;
            openCoverageModal();
        };
        document.body.appendChild(t);
    }
}

function cargarPasarelasYAbrirCheckout() {
    if (pasarelasCargadas) {
        openCheckout();
    } else {
        let e = document.createElement("script");
        e.src = "https://sdk.mercadopago.com/js/v2";
        document.body.appendChild(e);

        let t = document.createElement("script");
        t.src = "https://www.paypal.com/sdk/js?client-id=AbfBLeAuXrylWnzDIOQcvpfJwrzBAy0N8281_ip4dFmH1k6H8kW70tPOE_IH6sc05OafIHHfe1PE1Mv1&currency=USD";
        t.onload = () => {
            pasarelasCargadas = true;
            openCheckout();
        };
        t.onerror = () => {
            pasarelasCargadas = true;
            openCheckout();
        };
        document.body.appendChild(t);
    }
}

function openB2BFlow() {
    let e = document.getElementById("b2b-flow");
    if (e) {
        e.classList.remove("hidden");
        setTimeout(() => e.classList.remove("opacity-0"), 10);
        document.body.style.overflow = "hidden";
        if (typeof window.stopAutoPlay === "function") window.stopAutoPlay();
    }
}

function closeB2BFlow() {
    let e = document.getElementById("b2b-flow");
    if (e) {
        e.classList.add("opacity-0");
        setTimeout(() => {
            e.classList.add("hidden");
            document.body.style.overflow = "auto";
            resetB2BFlow();
        }, 500);
    }
}

function selectB2BSegment(e) {
    let segmentInput = document.getElementById("b2b-selected-segment");
    if (segmentInput) segmentInput.value = e;
    
    let t = document.getElementById("b2b-testimonial-text");
    let a = document.getElementById("b2b-testimonial-author");
    let r = document.getElementById("b2b-dynamic-testimonial");
    
    if (r) r.classList.add("opacity-0");
    
    if (t && a) {
        if (e === "Inmobiliarias & Propiedades") {
            t.innerText = '"Desde que entregamos nuestras propiedades con la belleza de La Foresta Flores, la percepción de nuestros clientes es inmediata. El boca a boca es la mejor publicidad."';
            a.innerText = "— Director Comercial, Inmobiliaria Jiménez y Asociados";
        } else if (e === "Boutiques & Espacios de Autor") {
            t.innerText = '"Los arreglos de La Foresta son la suavidad y colorida comodidad que nuestra tienda garantiza cada vez que alguien entra por la puerta."';
            a.innerText = "— Fundadora, Boutique de Alta Costura";
        } else if (e === "Oficinas Corporativas") {
            t.innerText = '"El ambiente laboral mejoró aún más. El servicio puntual, ordenado y con una limpieza visual y originalidad que representa totalmente nuestros valores."';
            a.innerText = "— Gerente General, Firma Consultora";
        } else if (e === "Eventos & Galas") {
            t.innerText = '"Su arte floral eleva la escenografía a otro nivel. Trabajar con ellos es tener la garantía de que el diseño será el tema central."';
            a.innerText = "— Productora Ejecutiva de Eventos";
        } else if (e === "Hogar & Jardín") {
            t.innerText = '"Recibir arreglos de autor cada semana da esa luz y elegancia fresca para pasar excelentes momentos en familia y amigos."';
            a.innerText = "— Cliente Particular, Bosques de Montemar";
        }
    }
    
    let o = document.getElementById("b2b-step-1");
    let n = document.getElementById("b2b-step-2");
    if (o && n) {
        o.classList.add("opacity-0", "-translate-x-8");
        setTimeout(() => {
            o.classList.add("hidden");
            o.classList.remove("flex");
            n.classList.remove("hidden");
            n.classList.add("flex");
            n.offsetWidth;
            setTimeout(() => {
                n.classList.remove("opacity-0", "translate-x-8");
                if (r) setTimeout(() => r.classList.remove("opacity-0"), 400);
            }, 10);
        }, 300);
    }
}

function resetB2BFlow() {
    let e = document.getElementById("b2b-final-form");
    if (e) e.reset();
    let t = document.getElementById("b2b-step-1");
    let a = document.getElementById("b2b-step-2");
    let r = document.getElementById("b2b-success");
    if (t) t.className = "b2b-step flex flex-col items-center w-full max-w-lg text-center transition-all duration-500 transform opacity-100 translate-x-0";
    if (a) a.className = "b2b-step hidden flex-col items-center w-full max-w-md text-center transition-all duration-500 transform translate-x-8 opacity-0";
    if (r) {
        r.classList.add("hidden");
        r.classList.remove("flex");
    }
}

async function sendB2BConsultation(e) {
    e.preventDefault();
    if (!b2bTurnstileToken) {
        alert("Por favor, verifica que eres humano marcando la casilla de seguridad.");
        return;
    }
    let t = document.getElementById("b2b-submit-btn");
    let a = t ? t.innerHTML : "";
    if (t) {
        t.innerHTML = "PROCESANDO...";
        t.disabled = true;
    }
    let r = new FormData(e.target);
    r.append("_subject", "Nueva Solicitud de Membresía B2B - La Foresta Flores");
    r.append("_captcha", "false");
    try {
        let o = await fetch("https://formsubmit.co/ajax/contacto@laforestaflores.cl", {
            method: "POST",
            body: r,
            headers: { Accept: "application/json" }
        });
        if (o.ok) {
            let s2 = document.getElementById("b2b-step-2");
            if (s2) {
                s2.classList.add("hidden");
                s2.classList.remove("flex");
            }
            let n = document.getElementById("b2b-success");
            if (n) {
                n.classList.remove("hidden");
                n.classList.add("flex");
            }
        } else {
            alert("Hubo un problema al procesar la solicitud. Por favor, intente vía WhatsApp.");
        }
    } catch (i) {
        console.error("Error al enviar:", i);
        alert("Error de conexión. Verifique su internet.");
    } finally {
        if (t) {
            t.innerHTML = a;
            t.disabled = false;
        }
    }
}

function trackGA4(e, t) {
    if (typeof gtag === "function") gtag("event", e, t);
}

function obtenerGA4ClientId() {
    try {
        let m = document.cookie.match(/_ga=(GA\d\.\d\.[0-9]+\.[0-9]+)/);
        if (m) return m[1].split(".").slice(-2).join(".");
    } catch (e) {}
    return null;
}

let cart = [];
let selectedGardenSpace = "";
let selectedPalette = "";
let shippingCost = 0;
let selectedZoneName = "";
let selectedLogistics = "";
let selectedDate = "";
let selectedTimeSlot = "";
let isExpressDelivery = false;
let b2bTurnstileToken = null;
let gardenTurnstileToken = null;

function onB2BTurnstileSuccess(e) { b2bTurnstileToken = e; }
function onGardenTurnstileSuccess(e) { gardenTurnstileToken = e; }

try {
    cart = JSON.parse(localStorage.getItem("laforesta_cart")) || [];
    selectedGardenSpace = localStorage.getItem("laforesta_selectedGardenSpace") || "";
    selectedPalette = localStorage.getItem("laforesta_selectedPalette") || "";
    shippingCost = parseInt(localStorage.getItem("laforesta_shippingCost")) || 0;
    selectedZoneName = localStorage.getItem("laforesta_selectedZoneName") || "";
    selectedLogistics = localStorage.getItem("laforesta_selectedLogistics") || "";
    selectedDate = localStorage.getItem("laforesta_selectedDate") || "";
    selectedTimeSlot = localStorage.getItem("laforesta_selectedTimeSlot") || "";
    isExpressDelivery = localStorage.getItem("laforesta_isExpressDelivery") === "true";
} catch (e) {
    console.warn("Navegación privada detectada, funciones de memoria limitadas.");
}

const RECARGO_EXPRESS_ENVIO = 1.5;
let currentCalendarDate = new Date();
let mp;
try {
    if (typeof MercadoPago !== "undefined") {
        mp = new MercadoPago("APP_USR-d0faaa27-f799-4a28-9898-7ccc68e2c8cb", { locale: "es-CL" });
    }
} catch (t) {
    console.warn("MercadoPago SDK bloqueado o no cargado aún.");
}

let mapInitialized = false;
let coverageMap;
let circleLayers = {};
const zoneData = [
    { id: 1, radius: 2200, color: "#c5a059", fillOpacity: 0.4, name: "Central" },
    { id: 2, radius: 4500, color: "#c5a059", fillOpacity: 0.25, name: "Local" },
    { id: 3, radius: 6500, color: "#c5a059", fillOpacity: 0.15, name: "Intermedia" },
    { id: 4, radius: 11500, color: "#c5a059", fillOpacity: 0.08, name: "Extendida" },
    { id: 5, radius: 20000, color: "#c5a059", fillOpacity: 0.03, name: "Extendida+" }
];
const atelierCenter = [-32.97074205954955, -71.5431332198481];

function initCoverageMap() {
    if (mapInitialized) return;
    let e = document.getElementById("coverage-map");
    if (!e) return;
    coverageMap = L.map("coverage-map", { zoomControl: true, scrollWheelZoom: false }).setView(atelierCenter, 10);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap",
        subdomains: "abcd",
        maxZoom: 18
    }).addTo(coverageMap);
    
    [...zoneData].reverse().forEach(z => {
        let t = L.circle(atelierCenter, {
            radius: z.radius,
            color: z.color,
            weight: 1,
            fillColor: z.color,
            fillOpacity: z.fillOpacity,
            interactive: false
        }).addTo(coverageMap);
        circleLayers[z.id] = t;
    });
    
    let t = L.divIcon({
        html: '<div class="w-3 h-3 bg-[#c5a059] rounded-full border border-[#0a1f1c] shadow-[0_0_15px_rgba(197,160,89,1)]"></div>',
        className: ""
    });
    L.marker(atelierCenter, { icon: t }).addTo(coverageMap).bindTooltip("Atelier", {
        permanent: true,
        direction: "right",
        className: "atelier-tooltip"
    }).openTooltip();
    mapInitialized = true;
}

function highlightZone(e) {
    if (circleLayers[e]) {
        circleLayers[e].setStyle({ fillOpacity: 0.6, weight: 3, color: "#ffffff" });
        circleLayers[e].bringToFront();
    }
}

function resetZone(e) {
    if (!circleLayers[e]) return;
    let t = zoneData.find(z => z.id === e);
    if (t) circleLayers[e].setStyle({ fillOpacity: t.fillOpacity, weight: 1, color: t.color });
    [...zoneData].reverse().forEach(z => {
        if (circleLayers[z.id]) circleLayers[z.id].bringToFront();
    });
}

function openCoverageModal() {
    let e = document.getElementById("coverage-modal");
    if (e) {
        e.classList.remove("hidden");
        setTimeout(() => {
            e.classList.remove("opacity-0");
            initCoverageMap();
        }, 10);
        setTimeout(() => {
            if (coverageMap) coverageMap.invalidateSize();
        }, 550);
        document.body.style.overflow = "hidden";
        if (typeof window.stopAutoPlay === "function") window.stopAutoPlay();
    }
}

function closeCoverageModal() {
    let e = document.getElementById("coverage-modal");
    if (e) {
        e.classList.add("opacity-0");
        setTimeout(() => {
            e.classList.add("hidden");
            document.body.style.overflow = "auto";
        }, 500);
    }
}

const catalog = [
    { id: 1, name: "Amor Delicado", price: 28900, img: "img/RAMOS01.webp", desc: "Lisianthus, lilium, limonium y astromelias.", url: "amor-delicado.html" },
    { id: 2, name: "Susurro de Amor", price: 28900, img: "img/RAMOS02.webp", desc: "Lilium, rosas, gypso y maule.", url: "susurro-de-amor.html" },
    { id: 3, name: "Amor Eterno", price: 230900, img: "img/RAMOS03.webp", desc: "Arreglo de 70 rosas premium seleccionadas.", url: "amor-eterno.html" },
    { id: 4, name: "Pasión de Sol", price: 45900, img: "img/RAMOS04.webp", desc: "Girasoles, rosas, gypso y maule.", url: "pasion-de-sol.html" },
    { id: 5, name: "Monte Mar Signature", price: 31900, img: "img/RAMOS05.webp", desc: "Gerberas, rosas, maules y gypso.", url: "monte-mar-signature.html" },
    { id: 6, name: "Brisa de Primavera", price: 36900, img: "img/RAMOS06.webp", desc: "Gerberas, astromelias, lisianthus y ruscus.", url: "brisa-de-primavera.html" },
    { id: 7, name: "Golden Bloom", price: 47900, img: "img/RAMOS07.webp", desc: "Girasoles, lisianthus, maule, astromelias, gypso y clavelinas.", url: "golden-bloom.html" },
    { id: 8, name: "Suave Amanecer", price: 37900, img: "img/RAMOS08.webp", desc: "Lisianthus, rosas, maules y gypso.", url: "suave-amanecer.html" },
    { id: 9, name: "Jardin de Verano", price: 28900, img: "img/RAMOS09.webp", desc: "Astromelias, gerberas, lilium y limonium.", url: "jardin-de-verano.html" },
    { id: 10, name: "Susurro Rosé", price: 48900, img: "img/RAMOS10.webp", desc: "Tulipanes y limonium.", url: "susurro-rose.html" },
    { id: 11, name: "Luz de Atardecer", price: 42900, img: "img/RAMOS11.webp", desc: "Rosas, astromelias y limonium.", url: "luz-de-atardecer.html" },
    { id: 12, name: "Encanto Vivo", price: 37900, img: "img/RAMOS12.webp", desc: "Astromelias, lisianthus, gypso, gerberas, maules y ruscus.", url: "encanto-vivo.html" },
    { id: 13, name: "Luz Infinita", price: 45900, img: "img/luz-infinita.webp", desc: "Ramo de rosas blancas.", url: "luz-infinita.html" },
    { id: 14, name: "Luz del Alba", price: 68900, img: "img/luz-del-alba.webp", desc: "Lirios blancos y alstroemerias amarillas en cesto.", url: "luz-del-alba.html" },
    { id: 15, name: "Sereno", price: 59900, img: "img/sereno.webp", desc: "Rosas y lirios blancos en caja gris.", url: "sereno.html" },
    { id: 16, name: "Dulce Amor", price: 48900, img: "img/dulce-amor.webp", desc: "Selección de flores en tonos rosados y blancos.", url: "dulce-amor.html" },
    { id: 17, name: "Esperanza", price: 138900, img: "img/esperanza.webp", desc: "Cesto de lirios y rosas blancas.", url: "esperanza.html" },
    { id: 201, name: "Cubre Urna Sublime", price: 129900, img: "img/cubre-urna.webp", desc: "Delicado homenaje en tonos blancos y crema.", url: "cubre-urna-sublime.html" },
    { id: 202, name: "Cojín de Condolencias", price: 58900, img: "img/cojin.webp", desc: "Composición sobria en rosas y astromelias.", url: "cojin-de-condolencias.html" }
];

const upsellsCatalog = [
    { id: 101, name: "Bombón Sin Azucar - Entrelagos (180g)", price: 16890, img: "img/upsell-choco.webp" },
    { id: 102, name: "Bombón Ferrero Rocher (150g)", price: 15890, img: "img/upsell-ferrero.webp" },
    { id: 103, name: "Bombón Chocolate Seashells (195g)", price: 18190, img: "img/upsell-seashells.webp" },
    { id: 104, name: "Perrito de Peluche - Bulldog", price: 12900, img: "img/bulldog-frances.webp" },
    { id: 105, name: "Perrito de Peluche - Corgi", price: 12900, img: "img/corgi-gales.webp" },
    { id: 106, name: "Osito de Peluche - Graduación", price: 12900, img: "img/osito-graduacion.webp" },
    { id: 107, name: "Perrito de Peluche - Pastor Alemán", price: 12900, img: "img/pastor-aleman.webp" },
    { id: 108, name: "Perrito de Peluche - Salchicha", price: 12900, img: "img/salchicha.webp" },
    { id: 109, name: "Globo Metalizado Helio - Te Amo", price: 6900, img: "img/globo-te-amo.webp" },
    { id: 110, name: "Globo Metalizado Helio - Feliz Cumpleaños", price: 6900, img: "img/globo-feliz-cumpleaños.webp" }
];

function getLuxuryBadge(e) {
    switch (e) {
        case 5:
        case 3:
        case 8:
        case 11:
        case 10:
            return "Más Vendidos";
        default:
            return "";
    }
}

function toggleCart() {
    let e = document.getElementById("atelier-bag");
    let t = document.getElementById("cart-overlay");
    if (e) e.classList.toggle("open");
    if (t && e) {
        if (e.classList.contains("open")) {
            t.classList.remove("hidden");
            setTimeout(() => t.classList.add("opacity-100"), 10);
        } else {
            t.classList.remove("opacity-100");
            setTimeout(() => t.classList.add("hidden"), 500);
        }
    }
}

function addToCart(e, t, a, r) {
    try {
        let o = cart.find(item => item.id === e);
        if (o) {
            o.qty++;
        } else {
            cart.push({ id: e, name: t, price: a, img: r, qty: 1 });
        }
        localStorage.setItem("laforesta_cart", JSON.stringify(cart));
        if (typeof updateCartUI === "function") updateCartUI();
        
        let n = document.getElementById("cart-count");
        if (n) {
            n.classList.add("scale-150");
            setTimeout(() => n.classList.remove("scale-150"), 300);
        }
        let i = document.getElementById("atelier-bag");
        if (i && !i.classList.contains("open")) toggleCart();
        
        trackGA4("add_to_cart", {
            currency: "CLP",
            value: a,
            items: [{ item_id: String(e), item_name: t, price: a, quantity: 1, item_category: "Ramos Florales" }]
        });
    } catch (s) {
        console.error("Error en addToCart:", s);
    }
}

function removeFromCart(e) {
    cart = cart.filter(t => t.id !== e);
    updateCartUI();
}

function updateQty(e, t) {
    let a = cart.find(item => item.id === e);
    if (a) {
        a.qty += t;
        if (a.qty <= 0) {
            removeFromCart(e);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    try {
        let e = cart.some(item => item.id < 100 || (item.id >= 201 && item.id <= 204));
        if (!e) cart = [];
        localStorage.setItem("laforesta_cart", JSON.stringify(cart));
        
        let t = document.getElementById("cart-items-container");
        let a = document.getElementById("cart-total");
        let r = document.getElementById("cart-count");
        
        if (!t) return;
        
        if (cart.length === 0) {
            t.innerHTML = `
                <div class="text-center py-20 opacity-70">
                    <p class="uppercase tracking-widest text-[10px]">Su bolsa está vacía</p>
                    <button onclick="toggleCart(); window.location.href='/#vault';" class="mt-4 text-gold-leaf border-b border-gold-leaf text-[10px] font-bold uppercase tracking-widest">Ir a la Colección</button>
                </div>`;
            if (a) a.innerText = "$0";
            if (r) r.innerText = "0";
            let o = document.getElementById("mobile-sticky-cart");
            if (o) {
                let n = document.getElementById("sticky-cart-count");
                let i = document.getElementById("sticky-cart-total");
                if (n) n.innerText = "0";
                if (i) i.innerText = "$0";
                o.classList.add("translate-y-full");
            }
            return;
        }
        
        let s = cart.map(item => {
            let imgName = item.img.split("/").pop();
            return `
            <div class="flex space-x-4 items-center">
                <div class="w-24 h-24 flex-shrink-0 bg-white overflow-hidden relative flex items-center justify-center border border-zinc-200 rounded-md shadow-sm">
                    <img src="img/${imgName}" class="w-full h-full object-cover relative z-10" alt="${item.name}">
                </div>
                <div class="flex-grow">
                    <h3 class="font-serif text-lg italic mb-1 text-[#0a1f1c]">${item.name}</h3>
                    <p class="text-[#0a1f1c] text-sm font-bold">$${item.price.toLocaleString("es-CL")}</p>
                    <div class="flex items-center space-x-6 mt-3">
                        <div class="flex items-center space-x-3 border border-zinc-200 px-2 py-1 bg-white rounded">
                            <button onclick="updateQty(${item.id}, -1)" aria-label="Disminuir cantidad" class="hover:text-[#c5a059] transition-colors">-</button>
                            <span class="text-xs font-bold w-4 text-center">${item.qty}</span>
                            <button onclick="updateQty(${item.id}, 1)" aria-label="Aumentar cantidad" class="hover:text-[#c5a059] transition-colors">+</button>
                        </div>
                        <button onclick="removeFromCart(${item.id})" class="text-[9px] uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity">Eliminar</button>
                    </div>
                </div>
            </div>`;
        }).join("");
        
        if (typeof upsellsCatalog !== "undefined") {
            let l = cart.map(item => item.id);
            let c = upsellsCatalog.filter(item => !l.includes(item.id));
            let d = [13, 14, 15, 16, 17, 201, 202, 203, 204];
            let p = cart.some(item => d.includes(item.id));
            
            if (c.length > 0 && !p) {
                s += `
                    <div class="mt-8 border-t border-zinc-100 pt-6">
                        <h5 class="font-serif text-lg italic mb-4 text-[#0a1f1c]">Agregar a este arreglo</h5>
                        <div id="upsell-slider" class="flex overflow-x-auto space-x-4 pb-4 hide-scroll w-full cursor-grab active:cursor-grabbing">
                            ${c.map(item => {
                                let imgName = item.img.split("/").pop();
                                return `
                                <div class="w-[110px] flex-shrink-0 group cursor-pointer" role="button" tabindex="0" aria-label="Agregar ${item.name} por $${item.price}" onclick="addToCart(${item.id}, '${item.name}', ${item.price}, 'img/${imgName}')">
                                    <div class="w-[110px] h-[110px] bg-white border border-zinc-200 mb-2 flex items-center justify-center relative overflow-hidden transition-all group-hover:border-[#c5a059] rounded-md shadow-sm p-2">
                                        <span class="font-serif italic text-[#c5a059] text-3xl opacity-20 group-hover:opacity-100 transition-all absolute z-0">+</span>
                                        <img src="img/${imgName}" loading="lazy" class="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-105" alt="${item.name}">
                                    </div>
                                    <h6 class="text-[9px] uppercase tracking-widest font-bold leading-tight text-[#0a1f1c] mb-1 line-clamp-2">${item.name}</h6>
                                    <p class="text-[#0a1f1c] text-[10px] font-bold">+$${item.price.toLocaleString("es-CL")}</p>
                                </div>`;
                            }).join("")}
                        </div>
                    </div>`;
            }
        }
        
        t.innerHTML = s;
        let m = document.getElementById("upsell-slider");
        if (m) {
            m.addEventListener("wheel", evt => {
                if (evt.deltaY !== 0) {
                    evt.preventDefault();
                    m.scrollLeft += evt.deltaY;
                }
            });
        }
        
        if (typeof actualizarTotalConDespacho === "function") actualizarTotalConDespacho();
        
        let u = cart.reduce((acc, item) => acc + item.qty, 0);
        if (r) r.innerText = u;
        
        let g = document.getElementById("mobile-sticky-cart");
        if (g) {
            let stickyCount = document.getElementById("sticky-cart-count");
            let stickyTotal = document.getElementById("sticky-cart-total");
            if (stickyCount) stickyCount.innerText = u;
            if (stickyTotal && a) stickyTotal.innerText = a.innerText;
            if (cart.length > 0) {
                g.classList.remove("translate-y-full");
            } else {
                g.classList.add("translate-y-full");
            }
        }
    } catch (f) {
        console.error("Error al renderizar el carrito:", f);
    }
}

function guardarProgresoCheckout() {
    let e = {
        senderName: document.getElementById("sender-name")?.value || "",
        buyerEmail: document.getElementById("buyer-email")?.value || "",
        receiverName: document.getElementById("receiver-name")?.value || "",
        address: document.getElementById("address")?.value || "",
        pickupName: document.getElementById("pickup-name")?.value || "",
        cardMessage: document.getElementById("card-message")?.value || "",
        receiverPhone: document.getElementById("receiver-phone")?.value || "",
        currentStep: document.querySelector(".checkout-step.active")?.id || "step-1"
    };
    localStorage.setItem("laforesta_checkout_inputs", JSON.stringify(e));
    localStorage.setItem("laforesta_selectedLogistics", selectedLogistics);
    localStorage.setItem("laforesta_selectedDate", selectedDate);
    localStorage.setItem("laforesta_selectedTimeSlot", selectedTimeSlot);
    localStorage.setItem("laforesta_isExpressDelivery", isExpressDelivery);
    localStorage.setItem("laforesta_shippingCost", shippingCost);
    localStorage.setItem("laforesta_selectedZoneName", selectedZoneName);
    localStorage.setItem("laforesta_selectedPalette", selectedPalette);
}

function restaurarProgresoCheckout() {
    let e = JSON.parse(localStorage.getItem("laforesta_checkout_inputs"));
    if (e) {
        ["sender-name", "buyer-email", "receiver-name", "address", "pickup-name", "card-message", "receiver-phone"].forEach(id => {
            let el = document.getElementById(id);
            if (el) el.value = e[id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] || "";
        });
        if (localStorage.getItem("laforesta_checkout_abierto") === "true") {
            cargarPasarelasYAbrirCheckout();
        }
    }
}

function validarEmailYContinuar() {
    let e = document.getElementById("buyer-email");
    if (!e) return;
    let t = e.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) {
        alert("Por favor, ingrese un correo electrónico válido para continuar.");
        return;
    }
    goToStep(2);
}

function openCheckout() {
    if (cart.length === 0) {
        alert("Su bolsa está vacía. Añada un ramo floral primero.");
        return;
    }
    let e = document.getElementById("atelier-bag");
    if (e && e.classList.contains("open")) toggleCart();
    localStorage.setItem("laforesta_checkout_abierto", "true");
    
    let t = document.getElementById("checkout-flow");
    if (!t) return;
    t.classList.remove("hidden");
    setTimeout(() => t.classList.add("open"), 10);
    
    let a = JSON.parse(localStorage.getItem("laforesta_checkout_inputs"));
    goToStep(a?.currentStep || 1);
    if ((a?.currentStep || "step-1") === "step-time") renderHorariosInteligentes();
    
    let o = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    trackGA4("begin_checkout", {
        currency: "CLP",
        value: o,
        items: cart.map(item => ({ item_id: String(item.id), item_name: item.name, price: item.price, quantity: item.qty, item_category: "Ramos Florales" }))
    });
}

function closeCheckout() {
    localStorage.removeItem("laforesta_checkout_abierto");
    let e = document.getElementById("checkout-flow");
    if (e) {
        e.classList.remove("open");
        setTimeout(() => e.classList.add("hidden"), 700);
    }
}

async function cargarVistaPreviaPuntosNativo() {
    const token = localStorage.getItem('laforesta_club_token');
    if (!token) return;
    let currentCart = cart.length > 0 ? cart : (JSON.parse(localStorage.getItem('laforesta_cart')) || []);
    let subtotalFlores = currentCart.reduce((sum, item) => sum + item.price * item.qty, 0);
    try {
        const res = await fetch(`https://club-laforesta.sebjmz.workers.dev/api/redeem-preview?flowers_subtotal=${subtotalFlores}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            const container = document.getElementById('points-redemption-container');
            if (container && data.points_balance > 0) {
                container.classList.remove('hidden');
                const ptsVisual = window.descuentoPuntos > 0 ? 0 : data.points_balance;
                let balEl = document.getElementById('checkout-points-balance');
                if (balEl) balEl.innerText = `${ptsVisual.toLocaleString("es-CL")} pts`;
                window.maxPuntosCanjeables = data.max_redeemable_clp;

                let txt = `Puedes usar hasta ${data.max_redeemable_clp.toLocaleString("es-CL")} pts en esta compra (Cubre hasta el ${data.cap_pct}% del arreglo).`;
                if (data.es_cumpleanos) txt = `¡Feliz Cumpleaños! Hoy puedes cubrir el 100% de tus flores con tus puntos. (Máx: ${data.max_redeemable_clp.toLocaleString("es-CL")})`;
                let maxEl = document.getElementById('checkout-max-discount');
                if (maxEl) maxEl.innerText = txt;
            }

            let pct = 0;
            let tName = "Beneficio Privé";
            if (data.tier === 'Diamante') { pct = 0.05; tName = "Beneficio Diamante (5%)"; }
            else if (data.tier === 'Zafiro') { pct = 0.04; tName = "Beneficio Zafiro (4%)"; }
            else if (data.tier === 'Cuarzo') { pct = 0.03; tName = "Beneficio Cuarzo (3%)"; }

            window.tierDiscount = Math.round(subtotalFlores * pct);
            if (window.tierDiscount > 0) {
                let tdEl = document.getElementById('checkout-tier-discount');
                if (tdEl) tdEl.classList.remove('hidden');
                let tlEl = document.getElementById('checkout-tier-label');
                if (tlEl) tlEl.innerText = tName;
                let taEl = document.getElementById('checkout-tier-amount');
                if (taEl) taEl.innerText = `-$${window.tierDiscount.toLocaleString("es-CL")}`;
            }

            actualizarTotalConDespacho();
        }
    } catch (e) {
        console.warn("Error preview club", e);
    }
}

window.aplicarPuntos = function() {
    const btn = document.getElementById('btn-aplicar-puntos');
    const balanceEl = document.getElementById('checkout-points-balance');

    if (window.descuentoPuntos > 0) {
        window.descuentoPuntos = 0;
        let pDisc = document.getElementById('checkout-points-discount');
        if(pDisc) pDisc.classList.add('hidden');
        if(balanceEl) balanceEl.innerText = `${(window.maxPuntosCanjeables || 0).toLocaleString("es-CL")} pts`; 
        if(btn) {
            btn.innerText = "Usar mi saldo en esta compra";
            btn.classList.add('border-[#0a1f1c]/30', 'text-[#0a1f1c]');
            btn.classList.remove('bg-[#c5a059]', 'border-transparent');
        }
    } else {
        if(window.maxPuntosCanjeables <= 0) return;
        window.descuentoPuntos = window.maxPuntosCanjeables;
        let pDisc = document.getElementById('checkout-points-discount');
        if(pDisc) pDisc.classList.remove('hidden');
        let pAmt = document.getElementById('checkout-points-amount');
        if(pAmt) pAmt.innerText = `-$${window.descuentoPuntos.toLocaleString("es-CL")}`;
        if(balanceEl) balanceEl.innerText = `0 pts`;
        if(btn) {
            btn.innerText = "✓ Saldo Aplicado (Hacer clic para anular)";
            btn.classList.remove('border-[#0a1f1c]/30', 'text-[#0a1f1c]');
            btn.classList.add('bg-[#c5a059]', 'text-[#0a1f1c]', 'border-transparent');
        }
    }
    actualizarTotalConDespacho();
};

function goToStep(e) {
    let t = typeof e === "number" ? `step-${e}` : e;
    document.querySelectorAll(".checkout-step").forEach(step => step.classList.remove("active"));
    let a = document.getElementById(t);
    if (a) a.classList.add("active");
    guardarProgresoCheckout();
    
    // Validar saldo y nivel si se entra al checkout de pago final
    if (t === "step-6") {
        cargarVistaPreviaPuntosNativo();
    }
}

function selectOption(e) {
    let a = e.closest(".checkout-step");
    if (a) {
        a.querySelectorAll(".step-option").forEach(opt => {
            opt.style.borderColor = "rgba(10, 31, 28, 0.15)";
            opt.style.background = "transparent";
        });
        e.style.borderColor = "#c5a059";
        e.style.background = "rgba(197, 160, 89, 0.05)";
    }
}

function setPalette(e) {
    selectedPalette = e;
    setTimeout(() => goToStep(3), 400);
}

function seleccionarModalidad(e) {
    selectedLogistics = e;
    if (e === "envio") {
        goToStep("step-zona");
    } else {
        shippingCost = 0;
        selectedZoneName = "Retiro en tienda";
        actualizarTotalConDespacho();
        goToStep("step-quien-retira");
    }
}

function seleccionarZona(e, t) {
    shippingCost = e;
    selectedZoneName = t;
    actualizarTotalConDespacho();
    goToStep("step-direccion");
}

function confirmarDireccion() {
    let e = document.getElementById("address");
    if (!e || !e.value.trim()) return alert("Ingrese la dirección de entrega.");
    goToStep("step-fecha");
}

function regresarDesdeFecha() {
    if (selectedLogistics === "envio") {
        goToStep("step-direccion");
    } else {
        goToStep("step-quien-retira");
    }
}

function seleccionarFecha(e) {
    if (e === "futuro") {
        let t = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Santiago" }));
        let a = new Date(t);
        a.setDate(a.getDate() + 1);
        currentCalendarDate = a.getMonth() !== t.getMonth() ? new Date(a.getFullYear(), a.getMonth(), 1) : new Date(t.getFullYear(), t.getMonth(), 1);
        renderCalendar();
        goToStep("step-calendario");
    } else {
        selectedDate = e;
        isExpressDelivery = false;
        actualizarTotalConDespacho();
        renderHorariosInteligentes();
        goToStep("step-time");
    }
}

function renderCalendar() {
    let e = document.getElementById("calendar-grid");
    let t = document.getElementById("cal-month-title");
    if (!e || !t) return;
    
    let a = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Santiago" }));
    let r = currentCalendarDate.getFullYear();
    let o = currentCalendarDate.getMonth();
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    t.innerText = `${meses[o]} ${r}`;
    
    let n = a.getMonth();
    let i = a.getFullYear();
    let s = new Date(a);
    let l = new Date(a);
    l.setDate(l.getDate() + 1);
    if (l.getMonth() !== a.getMonth()) s.setMonth(s.getMonth() + 1);
    let c = new Date(s.getFullYear(), s.getMonth() + 1, 1);
    let d = c.getMonth();
    let p = c.getFullYear();
    
    let prevBtn = document.getElementById("cal-prev");
    let nextBtn = document.getElementById("cal-next");
    if (prevBtn) prevBtn.style.visibility = (r === i && o === n) ? "hidden" : "visible";
    if (nextBtn) nextBtn.style.visibility = (r === p && o === d) ? "hidden" : "visible";
    
    e.innerHTML = "";
    let m = new Date(r, o, 1).getDay();
    let u = new Date(r, o + 1, 0).getDate();
    
    for (let g = 0; g < m; g++) e.innerHTML += "<div></div>";
    for (let day = 1; day <= u; day++) {
        let y = new Date(r, o, day);
        y.setHours(0, 0, 0, 0);
        let f = new Date(a.getFullYear(), a.getMonth(), a.getDate());
        f.setHours(0, 0, 0, 0);
        if (y.getTime() <= f.getTime()) {
            e.innerHTML += `<div class="py-3 text-zinc-300 font-serif text-sm cursor-not-allowed">${day}</div>`;
        } else {
            let dateStr = `${r}-${String(o + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            e.innerHTML += `<button onclick="seleccionarDiaCalendario('${dateStr}')" aria-label="Seleccionar el ${day} de este mes" class="py-3 font-serif text-sm hover:text-gold-leaf transition font-bold text-[#0a1f1c]">${day}</button>`;
        }
    }
}

function cambiarMesCalendario(e) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + e);
    renderCalendar();
}

function seleccionarDiaCalendario(e) {
    selectedDate = e;
    isExpressDelivery = false;
    actualizarTotalConDespacho();
    renderHorariosInteligentes();
    goToStep("step-time");
}

function renderHorariosInteligentes() {
    let e = document.getElementById("time-slots-container");
    let t = document.getElementById("time-step-chosen-date");
    if (!e) return;
    e.innerHTML = "";
    
    let a = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Santiago" }));
    let r = a.getHours();
    let o = a.getMinutes();
    let n = r + o / 60;
    let i = `${a.getFullYear()}-${String(a.getMonth() + 1).padStart(2, "0")}-${String(a.getDate()).padStart(2, "0")}`;
    let s = selectedDate === "hoy" || selectedDate === i;
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    if (s) {
        if (t) t.innerText = `Para Hoy: ${a.getDate()} de ${meses[a.getMonth()]} de ${a.getFullYear()}`;
    } else {
        let c = selectedDate.split("-");
        if (c.length === 3) {
            let d = c[0];
            let p = parseInt(c[1], 10) - 1;
            let m = parseInt(c[2], 10);
            if (t) t.innerText = `Para el ${m} de ${meses[p]} de ${d}`;
        } else {
            if (t) t.innerText = selectedDate;
        }
    }
    
    let u = "";
    let g = "";
    let express = "";
    
    if (s) {
        if (n < 7) g += `<button onclick="definirHorario('Mañana (11:00 - 13:00)', false)" class="step-option w-full py-5 text-xs uppercase tracking-widest font-bold mb-3">Mañana (11:00 - 13:00)</button>`;
        if (n < 11) g += `<button onclick="definirHorario('Medio día (14:00 - 17:00)', false)" class="step-option w-full py-5 text-xs uppercase tracking-widest font-bold mb-3">Medio día (14:00 - 17:00)</button>`;
        if (n < 14) g += `<button onclick="definirHorario('Tarde (18:00 - 21:00)', false)" class="step-option w-full py-5 text-xs uppercase tracking-widest font-bold mb-3">Tarde (18:00 - 21:00)</button>`;
        if (selectedLogistics === "envio" && n < 18) express = generarHorasExpress(n);
        
        if (g !== "") u += `<div class="mb-6"><span class="text-[9px] font-bold uppercase tracking-widest text-[#0a1f1c] block mb-3 text-left">Envío Estándar</span>${g}</div>`;
        if (express !== "") u += `<div class="border-t border-[#c5a059]/30 pt-6 mt-2"><span class="text-[9px] font-bold uppercase tracking-widest text-[#c5a059] block mb-3 text-left">Servicio Express (1 hr)</span><div class="flex flex-col gap-2">${express}</div></div>`;
        if (u === "") u = '<p class="text-xs uppercase tracking-widest text-zinc-400 p-4">Entregas de hoy cerradas.</p><button onclick="seleccionarFecha(\'futuro\')" class="w-full btn-premium mt-4">Ver fechas disponibles</button>';
    } else {
        g += `<button onclick="definirHorario('Mañana (11:00 - 13:00)', false)" class="step-option w-full py-5 text-xs uppercase tracking-widest font-bold mb-3">Mañana (11:00 - 13:00)</button>`;
        g += `<button onclick="definirHorario('Medio día (14:00 - 17:00)', false)" class="step-option w-full py-5 text-xs uppercase tracking-widest font-bold mb-3">Medio día (14:00 - 17:00)</button>`;
        g += `<button onclick="definirHorario('Tarde (18:00 - 21:00)', false)" class="step-option w-full py-5 text-xs uppercase tracking-widest font-bold mb-3">Tarde (18:00 - 21:00)</button>`;
        u += `<div class="mb-6"><span class="text-[9px] font-bold uppercase tracking-widest text-[#0a1f1c] block mb-3 text-left">Envío Estándar</span>${g}</div>`;
    }
    e.innerHTML = u;
}

function generarHorasExpress(e) {
    let t = "";
    let a = Math.max(10, Math.ceil(e + 1));
    while (a < 20) {
        let r = `${String(a).padStart(2, "0")}:00`;
        let o = `${String(a + 1).padStart(2, "0")}:00`;
        t += `<button onclick="definirHorario('Express (${r} - ${o})', true)" class="step-option text-[10px] uppercase tracking-widest font-bold py-4 border border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059] hover:text-[#0a1f1c] transition w-full">${r} - ${o}</button>`;
        a += 1;
    }
    return t;
}

function regresarDesdeTime() {
    if (selectedDate === "hoy") {
        goToStep("step-fecha");
    } else {
        goToStep("step-calendario");
    }
}

function definirHorario(e, t) {
    selectedTimeSlot = e;
    isExpressDelivery = t;
    actualizarTotalConDespacho();
    setTimeout(() => goToStep(4), 400);
}

function actualizarTotalConDespacho() {
    let e = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    let puntosAplicados = parseInt(window.descuentoPuntos || 0, 10) || 0;
    let descuentoTier = parseInt(window.tierDiscount || 0, 10) || 0;
    let subtotalConDescuentos = Math.max(0, e - descuentoTier - puntosAplicados);

    let t = parseInt(shippingCost || 0, 10);
    let a = isExpressDelivery ? Math.round(1.5 * t) : t;
    let r = 0;
    if (e >= 69990) r = Math.min(a, 7250);
    let o = Math.max(0, a - r);
    let n = subtotalConDescuentos + (selectedLogistics === "retiro" ? 0 : o);
    
    let i = document.getElementById("cart-total");
    if (i) i.innerText = `$${e.toLocaleString("es-CL")}`;
    
    let s = document.getElementById("sticky-cart-total");
    if (s) s.innerText = `$${e.toLocaleString("es-CL")}`;
    
    let l = document.getElementById("cart-shipping-notice");
    if (l) {
        if (e >= 69990) {
            l.style.opacity = "1";
            l.style.transform = "translateY(0)";
            l.innerText = "Envío de cortesía";
        } else {
            l.style.opacity = "1";
            l.style.transform = "translateY(0)";
            l.innerText = `agrega $${(69990 - e).toLocaleString("es-CL")} para envío de cortesía`;
        }
    }
    
    let c = document.getElementById("checkout-subtotal");
    let d = document.getElementById("checkout-shipping");
    let p = document.getElementById("checkout-final-total");
    let m = document.getElementById("checkout-shipping-notice");
    let u = document.getElementById("checkout-shipping-label");
    
    if (c) c.innerText = `$${e.toLocaleString("es-CL")}`;
    if (p) p.innerText = `$${n.toLocaleString("es-CL")}`;
    
    if (u) {
        if (isExpressDelivery && selectedLogistics === "envio") {
            u.innerHTML = `
                <span class="inline-flex items-center gap-1.5">
                    Logística 
                    <span class="bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 px-1.5 py-[2px] rounded-sm text-[7px] md:text-[8px] font-bold uppercase tracking-widest whitespace-nowrap leading-none mt-0.5">
                        Express (+50%)
                    </span>
                </span>`;
        } else {
            u.innerText = "Logística";
        }
    }
    
    if (d && m) {
        if (selectedLogistics === "retiro") {
            d.innerText = "Retiro en tienda ($0)";
            m.classList.add("hidden");
        } else if (e >= 69990) {
            if (o === 0) {
                d.innerText = "$0";
                m.innerText = "Envío de Cortesía";
                m.classList.remove("hidden");
            } else {
                d.innerText = `$${o.toLocaleString("es-CL")}`;
                m.innerText = "Bono Envío Aplicado (-$7.250)";
                m.classList.remove("hidden");
            }
        } else {
            d.innerText = `$${a.toLocaleString("es-CL")}`;
            m.classList.add("hidden");
        }
    }
    return n;
}

function scrollToVault() {
    let e = document.getElementById("vault");
    if (e) {
        let t = window.innerWidth >= 1024 ? 90 : 70;
        let a = e.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: a - t, behavior: "smooth" });
    }
}

function openGardenFlow() {
    let e = document.getElementById("garden-flow");
    if (e) {
        e.classList.remove("hidden");
        setTimeout(() => {
            e.style.transform = "translateY(0)";
            e.classList.add("open");
            e.classList.add("opacity-100");
        }, 10);
        nextGardenStep(1);
    }
}

function closeGardenFlow() {
    let e = document.getElementById("garden-flow");
    if (e) {
        e.style.transform = "translateY(100%)";
        e.classList.remove("open");
        e.classList.remove("opacity-100");
        setTimeout(() => e.classList.add("hidden"), 500);
    }
}

function nextGardenStep(e) {
    document.querySelectorAll(".garden-step").forEach(step => {
        step.classList.remove("active");
        step.classList.add("hidden");
    });
    let t = document.getElementById(`g-step-${e}`);
    if (t) {
        t.classList.remove("hidden");
        t.classList.add("active");
    }
}

function selectGardenOption(e, t) {
    let a = e.closest(".garden-step");
    if (a) {
        a.querySelectorAll(".step-option").forEach(opt => {
            opt.style.borderColor = "rgba(10, 31, 28, 0.15)";
            opt.style.background = "transparent";
        });
        e.style.borderColor = "#c5a059";
        e.style.background = "rgba(197, 160, 89, 0.05)";
        selectedGardenSpace = t;
        setTimeout(() => nextGardenStep(3), 400);
    }
}

function sendGardenConsultation() {
    let e = document.getElementById("g-name")?.value.trim();
    let t = document.getElementById("g-details")?.value.trim();
    let a = document.getElementById("g-phone")?.value.trim();
    if (!e || !a) {
        alert("Por favor complete los campos obligatorios.");
        return;
    }
    if (!gardenTurnstileToken) {
        alert("Por favor, verifica que eres humano marcando la casilla de seguridad.");
        return;
    }
    let r = `*SOLICITUD ASESORÍA PAISAJISMO - LA FORESTA*\n\n*CLIENTE:* ${e}\n*TIPO DE PROYECTO:* ${selectedGardenSpace}\n*FONO CONTACTO:* ${a}\n\n*DETALLES:*\n"${t}"`;
    let o = `https://wa.me/56994783520?text=${encodeURIComponent(r)}`;
    window.open(o, "_blank");
    closeGardenFlow();
}

function obtenerPayloadOrden() {
    let isAnon = document.getElementById("envio-anonimo") && document.getElementById("envio-anonimo").checked;
    let sender = isAnon ? "Alguien que te quiere (Anónimo)" : (document.getElementById("sender-name")?.value || "No especificado");
    let email = document.getElementById("buyer-email")?.value.trim() || "";
    let receiver = document.getElementById("receiver-name")?.value || "No especificado";
    let message = document.getElementById("card-message")?.value || "";
    let phone = document.getElementById("receiver-phone")?.value || "";
    
    let logisticsDetail = selectedLogistics === "envio" 
        ? `Envío a Domicilio (${selectedZoneName})\n• *DIRECCIÓN:* ${document.getElementById("address")?.value || ""}` 
        : `Retiro en Atelier Reñaca\n• *RETIRA:* ${document.getElementById("pickup-name")?.value || ""}`;
        
    if (isExpressDelivery && selectedLogistics === "envio") {
        logisticsDetail = "[SERVICIO EXPRESS] " + logisticsDetail;
    }
    
    let timeSlot = selectedTimeSlot || "No especificado";
    let deliveryDate = selectedDate === "hoy" ? "Hoy" : selectedDate;
    
    let subtotalFlores = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    let puntos = parseInt(window.descuentoPuntos || 0, 10) || 0;
    let tier = parseInt(window.tierDiscount || 0, 10) || 0;
    
    let baseShip = parseInt(shippingCost || 0, 10);
    let shipWithExpress = isExpressDelivery ? Math.round(1.5 * baseShip) : baseShip;
    let shippingFinal = Math.max(0, shipWithExpress - (subtotalFlores >= 69990 ? Math.min(shipWithExpress, 7250) : 0));
    if (selectedLogistics === "retiro") shippingFinal = 0;
    
    let totalPagar = actualizarTotalConDespacho();

    return {
        totalCLP: totalPagar,
        metadata: {
            sender_name: sender,
            receiver_name: receiver,
            palette: selectedPalette,
            logistics_detail: logisticsDetail,
            time_slot: timeSlot,
            destination_phone: phone,
            card_text: message,
            total_price: totalPagar,
            flowers_subtotal_clp: subtotalFlores,
            points_discount_clp: puntos,
            order_summary: cart.map(e => `- ${e.name} (Cant: ${e.qty}) [c/u: $${e.price.toLocaleString("es-CL")}]`).join("\n"),
            fecha_entrega: deliveryDate,
            valor_envio: shippingFinal,
            comprador_email: email,
            ga_client_id: obtenerGA4ClientId()
        }
    };
}

async function iniciarMercadoPago() {
    if (cart.length === 0) return alert("El atelier está vacío.");
    
    let sel = document.getElementById("payment-selector");
    let btnVolver = document.getElementById("btn-volver-pago");
    let loadEl = document.getElementById("loading-payment");
    
    if (sel) sel.style.display = "none";
    if (btnVolver) btnVolver.style.display = "none";
    if (loadEl) loadEl.style.display = "block";
    
    let payload = obtenerPayloadOrden();
    let externalRef = "LF-" + Date.now();
    let nameParts = payload.metadata.sender_name.trim().split(" ");
    let payerName = nameParts[0] || "Cliente";
    let payerSurname = nameParts.slice(1).join(" ") || "La Foresta";
    
    let descuentoTotal = (parseInt(payload.metadata.points_discount_clp) || 0) + (parseInt(window.tierDiscount) || 0);
    let itemsArr = [];
    
    if (descuentoTotal > 0) {
        itemsArr = [{
            id: "PEDIDO_CLUB",
            title: "Pedido La Foresta (Beneficio Club Aplicado)",
            description: "Arreglos florales y logística",
            quantity: 1,
            unit_price: payload.totalCLP,
            currency_id: "CLP"
        }];
    } else {
        itemsArr = cart.map(item => ({
            id: String(item.id),
            title: item.name,
            description: item.name,
            quantity: item.qty,
            unit_price: item.price,
            currency_id: "CLP"
        }));
        if (payload.metadata.valor_envio > 0) {
            itemsArr.push({
                id: "ENVIO",
                title: `Envío a Domicilio - ${selectedZoneName || "Despacho"}`,
                description: "Servicio de logística",
                quantity: 1,
                unit_price: payload.metadata.valor_envio,
                currency_id: "CLP"
            });
        }
    }
    
    let preferenceData = {
        external_reference: externalRef,
        items: itemsArr,
        payer: { name: payerName, surname: payerSurname, email: payload.metadata.comprador_email },
        back_urls: {
            success: window.location.origin + "/gracias.html",
            failure: window.location.origin + "?payment_result=failure",
            pending: window.location.origin + "?payment_result=pending"
        },
        auto_return: "approved",
        notification_url: "https://old-brook-bf01.sebjmz.workers.dev/webhook",
        metadata: payload.metadata
    };
    
    try {
        let s = await fetch("https://old-brook-bf01.sebjmz.workers.dev/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(preferenceData)
        });
        let l = await s.json();
        if (l.init_point) {
            window.location.href = l.init_point;
        } else {
            throw Error("No se pudo generar el link de pago.");
        }
    } catch (c) {
        console.error("Error MercadoPago:", c);
        alert("Error al conectar con MercadoPago. Intente nuevamente.");
        resetearPasarela();
    }
}

function iniciarPayPal() {
    if (cart.length === 0) return alert("El atelier está vacío.");
    
    if (typeof paypal === "undefined") {
        let loading = document.getElementById("loading-payment");
        if (loading) {
            loading.style.display = "block";
            loading.innerHTML = '<p class="text-[10px] uppercase tracking-widest text-[#c5a059] font-bold animate-pulse">Conectando pasarela segura...</p>';
        }
        
        let t = document.createElement("script");
        t.src = "https://www.paypal.com/sdk/js?client-id=AbfBLeAuXrylWnzDIOQcvpfJwrzBAy0N8281_ip4dFmH1k6H8kW70tPOE_IH6sc05OafIHHfe1PE1Mv1&currency=USD";
        t.onload = () => {
            ejecutarLogicaPayPal();
        };
        t.onerror = () => {
            alert("No se pudo establecer conexión con PayPal. Por favor, intente con MercadoPago o revise su conexión.");
            resetearPasarela();
        };
        document.body.appendChild(t);
        return;
    }

    ejecutarLogicaPayPal();
}

function ejecutarLogicaPayPal() {
    let sel = document.getElementById("payment-selector");
    let btnVolver = document.getElementById("btn-volver-pago");
    let paypalCont = document.getElementById("paypal-container");
    
    if (sel) sel.style.display = "none";
    if (btnVolver) btnVolver.style.display = "none";
    
    if (paypalCont) {
        paypalCont.classList.remove("hidden");
        paypalCont.style.display = "block";
        paypalCont.innerHTML = "";
    }
    
    let payload = obtenerPayloadOrden();
    
    paypal.Buttons({
        style: { color: "gold", shape: "rect", label: "pay", height: 45 },
        createOrder: async function() {
            let e = await fetch("https://old-brook-bf01.sebjmz.workers.dev/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ totalCLP: payload.totalCLP, metadata: payload.metadata })
            });
            let a = await e.json();
            if (a.id) return a.id;
            throw Error("Error generando orden de PayPal");
        },
        onApprove: async function(data) {
            if (paypalCont) paypalCont.style.display = "none";
            let r = document.getElementById("loading-payment");
            if (r) {
                r.innerHTML = '<p class="text-[10px] uppercase tracking-widest text-[#c5a059] font-bold animate-pulse">Acreditando pago internacional...</p>';
                r.style.display = "block";
            }
            try {
                let o = await fetch("https://old-brook-bf01.sebjmz.workers.dev/paypal/capture-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderID: data.orderID, metadata: payload.metadata })
                });
                let n = await o.json();
                if (n.status === "COMPLETED") {
                    window.location.href = window.location.origin + "/gracias.html?payment_id=" + n.id;
                } else {
                    alert("El pago no pudo completarse. Por favor, intente de nuevo.");
                    resetearPasarela();
                }
            } catch (i) {
                console.error("Error PayPal:", i);
                alert("Hubo un problema de conexión. Revise su comprobante o intente nuevamente.");
                resetearPasarela();
            }
        },
        onCancel: function() {
            resetearPasarela();
        },
        onError: function(err) {
            console.error("PayPal Error:", err);
            alert("La ventana de PayPal falló o fue bloqueada por el navegador.");
            resetearPasarela();
        }
    }).render("#paypal-container");
}

function resetearPasarela() {
    let loading = document.getElementById("loading-payment");
    if (loading) {
        loading.style.display = "none";
        loading.innerHTML = '<p class="text-[10px] uppercase tracking-widest text-[#c5a059] font-bold animate-pulse">Procesando Pasarela...</p>';
    }
    let selector = document.getElementById("payment-selector");
    if (selector) selector.style.display = "flex";
    let btnVolver = document.getElementById("btn-volver-pago");
    if (btnVolver) btnVolver.style.display = "block";
    let paypalCont = document.getElementById("paypal-container");
    if (paypalCont) {
        paypalCont.style.display = "none";
        paypalCont.classList.add("hidden");
        paypalCont.innerHTML = "";
    }
}

function toggleGardenImage() {
    let e = document.getElementById("garden-img-1");
    let t = document.getElementById("garden-img-2");
    if (e && t) {
        if (e.classList.contains("opacity-100")) {
            e.classList.replace("opacity-100", "opacity-0");
            t.classList.replace("opacity-0", "opacity-100");
        } else {
            e.classList.replace("opacity-0", "opacity-100");
            t.classList.replace("opacity-100", "opacity-0");
        }
    }
}

function updateCountdown() {
    try {
        let e = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Santiago" }));
        if (isNaN(e.getTime())) return;
        let t = new Date(e);
        t.setHours(18, 0, 0, 0);
        let a = document.getElementById("countdown-timer");
        if (!a) return;
        if (e >= t) {
            a.innerHTML = "<span class='text-sm tracking-wide'>Envíos a partir de <strong>MAÑANA</strong>.</span>";
            return;
        }
        let r = t - e;
        let o = `${String(Math.floor((r % 86400000) / 3600000)).padStart(2, "0")}:${String(Math.floor((r % 3600000) / 60000)).padStart(2, "0")}:${String(Math.floor((r % 60000) / 1000)).padStart(2, "0")}`;
        a.innerHTML = `<span class="opacity-80 hidden md:inline">Envío Express (1-2h) cierra en:</span><span class="opacity-80 md:hidden">Express cierra en:</span> <span class="ml-1 font-mono text-[#0a1f1c] bg-[#c5a059]/20 px-1.5 py-0.5 rounded text-[10px] font-extrabold">${o}</span>`;
    } catch (n) {
        console.warn("Contador visual desactivado", n);
    }
}

function escribirMensaje(e) {
    let t = document.getElementById("card-message");
    if (!t) return;
    let a = "";
    let r = [];
    if (e === "romance") {
        r = [
            "Cada pétalo de este ramo me recuerda a un momento a tu lado. Gracias por hacer que mi vida florezca de esta manera. Te amo profundamente.",
            "Dicen que la naturaleza crea obras de arte irrepetibles, pero ninguna se compara con el privilegio de tenerte en mi vida. Eres mi lugar seguro.",
            "Aunque el tiempo pase y las estaciones cambien, lo que siento por ti solo crece y se fortalece. Gracias por ser mi mayor refugio y mi alegría más pura."
        ];
    } else if (e === "condolencias") {
        r = [
            "Sé que no hay palabras que puedan aliviar este dolor, pero quiero que sepas que estoy aquí para ti. Que estas flores te abracen en la distancia y te brinden un poco de paz.",
            "Las almas que dejan huella nunca se marchan del todo; florecen en nuestros recuerdos. Con el mayor de los respetos, te acompaño en este difícil momento.",
            "Te envío toda mi fuerza y cariño en este momento de tristeza. Que el amor de quienes te rodean y los recuerdos hermosos te sirvan de consuelo."
        ];
    } else if (e === "agradecimiento") {
        r = [
            "Hay gestos que cambian el rumbo de las cosas, y el tuyo fue uno de ellos. Mi más sincero agradecimiento por tu apoyo incondicional; nunca lo olvidaré.",
            "Las palabras a veces quedan cortas para expresar la verdadera gratitud. Espero que este detalle transmita lo mucho que valoro tu tiempo, tu ayuda y tu confianza.",
            "Gracias por estar ahí cuando más lo necesitaba. Es un verdadero privilegio rodearse de personas con tanta calidad humana y un corazón tan noble."
        ];
    } else if (e === "cumpleanos") {
        r = [
            "Que este nuevo año de vida florezca con la misma fuerza, luz y alegría que transmite este arreglo. Celebro tu vida hoy y siempre. ¡Muy feliz cumpleaños!",
            "Un nuevo ciclo comienza y no puedo estar más feliz de poder celebrarlo contigo. Que la vida te siga sorprendiendo y te llene de momentos inolvidables.",
            "Brindo por ti, por todo lo que has logrado y por la hermosa energía que compartes con el mundo. Que hoy recibas tanto amor como el que siempre entregas."
        ];
    }
    
    if (r.length > 0) a = r[Math.floor(Math.random() * r.length)];
    t.value = "";
    let o = 0;
    let n = setInterval(() => {
        t.value += a.charAt(o);
        if (++o >= a.length) {
            clearInterval(n);
            guardarProgresoCheckout();
        }
    }, 15);
}

// ==========================================
// SENSOR MAESTRO 4D & TELEMETRÍA GLOBAL
// ==========================================
window.LF_TRACKER_INITIALIZED = true;

const API_TRACK = 'https://club-laforesta.sebjmz.workers.dev/api/track';

let sid = sessionStorage.getItem('lf_sid_4d') || sessionStorage.getItem('lf_sid');
if (!sid) {
    sid = 'sid_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
    sessionStorage.setItem('lf_sid_4d', sid);
    sessionStorage.setItem('lf_sid', sid);
}

let pagePath = window.location.pathname;
if (pagePath === '/' || pagePath === '') pagePath = '/index.html';
const pageStartTime = Date.now();

// 1. Declaración global directa
window.trackEvent4D = function(name, data = {}) {
    const payload = JSON.stringify({
        session_id: sid,
        event_name: name,
        event_data: data,
        url: pagePath
    });

    fetch(API_TRACK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
    }).catch(() => {});
};

// 2. Registro de vista inmediata
window.trackEvent4D('page_view');

// 3. Registro de compra en gracias.html
if (pagePath.includes('gracias.html')) {
    const cartData = JSON.parse(localStorage.getItem('laforesta_cart') || '[]');
    cartData.forEach(item => {
        window.trackEvent4D('purchase', { product_id: item.id, product_name: item.name, price: item.price, qty: item.qty });
    });
}

// 4. Sensor de Profundidad de Lectura (Scroll Depth)
let scrollFlags = { 25: false, 50: false, 75: false, 100: false };
window.addEventListener('scroll', function() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const scrollPct = Math.round((window.scrollY / docHeight) * 100);
    [25, 50, 75, 100].forEach(depth => {
        if (scrollPct >= depth && !scrollFlags[depth]) {
            scrollFlags[depth] = true;
            window.trackEvent4D('scroll_depth', { depth: depth });
        }
    });
}, { passive: true });

// 5. Heartbeat y reporte de tiempo continuo
function reportTime(event) {
    const seconds = Math.round((Date.now() - pageStartTime) / 1000);
    const currentCart = JSON.parse(localStorage.getItem('laforesta_cart') || '[]');
    const cartVal = currentCart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const email = document.getElementById('buyer-email')?.value?.trim() || '';
    const name = document.getElementById('sender-name')?.value || document.getElementById('receiver-name')?.value || '';
    const phone = document.getElementById('receiver-phone')?.value?.trim() || '';
    const currentStep = document.querySelector(".checkout-step.active")?.id || 'checkout';

    window.trackEvent4D('time_on_page', { 
        seconds: seconds,
        cart_value: cartVal,
        email: email,
        name: name,
        phone: phone
    });

    if (event && (event.type === 'beforeunload' || event.type === 'pagehide') && email && cartVal > 0) {
        window.trackEvent4D('abandonment_or_close', {
            step_name: currentStep,
            cart_value: cartVal,
            email: email,
            name: name,
            phone: phone
        });
    }
}

setInterval(reportTime, 15000);
window.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') reportTime(event); });
window.addEventListener('pagehide', reportTime);
window.addEventListener('beforeunload', reportTime);

// 6. Interceptores de Avance en el Checkout
if (typeof window.goToStep === 'function' && !window.goToStep._tracked4d) {
    const originalGoToStep = window.goToStep;
    window.goToStep = function(step) { 
        window.trackEvent4D('checkout_step', { step_target: String(step) }); 
        return originalGoToStep.apply(this, arguments); 
    };
    window.goToStep._tracked4d = true;
}

// 7. INYECCIÓN DE RETARDO PARA AGREGAR AL CARRITO (Páginas de Producto)
// Esto evita que window.location.href mate el envío del evento a la base de datos
const checkAgregarFunc = setInterval(() => {
    if (typeof window.agregarYVolver === 'function' && !window.agregarYVolver._tracked4d) {
        const originalAgregar = window.agregarYVolver;
        window.agregarYVolver = function(id, name, price, img) {
            window.trackEvent4D(id > 100 && id < 200 ? 'upsell_added' : 'add_to_cart', { product_id: id, product_name: name });
            // Pausa mágica de 250ms para que Cloudflare reciba el dato antes del salto de página
            setTimeout(() => {
                originalAgregar(id, name, price, img);
            }, 250);
        };
        window.agregarYVolver._tracked4d = true;
        clearInterval(checkAgregarFunc);
    }
}, 500);

// 8. Sensor Universal de Clics e Interacciones
document.addEventListener('click', function(e) {
    const target = e.target.closest('button, a, .step-option, .product-card');
    if (!target) return;

    const text = (target.innerText || target.textContent || '').trim();
    const textLower = text.toLowerCase();
    const onclickAttr = target.getAttribute('onclick') || '';
    const hrefAttr = target.getAttribute('href') || '';

    // Anclas
    if (hrefAttr.startsWith('#') || hrefAttr.includes('#')) {
        const anchor = hrefAttr.includes('#') ? '#' + hrefAttr.split('#')[1] : hrefAttr;
        if (anchor && anchor !== '#') {
            window.trackEvent4D('click', { target: anchor });
        }
    }

    // Agregar al carrito (Página Index/Categorías donde se usa addToCart nativo sin redirección inmediata)
    if (onclickAttr.includes('addToCart(') || textLower === 'añadir' || textLower.includes('añadir al atelier') || textLower === 'anadir') {
        const matchId = onclickAttr.match(/(?:addToCart)\s*\(\s*(\d+)/);
        const prodId = matchId ? parseInt(matchId[1], 10) : 0;
        
        const card = target.closest('.product-card, section, main') || document;
        const titleEl = card.querySelector('h1, h3, h6, .product-title');
        let prodName = titleEl ? titleEl.innerText.trim() : pagePath.replace('/', '').replace('.html', '').replace(/-/g, ' ');
        
        if (prodId > 100 && prodId < 200) {
            window.trackEvent4D('upsell_added', { product_name: prodName, target: prodName, product_id: prodId });
        } else {
            window.trackEvent4D('add_to_cart', { product_name: prodName, target: prodName, product_id: prodId });
        }
        return;
    }

    // Pasarelas
    if (onclickAttr.includes('iniciarMercadoPago') || textLower.includes('mercadopago')) {
        const cartVal = JSON.parse(localStorage.getItem('laforesta_cart') || '[]').reduce((acc, item) => acc + (item.price * item.qty), 0);
        const email = document.getElementById('buyer-email')?.value?.trim() || '';
        window.trackEvent4D('payment_initiated', { method: 'MercadoPago', target: 'MercadoPago', cart_value: cartVal, email: email });
        return;
    } else if (onclickAttr.includes('iniciarPayPal') || textLower.includes('paypal')) {
        const cartVal = JSON.parse(localStorage.getItem('laforesta_cart') || '[]').reduce((acc, item) => acc + (item.price * item.qty), 0);
        const email = document.getElementById('buyer-email')?.value?.trim() || '';
        window.trackEvent4D('payment_initiated', { method: 'PayPal', target: 'PayPal', cart_value: cartVal, email: email });
        return;
    }

    // Clics generales
    if (text && text.length > 0 && text.length < 40 && !hrefAttr.startsWith('#')) {
        window.trackEvent4D('click', { target: text });
    }
}, true);
