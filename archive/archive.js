(()=>{'use strict';
const ko=document.documentElement.lang==='ko',base=ko?'../../':'../';
const t=ko?{all:'전체 연도',search:'기사 제목 검색',count:'건의 기사',none:'검색 결과가 없습니다.',fail:'기사 목록을 불러올 수 없습니다.',page:'페이지'}:{all:'All years',search:'Search article headlines',count:'articles',none:'No articles match your search.',fail:'Could not load articles.',page:'Page'};
const $=s=>document.querySelector(s),search=$('#search'),years=$('#years'),list=$('#list'),count=$('#count'),prev=$('#prev'),next=$('#next'),pageText=$('#page');
const perPage=15;let all=[],page=1;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){
const q=search.value.trim().toLocaleLowerCase(),y=years.value;
const matches=all.filter(a=>(!y||(a.isoDate||'').slice(0,4)===y)&&(!q||String(a.title||'').toLocaleLowerCase().includes(q)||String(a.titleKo||'').toLocaleLowerCase().includes(q)));
const pages=Math.max(1,Math.ceil(matches.length/perPage));page=Math.max(1,Math.min(page,pages));
count.textContent=matches.length+' '+t.count;
const subset=matches.slice((page-1)*perPage,page*perPage);
list.innerHTML=subset.length?subset.map(a=>{
const title=ko&&a.titleKo?a.titleKo:a.title;
const url=/^https:\/\/www\.koreaherald\.com\/article\/\d+(?:[/?#].*)?$/.test(a.url||'')?a.url:'#';
const im=a.image&&/^https?:\/\//.test(a.image)?a.image:base+'assets/placeholder.svg';
const date=ko&&a.dateKo?a.dateKo:(a.date||'');
return '<article class="item"><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer"><img class="image" loading="lazy" alt="" referrerpolicy="no-referrer" src="'+esc(im)+'"></a><div><h3 class="title"><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(title)+'</a></h3><time class="date"'+(a.isoDate?' datetime="'+esc(a.isoDate)+'"':'')+'>'+esc(date)+'</time></div></article>';
}).join(''):'<p class="lede">'+t.none+'</p>';
list.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{if(img.dataset.fallback)return;img.dataset.fallback='1';img.src=base+'assets/placeholder.svg';img.removeAttribute('referrerpolicy')},{once:true}));
prev.disabled=page<=1;next.disabled=page>=pages;pageText.textContent=t.page+' '+page+' / '+pages;
}
search.placeholder=t.search;
search.addEventListener('input',()=>{page=1;render()});years.addEventListener('change',()=>{page=1;render()});
prev.addEventListener('click',()=>{page--;render()});next.addEventListener('click',()=>{page++;render()});
fetch(base+'data/articles.json?v='+Date.now(),{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(d=>{
all=(Array.isArray(d.articles)?d.articles:[]).filter(a=>a&&a.title&&a.url).sort((a,b)=>Number(b.id)-Number(a.id));
const ys=[...new Set(all.map(a=>(a.isoDate||'').slice(0,4)).filter(y=>/^\d{4}$/.test(y)))].sort().reverse();
years.innerHTML='<option value="">'+t.all+'</option>'+ys.map(y=>'<option value="'+y+'">'+y+'</option>').join('');
render();
}).catch(e=>{list.textContent=t.fail;count.textContent='';console.warn('Archive error',e)});
})();
