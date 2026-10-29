const imageFormats={"03.webp":"03.jpg","15.webp":"15.jpg","quote-02.webp":"quote-02.png","photo-02.webp":"photo-02.jpg","19.webp":"19.jpg","18.webp":"18.jpg","photo-03.webp":"photo-03.jpg","quote-03.webp":"quote-03.png","14.webp":"14.jpg","02.webp":"02.png","photo-04.webp":"photo-04.jpg","09.webp":"09.jpg","quote-08.webp":"quote-08.png","photo-08.webp":"photo-08.jpg","05.webp":"05.jpg","13.webp":"13.jpg","quote-04.webp":"quote-04.png","quote-05.webp":"quote-05.png","12.webp":"12.jpg","04.webp":"04.jpg","photo-09.webp":"photo-09.jpg","quote-09.webp":"quote-09.png","08.webp":"08.jpg","photo-05.webp":"photo-05.jpg","photo-06.webp":"photo-06.jpg","quote-06.webp":"quote-06.png","11.webp":"11.jpg","07.webp":"07.jpg","06.webp":"06.jpg","10.webp":"10.jpg","quote-07.webp":"quote-07.png","photo-07.webp":"photo-07.jpg","17.webp":"17.jpg","01.webp":"01.jpg","photo-01.webp":"photo-01.jpg","00.webp":"00.jpg","16.webp":"16.jpg","quote-01.webp":"quote-01.png"};
function imageAsset(id){const name=(typeof id==='number'?String(id).padStart(2,'0'):id)+'.webp';return 'assets/'+imageFormats[name]}
const dialog=document.querySelector('#viewer'),slides=document.querySelector('#slides');
const galleries={materials:{title:'',images:[6,0,4,5,8,9,10,11,12]},process:{title:'Process · 活动流程',images:[3]},notes:{title:'Notes · 注意事项',images:[7]},concept:{title:'Concept · 概念简要',images:[18]},photos:{title:'ANGEL OR DEVIL · 视觉收藏',images:[5,3,1,2,4,6,7,8,9].map(i=>`photo-${String(i).padStart(2,'0')}`)},style:{title:'WOONSTYLE · 服装细节',images:[17,16]}};
let total=0,current=0,lastFocus,depthMode=false;
function loadNearby(container,index){
 if(container.id!=='slides'&&container.dataset.ready!=='true')return;
 const cards=[...container.children],length=cards.length;
 cards.forEach((card,i)=>{let distance=Math.abs(i-index);distance=Math.min(distance,length-distance);if(distance>1)return;const image=card.querySelector('img[data-src]');if(image){image.src=image.dataset.src;delete image.dataset.src}});
}
function placeCards(container,index,progress=0){const cards=[...container.children],length=cards.length;cards.forEach((card,i)=>{let offset=(i-index+length)%length;if(offset>length/2)offset-=length;offset+=progress;const distance=Math.abs(offset);card.style.setProperty("--offset",offset);card.style.setProperty("--distance",distance);card.style.zIndex=String(Math.round(200-distance*10));card.classList.toggle("is-front",distance<.5);card.classList.toggle("is-hidden",distance>2.5);card.setAttribute("aria-hidden",String(distance>2.5));if(card.tagName==="BUTTON")card.tabIndex=distance>1?-1:0;});loadNearby(container,index);}
function updateCount(){}
function update(){if(depthMode)return;current=Math.round(slides.scrollLeft/slides.clientWidth);updateCount()}
function openViewer(title,html,index=0,depth=false){lastFocus=document.activeElement;depthMode=depth;current=index;document.querySelector('#viewer-title').textContent=title;slides.classList.toggle('depth-viewer',depth);slides.innerHTML=html;dialog.classList.toggle('quotes-only',Boolean(slides.querySelector('.quote-scene')));total=slides.children.length;document.querySelector('#flip-page').hidden=total<2;dialog.showModal();loadNearby(slides,index);document.body.style.overflow='hidden';if(depth){slides.scrollLeft=0;placeCards(slides,current);[...slides.children].forEach((card,i)=>card.onclick=()=>{current=i;placeCards(slides,current);updateCount()})}else slides.scrollLeft=index*slides.clientWidth;updateCount();document.querySelector('#close').focus()}
function imageSlides(images,title,concept=false){return images.map((id,index)=>`<div class="slide"><img class="${concept?'concept-text':''}" decoding="async" data-src="${imageAsset(id)}" alt="${title || '物料详情'} ${index+1}"></div>`).join('')}
function conceptSlide(){return `<div class="slide concept-slide"><article class="concept-copy"><p>白天是阳光善良的小天使，像小熊一样温暖<br>但是晚上他会出现在梦魔之中，以人们贪婪丑恶的欲望为食，<br>吃掉他们这些负面情绪之后，人们会感觉到前所未有的轻松，<br>而他则会变得更加强大。</p><p>寿命握手：这是他的终极裁决。当他在现实中遇到正在行凶作恶、<br>且无可救药的人时，他会主动上前，露出天使形象微笑着伸出手，<br>只要对方与他握手一次，就会立刻被扣除两个月的寿命</p><p>代价：这两个月的寿命会转化为他夜晚的力量。如果对方罪恶滔天，<br>他可能会连续握住对方的手，直到对方的寿命归零，<br>或者对方在极度的恐惧中痛哭流涕、真心悔过</p><p>所以……Do you think he is an angel or a devil?</p></article></div>`}
document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{const g=galleries[button.dataset.gallery];openViewer(g.title,button.dataset.gallery==='concept'?conceptSlide():imageSlides(g.images,g.title),Number(button.dataset.index||0),g.images.length>1)}));
const quoteImages=Array.from({length:9},(_,i)=>`quote-${String(i+1).padStart(2,'0')}`);
document.querySelector('#quotes').onclick=()=>openViewer('WOONHAK’S QUOTES',imageSlides(quoteImages,'金云鹤语录').replaceAll('class="slide"','class="slide quote-scene quote-original"'),0,true);
document.querySelector('#location').onclick=()=>openViewer('生咖地址',`<div class="slide"><article class="text-panel"><h2>ThreeH Records</h2><p>2026年11月21日<br>13:00—17:30</p><p>重庆市两江新区龙塔街道上域街5号附40号观恒上域3幢1层-商业3号</p><a href="https://uri.amap.com/search?keyword=ThreeH%20Records%20%E9%87%8D%E5%BA%86" target="_blank" rel="noopener">在地图中搜索 ThreeH Records</a></article></div>`);
function move(n){if(depthMode){current=(current+n+total)%total;placeCards(slides,current);updateCount()}else slides.scrollTo({left:(current+n)*slides.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
slides.addEventListener('scroll',update,{passive:true});document.querySelector('#close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{document.body.style.overflow='';lastFocus?.focus()});dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}});window.addEventListener('resize',()=>{if(dialog.open&&!depthMode)slides.scrollLeft=current*slides.clientWidth});
const photoStage=document.querySelector('.photo-strip');let photoIndex=1;const photoButtons=[...photoStage.children];photoStage.setAttribute('aria-label','金云鹤照片轮播');placeCards(photoStage,photoIndex);
photoButtons.forEach((button,i)=>{button.addEventListener('click',e=>{if(i!==photoIndex){e.stopImmediatePropagation();photoIndex=i;placeCards(photoStage,photoIndex);}},true)});
function turnPhoto(n){photoIndex=(photoIndex+n+photoButtons.length)%photoButtons.length;placeCards(photoStage,photoIndex);}

photoStage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();turnPhoto(e.key==='ArrowRight'?1:-1)}});
function enableDepthSwipe(stage,onTurn,getIndex,isEnabled=()=>true){
 let gesture=null,suppressClickUntil=0,wheelSum=0,wheelTimer;
 const step=()=>Math.max(120,(stage.querySelector('.is-front')?.getBoundingClientRect().width||stage.clientWidth*.6)*.64);
 function render(dx){placeCards(stage,getIndex(),Math.max(-1,Math.min(1,dx/step())))}
 function settle(dx,velocity=0,cancelled=false){stage.classList.remove('is-dragging');if(!cancelled&&Math.abs(dx)>=Math.max(24,step()*.18))onTurn(dx<0?1:-1);else placeCards(stage,getIndex())}
 stage.addEventListener('pointerdown',event=>{
  if(!isEnabled()||event.isPrimary===false||(event.pointerType==='mouse'&&event.button!==0))return;
  gesture={id:event.pointerId,x:event.clientX,y:event.clientY,lastX:event.clientX,lastTime:event.timeStamp,velocity:0,horizontal:false};
 });
 stage.addEventListener('pointermove',event=>{
  if(!gesture||event.pointerId!==gesture.id)return;
  const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
  if(!gesture.horizontal){
   if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){gesture=null;return}
   if(Math.abs(dx)<6||Math.abs(dx)<=Math.abs(dy))return;
   gesture.horizontal=true;stage.setPointerCapture(event.pointerId);stage.classList.add('is-dragging');
  }
  event.preventDefault();const elapsed=event.timeStamp-gesture.lastTime;
  if(elapsed>0)gesture.velocity=(event.clientX-gesture.lastX)/elapsed;
  gesture.lastX=event.clientX;gesture.lastTime=event.timeStamp;render(dx);
 });
 function finish(event,cancelled=false){
  if(!gesture||event.pointerId!==gesture.id)return;
  const drag=gesture;gesture=null;
  if(stage.hasPointerCapture(event.pointerId))stage.releasePointerCapture(event.pointerId);
  if(!drag.horizontal)return;
  suppressClickUntil=Date.now()+450;settle(event.clientX-drag.x,event.timeStamp-drag.lastTime<100?drag.velocity:0,cancelled);
 }
 stage.addEventListener('pointerup',event=>finish(event));stage.addEventListener('pointercancel',event=>finish(event,true));
 stage.addEventListener('lostpointercapture',()=>{if(gesture?.horizontal){gesture=null;settle(0,0,true)}});
 stage.addEventListener('click',event=>{if(Date.now()<suppressClickUntil){event.preventDefault();event.stopImmediatePropagation()}},true);
 stage.addEventListener('dragstart',event=>{if(isEnabled())event.preventDefault()});
 stage.addEventListener('wheel',event=>{if(!isEnabled()||Math.abs(event.deltaX)<=Math.abs(event.deltaY))return;event.preventDefault();if(gesture)return;wheelSum-=event.deltaX;stage.classList.add('is-dragging');render(wheelSum);clearTimeout(wheelTimer);wheelTimer=setTimeout(()=>{settle(wheelSum);wheelSum=0},100)},{passive:false});
}
photoStage.tabIndex=0;
enableDepthSwipe(photoStage,turnPhoto,()=>photoIndex);
enableDepthSwipe(slides,move,()=>current,()=>dialog.open&&depthMode);

