/* Pancreatic Cancer Atlas — application */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const VIEWS={
  pancreas:{title:'Pancreas & neighbors',short:'Pancreas',intro:'The pancreas and the organs, ducts, vessels and nerves packed around it. Click any structure, or the tumor, to read what it does and what changes when a cancer grows there.',legend:'Front view · person\'s right on your left · <span class="sw" style="background:#5b7fb3"></span>veins <span class="sw" style="background:#c45a4b"></span>arteries <span class="sw" style="background:#8fae46"></span>bile duct <span class="sw" style="background:#7f8f6a"></span>pancreatic duct <span class="sw" style="background:#5a3a46"></span>tumor',defaultTopic:'what-is-pdac'},
  ecosystem:{title:'Tumor ecosystem',short:'Ecosystem',intro:'What surrounds the cancer cells: scar-like stroma, fibroblasts in several states, compressed vessels, immune cells held at a distance, nerves and a starved core. Click any part.',legend:'Field about 1 mm across · <span class="sw" style="background:#8a5a6a"></span>cancer cells <span class="sw" style="background:#4e7d4a"></span>myofibroblasts <span class="sw" style="background:#8fb07f"></span>inflammatory fibroblasts <span class="sw" style="background:#4b6a9b"></span>T cells <span class="sw" style="background:#d98a3d"></span>myeloid cells <span class="sw" style="background:#e2c15a"></span>nerve',defaultTopic:'desmoplasia'},
  cells:{title:'Cells & genes',short:'Cells & genes',intro:'How a normal cell decides to grow, the brakes it keeps, and which of those are broken in pancreatic cancer. Side panels show how cells change over time and what tests look for.',legend:'Arrows show signal flow · boxes are proteins or genes · panels on the right are summaries, not pathways',defaultTopic:'kras'},
  spread:{title:'Spread & stage',short:'Spread & stage',intro:'How the tumor relates to the vessels that decide operability, the routes by which it spreads, and what stage means. Illustrative, not a decision tool.',legend:'<span class="sw" style="background:#5b7fb3"></span>vein <span class="sw" style="background:#c45a4b"></span>artery <span class="sw" style="background:#5a3a46"></span>tumor · dotted circles = deposits below scan resolution',defaultTopic:'resectability-categories'},
  treatment:{title:'Treatment & daily life',short:'Treatment & life',intro:'The branching sequences of chemotherapy, surgery, radiation and targeted therapy by category, with monitoring and supportive care running alongside every path.',legend:'<span class="sw" style="background:#dcecef"></span>chemotherapy <span class="sw" style="background:#fdf1ea"></span>surgery <span class="sw" style="background:#fff8e6"></span>radiation <span class="sw" style="background:#f1e6f5"></span>targeted <span class="sw" style="background:#fff4e8"></span>supportive care',defaultTopic:'treatment-sequencing'},
  connections:{title:'Connections',short:'Connections',intro:'Every topic sits in a group; selecting one draws its stated connections to other topics, each written as a full sentence naming both ends.',legend:'Lines appear for the selected topic only · statements are listed in the explanation panel under Connections',defaultTopic:null}
};
const TYPE_FILTERS=[['concept','Questions','var(--c-diagnosis)'],['symptom','Symptoms & care','var(--c-living)'],['structure','Anatomy','var(--c-anatomy)'],['process','Biology','var(--c-ecosystem)'],['gene','Genes','var(--c-genes)'],['test','Tests','var(--c-tests)'],['treatment','Treatments','var(--c-treatment)'],['research','Research','var(--c-research)']];
const GCOL={diagnosis:'var(--c-diagnosis)',living:'var(--c-living)',anatomy:'var(--c-anatomy)',ecosystem:'var(--c-ecosystem)',genes:'var(--c-genes)',tests:'var(--c-tests)',treatment:'var(--c-treatment)',research:'var(--c-research)'};
const PICT={
  compass:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="8"/><path d="M13 7l-2 5-4 2 2-5z" fill="currentColor"/></svg>',
  home:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 10l7-6 7 6v7H3z"/><path d="M8 17v-5h4v5"/></svg>',
  organ:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12c2-5 6-6 9-6s5 2 5 4-3 4-6 4-5 1-8-2z"/></svg>',
  cells:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="8" r="3.5"/><circle cx="13.5" cy="12.5" r="3"/><circle cx="7" cy="8" r="1" fill="currentColor"/></svg>',
  dna:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3c0 4 8 6 8 10M14 3c0 4-8 6-8 10M6 17c0-2 8-3 8-7M14 17c0-2-8-3-8-7"/></svg>',
  scan:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="14" height="12" rx="2"/><path d="M3 10h14M7 4v12"/></svg>',
  treat:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12l8-8 4 4-8 8H4z"/><path d="M9 7l4 4"/></svg>',
  flask:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 3h4M9 3v5l-5 8h12l-5-8V3"/></svg>'
};
const TYPE_PICT={concept:'compass',symptom:'home',structure:'organ',process:'cells',gene:'dna',test:'scan',treatment:'treat',research:'flask'};

const D={}; // data
const S={view:'pancreas',topic:'what-is-pdac',story:null,step:0,groupsOpen:new Set(),prevGroups:null,filters:new Set(),q:'',left:true,right:true,mleft:false,mright:false,zoom:1,pan:{x:0,y:0},expanded:{},dialog:null};
let T={}, G=[], GROUP_INDEX={};

/* ------------------------------------------------ data loading */
async function loadData(){
  if(window.ATLAS_DATA){ Object.assign(D,window.ATLAS_DATA); return; }
  const names=['topics','stories','glossary','sources','edges','regulatory','summary'];
  const res=await Promise.all(names.map(n=>fetch('data/'+n+'.json').then(r=>{ if(!r.ok) throw new Error(n); return r.json(); })));
  names.forEach((n,i)=>D[n]=res[i]);
}

