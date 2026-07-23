<script>
    // Corrección para scope: Haciendo `stopAutoPlay` global para que otros modales puedan usarla sin arrojar error
    window.stopAutoPlay = null;

    function openB2BFlow() {
        const flow = document.getElementById('b2b-flow');
        if(!flow) return;
        flow.classList.remove('hidden');
        setTimeout(() => flow.classList.remove('opacity-0'), 10);
        document.body.style.overflow = 'hidden'; 
        if (typeof window.stopAutoPlay === 'function') window.stopAutoPlay(); 
    }

    function closeB2BFlow() {
        const flow = document.getElementById('b2b-flow');
        if(!flow) return;
        flow.classList.add('opacity-0');
        setTimeout(() => {
            flow.classList.add('hidden');
            document.body.style.overflow = 'auto'; 
            resetB2BFlow(); 
        }, 500);
    }

    function selectB2BSegment(segment) {
        document.getElementById('b2b-selected-segment').value = segment;
        
        const textEl = document.getElementById('b2b-testimonial-text');
        const authorEl = document.getElementById('b2b-testimonial-author');
        const containerEl = document.getElementById('b2b-dynamic-testimonial');

        containerEl.classList.add('opacity-0');

        if (segment === 'Inmobiliarias & Propiedades') {
            textEl.innerText = '"Desde que entregamos nuestras propiedades con la belleza de La Foresta Flores, la percepción de nuestros clientes es inmediata. El boca a boca es la mejor publicidad."';
            authorEl.innerText = '— Director Comercial, Inmobiliaria Jiménez y Asociados';
        } else if (segment === 'Boutiques & Espacios de Autor') {
            textEl.innerText = '"Los arreglos de La Foresta son la suavidad y colorida comodidad que nuestra tienda garantiza cada vez que alguien entra por la puerta."';
            authorEl.innerText = '— Fundadora, Boutique de Alta Costura';
        } else if (segment === 'Oficinas Corporativas') {
            textEl.innerText = '"El ambiente laboral mejoró aún más. El servicio puntual, ordenado y con una limpieza visual y originalidad que representa totalmente nuestros valores."';
            authorEl.innerText = '— Gerente General, Firma Consultora';
        } else if (segment === 'Eventos & Galas') {
            textEl.innerText = '"Su arte floral eleva la escenografía a otro nivel. Trabajar con ellos es tener la garantía de que el diseño será el tema central."';
            authorEl.innerText = '— Productora Ejecutiva de Eventos';
        } else if (segment === 'Hogar & Jardín') {
            textEl.innerText = '"Recibir arreglos de autor cada semana da esa luz y elegancia fresca para pasar excelentes momentos en familia y amigos."';
            authorEl.innerText = '— Cliente Particular, Bosques de Montemar';
        }

        const step1 = document.getElementById('b2b-step-1');
        const step2 = document.getElementById('b2b-step-2');
        
        step1.classList.add('opacity-0', '-translate-x-8');
        
        setTimeout(() => {
            step1.classList.add('hidden');
            step1.classList.remove('flex');
            
            step2.classList.remove('hidden');
            step2.classList.add('flex');
            
            void step2.offsetWidth; 
            
            setTimeout(() => {
                step2.classList.remove('opacity-0', 'translate-x-8');
                setTimeout(() => {
                    containerEl.classList.remove('opacity-0');
                }, 400);
            }, 10);
        }, 300);
    }

    function registrarOrdenIntranet(orderId, payloadData, totalPagado) {
        const INT_API_URL = "https://laforesta-intranet.sebjmz.workers.dev";
        fetch(`${INT_API_URL}/api/orden`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: orderId,
                email: payloadData.metadata.comprador_email,
                receptor: payloadData.metadata.receiver_name,
                direccion: payloadData.metadata.logistics_detail.split('•')[1] || payloadData.metadata.logistics_detail,
                fecha: payloadData.metadata.fecha_entrega + " / " + payloadData.metadata.time_slot,
                totalCompra: totalPagado
            })
        }).catch(e => console.error("Fallo sincr. Intranet:", e));
    }
        
    function backToB2BStep1() {
        const step1 = document.getElementById('b2b-step-1');
        const step2 = document.getElementById('b2b-step-2');
        
        step2.classList.add('opacity-0', 'translate-x-8');
        
        setTimeout(() => {
            step2.classList.add('hidden');
            step2.classList.remove('flex');
            
            step1.classList.remove('hidden');
            step1.classList.add('flex');
            
            void step1.offsetWidth;
            
            setTimeout(() => step1.classList.remove('opacity-0', '-translate-x-8'), 10);
        }, 300);
    }
    
    function resetB2BFlow() {
        const form = document.getElementById('b2b-final-form');
        if(form) form.reset();
        const step1 = document.getElementById('b2b-step-1');
        const step2 = document.getElementById('b2b-step-2');
        const success = document.getElementById('b2b-success');
        if(step1) step1.className = "b2b-step flex flex-col items-center w-full max-w-lg text-center transition-all duration-500 transform opacity-100 translate-x-0";
        if(step2) step2.className = "b2b-step hidden flex-col items-center w-full max-w-md text-center transition-all duration-500 transform translate-x-8 opacity-0";
        if(success) {
            success.classList.add('hidden');
            success.classList.remove('flex');
        }
    }

    async function sendB2BConsultation(event) {
        event.preventDefault(); 

        if (!b2bTurnstileToken) {
            alert("Por favor, verifica que eres humano marcando la casilla de seguridad.");
            return;
        }

        const btn = document.getElementById('b2b-submit-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'PROCESANDO...';
        btn.disabled = true;

        const formData = new FormData(event.target);
        formData.append('_subject', 'Nueva Solicitud de Membresía B2B - La Foresta Flores');
        formData.append('_captcha', 'false');

        try {
            const response = await fetch("https://formsubmit.co/ajax/contacto@laforestaflores.cl", {
                method: "POST",
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                document.getElementById('b2b-step-2').classList.add('hidden');
                document.getElementById('b2b-step-2').classList.remove('flex');
                const successScreen = document.getElementById('b2b-success');
                successScreen.classList.remove('hidden');
                successScreen.classList.add('flex');
            } else {
                alert("Hubo un problema al procesar la solicitud. Por favor, intente vía WhatsApp.");
            }
        } catch (error) {
            console.error("Error al enviar:", error);
            alert("Error de conexión. Verifique su internet.");
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    function trackGA4(eventName, params) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }
    }

    // Variables protegidas
    let cart = [];
    let selectedGardenSpace = '';
    let selectedPalette = '';
    let shippingCost = 0;
    let selectedZoneName = '';
    let selectedLogistics = '';
    let selectedDate = '';
    let selectedTimeSlot = '';
    let isExpressDelivery = false;
    let b2bTurnstileToken = null;
    let gardenTurnstileToken = null;

function onB2BTurnstileSuccess(token) { b2bTurnstileToken = token; }
function onGardenTurnstileSuccess(token) { gardenTurnstileToken = token; }

    try {
        cart = JSON.parse(localStorage.getItem('laforesta_cart')) || [];
        selectedGardenSpace = localStorage.getItem('laforesta_selectedGardenSpace') || '';
        selectedPalette = localStorage.getItem('laforesta_selectedPalette') || '';
        shippingCost = parseInt(localStorage.getItem('laforesta_shippingCost')) || 0;
        selectedZoneName = localStorage.getItem('laforesta_selectedZoneName') || '';
        selectedLogistics = localStorage.getItem('laforesta_selectedLogistics') || '';
        selectedDate = localStorage.getItem('laforesta_selectedDate') || '';
        selectedTimeSlot = localStorage.getItem('laforesta_selectedTimeSlot') || '';
        isExpressDelivery = localStorage.getItem('laforesta_isExpressDelivery') === 'true';
    } catch (e) {
        console.warn("Navegación privada detectada, funciones de memoria limitadas.");
    }

    const RECARGO_EXPRESS_ENVIO = 1.50;
    let currentCalendarDate = new Date();

    let mp;
    try {
        mp = new MercadoPago('APP_USR-d0faaa27-f799-4a28-9898-7ccc68e2c8cb', { locale: 'es-CL' });
    } catch (e) {
        console.warn("MercadoPago SDK bloqueado por el navegador.");
    }

    let mapInitialized = false;
    let coverageMap;
    let circleLayers = {};

    const zoneData = [
        { id: 1, radius: 2200, color: '#c5a059', fillOpacity: 0.4, name: "Central" },
        { id: 2, radius: 4500, color: '#c5a059', fillOpacity: 0.25, name: "Local" },
        { id: 3, radius: 6500, color: '#c5a059', fillOpacity: 0.15, name: "Intermedia" },
        { id: 4, radius: 11500, color: '#c5a059', fillOpacity: 0.08, name: "Extendida" },
        { id: 5, radius: 20000, color: '#c5a059', fillOpacity: 0.03, name: "Extendida+" }
    ];

    const atelierCenter = [-32.97074205954955, -71.5431332198481];

    function initCoverageMap() {
        if (mapInitialized) return;
        const mapContainer = document.getElementById('coverage-map');
        if(!mapContainer) return;

        coverageMap = L.map('coverage-map', { 
            zoomControl: true,
            scrollWheelZoom: false 
        }).setView(atelierCenter, 10);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap',
            subdomains: 'abcd',
            maxZoom: 18
        }).addTo(coverageMap);

        [...zoneData].reverse().forEach(z => {
            let circle = L.circle(atelierCenter, {
                radius: z.radius,
                color: z.color,
                weight: 1,
                fillColor: z.color,
                fillOpacity: z.fillOpacity,
                interactive: false 
            }).addTo(coverageMap);
            circleLayers[z.id] = circle;
        });

        const icon = L.divIcon({ 
            html: '<div class="w-3 h-3 bg-[#c5a059] rounded-full border border-[#0a1f1c] shadow-[0_0_15px_rgba(197,160,89,1)]"></div>', 
            className: '' 
        });
        L.marker(atelierCenter, {icon: icon})
            .addTo(coverageMap)
            .bindTooltip("Atelier", {
                permanent: true, 
                direction: "right", 
                className: "atelier-tooltip"
            }).openTooltip();

        mapInitialized = true;
    }

    function highlightZone(id) {
        if(!circleLayers[id]) return;
        circleLayers[id].setStyle({ fillOpacity: 0.6, weight: 3, color: '#ffffff' });
        circleLayers[id].bringToFront();
    }

    function resetZone(id) {
        if(!circleLayers[id]) return;
        const original = zoneData.find(z => z.id === id);
        circleLayers[id].setStyle({ fillOpacity: original.fillOpacity, weight: 1, color: original.color });
        [...zoneData].reverse().forEach(z => {
            if(circleLayers[z.id]) circleLayers[z.id].bringToFront();
        });
    }

    function openCoverageModal() {
        const modal = document.getElementById('coverage-modal');
        if(!modal) return;
        modal.classList.remove('hidden');
        
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            initCoverageMap();
        }, 10);

        setTimeout(() => {
            if (coverageMap) coverageMap.invalidateSize();
        }, 550);

        document.body.style.overflow = 'hidden';
        if (typeof window.stopAutoPlay === 'function') window.stopAutoPlay();
    }

    function closeCoverageModal() {
        const modal = document.getElementById('coverage-modal');
        if(!modal) return;
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 500);
    }

    const catalog = [
        { id: 1, name: "Amor Delicado", price: 28900, img: "img/RAMOS01.jpeg", desc: "Lisianthus, lilium, limonium y astromelias.", url: "amor-delicado.html" },
        { id: 2, name: "Susurro de Amor", price: 28900, img: "img/RAMOS02.jpeg", desc: "Lilium, rosas, gypso y maule.", url: "susurro-de-amor.html" },
        { id: 3, name: "Amor Eterno", price: 230900, img: "img/RAMOS03.jpeg", desc: "Arreglo de 70 rosas premium seleccionadas.", url: "amor-eterno.html" },
        { id: 4, name: "Pasión de Sol", price: 45900, img: "img/RAMOS04.jpeg", desc: "Girasoles, rosas, gypso y maule.", url: "pasion-de-sol.html" },
        { id: 5, name: "Monte Mar Signature", price: 31900, img: "img/RAMOS05.jpeg", desc: "Gerberas, rosas, maules y gypso.", url: "monte-mar-signature.html" },
        { id: 6, name: "Brisa de Primavera", price: 36900, img: "img/RAMOS06.jpeg", desc: "Gerberas, astromelias, lisianthus y ruscus.", url: "brisa-de-primavera.html" },
        { id: 7, name: "Golden Bloom", price: 47900, img: "img/RAMOS07.jpeg", desc: "Girasoles, lisianthus, maule, astromelias, gypso y clavelinas.", url: "golden-bloom.html" },
        { id: 8, name: "Suave Amanecer", price: 37900, img: "img/RAMOS08.jpeg", desc: "Lisianthus, rosas, maules y gypso.", url: "suave-amanecer.html" },
        { id: 9, name: "Jardin de Verano", price: 28900, img: "img/RAMOS09.jpeg", desc: "Astromelias, gerberas, lilium y limonium.", url: "jardin-de-verano.html" },
        { id: 10, name: "Susurro Rosé", price: 48900, img: "img/RAMOS10.jpeg", desc: "Tulipanes y limonium.", url: "susurro-rose.html" },
        { id: 11, name: "Luz de Atardecer", price: 42900, img: "img/RAMOS11.jpeg", desc: "Rosas, astromelias y limonium.", url: "luz-de-atardecer.html" },
        { id: 12, name: "Encanto Vivo", price: 37900, img: "img/RAMOS12.jpeg", desc: "Astromelias, lisianthus, gypso, gerberas, maules y ruscus.", url: "encanto-vivo.html" },
        { id: 13, name: "Luz Infinita", price: 45900, img: "img/luz-infinita.jpeg", desc: "Ramo de rosas blancas.", url: "luz-infinita.html" },
        { id: 14, name: "Luz del Alba", price: 68900, img: "img/luz-del-alba.jpeg", desc: "Lirios blancos y alstroemerias amarillas en cesto.", url: "luz-del-alba.html" },
        { id: 15, name: "Sereno", price: 59900, img: "img/sereno.jpeg", desc: "Rosas y lirios blancos en caja gris.", url: "sereno.html" },
        { id: 16, name: "Dulce Amor", price: 48900, img: "img/dulce-amor.jpeg", desc: "Selección de flores en tonos rosados y blancos.", url: "dulce-amor.html" },
        { id: 17, name: "Esperanza", price: 138900, img: "img/esperanza.jpeg", desc: "Cesto de lirios y rosas blancas.", url: "esperanza.html" },
        { id: 201, name: "Cubre Urna Sublime", price: 129900, img: "img/cubre-urna.jpg", desc: "Delicado homenaje en tonos blancos y crema.", url: "cubre-urna-sublime.html" },
        { id: 202, name: "Cojín de Condolencias", price: 58900, img: "img/cojin.jpg", desc: "Composición sobria en rosas y astromelias.", url: "cojin-de-condolencias.html" }
    ];

    const upsellsCatalog = [
        { id: 101, name: "Bombón Sin Azucar - Entrelagos (180g)", price: 16890, img: "img/upsell-choco.png" },
        { id: 102, name: "Bombón Ferrero Rocher (150g)", price: 15890, img: "img/upsell-ferrero.jpg" },
        { id: 103, name: "Bombón Chocolate Seashells (250g)", price: 18190, img: "img/upsell-seashells.jpg" },
        { id: 104, name: "Perrito de Peluche - Bulldog", price: 12900, img: "img/bulldog-frances.jpeg" },
        { id: 105, name: "Perrito de Peluche - Corgi", price: 12900, img: "img/corgi-gales.jpeg" },
        { id: 106, name: "Osito de Peluche - Graduación", price: 12900, img: "img/osito-graduacion.jpeg" },
        { id: 107, name: "Perrito de Peluche - Pastor Alemán", price: 12900, img: "img/pastor-aleman.jpeg" },
        { id: 108, name: "Perrito de Peluche - Salchicha", price: 12900, img: "img/salchicha.jpeg" },
        { id: 109, name: "Globo Metalizado Helio - Te Amo", price: 6900, img: "img/globo-te-amo.jpeg" },
        { id: 110, name: "Globo Metalizado Helio - Feliz Cumpleaños", price: 6900, img: "img/globo-feliz-cumpleaños.jpeg" }
    ];

    function getLuxuryBadge(id) {
        switch(id) {
            case 5: case 3: case 8: case 11: case 10: return "Más Vendidos";
            default: return "";
        }
    }

    const grid = document.getElementById('product-grid');
    if (grid) {
        grid.innerHTML = catalog.map(product => {
            const badgeText = getLuxuryBadge(product.id);
            const badgeHTML = badgeText 
                ? `<div class="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#0a1f1c] shadow-sm">${badgeText}</div>` 
                : '';
                
            const scarcityHTML = (product.id === 3 || product.id === 5) 
                ? `<div class="urgency-tag">Últimas 2 unidades</div>` 
                : '';

            return `
            <div class="product-card group flex flex-col h-full">
                <a href="${product.url || '#'}" class="block">
                    <div class="img-zoom-container aspect-square mb-4 md:mb-6 relative bg-zinc-100 flex items-center justify-center rounded-xl">
                        <span class="font-serif italic text-zinc-300 text-3xl absolute z-0">LF</span>
                        ${scarcityHTML}
                        <img src="${product.img}" onerror="this.style.opacity='0'" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-10" alt="${product.name}" loading="lazy">
                        ${badgeHTML}
                    </div>
                </a>
                <div class="flex flex-col flex-grow mb-3 md:mb-4">
                    <a href="${product.url || '#'}" class="hover:text-[#c5a059] transition-colors">
                        <h3 class="font-serif text-sm md:text-xl italic text-[#0a1f1c] leading-tight mb-1">${product.name}</h3>
                    </a>
                    <p class="text-[8px] md:text-[10px] uppercase tracking-widest opacity-50 mt-1 line-clamp-2"><span class="text-[#c5a059] mr-1">★★★★★</span> ${product.desc}</p>
                </div>
                <div class="mt-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <span class="font-serif text-base md:text-xl text-[#0a1f1c]">$${product.price.toLocaleString()}</span>
                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.img}')" 
                            class="w-full md:w-auto px-4 py-3 border border-[#0a1f1c] text-[#0a1f1c] text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-[#0a1f1c] hover:text-[#c5a059] transition-colors duration-300 text-center">
                        Añadir
                    </button>
                </div>
            </div>
            `;
        }).join('');
    }

    function toggleCart() {
        const drawer = document.getElementById('atelier-bag');
        const overlay = document.getElementById('cart-overlay');
        
        if (drawer) {
            drawer.classList.toggle('open');
        }
        
        if (overlay && drawer) {
            if (drawer.classList.contains('open')) {
                overlay.classList.remove('hidden');
                setTimeout(() => overlay.classList.add('opacity-100'), 10);
            } else {
                overlay.classList.remove('opacity-100');
                setTimeout(() => overlay.classList.add('hidden'), 500);
            }
        }
    }

    function addToCart(id, name, price, img) {
        try {
            const existing = cart.find(item => item.id === id);
            if (existing) { existing.qty++; }
            else { cart.push({ id, name, price, img, qty: 1 }); }
            
            localStorage.setItem('laforesta_cart', JSON.stringify(cart));
            
            if (typeof updateCartUI === 'function') { updateCartUI(); }

            const badge = document.getElementById('cart-count');
            if (badge) {
                badge.classList.add('scale-150');
                setTimeout(() => badge.classList.remove('scale-150'), 300);
            }

            const atelierBag = document.getElementById('atelier-bag');
            if (atelierBag && !atelierBag.classList.contains('open')) { 
                toggleCart(); 
            }

            if (typeof trackGA4 === 'function') {
                trackGA4('add_to_cart', {
                    currency: 'CLP',
                    value: price,
                    items: [{ item_id: String(id), item_name: name, price: price, quantity: 1, item_category: 'Ramos Florales' }]
                });
            }
        } catch (errorFatal) {
            console.error("Error en addToCart:", errorFatal);
        }
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    }

    function updateQty(id, delta) {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) removeFromCart(id);
            else updateCartUI();
        }
    }

    function updateCartUI() {
        try {
            const tieneRamos = cart.some(item => item.id < 100 || (item.id >= 201 && item.id <= 204));
            if (!tieneRamos) { cart = []; }

            localStorage.setItem('laforesta_cart', JSON.stringify(cart));
            
            const container = document.getElementById('cart-items-container');
            const totalEl = document.getElementById('cart-total');
            const countNav = document.getElementById('cart-count');
            
            if (!container) return; 

            if (cart.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-20 opacity-40">
                        <p class="uppercase tracking-widest text-[10px]">Su bolsa está vacía</p>
                        <button onclick="toggleCart(); window.location.href='/#vault';" class="mt-4 text-gold-leaf border-b border-gold-leaf text-[10px] font-bold uppercase tracking-widest">Ir a la Colección</button>
                    </div>`;
                    
                if (totalEl) totalEl.innerText = `$0`;
                if (countNav) countNav.innerText = "0";
                
                const stickyCart = document.getElementById('mobile-sticky-cart');
                if (stickyCart) {
                    const stickyCount = document.getElementById('sticky-cart-count');
                    const stickyTotal = document.getElementById('sticky-cart-total');
                    if (stickyCount) stickyCount.innerText = "0";
                    if (stickyTotal) stickyTotal.innerText = "$0";
                    stickyCart.classList.add('translate-y-full');
                }
                return;
            }

            let html = cart.map(item => {
                const fileName = item.img.split('/').pop();
                return `
                <div class="flex space-x-4 items-center">
                    <div class="w-24 h-24 flex-shrink-0 bg-white overflow-hidden relative flex items-center justify-center border border-zinc-200 rounded-md shadow-sm">
                        <img src="img/${fileName}" class="w-full h-full object-cover relative z-10" alt="${item.name}">
                    </div>
                    <div class="flex-grow">
                        <h4 class="font-serif text-lg italic mb-1 text-[#0a1f1c]">${item.name}</h4>
                        <p class="text-[#0a1f1c] text-sm font-bold">$${(item.price).toLocaleString()}</p>
                        <div class="flex items-center space-x-6 mt-3">
                            <div class="flex items-center space-x-3 border border-zinc-200 px-2 py-1 bg-white rounded">
                                <button onclick="updateQty(${item.id}, -1)" aria-label="Disminuir cantidad" class="hover:text-[#c5a059] transition-colors">-</button>
                                <span class="text-xs font-bold w-4 text-center">${item.qty}</span>
                                <button onclick="updateQty(${item.id}, 1)" aria-label="Aumentar cantidad" class="hover:text-[#c5a059] transition-colors">+</button>
                            </div>
                            <button onclick="removeFromCart(${item.id})" class="text-[9px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Eliminar</button>
                        </div>
                    </div>
                </div>
                `;
            }).join('');

            if (typeof upsellsCatalog !== 'undefined') {
                const inCartIds = cart.map(item => item.id);
                const availableUpsells = upsellsCatalog.filter(u => !inCartIds.includes(u.id));
                const condolenceIds = [13, 14, 15, 16, 17, 201, 202, 203, 204]; 
                const tieneCondolencias = cart.some(item => condolenceIds.includes(item.id));

                if (availableUpsells.length > 0 && !tieneCondolencias) {
                    html += `
                        <div class="mt-8 border-t border-zinc-100 pt-6">
                            <h5 class="font-serif text-lg italic mb-4 text-[#0a1f1c]">Agregar a este arreglo</h5>
                            <div id="upsell-slider" class="flex overflow-x-auto space-x-4 pb-4 hide-scroll w-full cursor-grab active:cursor-grabbing">
                                ${availableUpsells.map(u => {
                                    const uFileName = u.img.split('/').pop();
                                    return `
                                    <div class="w-[110px] flex-shrink-0 group cursor-pointer" role="button" tabindex="0" aria-label="Agregar ${u.name} por $${u.price}" onclick="addToCart(${u.id}, '${u.name}', ${u.price}, 'img/${uFileName}')">
                                        <div class="w-[110px] h-[110px] bg-white border border-zinc-200 mb-2 flex items-center justify-center relative overflow-hidden transition-all group-hover:border-[#c5a059] rounded-md shadow-sm p-2">
                                            <span class="font-serif italic text-[#c5a059] text-3xl opacity-20 group-hover:opacity-100 transition-all absolute z-0">+</span>
                                            <img src="img/${uFileName}" loading="lazy" class="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-105" alt="${u.name}">
                                        </div>
                                        <h6 class="text-[9px] uppercase tracking-widest font-bold leading-tight text-[#0a1f1c] mb-1 line-clamp-2">${u.name}</h6>
                                        <p class="text-[#0a1f1c] text-[10px] font-bold">+$${u.price.toLocaleString()}</p>
                                    </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }
            }

            container.innerHTML = html;
            
            const upsellSlider = document.getElementById('upsell-slider');
            if (upsellSlider) {
                upsellSlider.addEventListener('wheel', (evt) => {
                    if (evt.deltaY !== 0) {
                        evt.preventDefault();
                        upsellSlider.scrollLeft += evt.deltaY;
                    }
                });
            }

            if (typeof actualizarTotalConDespacho === 'function') {
                actualizarTotalConDespacho();
            }

            const itemsCount = cart.reduce((acc, item) => acc + item.qty, 0);
            if (countNav) countNav.innerText = itemsCount;
            
            const stickyCart = document.getElementById('mobile-sticky-cart');
            if (stickyCart) {
                const stickyCount = document.getElementById('sticky-cart-count');
                const stickyTotal = document.getElementById('sticky-cart-total');
                if (stickyCount) stickyCount.innerText = itemsCount;
                if (stickyTotal && totalEl) stickyTotal.innerText = totalEl.innerText;
                
                if (cart.length > 0) { stickyCart.classList.remove('translate-y-full'); }
                else { stickyCart.classList.add('translate-y-full'); }
            }
        } catch (err) {
            console.error("Error al renderizar el carrito:", err);
        }
    }

    function guardarProgresoCheckout() {
        const progresoInputs = {
            senderName: document.getElementById('sender-name')?.value || '',
            buyerEmail: document.getElementById('buyer-email')?.value || '',
            receiverName: document.getElementById('receiver-name')?.value || '',
            address: document.getElementById('address')?.value || '',
            pickupName: document.getElementById('pickup-name')?.value || '',
            cardMessage: document.getElementById('card-message')?.value || '',
            receiverPhone: document.getElementById('receiver-phone')?.value || '',
            currentStep: document.querySelector('.checkout-step.active')?.id || 'step-1'
        };
        localStorage.setItem('laforesta_checkout_inputs', JSON.stringify(progresoInputs));
        localStorage.setItem('laforesta_selectedLogistics', selectedLogistics);
        localStorage.setItem('laforesta_selectedDate', selectedDate);
        localStorage.setItem('laforesta_selectedTimeSlot', selectedTimeSlot);
        localStorage.setItem('laforesta_isExpressDelivery', isExpressDelivery);
        localStorage.setItem('laforesta_shippingCost', shippingCost);
        localStorage.setItem('laforesta_selectedZoneName', selectedZoneName);
        localStorage.setItem('laforesta_selectedPalette', selectedPalette);
    }

    function restaurarProgresoCheckout() {
        const progreso = JSON.parse(localStorage.getItem('laforesta_checkout_inputs'));
        if (!progreso) return;
        const fields = ['sender-name', 'buyer-email', 'receiver-name', 'address', 'pickup-name', 'card-message', 'receiver-phone'];
        fields.forEach(field => {
            const el = document.getElementById(field);
            if (el) el.value = progreso[field.replace(/-([a-z])/g, (g) => g[1].toUpperCase())] || '';
        });
        if (localStorage.getItem('laforesta_checkout_abierto') === 'true') {
            const checkoutFlow = document.getElementById('checkout-flow');
            if (checkoutFlow) {
                checkoutFlow.classList.add('open');
                checkoutFlow.classList.remove('hidden');
                goToStep(progreso.currentStep);
                if (progreso.currentStep === 'step-time') { renderHorariosInteligentes(); }
            }
        }
    }

    function validarEmailYContinuar() {
        const emailEl = document.getElementById('buyer-email');
        if(!emailEl) return;
        const email = emailEl.value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            alert("Por favor, ingrese un correo electrónico válido para continuar.");
            return;
        }
        goToStep(2);
    }

    function openCheckout() {
        if(cart.length === 0) {
            alert("Su bolsa está vacía. Añada una ramo floral primero.");
            return;
        }
        const drawer = document.getElementById('atelier-bag');
        if(drawer && drawer.classList.contains('open')) {
            toggleCart();
        }
        localStorage.setItem('laforesta_checkout_abierto', 'true');
        const flow = document.getElementById('checkout-flow');
        if(!flow) return;
        flow.classList.remove('hidden');
        setTimeout(() => { flow.classList.add('open'); }, 10);
        const progreso = JSON.parse(localStorage.getItem('laforesta_checkout_inputs'));
        goToStep(progreso?.currentStep || 1);
        const currentStepId = progreso?.currentStep || 'step-1';
        if (currentStepId === 'step-time') { renderHorariosInteligentes(); }

        const totalCarrito = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
        trackGA4('begin_checkout', {
            currency: 'CLP',
            value: totalCarrito,
            items: cart.map(item => ({
                item_id: String(item.id), item_name: item.name, price: item.price, quantity: item.qty, item_category: 'Ramos Florales'
            }))
        });
    }

    function closeCheckout() {
        localStorage.removeItem('laforesta_checkout_abierto');
        const flow = document.getElementById('checkout-flow');
        if(!flow) return;
        flow.classList.remove('open');
        setTimeout(() => { flow.classList.add('hidden'); }, 700);
    }

    function goToStep(stepId) {
        const targetId = typeof stepId === 'number' ? `step-${stepId}` : stepId;
        document.querySelectorAll('.checkout-step').forEach(step => { step.classList.remove('active'); });
        const targetElement = document.getElementById(targetId);
        if(targetElement) { targetElement.classList.add('active'); }
        guardarProgresoCheckout();
    }

    function selectOption(button, step) {
        const stepContainer = button.closest('.checkout-step');
        if(!stepContainer) return;
        stepContainer.querySelectorAll('.step-option').forEach(btn => {
            btn.style.borderColor = 'rgba(10, 31, 28, 0.15)';
            btn.style.background = 'transparent';
        });
        button.style.borderColor = '#c5a059';
        button.style.background = 'rgba(197, 160, 89, 0.05)';
    }

    function setPalette(option) {
        selectedPalette = option;
        setTimeout(() => goToStep(3), 400);
    }

    function seleccionarModalidad(option) {
        selectedLogistics = option;
        if(option === 'envio') {
            goToStep('step-zona');
        } else {
            shippingCost = 0;
            selectedZoneName = 'Retiro en tienda';
            actualizarTotalConDespacho();
            goToStep('step-quien-retira');
        }
    }

    function seleccionarZona(costo, zoneName) {
        shippingCost = costo;
        selectedZoneName = zoneName;
        actualizarTotalConDespacho();
        goToStep('step-direccion');
    }

    function confirmarDireccion() {
        const dirEl = document.getElementById('address');
        if (!dirEl || !dirEl.value.trim()) return alert("Ingrese la dirección de entrega.");
        goToStep('step-fecha');
    }

    function regresarDesdeFecha() {
        if(selectedLogistics === 'envio') { goToStep('step-direccion'); }
        else { goToStep('step-quien-retira'); }
    }

    function seleccionarFecha(dia) {
        if(dia === 'futuro') {
            const ahora = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Santiago"}));
            const manana = new Date(ahora);
            manana.setDate(manana.getDate() + 1);
            if (manana.getMonth() !== ahora.getMonth()) {
                currentCalendarDate = new Date(manana.getFullYear(), manana.getMonth(), 1);
            } else {
                currentCalendarDate = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
            }
            renderCalendar();
            goToStep('step-calendario');
        } else {
            selectedDate = dia;
            isExpressDelivery = false;
            actualizarTotalConDespacho();
            renderHorariosInteligentes();
            goToStep('step-time');
        }
    }
    
    function renderCalendar() {
        const grid = document.getElementById('calendar-grid');
        const title = document.getElementById('cal-month-title');
        if(!grid || !title) return;

        const ahoraChile = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Santiago"}));
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();
        const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        title.innerText = `${nombresMeses[month]} ${year}`;
        
        const minMonth = ahoraChile.getMonth();
        const minYear = ahoraChile.getFullYear();
        
        const vistaInicial = new Date(ahoraChile);
        const mananaCheck = new Date(ahoraChile);
        mananaCheck.setDate(mananaCheck.getDate() + 1);
        
        if (mananaCheck.getMonth() !== ahoraChile.getMonth()) {
            vistaInicial.setMonth(vistaInicial.getMonth() + 1);
        }
        
        const maxDate = new Date(vistaInicial.getFullYear(), vistaInicial.getMonth() + 1, 1);
        const maxMonth = maxDate.getMonth();
        const maxYear = maxDate.getFullYear();
        
        document.getElementById('cal-prev').style.visibility = (year === minYear && month === minMonth) ? 'hidden' : 'visible';
        document.getElementById('cal-next').style.visibility = (year === maxYear && month === maxMonth) ? 'hidden' : 'visible';
        
        grid.innerHTML = "";
        const primerDia = new Date(year, month, 1).getDay();
        const totalDias = new Date(year, month + 1, 0).getDate();
        
        for (let i = 0; i < primerDia; i++) { grid.innerHTML += `<div></div>`; }
        for (let d = 1; d <= totalDias; d++) {
            const celdaFecha = new Date(year, month, d);
            celdaFecha.setHours(0,0,0,0);
            const hoyComparar = new Date(ahoraChile.getFullYear(), ahoraChile.getMonth(), ahoraChile.getDate());
            hoyComparar.setHours(0,0,0,0);
            
            if (celdaFecha.getTime() <= hoyComparar.getTime()) {
                grid.innerHTML += `<div class="py-3 text-zinc-300 font-serif text-sm cursor-not-allowed">${d}</div>`;
            } else {
                const fechaStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                grid.innerHTML += `<button onclick="seleccionarDiaCalendario('${fechaStr}')" aria-label="Seleccionar el ${d} de este mes" class="py-3 font-serif text-sm hover:text-gold-leaf transition font-bold text-[#0a1f1c]">${d}</button>`;
            }
        }
    }
    
    function cambiarMesCalendario(delta) {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
        renderCalendar();
    }

    function seleccionarDiaCalendario(fechaStr) {
        selectedDate = fechaStr;
        isExpressDelivery = false;
        actualizarTotalConDespacho();
        renderHorariosInteligentes();
        goToStep('step-time');
    }

    function renderHorariosInteligentes() {
        const container = document.getElementById('time-slots-container');
        const dateHeader = document.getElementById('time-step-chosen-date');
        if (!container) return;
        
        container.innerHTML = "";
        const ahoraChile = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Santiago"}));
        const hora = ahoraChile.getHours();
        const minutos = ahoraChile.getMinutes();
        const tiempoDecimal = hora + (minutos / 60);
        const dateStringHoy = `${ahoraChile.getFullYear()}-${String(ahoraChile.getMonth() + 1).padStart(2, '0')}-${String(ahoraChile.getDate()).padStart(2, '0')}`;
        const esHoyReal = (selectedDate === 'hoy' || selectedDate === dateStringHoy);
        
        const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        if (esHoyReal) {
            if (dateHeader) dateHeader.innerText = `Para Hoy: ${ahoraChile.getDate()} de ${nombresMeses[ahoraChile.getMonth()]} de ${ahoraChile.getFullYear()}`;
        } else {
            const partes = selectedDate.split('-');
            if (partes.length === 3) {
                const anio = partes[0];
                const mesIndex = parseInt(partes[1], 10) - 1;
                const dia = parseInt(partes[2], 10);
                if (dateHeader) dateHeader.innerText = `Para el ${dia} de ${nombresMeses[mesIndex]} de ${anio}`;
            } else {
                if (dateHeader) dateHeader.innerText = selectedDate;
            }
        }

        let html = "", htmlNormal = "", htmlExpress = "";
        if (esHoyReal) {
            if (tiempoDecimal < 7.0) { htmlNormal += `<button onclick="definirHorario('Mañana (11:00 - 13:00)', false)" class="step-option w-full py-5 text-xs uppercase tracking-widest font-bold mb-3">Mañana (11:00 - 13:00)</button>`; }
            if (tiempoDecimal < 11.0) { htmlNormal += `<button onclick="definirHorario('Medio día (14:00 - 17:00)', false)" class="step-option w-full py-5 text-xs uppercase tracking-widest font-bold mb-3">Medio día (14:00 - 17:00)</button>`; }
            if (tiempoDecimal < 14.0) { htmlNormal += `<button onclick="definirHorario('Tarde (18:00 - 21:00)', false)" class="step-option w-full py-5 text-xs uppercase tracking-widest font-bold mb-3">Tarde (18:00 - 21:00)</button>`; }
            
            if (selectedLogistics === 'envio' && tiempoDecimal < 18.0) { htmlExpress = generarHorasExpress(tiempoDecimal); }
            
            if (htmlNormal !== "") { html += `<div class="mb-6"><span class="text-[9px] font-bold uppercase tracking-widest text-[#0a1f1c] block mb-3 text-left">Envío Estándar</span>${htmlNormal}</div>`; }
            if (htmlExpress !== "") { html += `<div class="border-t border-[#c5a059]/30 pt-6 mt-2"><span class="text-[9px] font-bold uppercase tracking-widest text-[#c5a059] block mb-3 text-left">Servicio Express (1 hr)</span><div class="flex flex-col gap-2">${htmlExpress}</div></div>`; }
            if (html === "") { html = `<p class="text-xs uppercase tracking-widest text-zinc-400 p-4">Entregas de hoy cerradas.</p><button onclick="seleccionarFecha('futuro')" class="w-full btn-premium mt-4">Ver fechas disponibles</button>`; }
        } else {
            htmlNormal += `<button onclick="definirHorario('Mañana (11:00 - 13:00)', false)" class="step-option w-full py-5 text-xs uppercase tracking-widest font-bold mb-3">Mañana (11:00 - 13:00)</button>`;
            htmlNormal += `<button onclick="definirHorario('Medio día (14:00 - 17:00)', false)" class="step-option w-full py-5 text-xs uppercase tracking-widest font-bold mb-3">Medio día (14:00 - 17:00)</button>`;
            htmlNormal += `<button onclick="definirHorario('Tarde (18:00 - 21:00)', false)" class="step-option w-full py-5 text-xs uppercase tracking-widest font-bold mb-3">Tarde (18:00 - 21:00)</button>`;
            html += `<div class="mb-6"><span class="text-[9px] font-bold uppercase tracking-widest text-[#0a1f1c] block mb-3 text-left">Envío Estándar</span>${htmlNormal}</div>`;
        }
        container.innerHTML = html;
    }

    function generarHorasExpress(tiempoDecimal) {
        let opciones = "";
        let horaInicio = Math.ceil(tiempoDecimal + 1.0);
        let horaBase = Math.max(10, horaInicio);

        while (horaBase < 20) {
            let formatStart = `${String(horaBase).padStart(2, '0')}:00`;
            let formatEnd = `${String(horaBase + 1).padStart(2, '0')}:00`;
            
            opciones += `<button onclick="definirHorario('Express (${formatStart} - ${formatEnd})', true)" class="step-option text-[10px] uppercase tracking-widest font-bold py-4 border border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059] hover:text-[#0a1f1c] transition w-full">${formatStart} - ${formatEnd}</button>`;
            horaBase += 1;
        }
        return opciones;
    }

    function regresarDesdeTime() {
        if (selectedDate === 'hoy') { goToStep('step-fecha'); }
        else { goToStep('step-calendario'); }
    }

    function definirHorario(slot, esExpress) {
        selectedTimeSlot = slot;
        isExpressDelivery = esExpress;
        actualizarTotalConDespacho();
        setTimeout(() => goToStep(4), 400);
    }

    function actualizarTotalConDespacho() {
        let baseTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        let tarifaEnvioBase = parseInt(shippingCost || 0, 10);
        let tarifaEnvioFinal = isExpressDelivery ? Math.round(tarifaEnvioBase * RECARGO_EXPRESS_ENVIO) : tarifaEnvioBase;
        
        let descuentoEnvio = 0;
        if (baseTotal >= 69990) { descuentoEnvio = Math.min(tarifaEnvioFinal, 7250); }
        
        let costoEnvioFinal = Math.max(0, tarifaEnvioFinal - descuentoEnvio);
        const totalFinal = baseTotal + costoEnvioFinal;
        
        const totalEl = document.getElementById('cart-total');
        if (totalEl) totalEl.innerText = `$${baseTotal.toLocaleString('es-CL')}`;
        
        const stickyTotal = document.getElementById('sticky-cart-total');
        if (stickyTotal) stickyTotal.innerText = `$${baseTotal.toLocaleString('es-CL')}`;
        
        const shippingNotice = document.getElementById('cart-shipping-notice');
        if (shippingNotice) {
            if (baseTotal >= 69990) {
                shippingNotice.style.opacity = '1';
                shippingNotice.style.transform = 'translateY(0)';
                shippingNotice.innerText = 'Envío de cortesía';
            } else {
                shippingNotice.style.opacity = '1';
                shippingNotice.style.transform = 'translateY(0)';
                let faltante = 69990 - baseTotal;
                shippingNotice.innerText = `agrega $${faltante.toLocaleString('es-CL')} para envío de cortesía`;
            }
        }

        const checkoutSubtotal = document.getElementById('checkout-subtotal');
        const checkoutShipping = document.getElementById('checkout-shipping');
        const checkoutFinalTotal = document.getElementById('checkout-final-total');
        const checkoutShippingNotice = document.getElementById('checkout-shipping-notice');
        const checkoutShippingLabel = document.getElementById('checkout-shipping-label');

        if (checkoutSubtotal) checkoutSubtotal.innerText = `$${baseTotal.toLocaleString('es-CL')}`;
        if (checkoutFinalTotal) checkoutFinalTotal.innerText = `$${totalFinal.toLocaleString('es-CL')}`;
        
        if (checkoutShippingLabel) {
            if (isExpressDelivery && selectedLogistics === 'envio') {
                checkoutShippingLabel.innerHTML = `
                    <span class="inline-flex items-center gap-1.5">
                        Logística 
                        <span class="bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 px-1.5 py-[2px] rounded-sm text-[7px] md:text-[8px] font-bold uppercase tracking-widest whitespace-nowrap leading-none mt-0.5">
                            Express (+50%)
                        </span>
                    </span>
                `;
            } else {
                checkoutShippingLabel.innerText = `Logística`;
            }
        }

        if (checkoutShipping && checkoutShippingNotice) {
            if (selectedLogistics === 'retiro') {
                checkoutShipping.innerText = 'Retiro en tienda ($0)';
                checkoutShippingNotice.classList.add('hidden');
            } else {
                if (baseTotal >= 69990) {
                    if (costoEnvioFinal === 0) {
                        checkoutShipping.innerText = '$0';
                        checkoutShippingNotice.innerText = 'Envío de Cortesía';
                        checkoutShippingNotice.classList.remove('hidden');
                    } else {
                        checkoutShipping.innerText = `$${costoEnvioFinal.toLocaleString('es-CL')}`;
                        checkoutShippingNotice.innerText = 'Bono Envío Aplicado (-$7.250)';
                        checkoutShippingNotice.classList.remove('hidden');
                    }
                } else {
                    checkoutShipping.innerText = `$${tarifaEnvioFinal.toLocaleString('es-CL')}`;
                    checkoutShippingNotice.classList.add('hidden');
                }
            }
        }
        return totalFinal;
    }

    function scrollToVault() {
        const vaultSection = document.getElementById('vault');
        if (vaultSection) {
            const headerOffset = window.innerWidth >= 1024 ? 90 : 70;
            const elementPosition = vaultSection.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    }

    function openGardenFlow() {
        const flow = document.getElementById('garden-flow');
        if(!flow) return;
        flow.classList.remove('hidden');
        setTimeout(() => { flow.style.transform = 'translateY(0)'; flow.classList.add('open'); flow.classList.add('opacity-100'); }, 10);
        nextGardenStep(1);
    }

    function closeGardenFlow() {
        const flow = document.getElementById('garden-flow');
        if(!flow) return;
        flow.style.transform = 'translateY(100%)';
        flow.classList.remove('open'); flow.classList.remove('opacity-100');
        setTimeout(() => flow.classList.add('hidden'), 500);
    }

    function nextGardenStep(stepNumber) {
        document.querySelectorAll('.garden-step').forEach(step => { step.classList.remove('active'); step.classList.add('hidden'); });
        const targetStep = document.getElementById(`g-step-${stepNumber}`);
        if (targetStep) { targetStep.classList.remove('hidden'); targetStep.classList.add('active'); }
    }

    function selectGardenOption(button, optionName) {
        const stepContainer = button.closest('.garden-step');
        if(stepContainer){
            stepContainer.querySelectorAll('.step-option').forEach(btn => { btn.style.borderColor = 'rgba(10, 31, 28, 0.15)'; btn.style.background = 'transparent'; });
        }
        button.style.borderColor = '#c5a059';
        button.style.background = 'rgba(197, 160, 89, 0.05)';
        selectedGardenSpace = optionName;
        setTimeout(() => nextGardenStep(3), 400);
    }

    function sendGardenConsultation() {
        const nombre = document.getElementById('g-name')?.value.trim();
        const detalles = document.getElementById('g-details')?.value.trim();
        const fono = document.getElementById('g-phone')?.value.trim();
        if(!nombre || !fono) { alert("Por favor complete los campos obligatorios."); return; }
                if (!gardenTurnstileToken) {
            alert("Por favor, verifica que eres humano marcando la casilla de seguridad.");
            return;
        }

        const NUMERO_WHATSAPP_GARDEN = "56994783520"; 
        let textoGarden = `*SOLICITUD ASESORÍA PAISAJISMO - LA FORESTA*\n\n*CLIENTE:* ${nombre}\n*TIPO DE PROYECTO:* ${selectedGardenSpace}\n*FONO CONTACTO:* ${fono}\n\n*DETALLES:*\n"${detalles}"`;
        const wpUrl = `https://wa.me/${NUMERO_WHATSAPP_GARDEN}?text=${encodeURIComponent(textoGarden)}`;
        window.open(wpUrl, '_blank');
        closeGardenFlow();
    }

    function obtenerPayloadOrden() {
        const emisor = document.getElementById('sender-name')?.value || 'No especificado';
        const correoComprador = document.getElementById('buyer-email')?.value.trim() || '';
        const receptor = document.getElementById('receiver-name')?.value || 'No especificado';
        const mensaje = document.getElementById('card-message')?.value || '';
        const fonoDestino = document.getElementById('receiver-phone')?.value || '';
        
        let destinoFinal = selectedLogistics === 'envio' 
            ? `Envío a Domicilio (${selectedZoneName})\n• *DIRECCIÓN:* ${document.getElementById('address')?.value || ''}`
            : `Retiro en Atelier Reñaca\n• *RETIRA:* ${document.getElementById('pickup-name')?.value || ''}`;
        
        if (isExpressDelivery && selectedLogistics === 'envio') { destinoFinal = "[SERVICIO EXPRESS] " + destinoFinal; }

        const horario = selectedTimeSlot || 'No especificado';
        let fechaTexto = selectedDate === 'hoy' ? 'Hoy' : selectedDate;
        
        let baseTotalOrden = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        let tarifaEnvioBase = parseInt(shippingCost || 0);
        let tarifaEnvioFinal = isExpressDelivery ? Math.round(tarifaEnvioBase * RECARGO_EXPRESS_ENVIO) : tarifaEnvioBase;
        let descuentoEnvio = baseTotalOrden >= 69990 ? Math.min(tarifaEnvioFinal, 7250) : 0;
        let costoEnvioReal = Math.max(0, tarifaEnvioFinal - descuentoEnvio);
        let totalCLPFinal = baseTotalOrden + costoEnvioReal;

        let articulos = cart.map(item => `- ${item.name} (Cant: ${item.qty}) [c/u: $${item.price.toLocaleString('es-CL')}]`).join('\n');

        return {
            totalCLP: totalCLPFinal,
            metadata: {
                sender_name: emisor, receiver_name: receptor, palette: selectedPalette,
                logistics_detail: destinoFinal, time_slot: horario, destination_phone: fonoDestino,
                card_text: mensaje, total_price: totalCLPFinal, order_summary: articulos,
                fecha_entrega: fechaTexto, valor_envio: costoEnvioReal, comprador_email: correoComprador 
            }
        };
    }

    async function iniciarMercadoPago() {
        if(cart.length === 0) return alert("El atelier está vacío.");
        
        document.getElementById('payment-selector').style.display = 'none';
        document.getElementById('btn-volver-pago').style.display = 'none';
        document.getElementById('loading-payment').style.display = 'block';

        const payload = obtenerPayloadOrden();
        const orderId = 'LF-' + Date.now();

        const emisorParts = payload.metadata.sender_name.trim().split(' ');
        const payerName = emisorParts[0] || 'Cliente';
        const payerSurname = emisorParts.slice(1).join(' ') || 'La Foresta';

        const mpItems = cart.map(item => ({
            id: String(item.id), title: item.name, description: item.name, quantity: item.qty, unit_price: item.price, currency_id: "CLP"
        }));

        if (payload.metadata.valor_envio > 0) {
            mpItems.push({
                id: "ENVIO", title: `Envío a Domicilio - ${selectedZoneName}`, description: "Servicio de logística",
                quantity: 1, unit_price: payload.metadata.valor_envio, currency_id: "CLP"
            });
        }

        const preferenceData = {
            external_reference: orderId,
            items: mpItems,
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
            const response = await fetch("https://old-brook-bf01.sebjmz.workers.dev/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(preferenceData)
            });
            const data = await response.json();
            if (data.init_point) { window.location.href = data.init_point; } 
            else { throw new Error("No se pudo generar el link de pago."); }
        } catch (error) {
            console.error(error);
            alert("Error al conectar con MercadoPago. Intente nuevamente.");
            window.location.reload();
        }
    }

    function iniciarPayPal() {
        if(cart.length === 0) return alert("El atelier está vacío.");

        if (typeof paypal === 'undefined') {
            alert("El sistema de pago internacional no pudo cargar (posible bloqueo por AdBlock o conexión). Por favor, desactive el bloqueador de anuncios o intente recargar la página.");
            return;
        }

        document.getElementById('payment-selector').style.display = 'none';
        document.getElementById('btn-volver-pago').style.display = 'none';
        
        const paypalContainer = document.getElementById('paypal-container');
        paypalContainer.classList.remove('hidden');
        paypalContainer.style.display = 'block';
        paypalContainer.innerHTML = '';

        const payload = obtenerPayloadOrden();

        paypal.Buttons({
            style: { color: 'gold', shape: 'rect', label: 'pay', height: 45 },
            createOrder: async function() {
                const response = await fetch("https://old-brook-bf01.sebjmz.workers.dev/paypal/create-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ totalCLP: payload.totalCLP, metadata: payload.metadata })
                });
                const orderData = await response.json();
                if (orderData.id) { return orderData.id; } 
                else { throw new Error("Error generando orden de PayPal"); }
            },
            onApprove: async function(data, actions) {
                document.getElementById('paypal-container').style.display = 'none';
                const loader = document.getElementById('loading-payment');
                loader.innerHTML = '<p class="text-[10px] uppercase tracking-widest text-[#c5a059] font-bold animate-pulse">Acreditando pago internacional...</p>';
                loader.style.display = 'block';

                try {
                    const response = await fetch("https://old-brook-bf01.sebjmz.workers.dev/paypal/capture-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ orderID: data.orderID, metadata: payload.metadata })
                    });
                    
                    const captureData = await response.json();
                    
                    if (captureData.status === "COMPLETED") {
                        if (typeof trackGA4 === 'function') {
                            trackGA4('purchase', {
                                transaction_id: captureData.id,
                                currency: 'USD',
                                value: parseFloat(captureData.purchase_units[0].payments.captures[0].amount.value),
                                items: cart.map(item => ({ item_id: String(item.id), item_name: item.name, price: item.price, quantity: item.qty, item_category: 'Ramos Florales (Internacional)' }))
                            });
                        }
                        window.location.href = window.location.origin + "/gracias.html?payment_id=" + captureData.id;
                    } else {
                        alert("El pago no pudo completarse. Por favor, intente de nuevo.");
                        window.location.reload();
                    }
                } catch (error) {
                    console.error(error);
                    alert("Hubo un problema de conexión. Revise su comprobante o intente nuevamente.");
                    window.location.reload();
                }
            },
            onCancel: function (data) { resetearPasarela(); },
            onError: function(err) {
                console.error(err);
                alert("La ventana de PayPal falló o fue bloqueada por el navegador.");
                window.location.reload();
            }
        }).render("#paypal-container");
    }
    
    function resetearPasarela() {
        document.getElementById('loading-payment').style.display = 'none';
        document.getElementById('payment-selector').style.display = 'flex';
        document.getElementById('btn-volver-pago').style.display = 'block';
        const paypalContainer = document.getElementById('paypal-container');
        paypalContainer.style.display = 'none';
        paypalContainer.classList.add('hidden');
        paypalContainer.innerHTML = ''; 
    }

    document.addEventListener('DOMContentLoaded', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentResult = urlParams.get('payment_result');
        const status = urlParams.get('status') || urlParams.get('collection_status');
        
        if (paymentResult === 'success' && status === 'approved') {
            const cartData = JSON.parse(localStorage.getItem('laforesta_cart') || '[]');
            const totalPagado = parseInt(localStorage.getItem('laforesta_shippingCost') || '0') +
                cartData.reduce((a, i) => a + i.price * i.qty, 0);
            const orderId = 'LF-' + Date.now();

            if (typeof trackGA4 === 'function') {
                trackGA4('purchase', {
                    transaction_id: orderId,
                    currency: 'CLP',
                    value: totalPagado,
                    items: cartData.map(item => ({ item_id: String(item.id), item_name: item.name, price: item.price, quantity: item.qty, item_category: 'Ramos Florales' }))
                });
            }

            localStorage.removeItem('pending_laforesta_order');
            localStorage.removeItem('laforesta_cart');
            localStorage.removeItem('laforesta_checkout_inputs');
            localStorage.removeItem('laforesta_checkout_abierto');
            localStorage.removeItem('laforesta_shippingCost');
            localStorage.removeItem('laforesta_selectedZoneName');
            localStorage.removeItem('laforesta_selectedLogistics');
            localStorage.removeItem('laforesta_selectedDate');
            localStorage.removeItem('laforesta_selectedTimeSlot');
            localStorage.removeItem('laforesta_isExpressDelivery');
            localStorage.removeItem('laforesta_selectedPalette');
            cart = [];
            updateCartUI();
            alert("Pago acreditado exitosamente. Recibirá su comprobante y detalles de logística vía correo electrónico.");
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (paymentResult === 'failure' || paymentResult === 'pending' || status === 'rejected' || status === 'cancelled') {
            localStorage.removeItem('pending_laforesta_order');
            alert("El pago no fue acreditado o fue cancelado. Intente nuevamente.");
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        const yearFooter = document.getElementById("year-footer");
        if (yearFooter) { yearFooter.innerText = new Date().getFullYear(); }
        const flow = document.getElementById('garden-flow');
        if (flow) { flow.style.transform = 'translateY(100%)'; }
        updateCartUI();
        restaurarProgresoCheckout();

        if (urlParams.get('action') === 'open_cart') {
            setTimeout(() => {
                const drawer = document.getElementById('atelier-bag');
                if (drawer && !drawer.classList.contains('open')) {
                    toggleCart();
                }
            }, 150);
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // --- INICIALIZACIÓN DE MOTOR 3D Y ANIMACIONES AL CARGAR ---
        const collagePages = document.querySelectorAll('.collage-page');
        
        // 1. LÓGICA PARA PC
        collagePages.forEach(page => {
            page.addEventListener('mouseenter', function() {
                if(window.innerWidth > 1024) {
                    collagePages.forEach(p => p.classList.remove('active-page'));
                    this.classList.add('active-page');
                }
            });
            page.addEventListener('mouseleave', function() {
                if(window.innerWidth > 1024) {
                    this.classList.remove('active-page');
                }
            });
        });

        // 2. LÓGICA PARA MÓVILES (Escáner)
        if (window.innerWidth <= 1024) {
            const observerOptions = {
                root: null, 
                rootMargin: '-35% 0px -35% 0px', 
                threshold: 0
            };

            const scrollObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        collagePages.forEach(p => p.classList.remove('active-page'));
                        entry.target.classList.add('active-page');
                    }
                });
            }, observerOptions);

            collagePages.forEach(page => scrollObserver.observe(page));
        }

        // --- INICIALIZACIÓN DE SLIDER HERO ---
        const heroSlides = document.querySelectorAll('.slide-item');
        if (heroSlides.length > 0) {
            let currentHeroSlide = 0;
            const heroTotalSlides = heroSlides.length;
            const heroDotsContainer = document.getElementById('hero-dots');
            let heroAutoPlay;
            let userInteracted = false; 
            let isAnimating = false;    

            heroSlides.forEach((slide, index) => {
                if (index === 0) {
                    slide.style.transform = 'translate3d(0%, 0, 0)';
                    slide.style.zIndex = '20';
                } else {
                    slide.style.transform = 'translate3d(100%, 0, 0)'; 
                    slide.style.zIndex = '10';
                }
                if (heroDotsContainer) {
                    const dot = document.createElement('button');
                    dot.setAttribute('aria-label', 'Ver diapositiva ' + (index + 1));
                    dot.className = `w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 border border-[#c5a059] ${index === 0 ? 'bg-[#c5a059] scale-125' : 'bg-transparent hover:bg-[#c5a059]/50'}`;
                    dot.onclick = () => {
                        if(isAnimating || currentHeroSlide === index) return;
                        if (typeof window.stopAutoPlay === 'function') window.stopAutoPlay();
                        const direction = index > currentHeroSlide ? 'next' : 'prev';
                        transitionToSlide(index, direction);
                    };
                    heroDotsContainer.appendChild(dot);
                }
            });

            window.stopAutoPlay = function() {
                userInteracted = true;
                clearInterval(heroAutoPlay);
            }

            function transitionToSlide(targetIndex, direction) {
                if (isAnimating) return;
                isAnimating = true;
                const current = heroSlides[currentHeroSlide];
                const next = heroSlides[targetIndex];
                next.style.transition = 'none';
                next.style.zIndex = '20';
                current.style.zIndex = '10';
                
                if (direction === 'next') { next.style.transform = 'translate3d(100%, 0, 0)'; } 
                else { next.style.transform = 'translate3d(-100%, 0, 0)'; }

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        const duration = '0.6s';
                        const timing = 'cubic-bezier(0.16, 1, 0.3, 1)';
                        next.style.transition = `transform ${duration} ${timing}`;
                        current.style.transition = `transform ${duration} ${timing}`;
                        next.style.transform = 'translate3d(0%, 0, 0)';
                        
                        if (direction === 'next') { current.style.transform = 'translate3d(-100%, 0, 0)'; } 
                        else { current.style.transform = 'translate3d(100%, 0, 0)'; }

                        currentHeroSlide = targetIndex;
                        updateDots();
                        animateTexts();

                        setTimeout(() => { isAnimating = false; }, 600); 
                    });
                });
            }

            window.nextHeroSlide = function(manual = false) {
                if (manual && typeof window.stopAutoPlay === 'function') window.stopAutoPlay(); 
                if (isAnimating) return;
                const nextIndex = (currentHeroSlide + 1) % heroTotalSlides;
                transitionToSlide(nextIndex, 'next');
            };

            window.prevHeroSlide = function(manual = false) {
                if (manual && typeof window.stopAutoPlay === 'function') window.stopAutoPlay(); 
                if (isAnimating) return;
                const prevIndex = (currentHeroSlide - 1 + heroTotalSlides) % heroTotalSlides;
                transitionToSlide(prevIndex, 'prev');
            };

            function updateDots() {
                if (!heroDotsContainer) return;
                Array.from(heroDotsContainer.children).forEach((dot, index) => {
                    if(index === currentHeroSlide) {
                        dot.classList.replace('bg-transparent', 'bg-[#c5a059]');
                        dot.classList.add('scale-125');
                    } else {
                        dot.classList.replace('bg-[#c5a059]', 'bg-transparent');
                        dot.classList.remove('scale-125');
                    }
                });
            }

            function animateTexts() {
                heroSlides.forEach((slide, index) => {
                    const elementsToAnimate = slide.querySelectorAll('.slide-anim');
                    if(index === currentHeroSlide) {
                        setTimeout(() => {
                            elementsToAnimate.forEach(el => {
                                el.classList.remove('opacity-0', 'translate-y-4', 'translate-y-8');
                                el.classList.add('opacity-100', 'translate-y-0');
                            });
                        }, 300); 
                    } else {
                        elementsToAnimate.forEach(el => {
                            el.classList.remove('opacity-100', 'translate-y-0');
                            if(el.tagName === 'H2') el.classList.add('opacity-0', 'translate-y-8');
                            else el.classList.add('opacity-0', 'translate-y-4');
                        });
                    }
                });
            }

            animateTexts();
            heroAutoPlay = setInterval(() => {
                if (!userInteracted) { nextHeroSlide(false); }
            }, 8000); 

            const sliderWrapperElement = document.getElementById('slider-wrapper');
            if (sliderWrapperElement) {
                let touchStartX = 0;
                let touchEndX = 0;
                sliderWrapperElement.addEventListener('touchstart', (e) => {
                    touchStartX = e.changedTouches[0].screenX;
                }, { passive: true });
                sliderWrapperElement.addEventListener('touchend', (e) => {
                    touchEndX = e.changedTouches[0].screenX;
                    if (touchEndX < touchStartX - 50) { window.nextHeroSlide(true); }
                    if (touchEndX > touchStartX + 50) { window.prevHeroSlide(true); }
                }, { passive: true });
            }
        }
    });

    function toggleGardenImage() {
        const img1 = document.getElementById('garden-img-1');
        const img2 = document.getElementById('garden-img-2');
        if (!img1 || !img2) return;
        
        if (img1.classList.contains('opacity-100')) {
            img1.classList.replace('opacity-100', 'opacity-0');
            img2.classList.replace('opacity-0', 'opacity-100');
        } else {
            img1.classList.replace('opacity-0', 'opacity-100');
            img2.classList.replace('opacity-100', 'opacity-0');
        }
    }
        
    function updateCountdown() {
        try {
            // Forma segura, nativa y comprobada de obtener la hora exacta de Santiago, Chile
            const now = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Santiago"}));

            if (isNaN(now.getTime())) return;

            // Definimos la hora de corte a las 18:00 del día actual
            const cutoffExpress = new Date(now);
            cutoffExpress.setHours(18, 0, 0, 0);

            const timerEl = document.getElementById('countdown-timer');
            if (!timerEl) return;

            // Si ya pasaron las 18:00 hrs
            if (now >= cutoffExpress) {
                timerEl.innerHTML = "<span class='text-sm tracking-wide'>Envíos a partir de <strong>MAÑANA</strong>.</span>";
                return;
            }

            // Cálculo matemático del tiempo restante hasta las 18:00
            const diff = cutoffExpress - now;
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            // Damos formato HH:MM:SS (añadiendo ceros a la izquierda si es necesario)
            const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            timerEl.innerHTML = `<span class="opacity-60 hidden md:inline">Envío Express (1-2h) cierra en:</span><span class="opacity-60 md:hidden">Express cierra en:</span> <span class="ml-1 font-mono text-[#c5a059] bg-[#c5a059]/10 px-1.5 py-0.5 rounded text-[10px] font-extrabold">${timeString}</span>`;

        } catch(e) {
            console.warn("Contador visual desactivado", e);
        }
    }
