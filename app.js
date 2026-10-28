const dialog=document.querySelector('#viewer'),slides=document.querySelector('#slides'),count=document.querySelector('#count'),prev=document.querySelector('#prev'),next=document.querySelector('#next');
const galleries={materials:{title:'',images:[6,0,4,5,8,9,10,11,12]},process:{title:'Process · 活动流程',images:[3]},notes:{title:'Notes · 注意事项',images:[7]},concept:{title:'Concept · 概念简要',images:[18]},photos:{title:'ANGEL OR DEVIL · 视觉收藏',images:[5,3,1,2,4,6,7,8,9].map(i=>`photo-${String(i).padStart(2,'0')}`)},style:{title:'WOONSTYLE · 服装细节',images:[17,16]}};
let total=0,current=0,lastFocus,depthMode=false;
function placeCards(container,index){const cards=[...container.children],length=cards.length;cards.forEach((card,i)=>{let offset=(i-index+length)%length;if(offset>length/2)offset-=length;const distance=Math.abs(offset);card.style.setProperty("--offset",offset);card.style.setProperty("--distance",distance);card.style.zIndex=String(20-distance);card.classList.toggle("is-front",distance===0);card.classList.toggle("is-hidden",distance>2);card.setAttribute("aria-hidden",String(distance>2));if(card.tagName==="BUTTON")card.tabIndex=distance>1?-1:0;});}
function updateCount(){count.textContent=`${String(current+1).padStart(2,"0")} / ${String(total).padStart(2,"0")}`;prev.disabled=!depthMode&&current===0;next.disabled=!depthMode&&current===total-1;}
function update(){if(depthMode)return;current=Math.round(slides.scrollLeft/slides.clientWidth);updateCount()}
function openViewer(title,html,index=0,depth=false){lastFocus=document.activeElement;depthMode=depth;current=index;document.querySelector('#viewer-title').textContent=title;slides.classList.toggle('depth-viewer',depth);slides.innerHTML=html;dialog.classList.toggle('quotes-only',Boolean(slides.querySelector('.quote-scene')));total=slides.children.length;dialog.showModal();document.body.style.overflow='hidden';if(depth){slides.scrollLeft=0;placeCards(slides,current);[...slides.children].forEach((card,i)=>card.onclick=()=>{current=i;placeCards(slides,current);updateCount()})}else slides.scrollLeft=index*slides.clientWidth;updateCount();document.querySelector('#close').focus()}
function imageSlides(images,title,concept=false){return images.map((id,index)=>`<div class="slide"><img class="${concept?'concept-text':''}" src="assets/${typeof id==='number'?String(id).padStart(2,'0'):id}.webp" alt="${title || '物料详情'} ${index+1}"></div>`).join('')}
document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{const g=galleries[button.dataset.gallery];openViewer(g.title,imageSlides(g.images,g.title,button.dataset.gallery==='concept'),Number(button.dataset.index||0),button.dataset.gallery==='photos')}));
const quoteTexts=[["我觉得就算永远不成为大人也没关系哦", "永远不成为大人"], ["我会做一辈子的爱豆，所以请你做我一辈子的粉丝吧", "一辈子"], ["青春是只要相信就不会离开的季节", "青春"], ["就算是自私，也拜托要一直在一起哦", "一直在一起"], ["如果在今天，ONEDOOR能够因为我而微笑，哪怕只有一次我也会很开心的。\n如果我能成为ONEDOOR一天中的一点小小的光亮，那我就足够满足了", "一点小小的光亮"], ["我总是向onedoor说“我要登上顶峰”，而你们又一直用爱支持着这样的我，\n所以我衷心希望所有的onedoor都能实现心中所愿——在这条路上，\n无论我们（或我）成为怎样的存在都不重要，\n我只希望能成为你们幸福的某个支点就够了。", "幸福的某个支点"], ["我知道，有时可能会因为现实生活中一些无法避免的情况你们会暂时忘记我们，\n你们随时都可以来敲我们的门，我们会笑着和你打招呼，\n以后在累的时候，想哭、想笑、伤心的，生气的时候，\n在任何你需要的时候我们依旧会陪伴在大家身边，成为大家的青春。", "成为大家的青春"], ["想成为你们幸福时会想起的咖啡馆，睡前裹紧的被子，\n无论以什么方式，都能在大家追梦路上注入力量的人", "注入力量"], ["也许这个世界偶尔会让你觉得冰冷孤单，但请随时放心地靠向我吧！\n十年也好，398年也好，我都会站在这里，希望你们永远把我当作\n“能紧紧拥抱的人”", "能紧紧拥抱的人"]];
function escapeQuote(text){return text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}
function quoteSlides(){return quoteTexts.map(([text,highlight],i)=>{const words=escapeQuote(text).replaceAll(escapeQuote(highlight),`<em>${escapeQuote(highlight)}</em>`);return `<div class="slide quote-scene"><article class="themed-quote ${text.length>65?'long-quote':''}" aria-label="金云鹤语录 ${i+1}"><blockquote>${words.split('\n').map(line=>`<p>${line}</p>`).join('')}</blockquote></article></div>`}).join('')}
document.querySelector('#quotes').onclick=()=>openViewer('WOONHAK’S QUOTES',quoteSlides(),0,true);
document.querySelector('#location').onclick=()=>openViewer('生咖地址',`<div class="slide"><article class="text-panel"><h2>ThreeH Records</h2><p>2026年11月21日<br>13:00—17:30</p><p>重庆市两江新区龙塔街道上域街5号附40号观恒上域3幢1层-商业3号</p><a href="https://uri.amap.com/search?keyword=ThreeH%20Records%20%E9%87%8D%E5%BA%86" target="_blank" rel="noopener">在地图中搜索 ThreeH Records ↗</a></article></div>`);
function move(n){if(depthMode){current=(current+n+total)%total;placeCards(slides,current);updateCount()}else slides.scrollTo({left:(current+n)*slides.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
prev.onclick=()=>move(-1);next.onclick=()=>move(1);slides.addEventListener('scroll',update,{passive:true});document.querySelector('#close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{document.body.style.overflow='';lastFocus?.focus()});dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}});window.addEventListener('resize',()=>{if(dialog.open&&!depthMode)slides.scrollLeft=current*slides.clientWidth});
const photoStage=document.querySelector('.photo-strip');let photoIndex=1;const photoButtons=[...photoStage.children];photoStage.setAttribute('aria-label','金云鹤照片轮播');placeCards(photoStage,photoIndex);
photoButtons.forEach((button,i)=>{button.addEventListener('click',e=>{if(i!==photoIndex){e.stopImmediatePropagation();photoIndex=i;placeCards(photoStage,photoIndex);document.querySelector('#photo-count').textContent=`${i+1} / ${photoButtons.length}`;}},true)});
function turnPhoto(n){photoIndex=(photoIndex+n+photoButtons.length)%photoButtons.length;placeCards(photoStage,photoIndex);document.querySelector('#photo-count').textContent=`${photoIndex+1} / ${photoButtons.length}`;}
document.querySelector('#photo-prev').onclick=()=>turnPhoto(-1);document.querySelector('#photo-next').onclick=()=>turnPhoto(1);
photoStage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();turnPhoto(e.key==='ArrowRight'?1:-1)}});
function enableDepthSwipe(stage,onTurn,isEnabled=()=>true){
 let gesture=null,suppressClickUntil=0;
 stage.addEventListener('pointerdown',event=>{
  if(!isEnabled()||!event.isPrimary||(event.pointerType==='mouse'&&event.button!==0))return;
  gesture={id:event.pointerId,x:event.clientX,y:event.clientY,horizontal:false};
 });
 stage.addEventListener('pointermove',event=>{
  if(!gesture||event.pointerId!==gesture.id)return;
  const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
  if(!gesture.horizontal){
   if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){gesture=null;return;}
   if(Math.abs(dx)<10||Math.abs(dx)<=Math.abs(dy))return;
   gesture.horizontal=true;stage.setPointerCapture(event.pointerId);stage.classList.add('is-dragging');
  }
  event.preventDefault();
 });
 function finish(event,cancelled=false){
  if(!gesture||event.pointerId!==gesture.id)return;
  const drag=gesture;gesture=null;stage.classList.remove('is-dragging');
  if(stage.hasPointerCapture(event.pointerId))stage.releasePointerCapture(event.pointerId);
  if(!drag.horizontal)return;
  suppressClickUntil=Date.now()+400;
  const dx=event.clientX-drag.x;
  if(!cancelled&&Math.abs(dx)>=Math.min(60,Math.max(30,stage.clientWidth*.08)))onTurn(dx<0?1:-1);
 }
 stage.addEventListener('pointerup',event=>finish(event));
 stage.addEventListener('pointercancel',event=>finish(event,true));
 stage.addEventListener('lostpointercapture',()=>{gesture=null;stage.classList.remove('is-dragging')});
 stage.addEventListener('click',event=>{if(Date.now()<suppressClickUntil){event.preventDefault();event.stopImmediatePropagation()}},true);
 stage.addEventListener('dragstart',event=>{if(isEnabled())event.preventDefault()});
}
enableDepthSwipe(photoStage,turnPhoto);
enableDepthSwipe(slides,move,()=>dialog.open&&depthMode);
