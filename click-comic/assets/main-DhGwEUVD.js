import"./modulepreload-polyfill-B5Qt9EMX.js";class s{constructor(c){this.container=c}async render(){const c=await fetch("/comics/index.json").then(e=>e.json()),n=await Promise.all(c.map(async e=>{const o=await fetch(`/comics/${e}/comic.json`).then(r=>r.json());return{slug:e,manifest:o}}));this.container.innerHTML="";for(const e of n)this.container.appendChild(a(e))}}function a({slug:t,manifest:c}){const n=encodeURIComponent(t),e=document.createElement("a");return e.className="comic-card",e.href=`viewer.html?comic=${n}`,e.style.backgroundColor=c.bgColor,e.innerHTML=`
    <div class="comic-card-cover">
      <img src="/comics/${n}/${c.panels[0].src}" alt="">
    </div>
    <div class="comic-card-body">
      <h3></h3>
      <span></span>
    </div>
  `,e.querySelector("img").alt=c.title,e.querySelector("h3").textContent=c.title,e.querySelector("span").textContent=`${c.panels.length} panels`,e}new s(document.getElementById("gallery")).render();
