if(!self.define){let e,r={};const i=(i,s)=>(i=new URL(i+".js",s).href,r[i]||new Promise((r=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=r,document.head.appendChild(e)}else e=i,importScripts(i),r()})).then((()=>{let e=r[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(s,l)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(r[n])return;let t={};const o=e=>i(e,n),d={module:{uri:n},exports:t,require:o};r[n]=Promise.all(s.map((e=>d[e]||o(e)))).then((e=>(l(...e),t)))}}define(["./workbox-db5fc017"],(function(e){"use strict";e.setCacheNameDetails({prefix:"@gogoend/svg-filter-graph-builder"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"/svg-filter-graph-builder/css/app.4c72495d.css",revision:null},{url:"/svg-filter-graph-builder/css/chunk-vendors.7f0b87ef.css",revision:null},{url:"/svg-filter-graph-builder/demo/assets/rinkysplash.jpg",revision:"27a21317142f839653a0094d535496e5"},{url:"/svg-filter-graph-builder/demo/index.html",revision:"c96ce04e7d90ad9264467f526b520e59"},{url:"/svg-filter-graph-builder/index.html",revision:"83337dc777b0ab4f431249b85709b8cc"},{url:"/svg-filter-graph-builder/js/app.19fb1387.js",revision:null},{url:"/svg-filter-graph-builder/js/chunk-vendors.ca436cef.js",revision:null},{url:"/svg-filter-graph-builder/manifest.json",revision:"8d32804a8e9ad0575203ab645cfd448d"},{url:"/svg-filter-graph-builder/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"},{url:"/svg-filter-graph-builder/runtime-config.json",revision:"b167d76e73d1c1972388e6acbed7bf58"}],{})}));