/* ------------------------------------------------ routing */
function routeFromState(){
  if(S.dialog==='lib') return '#lib'+(S.libTopic?'.t_'+S.libTopic:S.libSrc?'.src_'+S.libSrc:'');
  if(S.dialog==='glossary') return '#glossary';
  if(S.dialog==='about') return '#about';
  if(S.story) return '#s_'+S.story+'.'+(S.step+1);
  return '#v_'+S.view+(S.topic?'.t_'+S.topic:'');
}
function push(replace){ const h=routeFromState(); if(location.hash===h) return; if(replace) history.replaceState(null,'',h); else history.pushState(null,'',h); }
function parseHash(){ const h=decodeURIComponent(location.hash.replace(/^#/,'')); const parts=h.split('.').filter(Boolean); const out={}; parts.forEach((p,i)=>{ const m=p.match(/^([a-z]+)_(.+)$/); if(m) out[m[1]]=m[2]; else if(i===0) out.kind=p; else out.n=p; }); if(parts.length && !out.kind){ const first=parts[0].match(/^([a-z]+)_/); out.kind=first?first[1]:parts[0]; } return out; }
function applyRoute(){
  const r=parseHash();
  closeDialogs(false);
  if(r.kind==='s' && r.s){ const st=D.stories.find(s=>s.id===r.s); if(st){ startStory(st.id, Math.max(0,Math.min(st.steps.length-1,(parseInt(r.n||'1',10)||1)-1)), false); return; } }
  S.story=null;
  if(r.kind==='v' && VIEWS[r.v]){ S.view=r.v; S.topic = (r.t && T[r.t]) ? r.t : (VIEWS[r.v].defaultTopic || S.topic); }
  else if(r.kind==='lib'){ S.libTopic = r.t||null; S.libSrc = r.src||null; openLibrary(S.libTopic,S.libSrc,false); return; }
  else if(r.kind==='glossary'){ openGlossary(false); return; }
  else if(r.kind==='about'){ openAbout(false); return; }
  else { S.view='pancreas'; S.topic='what-is-pdac'; }
  renderAll();
}

/* ------------------------------------------------ selection */
function primaryView(t){ const v=Object.keys(t.views||{}); return v[0]||'connections'; }
function belongs(t,view){ return view==='connections' || (t.views && t.views[view]); }
function selectTopic(id,opts={}){
  const t=T[id]; if(!t) return;
  if(S.story && !opts.fromStory){ S.story=null; }
  S.topic=id;
  if(!belongs(t,S.view)) S.view=opts.view||primaryView(t);
  if(opts.view) S.view=opts.view;
  S.expanded={}; if(S.view==='connections') S.expanded.rel=true;
  renderAll(); push(opts.replace);
  if(opts.focusPanel) $('#explHeading')?.focus();
}
function setView(v){
  if(S.story){ S.story=null; }
  S.view=v;
  const t=T[S.topic];
  if(!(t && belongs(t,v))) S.topic=VIEWS[v].defaultTopic || S.topic;
  S.expanded={}; if(v==='connections') S.expanded.rel=true; S.zoom=1; S.pan={x:0,y:0};
  renderAll(); push();
}

/* ------------------------------------------------ text rendering helpers */
function citeNumberer(){ const order=[]; return { n(id){ let i=order.indexOf(id); if(i<0){ order.push(id); i=order.length-1; } return i+1; }, list(){ return order; } }; }
function renderText(txt, num, glossTerms){
  let s=esc(txt);
  // glossary wrapping (first occurrence per term)
  if(glossTerms && glossTerms.length){
    glossTerms.slice().sort((a,b)=>b.term.length-a.term.length).forEach(g=>{
      const re=new RegExp('(^|[^\\w>-])('+g.term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')(?![\\w-])','i');
      if(re.test(s) && !new RegExp('data-def="[^"]*'+g.term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).test(s)) s=s.replace(re,(m,a,b)=>`${a}<span class="gloss" tabindex="0" data-def="${esc(g.definition)}">${b}</span>`);
    });
  }
  s=s.replace(/\s*\[\[([A-Za-z0-9\-]+)\]\]/g,(m,id)=>`<sup class="cite"><button type="button" data-src="${id}" aria-label="Source ${num.n(id)}">${num.n(id)}</button></sup>`);
  return s.replace(/\n\n+/g,'</p><p>');
}

/* ------------------------------------------------ render: nav */
function renderNav(){
  $$('.viewtabs button').forEach(b=>b.setAttribute('aria-selected', b.dataset.view===S.view ? 'true':'false'));
}

/* ------------------------------------------------ render: topics sidebar */
function topicMatches(t,q){
  if(!q) return true; const hay=[t.title,...(t.aliases||[]),t.orientation||'',...(t.faq||[]).map(f=>f.q), GROUP_INDEX[t.group]?.title||''].join(' ').toLowerCase();
  return q.split(/\s+/).every(w=>hay.includes(w));
}
function hl(text,q){ if(!q) return esc(text); let s=esc(text); q.split(/\s+/).filter(Boolean).forEach(w=>{ s=s.replace(new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>'); }); return s; }
function renderTopics(){
  const list=$('#topicsList'); const q=S.q.trim().toLowerCase(); const f=S.filters;
  const visible=D.topics.topics.filter(t=>topicMatches(t,q) && (!f.size || f.has(t.type)));
  $('#clearFilters').disabled = !f.size;
  $$('#filterChips .chip').forEach(c=>c.setAttribute('aria-pressed', f.has(c.dataset.type)?'true':'false'));
  if(!visible.length){
    list.innerHTML=`<div class="no-results"><b>No topics match “${esc(S.q)}”${f.size?' with the current filters':''}.</b><p>Try one of these:</p><ul>${['Whipple','why chemo before surgery','clear scan','enzyme','KRAS','jaundice','borderline','FOLFIRINOX','ctDNA','blood clots'].map(x=>`<li><button type="button" data-try="${esc(x)}">${esc(x)}</button></li>`).join('')}</ul><p><button type="button" id="resetSearch">Clear search${f.size?' and filters':''}</button></p></div>`;
    return;
  }
  const byG={}; visible.forEach(t=>(byG[t.group]=byG[t.group]||[]).push(t));
  list.innerHTML=G.map(g=>{ const items=byG[g.id]||[]; if(!items.length) return '';
    const open = q ? true : S.groupsOpen.has(g.id);
    return `<div class="tgroup" data-group="${g.id}" data-open="${open}" style="--c:${GCOL[g.id]}"><button type="button" class="ghead" aria-expanded="${open}" aria-controls="g-${g.id}"><span class="gpict">${PICT[g.icon]}</span>${esc(g.title)}<span class="count">${items.length}</span><span class="chev">▶</span></button><div class="gbody" id="g-${g.id}" role="list">${items.map(t=>`<button type="button" class="trow" role="listitem" data-topic="${t.id}" aria-current="${t.id===S.topic}" style="--c:${GCOL[g.id]}"><span class="pict" aria-hidden="true">${PICT[TYPE_PICT[t.type]||'compass']}</span><span><span class="t">${hl(t.title,q)}</span>${(t.aliases||[]).length?`<span class="al">${hl((t.aliases||[]).slice(0,4).join(' · '),q)}</span>`:''}</span></button>`).join('')}</div></div>`; }).join('');
  $('#topicsCount').textContent = q || f.size ? `${visible.length} of ${D.topics.topics.length} topics` : `${D.topics.topics.length} topics in ${G.length} groups`;
}

/* ------------------------------------------------ render: center */
function renderCenter(){
  const v=VIEWS[S.view]; const t=T[S.topic];
  $('#viewTitle').textContent=v.title;
  $('#crumbs').innerHTML=`<b>${esc(v.title)}</b>${t?` › ${esc(GROUP_INDEX[t.group]?.title||'')} › <b>${esc(t.title)}</b>`:' › Overview'}`;
  $('#viewIntro').textContent=v.intro;
  $('#entryRow').style.display = S.view==='pancreas' && !S.story ? 'flex':'none';
  $('#legend').innerHTML=v.legend;
  const stage=$('#stage');
  let svg;
  if(S.view==='connections') svg=window.ATLAS_ILLUS.connections(G,D.topics.topics,D.edges,S.topic);
  else svg=window.ATLAS_ILLUS[S.view]();
  stage.innerHTML=svg;
  const hsId = t && t.views ? t.views[S.view] : null;
  $$('.hotspot',stage).forEach(h=>{ h.setAttribute('data-selected', String(S.view==='connections' ? h.dataset.topic===S.topic : (hsId && h.dataset.hs===hsId))); });
  applyZoom();
  // story bar
  const bar=$('#storyBar');
  if(S.story){ const st=D.stories.find(s=>s.id===S.story); bar.style.display='flex'; bar.innerHTML=`<span class="t">${esc(st.title)}</span><span class="step">Step ${S.step+1} of ${st.steps.length}: ${esc(st.steps[S.step].title)}</span><span class="spacer"></span><button type="button" class="btn small" id="sbBack" ${S.step===0?'disabled':''}>← Back</button><button type="button" class="btn small primary" id="sbNext" ${S.step===st.steps.length-1?'disabled':''}>Next →</button><button type="button" class="btn small quiet" id="sbExit">Exit story</button>`; }
  else { bar.style.display='none'; bar.innerHTML=''; }
}
function applyZoom(){ const svg=$('#stage svg'); if(!svg) return; svg.style.transform=`translate(${S.pan.x}px,${S.pan.y}px) scale(${S.zoom})`; $('#zoomIn').disabled=S.zoom>=3; $('#zoomOut').disabled=S.zoom<=1; $('#zoomReset').disabled=S.zoom===1&&!S.pan.x&&!S.pan.y; }

/* ------------------------------------------------ render: explanation */
function sectionHtml(t,key,num,gl){
  const sec=t[key]; const open=!!S.expanded[key];
  return `<section class="sec" data-open="${open}" id="sec-${key}"><h3>${esc(sec.label)}</h3><p class="preview">${renderText(sec.preview,num,gl)}</p><button type="button" class="disc" aria-expanded="${open}" aria-controls="full-${key}" data-sec="${key}"><span class="chev">▶</span>${open?'Hide full explanation':'Read full explanation'}</button><div class="full" id="full-${key}"><p>${renderText(sec.full,num,gl)}</p></div></section>`;
}
function topicHtml(t,opts={}){
  const num=citeNumberer(); const gl=t.glossary||[]; const parts=[];
  parts.push(`<p class="orient">${renderText(t.orientation,num,gl)}</p>`);
  if(t.clinical_status) parts.push(`<div class="status"><b>Status:</b> ${renderText(t.clinical_status,num,gl)}</div>`);
  parts.push(sectionHtml(t,'section1',num,gl));
  if(t.action_note) parts.push(`<div class="action" role="note"><h4>${esc(t.action_note.heading)}</h4><p>${renderText(t.action_note.text,num,gl)}</p></div>`);
  parts.push(sectionHtml(t,'section2',num,gl));
  const mech=(t.mechanism_notes||[]).filter(m=>m&&m.text);
  const rn=t.research_notes||{};
  const openNotes=!!S.expanded.notes||opts.allOpen;
  parts.push(`<div class="fold" data-open="${openNotes}"><button type="button" class="disc" data-fold="notes" aria-expanded="${openNotes}"><span class="chev">▶</span>Research notes</button><div class="fbody">${rn.what_findings_mean?`<h4>What the findings mean</h4><p>${renderText(rn.what_findings_mean,num,gl)}</p>`:''}${rn.how_studied?`<h4>How researchers study this</h4><p>${renderText(rn.how_studied,num,gl)}</p>`:''}${mech.length?`<h4>Proposed mechanism</h4>${mech.map(m=>`<div class="mech"><div class="q">${esc(m.qualifier||'Proposed mechanism')} · ${esc(m.origin||'')}</div><p>${renderText(m.text,num,gl)}</p></div>`).join('')}`:''}<p class="ev">Kind of support for this topic: <b>${esc(t.evidence_type||'')}</b> — the kind of evidence, not a quality ranking. Evidence vocabulary: Established biology · Human studies · Experimental findings · Proposed mechanism.</p></div></div>`);
  const rel=(t.related||[]);
  if(rel.length){ const openRel=!!S.expanded.rel||opts.allOpen; parts.push(`<div class="fold" data-open="${openRel}"><button type="button" class="disc" data-fold="rel" aria-expanded="${openRel}"><span class="chev">▶</span>Connections (${rel.length})</button><div class="fbody"><ul class="rel-list">${rel.map(r=>`<li><span class="rtype">${esc(r.relation.replace('_',' '))}</span>${esc(r.statement)} <button type="button" data-goto="${r.topic}" aria-label="Go to ${esc(T[r.topic]?.title||r.topic)}">${esc(T[r.topic]?.title||r.topic)} →</button></li>`).join('')}</ul></div></div>`); }
  if((t.faq||[]).length){ const openF=!!S.expanded.faq||opts.allOpen; parts.push(`<div class="fold" data-open="${openF}"><button type="button" class="disc" data-fold="faq" aria-expanded="${openF}"><span class="chev">▶</span>Common questions</button><div class="fbody"><dl class="faq">${t.faq.map(f=>`<dt>${esc(f.q)}</dt><dd>${renderText(f.a,num,gl)}</dd>`).join('')}</dl></div></div>`); }
  const ids=num.list();
  parts.push(`<div class="srcs"><h4>Sources for this topic (${ids.length})</h4><ol>${ids.map(id=>{ const s=D.sources[id]; if(!s) return `<li>${esc(id)}</li>`; const gloss=(t.source_glosses&&t.source_glosses[id])||s.glosses?.[t.id]||''; return `<li id="srcref-${id}">${esc(shortCite(s))}${s.url?` <a href="${esc(s.url)}" target="_blank" rel="noopener">open ↗</a>`:''} <button type="button" class="lib-open" data-src="${id}" style="color:var(--teal-2);text-decoration:underline">details</button>${gloss?`<span class="gl">${esc(gloss)}</span>`:''}<span class="gl">${esc(kindLabel(s))}${s.access?` · ${esc(accessLabel(s.access))}`:''}</span></li>`; }).join('')}</ol><p><button type="button" class="btn small" data-lib-topic="${t.id}">Open in Research library</button></p></div>`);
  return parts.join('');
}
function shortCite(s){ if(s.kind==='inference') return s.citation; const c=s.citation||''; const m=c.match(/^([^.]+?(?:,| et al)[^.]*)\.\s*(.*?)\.\s*([^.]*?\d{4})/); return c.length>170? c.slice(0,168)+'…' : c; }
function kindLabel(s){ return {study:'Primary study (read in full)',lead:'Primary study (abstract or registry only)',secondary:'Secondary source: '+(s.type||''),inference:'Inference record'}[s.kind]||s.kind; }
function accessLabel(a){ return {full_text:'full text read',full_text_pmc_manuscript:'full text read (author manuscript)',abstract_plus_registry_results:'abstract + registry results',abstract_only:'abstract only'}[a]||a; }
function renderExpl(){
  const t=T[S.topic]; const head=$('#explHead'), body=$('#explBody'); const stepWrap=$('#stepCard');
  if(S.story){ const st=D.stories.find(s=>s.id===S.story); const step=st.steps[S.step]; const num=citeNumberer();
    stepWrap.style.display='block'; stepWrap.innerHTML=`<div class="k">Guided story ${st.number} · step ${S.step+1} of ${st.steps.length}</div><h3>${esc(step.title)}</h3><p>${renderText(step.text,num,[])}</p><div class="nav"><button type="button" class="btn small" id="scBack" ${S.step===0?'disabled':''}>← Back</button><button type="button" class="btn small primary" id="scNext" ${S.step===st.steps.length-1?'disabled':''}>${S.step===st.steps.length-1?'Finish':'Next →'}</button><button type="button" class="btn small quiet" id="scExit">Exit story</button></div>${num.list().length?`<p class="ev" style="margin-top:8px">Sources: ${num.list().map((id,i)=>`<button type="button" data-src="${id}" class="lib-open" style="text-decoration:underline;color:var(--teal-2)">${i+1}. ${esc(id)}</button>`).join(' · ')}</p>`:''}`;
    $('#depthNote').style.display='block'; $('#depthNote').textContent='Below: the full atlas entry for this step\'s topic.';
  } else { stepWrap.style.display='none'; stepWrap.innerHTML=''; $('#depthNote').style.display='none'; }
  if(!t){ head.innerHTML=`<div class="kicker">${esc(VIEWS[S.view].title)}</div><h2 id="explHeading" tabindex="-1">Overview</h2>`; body.innerHTML=`<p class="orient">${esc(VIEWS[S.view].intro)}</p>`; return; }
  const g=GROUP_INDEX[t.group];
  head.innerHTML=`<div class="kicker" style="--c:${GCOL[t.group]}"><span class="gpict" style="width:14px;height:14px">${PICT[g.icon]}</span>${esc(g.title)}</div><h2 id="explHeading" tabindex="-1">${esc(t.title)}</h2>${(t.aliases||[]).length?`<div class="aliases">Also: ${esc((t.aliases||[]).slice(0,6).join(' · '))}</div>`:''}<div class="expl-tools"><button type="button" class="btn small" id="openReading">Wide reading view</button><button type="button" class="btn small" data-lib-topic="${t.id}">Research notes &amp; sources</button><button type="button" class="btn small" id="copyLink">Copy link</button></div>`;
  body.innerHTML=topicHtml(t);
}

/* ------------------------------------------------ stories */
function renderStoryDrawer(){
  $('#storyCards').innerHTML=D.stories.map(s=>`<button type="button" class="story-card" data-story="${s.id}"><span class="num">Story ${s.number}</span><h3>${esc(s.title)}</h3><p>${esc(s.lead)}</p><span class="meta">${s.steps.length} steps</span></button>`).join('');
}
function toggleDrawer(open){ const strip=$('#storyStrip'); const willOpen = open==null ? strip.dataset.open!=='true' : open; strip.dataset.open=String(willOpen); $('#storyTab').setAttribute('aria-expanded',String(willOpen));
  if(willOpen){ const r=strip.getBoundingClientRect(); const navH=$('#topnav').offsetHeight; if(r.top<navH){ window.scrollBy({top:r.top-navH,behavior:reduced?'auto':'smooth'}); } } }
function startStory(id,step=0,doPush=true){ const st=D.stories.find(s=>s.id===id); if(!st) return; toggleDrawer(false); S.story=id; S.step=step; const sp=st.steps[step]; S.view=sp.view; S.topic=sp.topic; S.expanded={}; S.zoom=1; S.pan={x:0,y:0}; renderAll(); if(doPush) push(); $('#stepCard h3')?.focus?.(); if(S.mright===false && window.innerWidth<=980){ S.mright=true; renderShell(); } }
function stepStory(delta){ const st=D.stories.find(s=>s.id===S.story); if(!st) return; const n=S.step+delta; if(n<0) return; if(n>=st.steps.length){ exitStory(); return; } startStory(S.story,n); }
function exitStory(){ S.story=null; renderAll(); push(); }

/* ------------------------------------------------ shell */
function renderShell(){ const sh=$('#shell'); sh.dataset.left=S.left; sh.dataset.right=S.right; sh.dataset.mleft=S.mleft; sh.dataset.mright=S.mright; $('#leftToggle').setAttribute('aria-expanded',String(S.left)); $('#rightToggle').setAttribute('aria-expanded',String(S.right)); $('#leftToggle').title=S.left?'Hide topics':'Show topics'; $('#rightToggle').title=S.right?'Hide explanation':'Show explanation'; $('#leftToggle').textContent=S.left?'◀':'▶'; $('#rightToggle').textContent=S.right?'▶':'◀'; }
let lastTopicRendered=null;
function renderAll(){ if(lastTopicRendered!==S.topic+'|'+(S.story||'')+S.step){ const ex=$('#expl'); if(ex) ex.scrollTop=0; lastTopicRendered=S.topic+'|'+(S.story||'')+S.step; } renderNav(); renderTopics(); renderCenter(); renderExpl(); renderShell(); hideTip(); document.title=(T[S.topic]?T[S.topic].title+' — ':'')+'Pancreatic Cancer Atlas'; }

/* ------------------------------------------------ dialogs */
function closeDialogs(doPush=true){ ['libDlg','glossDlg','readDlg','aboutDlg'].forEach(id=>{ const d=$('#'+id); if(d&&d.open) d.close(); }); S.dialog=null; S.libTopic=null; S.libSrc=null; if(doPush) push(); }
function openDialog(id){ const d=$('#'+id); if(!d.open) d.showModal(); d.querySelector('.dlg-body').scrollTop=0; }
let LIB={q:'',kind:'',ev:'',dom:''};
function openLibrary(topicId,srcId,doPush=true){ S.dialog='lib'; S.libTopic=topicId||null; S.libSrc=srcId||null; LIB.q=''; $('#libQ').value=''; $('#libKind').value=''; $('#libEv').value=''; $('#libDom').value=''; setLibTab('sources'); renderLibrary(); openDialog('libDlg'); if(doPush) push(); if(srcId){ setTimeout(()=>{ const el=$('#src-'+CSS.escape(srcId)); if(el){ el.scrollIntoView({block:'start'}); el.focus(); } },30); } }
function setLibTab(tab){ LIB.tab=tab; $$('#libTabs button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tab===tab))); $('#libSourcesPane').style.display=tab==='sources'?'block':'none'; $('#libRegPane').style.display=tab==='reg'?'block':'none'; $('#libAboutPane').style.display=tab==='about'?'block':'none'; if(tab==='reg') renderReg(); if(tab==='about') renderAboutResearch(); }
function srcHtml(s){
  const cited=(s.cited_by||[]).filter(x=>!x.startsWith('story:')); const stories=(s.cited_by||[]).filter(x=>x.startsWith('story:'));
  let dl='';
  if(s.kind==='study'||s.kind==='lead'){ dl=`<dl>${s.population?`<dt>Population or model</dt><dd>${esc(s.population)}${s.n?` — ${esc(s.n)}`:''}</dd>`:''}${s.design?`<dt>Design</dt><dd>${esc(s.design)}</dd>`:''}${s.time_frame?`<dt>Time frame</dt><dd>${esc(s.time_frame)}</dd>`:''}${s.finding?`<dt>What it found</dt><dd>${esc(s.finding)}</dd>`:''}${s.effect?`<dt>Effect size</dt><dd>${esc(s.effect)}</dd>`:''}${s.interpretation?`<dt>What kind of inference it supports</dt><dd>${esc(s.interpretation)}</dd>`:''}${s.limitations?`<dt>Limitations</dt><dd>${esc(s.limitations)}</dd>`:''}${s.clinical_status&&s.clinical_status!=='not applicable'?`<dt>Clinical status</dt><dd>${esc(s.clinical_status)}</dd>`:''}</dl>`; }
  else if(s.kind==='secondary'){ dl=`<dl><dt>What it supports</dt><dd>${esc(s.supports)}</dd>${s.jurisdiction?`<dt>Jurisdiction</dt><dd>${esc(s.jurisdiction)}</dd>`:''}</dl>`; }
  else if(s.kind==='inference'){ dl=`<dl><dt>Phenomenon</dt><dd>${esc(s.phenomenon)}</dd><dt>Missing connection</dt><dd>${esc(s.missing)}</dd><dt>Proposed mechanism</dt><dd>${esc(s.mechanism)}</dd>${s.premises?.length?`<dt>Premises</dt><dd><ul>${s.premises.map(p=>`<li>${esc(p.statement)} ${(p.ids||[]).map(i=>`<button type="button" class="lib-open" data-src="${i}" style="text-decoration:underline;color:var(--teal-2)">${esc(i)}</button>`).join(' ')}</li>`).join('')}</ul></dd>`:''}${s.assumptions?.length?`<dt>Extra assumptions</dt><dd><ul>${s.assumptions.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></dd>`:''}${s.conflicting?.length?`<dt>Conflicting observations</dt><dd><ul>${s.conflicting.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></dd>`:''}<dt>Serious competing explanation</dt><dd>${esc(s.competing)}</dd><dt>What it predicts that competitors do not</dt><dd>${esc(s.prediction)}</dd><dt>A discriminating test</dt><dd>${esc(s.test)}</dd><dt>Implication (not a treatment recommendation)</dt><dd>${esc(s.implication)}</dd></dl>`; }
  const glossLines=Object.entries(s.glosses||{}).filter(([tid])=>!S.libTopic||tid===S.libTopic).slice(0,2).map(([tid,g])=>`<div class="gloss-line"><b>${esc(T[tid]?.title||tid)}:</b> ${esc(g)}</div>`).join('');
  return `<article class="src" id="src-${esc(s.id)}" tabindex="-1"><div class="ttl">${esc(s.citation)}</div><div class="meta"><span class="pill">${esc(kindLabel(s))}</span>${s.access?`<span class="pill">${esc(accessLabel(s.access))}</span>`:''}<span class="pill">${esc(s.evidence_type||'')}</span><span>${esc(s.domain_name||'')}</span>${s.year?`<span>${s.year}</span>`:''}<span>checked ${esc(s.verified||'')}</span>${s.url?`<a href="${esc(s.url)}" target="_blank" rel="noopener">primary link ↗</a>`:''}${s.trial_id?`<span>${esc(s.trial_id)}</span>`:''}</div>${glossLines}${dl}${cited.length||stories.length?`<div class="cited">Cited in: ${cited.map(tid=>`<button type="button" data-goto="${tid}">${esc(T[tid]?.title||tid)}</button>`).join(', ')}${stories.length?` · stories: ${stories.map(x=>esc(D.stories.find(st=>st.id===x.slice(6))?.title||x)).join('; ')}`:''}</div>`:''}</article>`;
}
function renderLibrary(){
  const all=Object.values(D.sources); const q=LIB.q.trim().toLowerCase();
  let list=all;
  const topic=S.libTopic?T[S.libTopic]:null;
  if(topic) list=list.filter(s=>(s.cited_by||[]).includes(topic.id));
  if(S.libSrc) { /* keep all; we scroll to it */ }
  if(LIB.kind) list=list.filter(s=>s.kind===LIB.kind);
  if(LIB.ev) list=list.filter(s=>s.evidence_type===LIB.ev);
  if(LIB.dom) list=list.filter(s=>s.domain===LIB.dom);
  if(q) list=list.filter(s=>JSON.stringify(s).toLowerCase().includes(q));
  list.sort((a,b)=>(a.kind===b.kind?0:a.kind==='study'?-1:b.kind==='study'?1:0)||((b.year||0)-(a.year||0)));
  $('#libCount').innerHTML = topic ? `Showing ${list.length} sources for <b>${esc(topic.title)}</b> · <button type="button" id="libShowAll">Show all</button>` : `Showing ${list.length} of ${all.length} sources${q||LIB.kind||LIB.ev||LIB.dom?' · <button type="button" id="libShowAll">Clear filters</button>':''}`;
  $('#libScope').textContent = topic ? `Scope: ${topic.title}` : 'Scope: all sources';
  $('#libList').innerHTML = list.length ? list.slice(0,400).map(srcHtml).join('') : `<div class="no-results"><b>No sources match.</b><p>Try a drug name, a trial name (PRODIGE, POLO, HALO), an author, or a gene.</p><p><button type="button" id="libShowAll">Clear filters</button></p></div>`;
}
function renderReg(){ const reg=D.regulatory.slice().sort((a,b)=>a.item.localeCompare(b.item)); $('#libRegPane').innerHTML=`<p class="lib-count">${reg.length} regulatory and registry checks · jurisdiction labeled per row · default United States · checked on the date shown. A registered trial is not a result; an approval is not approval for every use.</p>${reg.map(r=>`<article class="src"><div class="ttl">${esc(r.item)}</div><div class="meta"><span class="pill">${esc(r.jurisdiction||'US')}</span><span>checked ${esc(r.checked)}</span>${r.url?`<a href="${esc(r.url)}" target="_blank" rel="noopener">source ↗</a>`:''}</div><dl><dt>Status</dt><dd>${esc(r.status)}</dd>${r.note?`<dt>Note</dt><dd>${esc(r.note)}</dd>`:''}</dl></article>`).join('')}`; }
function renderAboutResearch(){ const s=D.summary; $('#libAboutPane').innerHTML=`<div class="about"><h3>How the research behind this atlas was done</h3><p>Every substantive statement in the atlas resolves to a numbered source. The sources were gathered in a staged search: a broad fan-out across ten domains (anatomy and symptoms; precursors and risk; genes and cell states; the tumor ecosystem; diagnosis and measurement; treatment trials; surgery and recurrence; supportive care; RAS-directed therapy; immunotherapy), then follow-ups from ${s.anchors} anchor studies, a rescreen of the whole corpus with a second fan-out, and ${s.triggers} discovery-triggered deep dives.</p><table><tr><th>Primary studies read in full and counted</th><td>${s.counted_studies}</td></tr><tr><th>Further records kept as leads (abstract or registry only)</th><td>${s.records_total-s.counted_studies}</td></tr><tr><th>Secondary sources (guidelines, labels, registries, reviews)</th><td>${s.secondary_sources}</td></tr><tr><th>Regulatory and registry checks (dated)</th><td>${s.regulatory_checks}</td></tr><tr><th>Inference records (proposed mechanisms with discriminating tests)</th><td>${s.inference_records}</td></tr><tr><th>Research run date</th><td>${s.run_date}</td></tr></table><h3>Evidence vocabulary</h3><p>Four labels describe the <em>kind</em> of support, not its quality. <b>Established biology</b>: anatomy, physiology and biochemistry that is not in dispute. <b>Human studies</b>: observations or trials in people. <b>Experimental findings</b>: perturbations in cells or animals that test cause and effect in a preparation. <b>Proposed mechanism</b>: a bridge between findings that has not been tested directly; notes say whether it is a likely or a possible inference and whether it comes from a publication or from this atlas's synthesis. A small human study is not stronger than a careful experiment merely because it is human.</p><h3>Access and honesty</h3><p>A source counted as read in full was examined as full text or an author manuscript. Where only an abstract or a registry entry could be examined, the entry says so, and the atlas does not claim details that were not read. Regulatory status is United States unless labeled otherwise, with the date it was checked.</p><h3>What this atlas is not</h3><p>It is not a treatment plan or a prognosis calculator. Population figures do not predict an individual, and no figure here should be multiplied against another to produce one. Its purpose is understanding and better conversations with a care team.</p></div>`; }
function openGlossary(doPush=true){ S.dialog='glossary'; $('#glossQ').value=''; renderGlossary(); openDialog('glossDlg'); if(doPush) push(); }
function renderGlossary(){ const q=$('#glossQ').value.trim().toLowerCase(); const list=D.glossary.filter(g=>!q||g.term.toLowerCase().includes(q)||g.definition.toLowerCase().includes(q)); $('#glossCount').textContent=`${list.length} of ${D.glossary.length} terms`; $('#glossList').innerHTML=list.length?`<dl class="gl-list">${list.map(g=>`<dt>${esc(g.term)}</dt><dd>${esc(g.definition)} ${(g.topics||[]).slice(0,2).map(tid=>`<button type="button" data-goto="${tid}" style="color:var(--teal-2);text-decoration:underline">${esc(T[tid]?.title||tid)}</button>`).join(' · ')}</dd>`).join('')}</dl>`:`<div class="no-results"><b>No terms match.</b><p>Try a shorter word, or search the topics list instead.</p></div>`; }
function openReading(){ const t=T[S.topic]; if(!t) return; S.dialog='reading'; $('#readTitle').textContent=t.title; $('#readBody').innerHTML=topicHtml(t,{allOpen:true}); $$('#readBody .sec').forEach(s=>s.dataset.open='true'); openDialog('readDlg'); }
function openAbout(doPush=true){ S.dialog='about'; renderAboutResearch(); const s=D.summary; $('#aboutBody').innerHTML=`<div class="about"><p class="orient">An illustrated field guide to pancreatic ductal adenocarcinoma (PDAC): the healthy pancreas and its neighbors, the biology of the tumor and its ecosystem, how the disease spreads and is staged, the treatment pathways, what monitoring can and cannot see, and what daily life involves.</p><p>The atlas is written for adults, including people newly encountering the diagnosis and their families. It is a guide to understanding and to better conversations with a care team, not a personal treatment plan or a prognosis calculator. Nothing here replaces advice from the people who know your situation.</p><p>Six views organize the material (the pancreas and its neighbors; the tumor ecosystem; cells and genes; spread and stage; treatment and daily life; connections), with ${D.topics.topics.length} topics, eight guided stories, a glossary of ${D.glossary.length} terms, and a research library of ${Object.keys(D.sources).length} sources. Numbered notes beside each claim open the source; the Research library lists what each source found, in whom, with what limits.</p><p>Research run date: ${s.run_date}. Regulatory status is for the United States unless labeled otherwise, with the date it was checked.</p>${$('#libAboutPane').innerHTML}</div>`; openDialog('aboutDlg'); if(doPush) push(); }

/* ------------------------------------------------ tooltips */
const tip=$('#tip'); let tipTarget=null;
function showTip(el,html){ tipTarget=el; tip.innerHTML=html; tip.style.display='block'; const r=el.getBoundingClientRect(); const tw=tip.offsetWidth, th=tip.offsetHeight; let x=r.left+r.width/2-tw/2, y=r.top-th-8; if(y<8) y=r.bottom+8; x=Math.max(8,Math.min(window.innerWidth-tw-8,x)); tip.style.left=x+'px'; tip.style.top=y+'px'; }
function hideTip(){ tip.style.display='none'; tipTarget=null; const st=$('#svgTip'); if(st) st.style.display='none'; }
function citeTip(id){ const s=D.sources[id]; if(!s) return esc(id); const g=Object.values(s.glosses||{})[0]||s.supports||s.phenomenon||''; return `<b>${esc(shortCite(s).slice(0,140))}</b><br><span class="cit">${esc(kindLabel(s))}${s.access?' · '+esc(accessLabel(s.access)):''}</span>${g?`<br>${esc(g.slice(0,220))}`:''}<br><span class="cit">Click to open in the Research library</span>`; }
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.style.display='block'; clearTimeout(t._t); t._t=setTimeout(()=>t.style.display='none',2200); }

/* ------------------------------------------------ events */
function wire(){
  $$('.viewtabs button').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
  $('#storyTab').addEventListener('click',()=>toggleDrawer());
  $('#storyCards').addEventListener('click',e=>{ const c=e.target.closest('.story-card'); if(c) startStory(c.dataset.story,0); });
  $('#leftToggle').addEventListener('click',()=>{ S.left=!S.left; renderShell(); });
  $('#rightToggle').addEventListener('click',()=>{ S.right=!S.right; renderShell(); });
  $('#mTopics').addEventListener('click',()=>{ S.mleft=!S.mleft; S.mright=false; renderShell(); if(S.mleft) $('#topicSearch').focus(); });
  $('#mExpl').addEventListener('click',()=>{ S.mright=!S.mright; S.mleft=false; renderShell(); });
  $('#scrim').addEventListener('click',()=>{ S.mleft=S.mright=false; renderShell(); });
  $$('.mclose').forEach(b=>b.addEventListener('click',()=>{ S.mleft=S.mright=false; renderShell(); }));
  // search
  const ts=$('#topicSearch'); let tmr;
  ts.addEventListener('input',()=>{ clearTimeout(tmr); tmr=setTimeout(()=>{ const was=S.q; S.q=ts.value; if(!was && S.q) S.prevGroups=new Set(S.groupsOpen); if(was && !S.q && S.prevGroups){ S.groupsOpen=S.prevGroups; S.prevGroups=null; } $('#searchWrap').classList.toggle('has-q',!!S.q); renderTopics(); },120); });
  $('#searchClear').addEventListener('click',()=>{ ts.value=''; ts.dispatchEvent(new Event('input')); ts.focus(); });
  $('#navSearch').addEventListener('click',()=>{ if(window.innerWidth<=980){ S.mleft=true; S.mright=false; renderShell(); } else if(!S.left){ S.left=true; renderShell(); } ts.focus(); });
  $('#filterChips').addEventListener('click',e=>{ const c=e.target.closest('.chip'); if(!c) return; const t=c.dataset.type; if(S.filters.has(t)) S.filters.delete(t); else S.filters.add(t); renderTopics(); });
  $('#clearFilters').addEventListener('click',()=>{ S.filters.clear(); renderTopics(); });
  $('#expandAll').addEventListener('click',()=>{ G.forEach(g=>S.groupsOpen.add(g.id)); renderTopics(); });
  $('#collapseAll').addEventListener('click',()=>{ S.groupsOpen.clear(); renderTopics(); });
  $('#topicsList').addEventListener('click',e=>{
    const gh=e.target.closest('.ghead'); if(gh){ const id=gh.parentElement.dataset.group; if(S.q){ /* while searching, groups stay open */ return; } if(S.groupsOpen.has(id)) S.groupsOpen.delete(id); else S.groupsOpen.add(id); renderTopics(); return; }
    const row=e.target.closest('.trow'); if(row){ S.groupsOpen.add(T[row.dataset.topic].group); selectTopic(row.dataset.topic,{focusPanel:false}); if(window.innerWidth<=980){ S.mleft=false; S.mright=true; renderShell(); } return; }
    const tr=e.target.closest('[data-try]'); if(tr){ ts.value=tr.dataset.try; ts.dispatchEvent(new Event('input')); return; }
    if(e.target.id==='resetSearch'){ ts.value=''; S.filters.clear(); ts.dispatchEvent(new Event('input')); }
  });
  // stage: hotspots, inset, tooltips, zoom
  const stage=$('#stage');
  stage.addEventListener('click',e=>{ const ins=e.target.closest('.inset'); if(ins){ setView(ins.dataset.goto); return; } const h=e.target.closest('.hotspot'); if(h){ selectTopic(h.dataset.topic,{view:S.view}); } });
  stage.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ const h=e.target.closest('.hotspot,.inset'); if(h){ e.preventDefault(); h.dispatchEvent(new MouseEvent('click',{bubbles:true})); } } });
  stage.addEventListener('mouseover',e=>{ const h=e.target.closest('.hotspot,.inset'); const st=$('#svgTip'); if(h){ st.textContent=h.getAttribute('aria-label'); st.style.display='block'; } else st.style.display='none'; });
  stage.addEventListener('mousemove',e=>{ const st=$('#svgTip'); if(st.style.display==='block'){ const r=stage.getBoundingClientRect(); st.style.left=Math.min(r.width-250,e.clientX-r.left+14)+'px'; st.style.top=(e.clientY-r.top+16)+'px'; } });
  stage.addEventListener('mouseleave',()=>{ $('#svgTip').style.display='none'; });
  stage.addEventListener('focusin',e=>{ const h=e.target.closest('.hotspot,.inset'); const st=$('#svgTip'); if(h){ st.textContent=h.getAttribute('aria-label'); st.style.display='block'; st.style.left='12px'; st.style.top='12px'; } });
  stage.addEventListener('focusout',()=>{ $('#svgTip').style.display='none'; });
  $('#zoomIn').addEventListener('click',()=>{ S.zoom=Math.min(3,+(S.zoom+0.5).toFixed(2)); applyZoom(); });
  $('#zoomOut').addEventListener('click',()=>{ S.zoom=Math.max(1,+(S.zoom-0.5).toFixed(2)); if(S.zoom===1) S.pan={x:0,y:0}; applyZoom(); });
  $('#zoomReset').addEventListener('click',()=>{ S.zoom=1; S.pan={x:0,y:0}; applyZoom(); });
  let drag=null; stage.addEventListener('pointerdown',e=>{ if(S.zoom===1) return; drag={x:e.clientX,y:e.clientY,px:S.pan.x,py:S.pan.y}; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove',e=>{ if(!drag) return; S.pan={x:drag.px+(e.clientX-drag.x),y:drag.py+(e.clientY-drag.y)}; applyZoom(); });
  stage.addEventListener('pointerup',()=>{ drag=null; }); stage.addEventListener('pointercancel',()=>{ drag=null; });
  // story bar
  document.addEventListener('click',e=>{
    const id=e.target.id;
    if(id==='sbBack'||id==='scBack'){ stepStory(-1); return; }
    if(id==='sbNext'||id==='scNext'){ stepStory(1); return; }
    if(id==='sbExit'||id==='scExit'){ exitStory(); return; }
    if(id==='openReading'){ openReading(); return; }
    if(id==='copyLink'||id==='footCopy'){ navigator.clipboard?.writeText(location.href).then(()=>toast('Link copied — it opens this view and topic'),()=>toast('Could not copy; copy the address bar instead')); return; }
    if(id==='libShowAll'){ S.libTopic=null; S.libSrc=null; LIB.q=''; $('#libQ').value=''; $('#libKind').value=''; $('#libEv').value=''; $('#libDom').value=''; LIB.kind=LIB.ev=LIB.dom=''; renderLibrary(); push(); return; }
    const sec=e.target.closest('[data-sec]'); if(sec){ const k=sec.dataset.sec; const container=sec.closest('.sec'); const open=container.dataset.open!=='true'; container.dataset.open=String(open); sec.setAttribute('aria-expanded',String(open)); sec.lastChild.textContent=open?'Hide full explanation':'Read full explanation'; if(!sec.closest('#readBody')) S.expanded[k]=open; return; }
    const fold=e.target.closest('[data-fold]'); if(fold){ const c=fold.closest('.fold'); const open=c.dataset.open!=='true'; c.dataset.open=String(open); fold.setAttribute('aria-expanded',String(open)); if(!fold.closest('#readBody')) S.expanded[fold.dataset.fold]=open; return; }
    const lt=e.target.closest('[data-lib-topic]'); if(lt){ openLibrary(lt.dataset.libTopic,null); return; }
    const src=e.target.closest('[data-src]'); if(src){ openLibrary(S.dialog==='lib'?S.libTopic:null,src.dataset.src); return; }
    const go=e.target.closest('[data-goto]'); if(go && !go.classList.contains('inset')){ closeDialogs(false); selectTopic(go.dataset.goto,{focusPanel:true}); return; }
    const entry=e.target.closest('[data-entry]'); if(entry){ const [grp,topic,view]=entry.dataset.entry.split('|'); S.groupsOpen.add(grp); if(view) S.view=view; selectTopic(topic,{view:view||undefined}); return; }
    const close=e.target.closest('.dlg .close'); if(close){ closeDialogs(true); return; }
    const tab=e.target.closest('#libTabs button'); if(tab){ setLibTab(tab.dataset.tab); return; }
  });
  $('#libOpen').addEventListener('click',()=>openLibrary(null,null));
  $('#glossOpen').addEventListener('click',()=>openGlossary());
  $('#aboutOpen').addEventListener('click',()=>openAbout());
  $('#footAbout').addEventListener('click',()=>openAbout());
  $('#footLib').addEventListener('click',()=>openLibrary(null,null));
  $('#footGloss').addEventListener('click',()=>openGlossary());
  $('#libQ').addEventListener('input',()=>{ LIB.q=$('#libQ').value; renderLibrary(); });
  ['libKind','libEv','libDom'].forEach(id=>$('#'+id).addEventListener('change',()=>{ LIB[id==='libKind'?'kind':id==='libEv'?'ev':'dom']=$('#'+id).value; renderLibrary(); }));
  $('#glossQ').addEventListener('input',renderGlossary);
  ['libDlg','glossDlg','readDlg','aboutDlg'].forEach(id=>{ const d=$('#'+id); d.addEventListener('cancel',e=>{ e.preventDefault(); closeDialogs(true); }); d.addEventListener('click',e=>{ if(e.target===d) closeDialogs(true); }); });
  // tooltips for citations and glossary
  document.addEventListener('mouseover',e=>{ const c=e.target.closest('sup.cite button'); if(c){ showTip(c,citeTip(c.dataset.src)); return; } const g=e.target.closest('.gloss'); if(g){ showTip(g,`<b>${esc(g.textContent)}</b><br>${esc(g.dataset.def)}`); return; } if(tipTarget && !e.target.closest('#tip')) hideTip(); });
  document.addEventListener('focusin',e=>{ const c=e.target.closest('sup.cite button'); if(c){ showTip(c,citeTip(c.dataset.src)); return; } const g=e.target.closest('.gloss'); if(g){ showTip(g,`<b>${esc(g.textContent)}</b><br>${esc(g.dataset.def)}`); return; } hideTip(); });
  document.addEventListener('click',e=>{ const g=e.target.closest('.gloss'); if(g){ if(tipTarget===g) hideTip(); else showTip(g,`<b>${esc(g.textContent)}</b><br>${esc(g.dataset.def)}`); } else if(!e.target.closest('sup.cite')) hideTip(); },true);
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ hideTip(); if(S.mleft||S.mright){ S.mleft=S.mright=false; renderShell(); } } });
  document.addEventListener('scroll',()=>{ if(tipTarget){ const r=tipTarget.getBoundingClientRect(); if(r.bottom<0||r.top>window.innerHeight) hideTip(); else showTip(tipTarget,tip.innerHTML); } },true);
  window.addEventListener('popstate',applyRoute);
}

/* ------------------------------------------------ init */
async function init(){
  try{ await loadData(); }catch(err){ $('#stage').innerHTML=`<div class="no-results"><b>The atlas data could not be loaded.</b><p>Reload the page. If the problem persists, the data files beside this page may be missing.</p></div>`; console.error(err); return; }
  G=D.topics.groups.slice().sort((a,b)=>a.order-b.order); G.forEach(g=>GROUP_INDEX[g.id]=g);
  D.topics.topics.forEach(t=>T[t.id]=t);
  $('#filterChips').innerHTML=TYPE_FILTERS.map(([t,l,c])=>`<button type="button" class="chip" data-type="${t}" aria-pressed="false"><span class="dot" style="--c:${c}"></span>${l}</button>`).join('');
  $('#libDom').innerHTML='<option value="">All domains</option>'+Object.entries(D.summary.domain_names).map(([k,v])=>`<option value="${k}">${esc(v)}</option>`).join('');
  renderStoryDrawer(); wire();
  if(location.hash && location.hash.length>2) applyRoute(); else { renderAll(); push(true); }
  $('#loading')?.remove();
}
document.addEventListener('DOMContentLoaded',init);
})();
