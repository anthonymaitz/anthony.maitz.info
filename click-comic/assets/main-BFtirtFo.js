import"./modulepreload-polyfill-B5Qt9EMX.js";class i{constructor(e){this.container=e}async render(){const e=await fetch("/click-comic/comics/index.json").then(c=>c.json()),n=await Promise.all(e.map(async c=>{const o=await fetch(`/click-comic/comics/${c}/comic.json`).then(r=>r.json());return{slug:c,manifest:o}}));this.container.innerHTML="";for(const c of n)this.container.appendChild(s(c))}}function s({slug:t,manifest:e}){const n=encodeURIComponent(t),c=document.createElement("a");return c.className="comic-card",c.href=`viewer.html?comic=${n}`,c.style.backgroundColor=e.bgColor,c.innerHTML=`
    <div class="comic-card-cover">
      <img src="/click-comic/comics/${n}/${e.panels[0].src}" alt="">
    </div>
    <div class="comic-card-body">
      <h3></h3>
      <span></span>
    </div>
  `,c.querySelector("img").alt=e.title,c.querySelector("h3").textContent=e.title,c.querySelector("span").textContent=`${e.panels.length} panels`,c}new i(document.getElementById("gallery")).render();
