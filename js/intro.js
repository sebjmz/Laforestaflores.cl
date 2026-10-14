/* La Foresta – intro de 3 s la primera vez que el visitante abre un arreglo (producto). */
(function(){
  var SEEN='lf_intro_visto', ARRIVE='lf_intro_in', MS=3000, VEIL=0.82;
  var CAT={
    'cojin-de-condolencias':'funebre','cubre-urna-sublime':'funebre','esperanza':'funebre','luz-del-alba':'funebre','luz-infinita':'funebre',
    'sereno':'funebre','suave-amanecer':'funebre','corona-memorial-premium':'funebre','pedestal-de-honor':'funebre',
    'amor-delicado':'romance','amor-eterno':'romance','susurro-de-amor':'romance','susurro-rose':'romance','dulce-amor':'romance',
    'golden-bloom':'celebra','jardin-de-verano':'celebra','pasion-de-sol':'celebra','encanto-vivo':'celebra',
    'destello-de-primavera':'celebra','bienvenida-primavera':'celebra','luz-de-primavera':'celebra',
    'brisa-de-primavera':'corp','luz-de-atardecer':'corp','monte-mar-signature':'corp'
  };
  var VID={romance:'romance',funebre:'funebre',celebra:'celebraciones',corp:'corporativo',regalo:'regalos'};
  var GEN=['Cultivando pequeños grandes momentos…','Consultando al comité de pétalos…','Cada pedido incluye seguimiento y una foto real del arreglo terminado.','4,9 estrellas en Google y más de 120 reseñas.','Hay cosas que florecen mejor con flores.','Un pequeño paseo por el lado más bonito de la vida…','La belleza está en los detalles. Y en los pétalos.'];
  var MSG={
    romance:['Hay emociones que merecen flores.','El lenguaje de las flores nunca pasa de moda.','Un clásico: las rosas siempre tienen algo que decir.','Algunas emociones tienen su propio lenguaje.'],
    funebre:['Hay momentos en que las flores hablan por nosotros.','Un gesto delicado para acompañar en momentos difíciles.','Arreglos florales para ceremonias y homenajes.'],
    celebra:['Siempre hay algo bonito que celebrar.','La vida tiene más color cuando se celebra.','Un cumpleaños, un aniversario o simplemente porque sí.'],
    corp:['Los buenos detalles también hablan de tu empresa.','La primera impresión puede florecer.','Elegancia en cada detalle.'],
    regalo:['No es solo un regalo. Es la experiencia de recibirlo.','Los detalles hacen que un regalo sea inolvidable.','Hay formas de regalar que dicen mucho más.']
  };
  var PAGECAT={'condolencias':'funebre','coronas-funebres':'funebre','flores-parque-del-mar':'funebre','flores-para-velorio-vina-del-mar':'funebre','flores-iglesias-vina-del-mar':'funebre','romance-aniversario':'romance','celebraciones':'celebra','flores-eventos-vina-del-mar':'celebra','flores-licenciatura-vina-del-mar':'celebra','corporativo':'corp','regalos-premium-completos':'regalo'};
  function pick(a){return a[Math.floor(Math.random()*a.length)]}
  function phrase(c){if(c==='funebre')return pick(MSG.funebre);if(!MSG[c])return pick(GEN);return Math.random()<1/3?pick(GEN.slice(0,4)):pick(MSG[c])}
  function slug(p){return (p.split('/').pop()||'').replace(/\.html$/,'')}
  function catOf(p){return CAT[slug(p)]}
  function get(k,s){try{return (s||localStorage).getItem(k)}catch(_){return '1'}}
  function set(k,s){try{(s||localStorage).setItem(k,'1')}catch(_){}}
  var saveData=!!(navigator.connection&&navigator.connection.saveData);
  var reduce=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
  var EXT=(function(){try{return document.createElement('video').canPlayType('video/webm; codecs="vp9"')?'webm':'mp4'}catch(_){return 'mp4'}})();
  var blobs={},pending={};
  function preload(c){ // descarga el video a memoria (blob) para que esté listo antes del clic
    var v=VID[c]; if(!v||saveData||blobs[v]||pending[v])return;
    pending[v]=fetch('/assets/intro/'+v+'.'+EXT).then(function(r){return r.ok?r.blob():null}).then(function(b){if(b)blobs[v]=URL.createObjectURL(b)}).catch(function(){});
    var i=new Image();i.src='/assets/intro/'+v+'_poster.webp';
  }
  var css='#lfc{position:fixed;inset:0;z-index:2147483646;background:#fbf8f1;color:#0a1f1c;cursor:pointer;opacity:0;transition:opacity .25s ease;-webkit-tap-highlight-color:transparent}#lfc.on{opacity:1}'+
  '#lfc .bg,#lfc .vid,#lfc .veil{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none}#lfc .bg{background:center/cover no-repeat}#lfc .vid{opacity:0;transition:opacity .5s ease}#lfc .vid.ok{opacity:1}'+
  '#lfc .veil{background:radial-gradient(ellipse at center,rgba(251,248,241,'+(VEIL+.1)+') 0%,rgba(251,248,241,'+VEIL+') 45%,rgba(251,248,241,'+(VEIL-.12)+') 100%)}'+
  '#lfc .st{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 6vw;pointer-events:none;opacity:0;transform:translateY(12px);transition:opacity .8s ease,transform 1s cubic-bezier(.2,.7,.2,1)}#lfc .st.v{opacity:1;transform:none}'+
  '#lfc .st>span{display:block;max-width:720px}'+
  '#lfc .name span{font:400 clamp(2rem,5vw,4.5rem)/1 "Cormorant Garamond",Georgia,serif;letter-spacing:.38em;padding-left:.38em}'+
  '#lfc .ph span{font:italic 400 clamp(1.4rem,3vw,2.6rem)/1.35 "Cormorant Garamond",Georgia,serif}'+
  '#lfc .end span{font:400 clamp(1.3rem,2.6vw,2.3rem)/1.35 "Cormorant Garamond",Georgia,serif;letter-spacing:.03em}'+
  '#lfc .bar{position:absolute;left:50%;top:calc(50% + clamp(70px,9vw,130px));width:min(420px,70vw);height:3px;transform:translateX(-50%);background:rgba(10,31,28,.16);overflow:hidden}'+
  '#lfc .fill{height:100%;width:100%;transform-origin:left center;transform:scaleX(0);background:#b8913f}'+
  '#lfc .skip{position:fixed;left:50%;transform:translateX(-50%);bottom:max(28px,calc(env(safe-area-inset-bottom) + 16px));font:600 12px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.12em;text-transform:uppercase;background:#0a1f1c;color:#fbf8f1;border:1px solid #0a1f1c;border-radius:999px;padding:14px 26px;cursor:pointer;white-space:nowrap;box-shadow:0 6px 18px rgba(10,31,28,.18);transition:background .2s,color .2s,box-shadow .2s;touch-action:manipulation;z-index:2}'+
  '#lfc .skip:hover{background:#fbf8f1;color:#0a1f1c;box-shadow:0 8px 22px rgba(10,31,28,.22)}#lfc .skip:focus-visible{outline:2px solid #c5a059;outline-offset:3px}'+
  '@media (prefers-reduced-motion:reduce){#lfc,#lfc .st,#lfc .vid{transition:none;transform:none}}';
  function font(){
    if(document.getElementById('lfc-font'))return;
    var t=encodeURIComponent('LAFORESTAabcdefghijklmnopqrstuvwxyzáéíóúñ ABCDEFGHIJKLMNOPQRSTUVWXYZ….,:0123456789');
    var l=document.createElement('link');l.id='lfc-font';l.rel='stylesheet';
    l.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap&text='+t;
    document.head.appendChild(l);
  }
  var o=null;
  function show(href){
    if(o)return;
    var c=catOf(new URL(href,location.href).pathname)||'general', v=VID[c];
    font(); preload(c);
    try{var pf=document.createElement('link');pf.rel='prefetch';pf.href=href;document.head.appendChild(pf);fetch(href,{credentials:'same-origin'}).catch(function(){})}catch(_){}
    if(!document.getElementById('lfc-css')){var st=document.createElement('style');st.id='lfc-css';st.textContent=css;document.head.appendChild(st)}
    o=document.createElement('div');o.id='lfc';o.setAttribute('role','status');o.setAttribute('aria-live','polite');
    var media='';
    if(v){
      var p='/assets/intro/'+v;
      media='<div class="bg" style="background-image:url('+p+'_poster.webp)"></div>'+(saveData?'':'<video class="vid" muted playsinline preload="auto" poster="'+p+'_poster.webp"></video>')+'<div class="veil"></div>';
    }
    o.innerHTML=media+'<div class="st ph"><span></span></div><div class="bar"><div class="fill"></div></div><button class="skip" type="button">Saltar introducción →</button>';
    o.querySelector('.ph span').textContent=phrase(c);
    document.body.appendChild(o);o.getBoundingClientRect();o.classList.add('on');
    var steps=o.querySelectorAll('.st'),fill=o.querySelector('.fill'),done=false,started=false,timers=[],raf=0;
    function step(i){for(var k=0;k<steps.length;k++)steps[k].classList.toggle('v',k===i)}
    requestAnimationFrame(function(){requestAnimationFrame(function(){step(0)})});
    var vid=o.querySelector('.vid');
    function begin(){ // arranca los 3 s exactos: barra 0→100 % con rAF + pasos
      if(started||done)return;started=true;
      var t0=performance.now();
      (function tick(now){var k=Math.min(1,((now||performance.now())-t0)/MS);fill.style.transform='scaleX('+k+')';if(k<1&&!done)raf=requestAnimationFrame(tick)})(t0);
      timers.push(setTimeout(go,MS));
    }
    if(vid){
      vid.muted=true;vid.defaultMuted=true;vid.playsInline=true;vid.setAttribute('muted','');
      var vv=VID[c];
      function src(){vid.src=blobs[vv]||('/assets/intro/'+vv+'.'+EXT);var pr=vid.play();if(pr&&pr.catch)pr.catch(function(){})}
      if(blobs[vv])src();else if(pending[vv])pending[vv].then(function(){if(!done&&!vid.src)src()});else src();
      setTimeout(function(){if(!vid.src)src()},250);
      vid.addEventListener('playing',function(){vid.classList.add('ok');begin()},{once:true});
      vid.addEventListener('canplay',function(){var pr=vid.play();if(pr&&pr.catch)pr.catch(function(){})},{once:true});
      timers.push(setTimeout(begin,600)); // como máximo 600 ms esperando el video (se ve el póster)
    } else begin();
    function go(){if(done)return;done=true;cancelAnimationFrame(raf);timers.forEach(clearTimeout);set(ARRIVE,sessionStorage);location.href=href}
    o.addEventListener('pointerdown',function(e){e.preventDefault();go()});
    o.addEventListener('click',go);
    o.querySelector('.skip').addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}});
  }
  addEventListener('pageshow',function(e){ if(e.persisted&&o){o.remove();o=null} }); // Atrás (bfcache): no dejar el overlay pegado
  function linkOf(e){var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return null;var u=new URL(a.href,location.href);return (u.origin===location.origin&&catOf(u.pathname))?u:null}
  function hint(e){if(get(SEEN))return;var u=linkOf(e);if(u)preload(catOf(u.pathname))}
  document.addEventListener('pointerover',hint,{passive:true});
  document.addEventListener('touchstart',hint,{passive:true});
  document.addEventListener('pointerdown',hint,{passive:true});
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
    if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank'||a.hasAttribute('download'))return;
    var u=new URL(a.href,location.href);
    if(u.origin!==location.origin||u.pathname===location.pathname||!catOf(u.pathname))return;
    if(get(SEEN))return;
    set(SEEN);e.preventDefault();show(u.href);
  });
  // Precarga en reposo del video de la categoría probable de esta página
  if(!get(SEEN)){var lc=PAGECAT[slug(location.pathname)]||catOf(location.pathname);if(lc){var idle=window.requestIdleCallback||function(f){setTimeout(f,1500)};addEventListener('load',function(){idle(function(){preload(lc)})})}}
  // Prueba: ?intro=1 fuerza la intro en esta página; ?intro=reset borra la marca
  try{var q=new URLSearchParams(location.search).get('intro');
    if(q){var clean=location.pathname+location.hash;
      if(q==='reset'){localStorage.removeItem(SEEN);history.replaceState(null,'',clean)}
      else if(q==='1'){var run=function(){show(clean)};if(document.body)run();else addEventListener('DOMContentLoaded',run)}}
  }catch(_){}
  window.LFIntro=show;
})();