setInterval(updateCountdown, 1000);
updateCountdown();

    function escribirMensaje(tipo) {
        const textarea = document.getElementById('card-message');
        if(!textarea) return;
        
        let mensaje = "";
        let opciones = [];

        if (tipo === 'romance') {
            opciones = [
                "Cada pétalo de este ramo me recuerda a un momento a tu lado. Gracias por hacer que mi vida florezca de esta manera. Te amo profundamente.",
                "Dicen que la naturaleza crea obras de arte irrepetibles, pero ninguna se compara con el privilegio de tenerte en mi vida. Eres mi lugar seguro.",
                "Aunque el tiempo pase y las estaciones cambien, lo que siento por ti solo crece y se fortalece. Gracias por ser mi mayor refugio y mi alegría más pura."
            ];
        } else if (tipo === 'condolencias') {
            opciones = [
                "Sé que no hay palabras que puedan aliviar este dolor, pero quiero que sepas que estoy aquí para ti. Que estas flores te abracen en la distancia y te brinden un poco de paz.",
                "Las almas que dejan huella nunca se marchan del todo; florecen en nuestros recuerdos. Con el mayor de los respetos, te acompaño en este difícil momento.",
                "Te envío toda mi fuerza y cariño en este momento de tristeza. Que el amor de quienes te rodean y los recuerdos hermosos te sirvan de consuelo."
            ];
        } else if (tipo === 'agradecimiento') {
            opciones = [
                "Hay gestos que cambian el rumbo de las cosas, y el tuyo fue uno de ellos. Mi más sincero agradecimiento por tu apoyo incondicional; nunca lo olvidaré.",
                "Las palabras a veces quedan cortas para expresar la verdadera gratitud. Espero que este detalle transmita lo mucho que valoro tu tiempo, tu ayuda y tu confianza.",
                "Gracias por estar ahí cuando más lo necesitaba. Es un verdadero privilegio rodearse de personas con tanta calidad humana y un corazón tan noble."
            ];
        } else if (tipo === 'cumpleanos') {
            opciones = [
                "Que este nuevo año de vida florezca con la misma fuerza, luz y alegría que transmite este arreglo. Celebro tu vida hoy y siempre. ¡Muy feliz cumpleaños!",
                "Un nuevo ciclo comienza y no puedo estar más feliz de poder celebrarlo contigo. Que la vida te siga sorprendiendo y te llene de momentos inolvidables.",
                "Brindo por ti, por todo lo que has logrado y por la hermosa energía que compartes con el mundo. Que hoy recibas tanto amor como el que siempre entregas."
            ];
        }

        if (opciones.length > 0) {
            mensaje = opciones[Math.floor(Math.random() * opciones.length)];
        }

        textarea.value = "";
        let i = 0;
        const intervalo = setInterval(() => {
            textarea.value += mensaje.charAt(i);
            i++;
            if (i >= mensaje.length) {
                clearInterval(intervalo);
                if (typeof guardarProgresoCheckout === 'function') {
                    guardarProgresoCheckout(); 
                }
            }
        }, 15);
    }

    function toggleFabMenu() {
        const menu = document.getElementById('fab-menu');
        const icon = document.getElementById('fab-icon');
        if (menu.classList.contains('opacity-0')) {
            menu.classList.remove('opacity-0', 'pointer-events-none', 'invisible', 'translate-y-4');
            menu.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
            icon.style.transform = 'rotate(180deg)';
        } else {
            menu.classList.add('opacity-0', 'pointer-events-none', 'invisible', 'translate-y-4');
            menu.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            icon.style.transform = 'rotate(0deg)';
        }
    }
    </script>
