if(!self.define){let e,n={};const s=(s,c)=>(s=new URL(s+".js",c).href,n[s]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=n,document.head.appendChild(e)}else e=s,importScripts(s),n()})).then((()=>{let e=n[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(c,i)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(n[r])return;let t={};const o=e=>s(e,r),a={module:{uri:r},exports:t,require:o};n[r]=Promise.all(c.map((e=>a[e]||o(e)))).then((e=>(i(...e),t)))}}define(["./workbox-2ba19784"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"apple-touch-icon.png",revision:"a592555702d244463c3110a565bb52a9"},{url:"favicon-48x48.png",revision:"401123d62c82f982cf23a5bb8475972f"},{url:"index.html",revision:"8000cc00f4f108a6db56cfbd9823903d"},{url:"mcq_css.css",revision:"0eda59d73bc471f99ab54c64e7ed7a10"},{url:"mcq_js.js",revision:"d357f8349815e1efd5632421eeaa0fd9"},{url:"web-app-manifest-192x192.png",revision:"4bf361a1529f253035891210d92f5fd0"},{url:"web-app-manifest-512x512.png",revision:"5d3c42b6c41874b42899092de7070ceb"}],{}),e.registerRoute((({request:e})=>"document"===e.destination),new e.StaleWhileRevalidate({cacheName:"html-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute((({request:e})=>"script"===e.destination),new e.StaleWhileRevalidate({cacheName:"js-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute((({request:e})=>"style"===e.destination),new e.StaleWhileRevalidate({cacheName:"css-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:2592e3})]}),"GET")}));
//# sourceMappingURL=sw.js.map
