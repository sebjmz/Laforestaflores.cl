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
  function pick(a){return a[Math.floor(Math.random()*a.length)]}
  function phrase(c){if(c==='funebre')return pick(MSG.funebre);if(!MSG[c])return pick(GEN);return Math.random()<1/3?pick(GEN.slice(0,4)):pick(MSG[c])}
  function slug(p){return (p.split('/').pop()||'').replace(/\.html$/,'')}
  function catOf(p){return CAT[slug(p)]}
  function get(k,s){try{return (s||localStorage).getItem(k)}catch(_){return '1'}}
  function set(k,s){try{(s||localStorage).setItem(k,'1')}catch(_){}}
  var css='#lfc{position:fixed;inset:0;z-index:2147483646;background:#fbf8f1;color:#0a1f1c;cursor:pointer;opacity:0;transition:opacity .25s ease;-webkit-tap-highlight-color:transparent}#lfc.on{opacity:1}'+
  '#lfc .bg,#lfc .vid,#lfc .veil{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none}#lfc .bg{background:center/cover no-repeat}#lfc .vid{opacity:0;transition:opacity .5s ease}#lfc .vid.ok{opacity:1}'+
  '#lfc .veil{background:radial-gradient(ellipse at center,rgba(251,248,241,'+(VEIL+.1)+') 0%,rgba(251,248,241,'+VEIL+') 45%,rgba(251,248,241,'+(VEIL-.12)+') 100%)}'+
  '#lfc .st{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 36px;pointer-events:none;opacity:0;transform:translateY(8px);transition:opacity .45s ease,transform .6s ease}#lfc .st.v{opacity:1;transform:none}'+
  '#lfc .name{font:400 26px/1 "Cormorant Garamond",Georgia,serif;letter-spacing:.42em;padding-left:.42em}'+
  '#lfc .ph{font:italic 400 23px/1.4 "Cormorant Garamond",Georgia,serif;max-width:330px;margin:0 auto}'+
  '#lfc .end{font:400 21px/1.4 "Cormorant Garamond",Georgia,serif;letter-spacing:.04em}'+
  '#lfc .bar{position:absolute;left:50%;top:calc(50% + 62px);width:min(56vw,240px);height:1.5px;transform:translateX(-50%);background:#0a1f1c26}'+
  '#lfc .fill{height:100%;transform-origin:left;transform:scaleX(0);background:#b8913f;animation:lfcfill '+MS+'ms linear forwards}@keyframes lfcfill{to{transform:scaleX(1)}}'+
  '#lfc .skip{position:absolute;left:50%;transform:translateX(-50%);bottom:max(32px,env(safe-area-inset-bottom));font:500 11px system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;background:none;border:0;padding:14px 18px;color:#0a1f1c;opacity:.65;cursor:pointer;white-space:nowrap;outline:none;touch-action:manipulation}#lfc .skip:focus-visible{outline:1px solid #b8913f;outline-offset:2px}'+
  '@media (prefers-reduced-motion:reduce){#lfc,#lfc .st{transition:none;transform:none}#lfc .fill{animation:none;transform:none}}';
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
    font();
    try{var pf=document.createElement('link');pf.rel='prefetch';pf.href=href;document.head.appendChild(pf);fetch(href,{credentials:'same-origin'}).catch(function(){})}catch(_){}
    if(!document.getElementById('lfc-css')){var st=document.createElement('style');st.id='lfc-css';st.textContent=css;document.head.appendChild(st)}
    o=document.createElement('div');o.id='lfc';o.setAttribute('role','status');o.setAttribute('aria-live','polite');
    var media='';
    if(v){
      var p='/assets/intro/'+v, lite=(navigator.connection&&navigator.connection.saveData)||matchMedia('(prefers-reduced-motion: reduce)').matches;
      media='<div class="bg" style="background-image:url('+p+'_poster.webp)"></div>'+(lite?'':'<video class="vid" muted autoplay playsinline preload="auto" poster="'+p+'_poster.webp"><source src="'+p+'.webm" type="video/webm"><source src="'+p+'.mp4" type="video/mp4"></video>')+'<div class="veil"></div>';
    }
    o.innerHTML=media+'<div class="st name">LA FORESTA</div><div class="st ph"></div><div class="st end">Descubre tu próximo detalle.</div><div class="bar"><div class="fill"></div></div><button class="skip" type="button">Saltar introducción →</button>';
    o.querySelector('.ph').textContent=phrase(c);
    document.body.appendChild(o);o.getBoundingClientRect();o.classList.add('on');
    var vid=o.querySelector('.vid');
    if(vid){vid.muted=true;var ok=function(){vid.classList.add('ok')};vid.addEventListener('canplay',ok,{once:true});if(vid.readyState>=3)ok();var pr=vid.play();if(pr&&pr.catch)pr.catch(function(){})}
    var steps=o.querySelectorAll('.st'),done=false,timers=[];
    function step(i){for(var k=0;k<steps.length;k++)steps[k].classList.toggle('v',k===i)}
    step(0);
    timers.push(setTimeout(function(){step(1)},1000),setTimeout(function(){step(2)},2000),setTimeout(go,MS));
    function go(){if(done)return;done=true;timers.forEach(clearTimeout);set(ARRIVE,sessionStorage);location.href=href}
    o.addEventListener('pointerdown',function(e){e.preventDefault();go()});
    o.addEventListener('click',go);
    o.querySelector('.skip').addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}});
  }
  addEventListener('pageshow',function(e){ if(o){o.remove();o=null} }); // Atrás (bfcache): no dejar el overlay pegado
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
    if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank'||a.hasAttribute('download'))return;
    var u=new URL(a.href,location.href);
    if(u.origin!==location.origin||u.pathname===location.pathname||!catOf(u.pathname))return;
    if(get(SEEN))return;
    set(SEEN);e.preventDefault();show(u.href);
  });
  window.LFIntro=show;
})();
