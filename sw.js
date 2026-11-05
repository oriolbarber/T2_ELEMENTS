// Memòria cau per jugar sense connexió.
// Pàgines: primer la xarxa (així sempre arriba la versió nova) i, sense connexió, la còpia guardada.
// Icones i altres fitxers: primer la còpia guardada.
const C="t2-jocs-v5";
const FILES=["./","./index.html","./escriptori.html","./manifest.json","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET")return;
  const isPage=req.mode==="navigate"||req.destination==="document"||/\.html$|\/$/.test(new URL(req.url).pathname);
  if(isPage){
    e.respondWith(fetch(req).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(req,cp));return res}).catch(()=>caches.match(req).then(r=>r||caches.match("./index.html"))));
  }else{
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(req,cp));return res})));
  }
});
