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
  css.textContent=`.closed-test-bar{font:700 12px/1.3 Inter,Arial,sans-serif;letter-spacing:.02em;padding:9px 16px;text-align:center;background:#0b1220;color:#dbeafe;position:relative;z-index:50}.closed-test-bar b{color:#fff}.test-choice{margin-top:18px;padding:22px;border:1px solid rgba(100,116,139,.28);border-radius:16px;background:rgba(255,255,255,.07)}.test-choice h4{margin:0 0 7px;font-size:18px}.test-choice p{margin:0 0 14px;opacity:.84}.test-buttons{display:flex;gap:10px;flex-wrap:wrap}.test-buttons a,.test-buttons button{display:inline-block;text-decoration:none;padding:12px 15px;border-radius:10px;font-weight:800;background:#fff;color:#101827;border:1px solid rgba(15,23,42,.15);cursor:pointer}.test-buttons .primary-test{background:#2563eb;color:#fff;border-color:#2563eb}.test-buttons button:disabled{opacity:.55;cursor:wait}.test-note{font-size:12px;margin-top:11px;opacity:.72}.test-status{font-size:13px;margin-top:12px}.tradie-outcomes{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0 16px;max-width:690px}.tradie-outcome{display:flex;align-items:flex-start;gap:10px;padding:13px 14px;background:#fff;border:1px solid #d7e4eb;border-radius:12px;box-shadow:0 6px 18px rgba(18,61,88,.05);color:#18384e;font-weight:800;line-height:1.25}.tradie-outcome:before{content:'✓';display:grid;place-items:center;flex:0 0 24px;width:24px;height:24px;border-radius:50%;background:#e3f3f9;color:#0876a8;font-size:13px;font-weight:950}@media(max-width:680px){.tradie-outcomes{grid-template-columns:1fr}}`;
  document.head.appendChild(css);

  if(styleId==='4'){
    const headline=document.getElementById('headline');
    const sub=document.getElementById('sub');
    if(headline){headline.textContent='Find the AI tool that can help you:';}
    if(sub){
      sub.textContent='A 3-minute business check for busy tradies. Start with what is costing you time, attention or opportunity — then test one practical improvement before adding more software.';
      const outcomes=document.createElement('div');
      outcomes.className='tradie-outcomes';
      outcomes.innerHTML='<div class="tradie-outcome">Cut the admin that follows you home</div><div class="tradie-outcome">Get me more work</div><div class="tradie-outcome">Remove the noise</div><div class="tradie-outcome">Improve my business</div>';
      sub.insertAdjacentElement('beforebegin',outcomes);
    }
  }

  const bar=document.createElement('div');bar.className='closed-test-bar';
  bar.innerHTML=`PRIVATE MARKET TEST · STYLE ${v.id} — <b>${v.name}</b>${tester?' · Thanks, '+tester:''}`;
  document.body.insertBefore(bar,document.body.firstChild);

  async function loadConfig(){
    try{
      const r=await fetch('closed-test-config.json?ts='+Date.now(),{cache:'no-store'});
      if(!r.ok)throw new Error('config');
      return await r.json();
    }catch(e){return {backend_url:'',mode:'founder-review'};}
  }

  function assessmentSnapshot(){
    try{
      if(typeof answers==='undefined')return null;
      return JSON.parse(JSON.stringify(answers));
    }catch(e){return null;}
  }

  async function createPrivateSession(backendUrl,intent,status,buttons){
    const assessment=assessmentSnapshot();
    if(!assessment||!assessment.priority){status.textContent='Please complete the assessment before choosing a test path.';return;}
    buttons.forEach(b=>b.disabled=true);
    status.textContent='Preparing your personalised test path…';
    try{
      const r=await fetch(backendUrl.replace(/\/$/,'')+'/v1/sessions',{
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({tester_id:tester,brand_variant:Number(v.id),source,intent,assessment})
      });
      const j=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(j.detail||'The test service could not prepare this result.');
      location.href=intent==='free'?j.feedback_url:j.pack_url;
    }catch(e){
      status.textContent='This test path is temporarily unavailable. Nothing has been submitted. '+(e.message||'Please try again later.');
      buttons.forEach(b=>b.disabled=false);
    }
  }

  const paid=document.getElementById('paidBlock');
  if(!paid)return;
  const old=paid.querySelector('.paid-cta');
  const box=document.createElement('div');box.className='test-choice';
  paid.appendChild(box);

  loadConfig().then(cfg=>{
    const backend=(cfg.backend_url||'').trim();
    if(backend){
      if(old)old.style.display='none';
      box.innerHTML='<h4>For this test, what would you genuinely do next?</h4><p>No payment will be taken. Your selected path and final five-question feedback will be recorded automatically for this closed test.</p><div class="test-buttons"><button id="freePath">I’d stay with the free result</button><button id="paidPath" class="primary-test">I’d consider the A$39 personalised kit</button></div><div class="test-note">If you choose the paid path, you’ll see the V2 pack generated from your own assessment, then continue directly to the feedback survey.</div><div class="test-status" id="testStatus"></div>';
      const freeBtn=box.querySelector('#freePath'),paidBtn=box.querySelector('#paidPath'),status=box.querySelector('#testStatus'),buttons=[freeBtn,paidBtn];
      freeBtn.addEventListener('click',()=>createPrivateSession(backend,'free',status,buttons));
      paidBtn.addEventListener('click',()=>createPrivateSession(backend,'paid-preview',status,buttons));
    }else{
      if(old){old.textContent='Preview the A$39 V2 kit';old.target='_blank';old.rel='noopener';old.href='kit.html?'+carry.toString()+'&choice=paid-preview';}
      const freeQ=new URLSearchParams(carry);freeQ.set('choice','free');
      const paidQ=new URLSearchParams(carry);paidQ.set('choice','paid');
      box.innerHTML=`<h4>For this review, what would you do next?</h4><p>No payment will be taken. This founder-review mode uses the static V2 example until private fulfilment is activated.</p><div class="test-buttons"><a href="feedback.html?${freeQ.toString()}">I’d stay with the free result</a><a class="primary-test" target="_blank" rel="noopener" href="kit.html?${carry.toString()}&choice=paid-preview">I’d consider the A$39 kit</a><a href="feedback.html?${paidQ.toString()}">I’ve viewed the kit — give feedback</a></div><div class="test-note">Founder-review feedback still uses the email/copy fallback. Wider external testing should wait until private fulfilment and stored feedback are activated.</div>`;
    }
  });
})();