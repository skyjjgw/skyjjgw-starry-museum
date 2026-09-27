(() => {
  const dialog=document.querySelector('.world-gift-dialog');
  if(!dialog)return;
  const card=dialog.querySelector('[data-egg-card]');
  let focus;
  function show(){
    if(dialog.open)return;
    focus=document.activeElement;
    dialog.showModal();
    dispatchEvent(new Event('resize'));
  }
  new MutationObserver(()=>{if(!card.hidden)show();else if(dialog.open)dialog.close();}).observe(card,{attributes:true,attributeFilter:['hidden']});
  dialog.querySelector('.world-gift-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>focus?.focus({preventScroll:true}));
  // The original stars and the cloud story use the same scratch gift.
  document.querySelector('[data-reward-open]')?.addEventListener('click',()=>{if(!card.hidden)show();});
  const panels=[...document.querySelectorAll('.story-frame')];
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('world-in-view',entry.isIntersecting)),{threshold:0,rootMargin:'0px 0px -15% 0px'});
    panels.forEach(panel=>observer.observe(panel));
  } else panels.forEach(panel=>panel.classList.add('world-in-view'));
})();