const scrollFrost=document.createElement('div');
scrollFrost.className='page-scroll-frost';scrollFrost.setAttribute('aria-hidden','true');document.body.append(scrollFrost);
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');let frostTimer,lastScrollY=window.scrollY;
window.addEventListener('scroll',()=>{
 const delta=Math.abs(window.scrollY-lastScrollY);lastScrollY=window.scrollY;
 if(dialog.open||reducedMotion.matches||delta<1)return;
 scrollFrost.classList.add('is-scrolling');clearTimeout(frostTimer);
 frostTimer=setTimeout(()=>scrollFrost.classList.remove('is-scrolling'),110);
},{passive:true});
dialog.addEventListener('close',()=>{clearTimeout(frostTimer);scrollFrost.classList.remove('is-scrolling');lastScrollY=window.scrollY});


if('IntersectionObserver' in window){
 const photoObserver=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){photoStage.dataset.ready='true';loadNearby(photoStage,photoIndex);photoObserver.disconnect()}},{rootMargin:'250px'});photoObserver.observe(photoStage);
}else{photoStage.dataset.ready='true';loadNearby(photoStage,photoIndex)}

document.querySelector('#flip-page').onclick=()=>move(1);

const backupImageBase='https://cdn.jsdelivr.net/gh/jmiochvjk-hub/woonhak-chongqing-2026@03779ab88c5d73990b6e09ef250a0671395889a1/assets/';
const imageTimers=new WeakMap();
function useBackupImage(image){
 if(image.dataset.backupUsed||!image.isConnected)return;
 const original=image.currentSrc||image.getAttribute('src');if(!original)return;
 const url=new URL(original,location.href);const marker='/assets/';const at=url.pathname.indexOf(marker);if(at<0)return;
 image.dataset.backupUsed='true';clearTimeout(imageTimers.get(image));
 const picture=image.closest('picture');picture?.querySelectorAll('source').forEach(source=>source.removeAttribute('srcset'));
 image.src=backupImageBase+url.pathname.slice(at+marker.length);
}
function watchImage(image){
 if(!(image instanceof HTMLImageElement)||image.dataset.backupUsed||(!image.getAttribute('src')&&!image.currentSrc))return;
 clearTimeout(imageTimers.get(image));if(image.complete&&image.naturalWidth>0)return;
 if(image.complete&&image.naturalWidth===0){useBackupImage(image);return}
 imageTimers.set(image,setTimeout(()=>{if(!image.complete||image.naturalWidth===0)useBackupImage(image)},6000));
}
document.addEventListener('load',event=>{if(event.target instanceof HTMLImageElement)clearTimeout(imageTimers.get(event.target))},true);
document.addEventListener('error',event=>{if(event.target instanceof HTMLImageElement)useBackupImage(event.target)},true);
const imageObserver=new MutationObserver(changes=>{for(const change of changes){if(change.type==='attributes')watchImage(change.target);else for(const node of change.addedNodes){if(node.nodeType===1){watchImage(node);node.querySelectorAll?.('img[src]').forEach(watchImage)}}}});
imageObserver.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
if('IntersectionObserver' in window){const visibleImages=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){watchImage(entry.target);visibleImages.unobserve(entry.target)}},{rootMargin:'250px'});document.querySelectorAll('img[src]').forEach(image=>visibleImages.observe(image))}else document.querySelectorAll('img[src]').forEach(watchImage);
