(function(){
  const params=new URLSearchParams(location.search);
  const tester=(params.get('tester')||'').trim();
  const reply=(params.get('reply')||'').trim();
  const source=(params.get('source')||'known-test').trim();
  const path=location.pathname.split('/').pop();
  const variants={
    '1':{id:'1',name:'One Good AI'},
    '2':{id:'2',name:'AI Value Finder'},
    '3':{id:'3',name:'AI Quick Win'},
    '4':{id:'4',name:'Have A Crack AI'}
  };
  const fileMap={
    'one-good-ai.html':'1',
    'ai-value-finder.html':'2',
    'ai-quick-win.html':'3',
    'have-a-crack-ai.html':'4'
  };
  const styleId=params.get('style')||fileMap[path];
  const v=variants[styleId];
  if(!v)return;
  const carry=new URLSearchParams();
  carry.set('variant',v.id); carry.set('brand',v.name); carry.set('source',source);
  if(tester)carry.set('tester',tester); if(reply)carry.set('reply',reply);

  const css=document.createElement('style');
  css.textContent=`.closed-test-bar{font:700 12px/1.3 Inter,Arial,sans-serif;letter-spacing:.02em;padding:9px 16px;text-align:center;background:#0b1220;color:#dbeafe;position:relative;z-index:50}.closed-test-bar b{color:#fff}.test-choice{margin-top:18px;padding:22px;border:1px solid rgba(100,116,139,.28);border-radius:16px;background:rgba(255,255,255,.07)}.test-choice h4{margin:0 0 7px;font-size:18px}.test-choice p{margin:0 0 14px;opacity:.84}.test-buttons{display:flex;gap:10px;flex-wrap:wrap}.test-buttons a{display:inline-block;text-decoration:none;padding:12px 15px;border-radius:10px;font-weight:800;background:#fff;color:#101827;border:1px solid rgba(15,23,42,.15)}.test-buttons a.primary-test{background:#2563eb;color:#fff;border-color:#2563eb}.test-note{font-size:12px;margin-top:11px;opacity:.72}`;
  document.head.appendChild(css);

  const bar=document.createElement('div');bar.className='closed-test-bar';
  bar.innerHTML=`PRIVATE MARKET TEST · STYLE ${v.id} — <b>${v.name}</b>${tester?' · Thanks, '+tester:''}`;
  document.body.insertBefore(bar,document.body.firstChild);

  const paid=document.getElementById('paidBlock');
  if(paid){
    const old=paid.querySelector('.paid-cta');
    if(old){old.textContent='Preview the A$39 V2 kit';old.target='_blank';old.rel='noopener';old.href='kit.html?'+carry.toString()+'&choice=paid-preview';}
    const box=document.createElement('div');box.className='test-choice';
    const freeQ=new URLSearchParams(carry);freeQ.set('choice','free');
    const paidQ=new URLSearchParams(carry);paidQ.set('choice','paid');
    box.innerHTML=`<h4>For this test, what would you do next?</h4><p>No payment will be taken. Choose the path that best reflects what you would genuinely do.</p><div class="test-buttons"><a href="feedback.html?${freeQ.toString()}">I’d stay with the free result</a><a class="primary-test" target="_blank" rel="noopener" href="kit.html?${carry.toString()}&choice=paid-preview">I’d consider the A$39 kit</a><a href="feedback.html?${paidQ.toString()}">I’ve viewed the kit — give feedback</a></div><div class="test-note">If you choose the paid path, preview the kit first, then return here and select “I’ve viewed the kit”.</div>`;
    paid.appendChild(box);
  }
})();