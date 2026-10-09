/* Original SVG illustrations for the Pancreatic Cancer Atlas. Each view returns an SVG string.
   Hotspots: <g class="hotspot" data-topic="<topic-id>" data-hs="<hotspot-id>" role="button" tabindex="0" aria-label="...">.
   Convention: anatomy drawn as viewed from the front; the person's right side is on the viewer's left. */
window.ATLAS_ILLUS = (function(){
  const C = { ink:'#1b2a41', ink3:'#6b7684', line:'#d9d1c3',
    pancreas:'#e8c9a4', pancreasEdge:'#b98a5a', tumor:'#5a3a46', duodenum:'#e9b8a0', stomach:'#d9c7b3', liver:'#c98d78', spleen:'#9b5e6a',
    vein:'#5b7fb3', artery:'#c45a4b', bile:'#8fae46', duct:'#7f8f6a', node:'#d6c59a', nerve:'#e2c15a', fat:'#f3e9d6',
    caf1:'#4e7d4a', caf2:'#8fb07f', caf3:'#b7a3cf', tcell:'#4b6a9b', myeloid:'#d98a3d', dc:'#7a4e8b', collagen:'#c9b08a', ha:'#9fc7d9', cancer:'#8a5a6a', lumen:'#f7f3ec' };
  function hs(topic, id, label, inner, extra=''){ return `<g class="hotspot" data-topic="${topic}" data-hs="${id}" role="button" tabindex="0" aria-label="${label}" ${extra}>${inner}</g>`; }
  function label(x,y,text,cls='lbl',anchor='start'){ return `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${text}</text>`; }
  function leader(x1,y1,x2,y2){ return `<path class="leader" d="M${x1},${y1} L${x2},${y2}"/>`; }
  function cell(x,y,r,fill,stroke,nuc=true){ return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>${nuc?`<circle cx="${x}" cy="${y}" r="${r*0.42}" fill="${stroke}" opacity=".8"/>`:''}`; }
  function spindle(x,y,len,angle,fill){ return `<ellipse cx="${x}" cy="${y}" rx="${len/2}" ry="${len/7}" transform="rotate(${angle} ${x} ${y})" fill="${fill}" stroke="#355a33" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="${len/9}" fill="#355a33" opacity=".7"/>`; }

  /* ---------------------------------------------------------------- PANCREAS & NEIGHBORS */
  function pancreas(){
    const s=[];
    s.push(`<svg viewBox="0 0 1000 680" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pv-title pv-desc"><title id="pv-title">The pancreas and its neighbors, viewed from the front</title><desc id="pv-desc">The pancreas lies across the upper abdomen behind the stomach: its head sits in the curve of the duodenum with the bile duct running through it, its neck crosses in front of the superior mesenteric and portal veins, its body passes in front of the aorta and its tail reaches the spleen. A tumor is drawn at the junction of the head and neck, beside the vein.</desc>`);
    s.push(`<rect width="1000" height="680" fill="#fff"/>`);
    s.push(`<text class="svg-title" x="22" y="30">The pancreas in its setting</text><text class="svg-note" x="22" y="48">Viewed from the front · the person's right is on your left · stomach shown as an outline because it lies in front of the pancreas</text>`);
    // aorta (behind)
    s.push(`<path d="M470,60 L470,610" stroke="${C.artery}" stroke-width="16" stroke-dasharray="10 7" opacity=".35" fill="none"/>${label(482,72,'Aorta (behind)','lbl small')}`);
    // liver
    s.push(hs('liver','liver','Liver',`<path class="fill" d="M60,120 C80,60 300,50 480,70 C560,78 600,120 560,170 C520,215 430,225 380,215 C330,205 300,230 250,240 C180,252 90,230 60,170 Z" fill="${C.liver}" stroke="#9a5f4d" stroke-width="1.5" opacity=".93"/>`));
    s.push(label(110,150,'Liver','lbl strong'));
    // gallbladder
    s.push(`<ellipse cx="238" cy="236" rx="22" ry="12" fill="#a7c35a" stroke="#6f8a2e" stroke-width="1"/>${label(190,262,'Gallbladder','lbl small')}`);
    // spleen
    s.push(hs('spleen','spleen','Spleen',`<path class="fill" d="M775,150 C820,135 870,170 862,230 C855,290 810,310 772,295 C745,284 740,220 752,185 C758,168 764,154 775,150 Z" fill="${C.spleen}" stroke="#6d3f49" stroke-width="1.5"/>`));
    s.push(label(840,120,'Spleen','lbl strong','end'));
    // stomach ghost outline
    s.push(hs('stomach','stomach','Stomach (outline; lies in front of the pancreas)',`<path class="fill" d="M560,95 C620,40 760,60 760,150 C760,250 650,330 520,335 C430,340 370,330 330,300 C380,290 470,250 520,190 C545,160 550,120 560,95 Z" fill="${C.stomach}" fill-opacity=".18" stroke="#8c7a66" stroke-width="1.6" stroke-dasharray="7 5"/>`));
    s.push(label(640,150,'Stomach','lbl strong')+label(640,166,'(outline: in front of the pancreas)','lbl small'));
    // celiac axis and arteries (behind pancreas top)
    s.push(hs('celiac-hepatic-arteries','celiac','Celiac axis with common hepatic artery',`<path class="fill" d="M470,286 L470,270" stroke="${C.artery}" stroke-width="9" fill="none"/><path class="fill" d="M470,272 C440,262 400,262 352,246" stroke="${C.artery}" stroke-width="6" fill="none"/><path class="fill" d="M352,246 C330,250 318,270 316,300 C314,320 310,340 304,360" stroke="${C.artery}" stroke-width="4" fill="none"/><path class="fill" d="M352,246 C345,232 340,226 338,222" stroke="${C.artery}" stroke-width="5" fill="none"/>`));
    s.push(label(486,294,'Celiac axis','lbl')+label(414,250,'Common hepatic artery','lbl small')+leader(412,252,372,252));
    s.push(hs('splenic-vessels','splenic','Splenic artery and splenic vein',`<path class="fill" d="M470,272 C520,262 560,282 600,262 C640,244 680,270 720,250 C745,238 760,246 770,250" stroke="${C.artery}" stroke-width="5" fill="none"/><path class="fill" d="M770,278 C700,300 600,330 500,342 C460,347 430,345 408,344" stroke="${C.vein}" stroke-width="7" fill="none" opacity=".9"/>`));
    s.push(label(600,246,'Splenic artery','lbl small')+label(590,352,'Splenic vein (behind the body)','lbl small'));
    // SMV / portal vein
    s.push(hs('smv-portal-vein','smv','Superior mesenteric vein and portal vein',`<path class="fill" d="M400,590 L400,400" stroke="${C.vein}" stroke-width="13" fill="none"/><path class="fill" d="M400,400 L400,330 C400,290 360,270 346,222" stroke="${C.vein}" stroke-width="13" fill="none"/>`));
    s.push(label(392,660,'Superior mesenteric vein','lbl')+leader(400,594,398,650)+label(372,285,'Portal vein','lbl','end'));
    // SMA
    s.push(hs('sma','sma','Superior mesenteric artery',`<path class="fill" d="M470,300 C450,330 436,360 432,400 L432,590" stroke="${C.artery}" stroke-width="9" fill="none"/>`));
    s.push(label(446,610,'Superior mesenteric artery','lbl')+leader(444,606,434,580));
    // nerve plexus around celiac/SMA
    s.push(hs('nerve-plexus','nerve-plexus','Celiac plexus and nerves around the arteries',`<g class="fill" stroke="${C.nerve}" stroke-width="1.6" fill="none"><path d="M450,296 C430,300 420,320 410,340 M490,296 C505,310 515,330 520,350 M452,302 C462,330 455,360 448,390 M488,304 C486,330 492,360 482,392 M440,350 L470,345 L500,352 M452,312 L488,312 M430,372 C445,380 466,384 484,378"/><circle cx="452" cy="312" r="5" fill="${C.nerve}"/><circle cx="488" cy="312" r="5" fill="${C.nerve}"/><circle cx="470" cy="345" r="4" fill="${C.nerve}"/></g>`));
    s.push(label(520,332,'Celiac plexus','lbl'));
    // duodenum
    s.push(hs('duodenum','duodenum','Duodenum, curving around the head of the pancreas',`<path class="fill" d="M322,300 C280,296 248,300 232,330 C212,368 210,430 220,480 C228,512 260,516 300,516 L430,516 C455,516 468,500 470,480 L470,462" stroke="${C.duodenum}" stroke-width="30" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M322,300 C280,296 248,300 232,330 C212,368 210,430 220,480 C228,512 260,516 300,516 L430,516 C455,516 468,500 470,480 L470,462" stroke="#b07f68" stroke-width="30" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".25"/><path d="M322,300 C280,296 248,300 232,330 C212,368 210,430 220,480 C228,512 260,516 300,516 L430,516 C455,516 468,500 470,480 L470,462" stroke="#f4dccd" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`));
    s.push(label(150,420,'Duodenum','lbl strong')+leader(195,414,222,410)+label(486,470,'Jejunum →','lbl small'));
    // pancreas gland
    s.push(hs('pancreas-overview','pancreas','The pancreas',`<path class="fill" d="M250,330 C280,322 340,330 382,334 C398,332 410,330 424,330 C450,312 520,282 600,268 C660,258 720,250 790,246 C792,262 790,274 788,278 C720,290 640,308 580,330 C520,350 470,360 436,376 C428,380 424,386 422,392 C424,420 432,450 430,470 C412,486 380,490 340,486 C300,484 262,470 248,440 C240,410 242,370 250,330 Z" fill="${C.pancreas}" stroke="${C.pancreasEdge}" stroke-width="1.6" opacity=".96"/><path d="M262,350 C300,345 330,348 370,350 M270,400 C300,396 330,398 360,400 M448,345 C500,330 560,312 620,300 M470,370 C520,352 580,336 640,318 M640,275 C690,266 740,258 775,256" stroke="${C.pancreasEdge}" stroke-width=".7" fill="none" opacity=".6"/>`));
    // head/neck/body hotspots (transparent overlays on top of gland)
    s.push(hs('pancreas-head','head','Head and uncinate process of the pancreas',`<path class="fill" d="M250,330 C280,322 340,330 382,334 L382,392 C386,420 395,450 395,470 C380,488 340,490 300,486 C262,482 250,462 248,440 C240,410 242,370 250,330 Z" fill="#000" fill-opacity="0" stroke="transparent" stroke-width="2"/>`));
    s.push(hs('pancreas-neck','neck','Neck of the pancreas, crossing in front of the superior mesenteric vein',`<path class="fill" d="M382,334 C398,332 410,330 424,330 L436,376 C428,380 424,386 422,392 L395,470 L382,392 Z" fill="#000" fill-opacity="0" stroke="transparent" stroke-width="2"/>`));
    s.push(hs('pancreas-body-tail','body','Body and tail of the pancreas',`<path class="fill" d="M424,330 C450,312 520,282 600,268 C660,258 720,250 790,246 C792,262 790,274 788,278 C720,290 640,308 580,330 C520,350 470,360 436,376 Z" fill="#000" fill-opacity="0" stroke="transparent" stroke-width="2"/>`));
    s.push(label(300,560,'Head','lbl strong')+leader(312,548,318,470)+label(520,560,'Uncinate process','lbl small')+label(520,574,'(hooks behind the vein)','lbl small')+leader(516,560,428,474));
    s.push(label(392,318,'Neck','lbl strong','middle')+label(560,232,'Body','lbl strong')+label(735,226,'Tail','lbl strong'));
    // ducts
    s.push(hs('pancreatic-duct','duct','Main pancreatic duct',`<path class="fill" d="M782,262 C700,276 620,296 540,320 C480,338 440,352 410,372 C380,392 330,410 290,420 C275,424 265,428 262,430" stroke="${C.duct}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`));
    s.push(label(640,300,'Main pancreatic duct','lbl small'));
    s.push(hs('bile-duct-ampulla','bile-duct','Common bile duct, running through the head to the ampulla',`<path class="fill" d="M340,222 C336,250 330,290 322,330 C312,370 290,400 266,422 C262,426 260,430 258,432" stroke="${C.bile}" stroke-width="5" fill="none" stroke-linecap="round"/><circle class="fill" cx="257" cy="433" r="7" fill="${C.bile}" stroke="#5f7a2a" stroke-width="1"/>`));
    s.push(label(236,300,'Common bile duct','lbl','end')+leader(240,296,326,318)+label(236,456,'Ampulla','lbl small','end')+leader(240,452,252,438));
    // lymph nodes
    s.push(hs('lymph-nodes','nodes','Lymph nodes around the pancreas and along the vessels',`<g class="fill" fill="${C.node}" stroke="#9c8a55" stroke-width="1"><ellipse cx="258" cy="352" rx="8" ry="5"/><ellipse cx="262" cy="476" rx="8" ry="5"/><ellipse cx="320" cy="500" rx="8" ry="5"/><ellipse cx="372" cy="290" rx="8" ry="5"/><ellipse cx="330" cy="266" rx="8" ry="5"/><ellipse cx="452" cy="416" rx="8" ry="5"/><ellipse cx="455" cy="446" rx="8" ry="5"/><ellipse cx="660" cy="248" rx="8" ry="5"/><ellipse cx="700" cy="286" rx="8" ry="5"/></g>`));
    s.push(label(476,430,'Lymph node stations','lbl small')+leader(474,426,462,418)+leader(270,340,258,352)+label(205,338,'nodes','lbl small'));
    // tumor
    s.push(hs('what-is-pdac','tumor','Tumor at the junction of the head and neck, beside the superior mesenteric vein',`<path class="fill" d="M372,380 C380,366 402,364 410,376 C420,384 418,402 408,410 C398,420 378,418 370,406 C364,398 366,388 372,380 Z" fill="${C.tumor}" stroke="#3a2230" stroke-width="1.5"/><path d="M376,392 C384,386 398,388 404,396" stroke="#fff" stroke-width=".8" fill="none" opacity=".5"/>`));
    s.push(label(300,636,'Tumor (example: head–neck junction, touching the vein)','lbl strong')+leader(372,626,388,412));
    // ecosystem inset (magnifier)
    s.push(`<g class="inset" data-goto="ecosystem" role="button" tabindex="0" aria-label="Open the tumor ecosystem view"><line x1="396" y1="412" x2="186" y2="540" stroke="${C.ink3}" stroke-width="1" stroke-dasharray="4 3"/><circle class="ring" cx="130" cy="560" r="64" fill="#fff" stroke="${C.ink3}" stroke-width="2"/><clipPath id="insetClip"><circle cx="130" cy="560" r="62"/></clipPath><g clip-path="url(#insetClip)">${miniEcosystem(130,560)}</g><text class="lbl strong" x="130" y="648" text-anchor="middle">Tumor ecosystem inset</text><text class="lbl small" x="130" y="663" text-anchor="middle">click to open the view</text></g>`);
    // gland micro inset
    s.push(`<g><line x1="600" y1="318" x2="800" y2="460" stroke="${C.ink3}" stroke-width="1" stroke-dasharray="4 3"/><circle cx="600" cy="318" r="7" fill="none" stroke="${C.ink3}" stroke-width="1.4"/><circle cx="860" cy="520" r="78" fill="#fff" stroke="${C.ink3}" stroke-width="2"/><clipPath id="glandClip"><circle cx="860" cy="520" r="76"/></clipPath><g clip-path="url(#glandClip)">${miniGland(860,520)}</g><text class="lbl strong" x="860" y="618" text-anchor="middle">Inside the gland</text><text class="lbl small" x="860" y="633" text-anchor="middle">acini · ducts · islets</text></g>`);
    s.push(`</svg>`);
    return s.join('');
  }
  function miniEcosystem(cx,cy){
    const g=[];
    g.push(`<rect x="${cx-70}" y="${cy-70}" width="140" height="140" fill="#fbf6ee"/>`);
    for(let i=0;i<9;i++){ g.push(`<path d="M${cx-70},${cy-60+i*15} q 20,${(i%2?8:-8)} 40,0 t 40,0 t 40,0 t 40,0" stroke="${C.collagen}" stroke-width="1.2" fill="none" opacity=".8"/>`); }
    g.push(`<g>${[0,1,2,3,4,5,6].map(i=>{const a=i/7*Math.PI*2; return cell(cx+Math.cos(a)*16,cy+Math.sin(a)*16,8,C.cancer,'#4a2e3a');}).join('')}<circle cx="${cx}" cy="${cy}" r="5" fill="${C.lumen}"/></g>`);
    g.push(spindle(cx-38,cy-30,26,-30,C.caf1)+spindle(cx+40,cy-22,26,30,C.caf1)+spindle(cx-42,cy+30,26,20,C.caf2)+spindle(cx+44,cy+28,26,-20,C.caf2));
    g.push(cell(cx-56,cy+4,5,'#dbe4f2',C.tcell)+cell(cx-50,cy-50,5,'#dbe4f2',C.tcell)+cell(cx+56,cy-54,5,'#dbe4f2',C.tcell)+cell(cx+58,cy+6,7,'#fbe3c8',C.myeloid));
    g.push(`<path d="M${cx-70},${cy+56} C${cx-30},${cy+50} ${cx+30},${cy+62} ${cx+70},${cy+56}" stroke="${C.artery}" stroke-width="5" fill="none" opacity=".7"/>`);
    return g.join('');
  }
  function miniGland(cx,cy){
    const g=[]; g.push(`<rect x="${cx-80}" y="${cy-80}" width="160" height="160" fill="#fbf6ee"/>`);
    // duct
    g.push(hs('duct-cells','duct-cells','Duct cells lining the small ducts',`<path class="fill" d="M${cx-80},${cy+10} C${cx-40},${cy} ${cx+20},${cy+20} ${cx+80},${cy+6}" stroke="${C.duct}" stroke-width="9" fill="none"/><path d="M${cx-80},${cy+10} C${cx-40},${cy} ${cx+20},${cy+20} ${cx+80},${cy+6}" stroke="#fff" stroke-width="3" fill="none"/>`));
    // acini
    const ac=(x,y)=>{let r='';for(let i=0;i<6;i++){const a=i/6*Math.PI*2;r+=`<ellipse cx="${x+Math.cos(a)*11}" cy="${y+Math.sin(a)*11}" rx="7" ry="5" transform="rotate(${a*180/Math.PI} ${x+Math.cos(a)*11} ${y+Math.sin(a)*11})" fill="#e7b89b" stroke="#a9704f" stroke-width=".8"/>`;} return r+`<circle cx="${x}" cy="${y}" r="3" fill="${C.duct}"/>`;};
    g.push(hs('acinar-cells','acinar','Acinar cells, arranged in clusters that make digestive enzymes',`<g class="fill" stroke="transparent">${ac(cx-42,cy-36)}${ac(cx-10,cy-48)}${ac(cx+30,cy-34)}${ac(cx-44,cy+48)}${ac(cx+8,cy+52)}</g><path d="M${cx-42},${cy-24} L${cx-40},${cy+4} M${cx-10},${cy-36} L${cx-8},${cy+8} M${cx+30},${cy-22} L${cx+28},${cy+12} M${cx-44},${cy+36} L${cx-42},${cy+14} M${cx+8},${cy+40} L${cx+6},${cy+16}" stroke="${C.duct}" stroke-width="2" fill="none"/>`));
    // islet
    g.push(hs('islets','islets','An islet of Langerhans, making insulin and glucagon',`<g class="fill" stroke="transparent"><circle cx="${cx+46}" cy="${cy+40}" r="22" fill="#f6dfe3" stroke="#b56b7b" stroke-width="1"/>${[[-8,-6],[6,-9],[10,4],[-2,9],[-11,6],[2,-1]].map(([dx,dy])=>`<circle cx="${cx+46+dx}" cy="${cy+40+dy}" r="4" fill="#c97a8d"/>`).join('')}</g>`));
    g.push(`<text class="lbl small" x="${cx-70}" y="${cy-62}">acini</text><text class="lbl small" x="${cx+26}" y="${cy+72}">islet</text><text class="lbl small" x="${cx-74}" y="${cy+26}">duct</text>`);
    return g.join('');
  }

  /* ---------------------------------------------------------------- TUMOR ECOSYSTEM */
  function ecosystem(){
    const s=[]; const cx=470, cy=350;
    s.push(`<svg viewBox="0 0 1000 680" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="ev-title ev-desc"><title id="ev-title">The tumor ecosystem</title><desc id="ev-desc">A field about one millimeter across: cancer cells form small glands surrounded by scar-like stroma with fibroblasts in several states, collagen and hyaluronan, compressed blood vessels, T cells held away from the cancer cells, macrophages and myeloid cells, a nerve with cancer cells tracking along it, and a nutrient-poor, low-oxygen core.</desc>`);
    s.push(`<rect width="1000" height="680" fill="#fff"/><text class="svg-title" x="22" y="30">Inside the tumor: the ecosystem around the cancer cells</text><text class="svg-note" x="22" y="48">Field of view about 1 mm · cells enlarged for legibility · colors mark cell types, not stains</text>`);
    // matrix background: collagen fibers + hyaluronan dots
    s.push(hs('matrix-pressure','matrix','Extracellular matrix: collagen fibers and hyaluronan that generate pressure',`<g class="fill" stroke="transparent"><rect x="90" y="70" width="820" height="540" rx="26" fill="#fbf6ee"/>${Array.from({length:22},(_,i)=>`<path d="M100,${90+i*24} q 60,${i%2?12:-12} 120,0 t 120,0 t 120,0 t 120,0 t 120,0 t 120,0 t 120,0" stroke="${C.collagen}" stroke-width="1.4" fill="none" opacity=".75"/>`).join('')}${Array.from({length:160},(_,i)=>{const x=110+((i*137)%800), y=85+((i*89)%520); return `<circle cx="${x}" cy="${y}" r="1.6" fill="${C.ha}"/>`;}).join('')}</g>`));
    // hypoxic / nutrient-poor core (gradient)
    s.push(`<defs><radialGradient id="hypo" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#9a8f9e" stop-opacity=".35"/><stop offset="100%" stop-color="#9a8f9e" stop-opacity="0"/></radialGradient></defs>`);
    s.push(hs('nutrient-scavenging','metabolism','Nutrient-poor, low-oxygen core where cancer cells scavenge and recycle',`<circle class="fill" cx="${cx+40}" cy="${cy+20}" r="150" fill="url(#hypo)" stroke="transparent"/>`));
    // neighborhoods: dashed boundary
    s.push(hs('sub-environments','neighborhood','Two tumor neighborhoods: a fibroblast-rich, immune-poor region and a looser, immune-richer region',`<path class="fill" d="M130,120 C300,160 330,420 170,560" stroke="${C.ink3}" stroke-width="1.4" stroke-dasharray="8 6" fill="none"/>`));
    s.push(label(118,110,'Looser, immune-richer neighborhood','lbl small')+label(560,578,'Fibroblast-rich, immune-poor neighborhood','lbl small'));
    // vessels: a collapsed vessel near the glands and a patent one at the periphery
    s.push(hs('blood-supply-hypoxia','vessel','Blood vessels: one compressed by matrix pressure near the tumor, one open at the edge',`<g class="fill" stroke="transparent"><path d="M300,470 C380,455 440,500 520,480 C600,462 660,500 740,482" stroke="${C.artery}" stroke-width="9" fill="none" opacity=".85"/><path d="M300,470 C380,455 440,500 520,480 C600,462 660,500 740,482" stroke="#fff" stroke-width="2" fill="none" stroke-dasharray="3 10"/><path d="M120,600 C300,600 480,606 900,598" stroke="${C.artery}" stroke-width="16" fill="none" opacity=".9"/><path d="M120,600 C300,600 480,606 900,598" stroke="#f6c9c0" stroke-width="7" fill="none"/>${[180,260,340,520,700,820].map(x=>`<circle cx="${x}" cy="599" r="4" fill="#c0392b"/>`).join('')}</g>`));
    s.push(label(760,476,'Compressed vessel (little flow)','lbl small')+label(120,628,'Open vessel at the tumor edge','lbl small'));
    // cancer glands
    const gland=(x,y,r,n)=>{let g='';for(let i=0;i<n;i++){const a=i/n*Math.PI*2; g+=cell(x+Math.cos(a)*r,y+Math.sin(a)*r,r*0.52,C.cancer,'#4a2e3a');} return g+`<circle cx="${x}" cy="${y}" r="${r*0.42}" fill="${C.lumen}"/>`;};
    s.push(hs('what-is-pdac','tumor-cells','Cancer cells forming small irregular glands',`<g class="fill" stroke="transparent">${gland(cx,cy,34,10)}${gland(cx+150,cy+60,28,8)}${gland(cx+60,cy-120,22,7)}${cell(cx+110,cy-40,13,C.cancer,'#4a2e3a')}${cell(cx-80,cy+70,13,C.cancer,'#4a2e3a')}</g><g stroke="${C.tcell}" stroke-width="1" stroke-dasharray="3 3" fill="none" opacity=".7"><circle cx="${cx}" cy="${cy}" r="50"/><circle cx="${cx+150}" cy="${cy+60}" r="42"/></g>`));
    s.push(label(cx-30,cy-62,'Cancer cells (glands)','lbl strong')+label(cx+56,cy+14,'CXCL12 coat','lbl small'));
    // fibroblasts: myCAF adjacent, iCAF distant, apCAF
    s.push(hs('fibroblast-states','caf','Cancer-associated fibroblasts in three states: myofibroblastic next to the glands, inflammatory farther away, antigen-presenting',`<g class="fill" stroke="transparent">${spindle(cx-62,cy-12,44,-70,C.caf1)}${spindle(cx+54,cy+46,44,40,C.caf1)}${spindle(cx+100,cy+118,44,-10,C.caf1)}${spindle(cx+194,cy+4,44,70,C.caf1)}${spindle(cx-20,cy+56,44,15,C.caf1)}${spindle(cx+210,cy-110,52,-35,C.caf2)}${spindle(cx-150,cy-90,52,25,C.caf2)}${spindle(cx+300,cy+150,52,20,C.caf2)}${spindle(cx-200,cy+150,52,-20,C.caf2)}${spindle(cx-110,cy+200,52,40,C.caf2)}<g><ellipse cx="${cx+260}" cy="${cy-40}" rx="26" ry="8" transform="rotate(-20 ${cx+260} ${cy-40})" fill="${C.caf3}" stroke="#5e4a73" stroke-width=".8"/><circle cx="${cx+260}" cy="${cy-40}" r="5" fill="#5e4a73" opacity=".7"/>${[0,1,2,3].map(i=>`<rect x="${cx+240+i*11}" y="${cy-56}" width="4" height="6" fill="#5e4a73"/>`).join('')}</g></g>`));
    s.push(label(cx-230,cy-128,'Inflammatory fibroblasts (farther away)','lbl small')+label(cx+120,cy+150,'Myofibroblasts (pressed against glands)','lbl small')+label(cx+236,cy-70,'Antigen-presenting state','lbl small','end'));
    // T cells kept at a distance
    s.push(hs('t-cells','tcell','T cells, mostly held in the stroma away from the cancer cells',`<g class="fill" stroke="transparent">${[[150,150],[170,210],[130,260],[200,320],[160,380],[215,440],[140,470],[820,160],[860,230],[790,300],[850,360],[300,130],[380,560],[640,140]].map(([x,y])=>cell(x,y,8,'#dbe4f2',C.tcell)).join('')}${cell(cx+20,cy+36,8,'#dbe4f2',C.tcell)}</g>`));
    s.push(label(118,136,'T cells','lbl strong')+label(760,140,'T cells','lbl strong'));
    // myeloid cells
    s.push(hs('myeloid-cells','myeloid','Macrophages and myeloid suppressor cells near the glands',`<g class="fill" stroke="transparent">${[[cx-120,cy+10],[cx+96,cy-70],[cx+230,cy+90],[cx-40,cy+130]].map(([x,y])=>`<path d="M${x-14},${y-6} C${x-18},${y-20} ${x+2},${y-22} ${x+8},${y-14} C${x+20},${y-18} ${x+22},${y-2} ${x+14},${y+6} C${x+18},${y+18} ${x+2},${y+22} ${x-6},${y+14} C${x-20},${y+16} ${x-22},${y+2} ${x-14},${y-6} Z" fill="#fbe3c8" stroke="${C.myeloid}" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="5" fill="${C.myeloid}" opacity=".8"/>`).join('')}${[[cx+300,cy+40],[cx-180,cy+60]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="9" fill="#fff0e0" stroke="${C.myeloid}" stroke-width="1.2"/><path d="M${x-5},${y} q 2,-6 5,0 q 2,6 5,0" stroke="${C.myeloid}" stroke-width="2" fill="none"/>`).join('')}</g>`));
    s.push(label(cx-200,cy+12,'Macrophages','lbl strong','end')+label(cx+286,cy+66,'Neutrophil-like','lbl small')+label(cx+286,cy+80,'suppressor cells','lbl small'));
    // dendritic cell (rare, at periphery)
    s.push(hs('antigen-presentation','antigen','A dendritic cell, scarce in these tumors, the cell that would start a T-cell response',`<g class="fill" stroke="transparent"><g transform="translate(240,560)"><path d="M0,-12 L6,-4 L16,-6 L10,2 L16,10 L6,8 L0,16 L-6,8 L-16,10 L-10,2 L-16,-6 L-6,-4 Z" fill="#e9dff1" stroke="${C.dc}" stroke-width="1.3"/><circle r="4" fill="${C.dc}"/></g></g>`));
    s.push(label(262,566,'Dendritic cell (scarce)','lbl small'));
    // nerve with perineural invasion
    s.push(hs('nerves-in-tumor','nerve','A nerve crossing the tumor, with cancer cells tracking along its sheath',`<g class="fill" stroke="transparent"><path d="M700,90 C740,180 760,300 840,420" stroke="${C.nerve}" stroke-width="14" fill="none" opacity=".9"/><path d="M700,90 C740,180 760,300 840,420" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="14 8"/>${[[722,160],[742,230],[776,300],[812,370]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="6" ry="10" fill="#f3e3a0" stroke="#a88a2a" stroke-width=".8"/>`).join('')}${cell(766,250,9,C.cancer,'#4a2e3a')}${cell(798,330,9,C.cancer,'#4a2e3a')}</g>`));
    s.push(label(850,436,'Nerve with cancer cells along it','lbl small','end')+label(690,80,'Nerve','lbl strong'));
    // stroma label (desmoplasia)
    s.push(hs('desmoplasia','stroma','The scar-like stroma that makes up most of the tumor',`<rect class="fill" x="92" y="72" width="816" height="536" rx="26" fill="transparent" stroke="transparent" stroke-width="3" pointer-events="stroke"/>`));
    s.push(label(900,560,'Scar-like stroma fills most of the tumor','lbl small','end')+label(cx+60,cy+46,'low oxygen · low glucose','lbl small'));
    s.push(`</svg>`);
    return s.join('');
  }

  /* ---------------------------------------------------------------- CELLS & GENES */
  function cells(){
    const s=[];
    s.push(`<svg viewBox="0 0 1000 680" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cv-title cv-desc"><title id="cv-title">Inside the cancer cell: growth signals, brakes and repair</title><desc id="cv-desc">A cell with a growth-factor receptor passing its signal to KRAS, which drives the MAPK and PI3K pathways toward the nucleus; cell-cycle brakes CDKN2A and the damage sensor TP53; TGF-beta signaling through SMAD4; and DNA repair by BRCA1, BRCA2 and PALB2. Side panels show precursor routes, punctuated genome evolution, classical and basal-like states, KRAS wild-type targets, drug-metabolism variants and testing.</desc>`);
    s.push(`<rect width="1000" height="680" fill="#fff"/><text class="svg-title" x="22" y="30">Inside the cell: signals, brakes, repair</text><text class="svg-note" x="22" y="668">Left: one cell. Right: how cells change over time and what tests look for.</text>`);
    // cell body
    s.push(`<path d="M60,120 C60,80 120,70 200,72 L520,72 C600,72 640,100 640,160 L640,560 C640,620 600,640 520,640 L160,640 C90,640 60,600 60,540 Z" fill="#f7f1e6" stroke="#b9a98f" stroke-width="2"/>`);
    // receptor + pathway
    s.push(hs('growth-control','pathway','Growth-factor receptor passing its signal through KRAS to the MAPK and PI3K pathways',`<g class="fill" stroke="transparent"><rect x="210" y="56" width="14" height="60" fill="#8fa3bf" stroke="#4b6a9b" stroke-width="1"/><rect x="232" y="56" width="14" height="60" fill="#8fa3bf" stroke="#4b6a9b" stroke-width="1"/><circle cx="228" cy="48" r="8" fill="#f1c45c" stroke="#9a7b1d" stroke-width="1"/><text class="lbl small" x="252" y="70">growth-factor receptor</text><text class="lbl small" x="252" y="84">(EGFR family)</text><path d="M228,120 L228,150" stroke="${C.ink}" stroke-width="2" marker-end="url(#arr)"/><path d="M212,214 C180,250 160,290 150,330" stroke="${C.ink}" stroke-width="2" fill="none" marker-end="url(#arr)"/><path d="M244,214 C280,250 300,290 310,330" stroke="${C.ink}" stroke-width="2" fill="none" marker-end="url(#arr)"/>${['RAF','MEK','ERK'].map((n,i)=>`<rect x="104" y="${336+i*40}" width="80" height="28" rx="6" fill="#e9eef6" stroke="#4b6a9b" stroke-width="1"/><text class="lbl" x="144" y="${355+i*40}" text-anchor="middle">${n}</text>${i<2?`<path d="M144,${364+i*40} L144,${374+i*40}" stroke="${C.ink}" stroke-width="2" marker-end="url(#arr)"/>`:''}`).join('')}${['PI3K','AKT','mTOR'].map((n,i)=>`<rect x="272" y="${336+i*40}" width="80" height="28" rx="6" fill="#e9eef6" stroke="#4b6a9b" stroke-width="1"/><text class="lbl" x="312" y="${355+i*40}" text-anchor="middle">${n}</text>${i<2?`<path d="M312,${364+i*40} L312,${374+i*40}" stroke="${C.ink}" stroke-width="2" marker-end="url(#arr)"/>`:''}`).join('')}<text class="lbl small" x="144" y="330" text-anchor="middle">MAPK pathway</text><text class="lbl small" x="312" y="330" text-anchor="middle">PI3K pathway</text><path d="M184,350 L300,350" stroke="transparent"/><path d="M144,452 C200,480 240,490 262,500" stroke="${C.ink}" stroke-width="2" fill="none" marker-end="url(#arr)"/><path d="M312,452 C290,470 280,486 274,500" stroke="${C.ink}" stroke-width="2" fill="none" marker-end="url(#arr)"/><text class="lbl small" x="100" y="482">"grow, survive, build"</text></g>`));
    s.push(`<defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${C.ink}"/></marker><marker id="arrR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#b5563a"/></marker></defs>`);
    // KRAS switch
    s.push(hs('kras','kras','KRAS: the on–off switch that is stuck on in about 90 percent of pancreatic cancers',`<g class="fill" stroke="transparent"><rect x="178" y="150" width="100" height="64" rx="12" fill="#fde7df" stroke="#b5563a" stroke-width="2"/><text class="lbl strong" x="228" y="176" text-anchor="middle">KRAS</text><text class="lbl small" x="228" y="192" text-anchor="middle">GTP = on · GDP = off</text><text class="lbl small" x="228" y="206" text-anchor="middle">mutation: cannot switch off</text></g>`));
    // nucleus
    s.push(`<ellipse cx="420" cy="540" rx="190" ry="84" fill="#eef0f4" stroke="#7a86a0" stroke-width="1.5"/><text class="lbl small" x="420" y="470" text-anchor="middle">nucleus</text>`);
    // cell cycle + CDKN2A
    s.push(hs('cdkn2a','cdkn2a','CDKN2A (p16): a brake on the cell cycle, lost in most pancreatic cancers',`<g class="fill" stroke="transparent"><circle cx="330" cy="545" r="40" fill="#fff" stroke="#7a4e8b" stroke-width="1.6"/><path d="M330,505 A40,40 0 0 1 370,545" stroke="#7a4e8b" stroke-width="6" fill="none"/><text class="lbl small" x="330" y="541" text-anchor="middle">cell</text><text class="lbl small" x="330" y="555" text-anchor="middle">cycle</text><rect x="366" y="508" width="58" height="22" rx="5" fill="#f1e6f5" stroke="#7a4e8b"/><text class="lbl small" x="395" y="523" text-anchor="middle">CDK4/6</text><rect x="252" y="490" width="70" height="22" rx="5" fill="#f1e6f5" stroke="#7a4e8b"/><text class="lbl small" x="287" y="505" text-anchor="middle">p16 brake</text><path d="M322,501 L364,516" stroke="#7a4e8b" stroke-width="2"/><path d="M356,508 l 8,8 m0,-8 l-8,8" stroke="#7a4e8b" stroke-width="2"/></g>`));
    // TP53
    s.push(hs('tp53','tp53','TP53 (p53): the damage sensor that halts or kills a damaged cell; mutated in most pancreatic cancers',`<g class="fill" stroke="transparent"><rect x="440" y="520" width="140" height="50" rx="8" fill="#fff" stroke="#b5563a" stroke-width="1.6"/><text class="lbl strong" x="510" y="541" text-anchor="middle">p53</text><text class="lbl small" x="510" y="558" text-anchor="middle">DNA damage → stop, repair or die</text></g>`));
    // TGF-beta / SMAD4
    s.push(hs('smad4','smad4','TGF-beta receptor signaling through SMAD4, which normally tells epithelial cells to stop dividing',`<g class="fill" stroke="transparent"><rect x="596" y="300" width="14" height="60" fill="#bcd3c0" stroke="#4e7d4a"/><rect x="616" y="300" width="14" height="60" fill="#bcd3c0" stroke="#4e7d4a"/><circle cx="612" cy="292" r="7" fill="#9fcf9a" stroke="#4e7d4a"/><text class="lbl small" x="590" y="282" text-anchor="end">TGF-β receptor</text><path d="M612,362 C590,400 560,430 540,470" stroke="#4e7d4a" stroke-width="2" fill="none" marker-end="url(#arr)"/><rect x="520" y="400" width="72" height="24" rx="6" fill="#e6f0e4" stroke="#4e7d4a"/><text class="lbl small" x="556" y="416" text-anchor="middle">SMAD4</text><text class="lbl small" x="560" y="446" text-anchor="middle">"stop dividing"</text></g>`));
    // DNA repair
    s.push(hs('dna-repair-checkpoints','repair','DNA repair of double-strand breaks by BRCA1, BRCA2 and PALB2; ATM signals damage',`<g class="fill" stroke="transparent"><rect x="440" y="580" width="150" height="34" rx="6" fill="#fff" stroke="#4b6a9b" stroke-width="1.4"/><text class="lbl small" x="515" y="594" text-anchor="middle">double-strand break repair</text><text class="lbl small" x="515" y="608" text-anchor="middle">BRCA1 · BRCA2 · PALB2 (ATM signals)</text></g>`));
    s.push(label(100,620,'A pancreatic cancer cell','lbl strong'));
    // right-hand panels
    const px=680, pw=300;
    const panel=(y,h,title,lines,topic,hsid,aria,extra='')=>{ const body=lines.map((l,i)=>`<text class="lbl small" x="${px+12}" y="${y+38+i*15}">${l}</text>`).join(''); return hs(topic,hsid,aria,`<g class="fill" stroke="transparent"><rect x="${px}" y="${y}" width="${pw}" height="${h}" rx="8" fill="#fbf9f4" stroke="${C.line}"/><text class="lbl strong" x="${px+10}" y="${y+18}">${title}</text>${extra}${body}</g>`); };
    s.push(panel(70,112,'How cells become cancer: more than one route',['acinar cell → ADM → PanIN → carcinoma (classic route)','duct cell → carcinoma, skipping low-grade PanIN','IPMN / MCN cysts → their own, mostly slow route','most PanINs never progress; KRAS alone is not enough'],'cell-of-origin','precursor','Precursor routes: acinar cells reprogram (acinar-to-ductal metaplasia) to PanIN and carcinoma; duct cells and cysts follow other routes'));
    s.push(panel(190,92,'Genome change: stepwise or all at once',['gradual accumulation in some tumors','a single shattering burst (chromothripsis) in many','whole-genome doubling in about half'],'genome-evolution','evolution','Genome evolution: gradual steps in some tumors, a single catastrophic burst in many',''));
    s.push(panel(290,76,'Cell state: a dial, not a label',['classical (GATA6-high) ←——●——→ basal-like','shifts with TGF-β, stress and treatment'],'cell-states','states','Cell states: a dial between classical and basal-like programs that cells can move along'));
    s.push(panel(374,76,'KRAS wild-type (10–13%): the rare targets',['NRG1 · NTRK · RET · BRAF · ALK/ROS1 fusions · HER2','mismatch-repair deficiency ≈ 1% of all tumors'],'fusions-rare-targets','fusions','KRAS wild-type tumors (10 to 13 percent) where fusions and other rare targets cluster'));
    s.push(panel(458,76,'Inherited drug-metabolism variants',['UGT1A1 → irinotecan · DPYD → fluorouracil, capecitabine','tested on the person; about toxicity, not the tumor'],'ugt1a1-dpyd','toxicity','Drug-metabolism variants UGT1A1 and DPYD that predict chemotherapy toxicity, not tumor response'));
    s.push(panel(542,62,'What the tests look at',['tumor tissue · blood tumor DNA · germline (inherited)','yield of findings ≠ delivered benefit'],'molecular-testing','testing','Molecular testing: tumor tissue, blood ctDNA and germline tests, and what each can find'));
    s.push(panel(612,56,'Risk and inheritance',['smoking ×2 · obesity · alcohol · pancreatitis · genes ≈ 5.5%'],'risk-factors','risk','Risk: smoking, obesity, alcohol, pancreatitis, long-standing diabetes and inherited variants'));
    s.push(`</svg>`);
    return s.join('');
  }

  /* ---------------------------------------------------------------- SPREAD & STAGE */
  function spread(){
    const s=[];
    s.push(`<svg viewBox="0 0 1000 680" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="sv-title sv-desc"><title id="sv-title">How the cancer relates to vessels and how it spreads</title><desc id="sv-desc">Left: cross-sections showing a tumor touching the superior mesenteric vein and artery to different degrees, which define resectable, borderline resectable and locally advanced categories. Middle: routes of spread to lymph nodes, along nerves, through the portal vein to the liver, to the peritoneal lining and to the lungs, with microscopic deposits too small to see. Right: the stage ladder from stage I to stage IV.</desc>`);
    s.push(`<rect width="1000" height="680" fill="#fff"/><text class="svg-title" x="22" y="30">Vessels, routes of spread, and stage</text><text class="svg-note" x="22" y="48">Illustrative only: resectability is judged by a surgical team on real images, not from a diagram.</text>`);
    // LEFT: vessel contact cross-sections
    s.push(`<rect x="22" y="64" width="300" height="560" rx="10" fill="#fbf9f4" stroke="${C.line}"/><text class="lbl strong" x="36" y="86">Tumor–vessel contact (cross-section)</text>`);
    const blob=(x,y,r)=>`<path d="M${x-r},${y} C${x-r},${y-r*0.9} ${x-r*0.5},${y-r*1.05} ${x},${y-r} C${x+r*0.6},${y-r*0.95} ${x+r},${y-r*0.5} ${x+r},${y} C${x+r},${y+r*0.6} ${x+r*0.55},${y+r} ${x},${y+r} C${x-r*0.6},${y+r*1.02} ${x-r},${y+r*0.5} ${x-r},${y} Z" fill="${C.tumor}" opacity=".92"/>`;
    const xs=(cy,title,tumor,arc,catTxt,catColor)=>`<g><text class="lbl" x="36" y="${cy-52}">${title}</text>${tumor}<circle cx="140" cy="${cy}" r="26" fill="#dde6f3" stroke="${C.vein}" stroke-width="3"/><text class="lbl small" x="140" y="${cy+4}" text-anchor="middle">vein</text><circle cx="230" cy="${cy}" r="18" fill="#f7dcd8" stroke="${C.artery}" stroke-width="3"/><text class="lbl small" x="230" y="${cy+4}" text-anchor="middle">artery</text>${arc}<text class="lbl" x="36" y="${cy+50}" fill="${catColor}">→ ${catTxt}</text></g>`;
    s.push(hs('vessel-contact','vein-contact','Degree of contact between tumor and the superior mesenteric vein or portal vein',`<g class="fill" stroke="transparent">${xs(150,'Touching the vein over less than half its circumference',blob(86,150,34),`<path d="M118,134 A26,26 0 0 0 118,166" stroke="#1f7a8c" stroke-width="5" fill="none"/>`,'potentially resectable','#4e7d4a')}${xs(300,'Wrapping more than half the vein (vein can be rebuilt)',blob(112,300,44),`<path d="M152,277 A26,26 0 1 0 152,323" stroke="#b9771c" stroke-width="5" fill="none"/>`,'borderline resectable','#b9771c')}</g>`));
    s.push(hs('sma','artery-contact','Contact between tumor and the superior mesenteric artery or celiac axis',`<g class="fill" stroke="transparent">${xs(450,'Artery encased over more than half its circumference',blob(214,450,40),`<path d="M240,436 A18,18 0 1 0 240,464" stroke="#b5563a" stroke-width="5" fill="none"/>`,'locally advanced','#b5563a')}</g>`));
    s.push(hs('resectability-categories','resectability','Resectability categories: potentially resectable, borderline resectable, locally advanced, metastatic',`<g class="fill" stroke="transparent"><rect x="34" y="520" width="276" height="92" rx="8" fill="#fff" stroke="${C.line}"/><text class="lbl strong" x="44" y="540">Four categories</text><text class="lbl small" x="44" y="558">resectable · borderline resectable</text><text class="lbl small" x="44" y="574">locally advanced · metastatic</text><text class="lbl small" x="44" y="596">"borderline" describes anatomy, not malignancy</text></g>`));
    // MIDDLE: torso with routes
    s.push(`<text class="lbl strong" x="530" y="86" text-anchor="middle">Routes of spread</text>`);
    s.push(`<path d="M420,96 C360,146 340,230 350,350 C356,440 380,540 420,626 L640,626 C680,540 704,440 710,350 C720,230 700,146 640,96 Z" fill="#fbf6ee" stroke="${C.line}" stroke-width="1.5"/>`);
    // lungs
    s.push(hs('recurrence-meaning','lung-met','Lungs: a less common site of spread, with longer survival after isolated lung recurrence',`<g class="fill" stroke="transparent"><path d="M470,140 C440,150 420,200 426,250 C432,282 470,290 488,270 C500,240 500,170 470,140 Z" fill="#f3e4e6" stroke="#b56b7b" stroke-width="1.2"/><path d="M590,140 C620,150 640,200 634,250 C628,282 590,290 572,270 C560,240 560,170 590,140 Z" fill="#f3e4e6" stroke="#b56b7b" stroke-width="1.2"/><circle cx="454" cy="220" r="3" fill="${C.tumor}"/><circle cx="604" cy="234" r="3" fill="${C.tumor}"/></g>`));
    s.push(label(646,172,'Lungs','lbl small'));
    // liver with mets
    s.push(hs('liver-niche','liver-met','Liver: the commonest site of spread, reached through the portal vein and prepared in advance by tumor signals',`<g class="fill" stroke="transparent"><path d="M380,310 C400,290 500,288 560,302 C590,310 598,338 580,356 C556,376 480,380 440,370 C400,362 372,340 380,310 Z" fill="${C.liver}" opacity=".9" stroke="#9a5f4d" stroke-width="1.2"/><circle cx="430" cy="326" r="6" fill="${C.tumor}"/><circle cx="480" cy="350" r="4" fill="${C.tumor}"/><circle cx="540" cy="320" r="3" fill="${C.tumor}"/></g>`));
    s.push(label(600,320,'Liver (via portal vein)','lbl small'));
    // pancreas + tumor
    s.push(`<path d="M430,440 C470,424 540,416 600,412 C600,424 598,432 596,434 C540,440 480,452 440,466 Z" fill="${C.pancreas}" stroke="${C.pancreasEdge}"/><path d="M438,440 C446,432 460,432 464,442 C468,452 460,462 448,460 C438,458 434,448 438,440 Z" fill="${C.tumor}"/>`);
    s.push(label(606,418,'Pancreas','lbl small'));
    // portal vein route
    s.push(`<path d="M452,434 C450,400 452,380 470,360" stroke="${C.vein}" stroke-width="5" fill="none" marker-end="url(#arrV)"/><defs><marker id="arrV" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${C.vein}"/></marker></defs>`);
    // nodes route
    s.push(hs('lymph-nodes','nodes','Lymph nodes: the first stations the cancer reaches; the number involved shapes stage and outlook',`<g class="fill" stroke="transparent"><path d="M448,464 C430,490 420,500 400,520" stroke="${C.node}" stroke-width="3" fill="none"/>${[[414,480],[398,506],[380,526]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="${C.node}" stroke="#9c8a55"/>`).join('')}</g>`));
    s.push(label(356,552,'Lymph nodes','lbl small'));
    // perineural route
    s.push(hs('nerve-plexus','perineural','Spread along nerves (perineural invasion) toward the celiac plexus',`<g class="fill" stroke="transparent"><path d="M462,438 C490,460 520,472 560,490" stroke="${C.nerve}" stroke-width="5" fill="none"/>${[[500,466],[540,482]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" fill="${C.tumor}"/>`).join('')}</g>`));
    s.push(label(566,504,'Along nerves','lbl small'));
    // peritoneum
    s.push(hs('peritoneum','peritoneum','Peritoneal lining: deposits here are often too small for scans and found only at laparoscopy',`<g class="fill" stroke="transparent"><path d="M366,580 C420,620 580,624 690,580" stroke="#8c7a66" stroke-width="2.5" stroke-dasharray="6 4" fill="none"/>${[[420,602],[500,614],[600,608]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="${C.tumor}"/>`).join('')}</g>`));
    s.push(label(530,568,'Peritoneal lining','lbl small','middle'));
    // micrometastases
    s.push(hs('microscopic-disease','micromets','Microscopic deposits below the size scans can show',`<g class="fill" stroke="transparent">${[[640,270],[660,350],[380,270],[636,490],[640,610],[400,610],[370,420]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="${C.tumor}" stroke-width="1" stroke-dasharray="2 2"/><circle cx="${x}" cy="${y}" r="1.5" fill="${C.tumor}"/>`).join('')}</g>`));
    s.push(label(530,650,'dotted = below what a scan can show','lbl small','middle'));
    // RIGHT: stage ladder
    s.push(hs('stage-vs-resectability','stage-ladder','Stage ladder: stage I to stage IV by size, nodes and distant spread',`<g class="fill" stroke="transparent"><rect x="740" y="64" width="238" height="560" rx="10" fill="#fbf9f4" stroke="${C.line}"/><text class="lbl strong" x="754" y="86">Stage (AJCC 8th edition)</text>${[['IV','distant spread (liver, peritoneum, lung)','#5a3a46'],['III','4 or more nodes, or artery involved','#b5563a'],['II','1–3 nodes, or tumor > 4 cm','#b9771c'],['I','≤ 4 cm, no nodes (IA ≤ 2 cm)','#4e7d4a']].map(([st,txt,col],i)=>`<rect x="754" y="${110+i*118}" width="210" height="96" rx="8" fill="#fff" stroke="${col}" stroke-width="1.6"/><text class="svg-title" x="770" y="${146+i*118}" fill="${col}">Stage ${st}</text><text class="lbl small" x="770" y="${168+i*118}">${txt}</text>`).join('')}<text class="lbl small" x="754" y="600">stage ≠ resectability ≠ fitness</text></g>`));
    s.push(`</svg>`);
    return s.join('');
  }

  /* ---------------------------------------------------------------- TREATMENT & DAILY LIFE */
  function treatment(){
    const s=[];
    s.push(`<svg viewBox="0 0 1000 680" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="tv-title tv-desc"><title id="tv-title">Treatment pathways and daily life</title><desc id="tv-desc">A branching map from diagnosis through the four resectability categories to sequences of chemotherapy, surgery, radiation and targeted or trial therapy, with monitoring and supportive care running alongside.</desc>`);
    s.push(`<rect width="1000" height="680" fill="#fff"/><text class="svg-title" x="22" y="30">Treatment pathways, with daily life alongside</text><text class="svg-note" x="22" y="48">Illustrative sequences, not a decision tool: the same category can be treated in more than one order.</text>`);
    s.push(`<defs><marker id="arrT" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${C.ink3}"/></marker></defs>`);
    const box=(x,y,w,h,title,sub,fill='#fff',stroke=C.line)=>{ const subs=Array.isArray(sub)?sub:(sub?[sub]:[]); const top=(subs.length||h>70); return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.4"/><text class="lbl strong" x="${x+w/2}" y="${y+(top?20:h/2+5)}" text-anchor="middle">${title}</text>${subs.map((l,i)=>`<text class="lbl small" x="${x+w/2}" y="${y+36+i*14}" text-anchor="middle">${l}</text>`).join('')}`; };
    const arrow=(x1,y1,x2,y2)=>`<path d="M${x1},${y1} L${x2},${y2}" stroke="${C.ink3}" stroke-width="1.6" fill="none" marker-end="url(#arrT)"/>`;
    // root
    s.push(hs('why-plans-change','branch-root','Diagnosis, staging and the multidisciplinary plan',`<g class="fill" stroke="transparent">${box(22,70,170,48,'Diagnosis & staging','multidisciplinary review','#e9eef6','#4b6a9b')}</g>`));
    // categories column
    const cats=[['Resectable',130],['Borderline resectable',250],['Locally advanced',370],['Metastatic',490]];
    s.push(hs('resectability-categories','categories','The four resectability categories',`<g class="fill" stroke="transparent">${cats.map(([n,y])=>box(22,y,170,40,n,'')).join('')}</g>`));
    cats.forEach(([n,y])=>s.push(arrow(107,118,107,y)));
    // resectable row
    s.push(hs('whipple','surgery','Surgery: Whipple, distal or total pancreatectomy',`<g class="fill" stroke="transparent">${box(230,122,120,56,'Surgery','Whipple / distal / total','#fdf1ea','#b5563a')}${box(500,246,120,56,'Surgery','if restaging allows','#fdf1ea','#b5563a')}${box(640,366,120,60,'Surgery',['if converted','(about 1 in 5)'],'#fdf1ea','#b5563a')}</g>`));
    s.push(hs('treatment-sequencing','adjuvant','Adjuvant chemotherapy after surgery, typically six months',`<g class="fill" stroke="transparent">${box(380,122,150,56,'Adjuvant chemo','≈ 6 months (mFOLFIRINOX)','#dcecef','#1f7a8c')}${box(640,246,150,56,'Adjuvant chemo','to complete the course','#dcecef','#1f7a8c')}</g>`));
    s.push(arrow(192,150,228,150)+arrow(350,150,378,150));
    s.push(hs('why-chemo-first','neoadjuvant','Chemotherapy before surgery (neoadjuvant), sometimes with radiation',`<g class="fill" stroke="transparent">${box(230,246,120,60,'Chemo first',['2–4 months,','sometimes with radiation'],'#dcecef','#1f7a8c')}${box(230,186,130,46,'Chemo first (in trials)','resectable: being tested','#f3f7f8','#1f7a8c')}</g>`));
    s.push(hs('restaging','restage','Restaging scan after chemotherapy',`<g class="fill" stroke="transparent">${box(380,246,100,56,'Restage','scan ± CA 19-9','#fff',C.line)}${box(380,366,100,56,'Restage','scan ± CA 19-9','#fff',C.line)}</g>`));
    s.push(arrow(192,270,228,270)+arrow(350,270,378,270)+arrow(480,270,498,270)+arrow(620,270,638,270));
    // locally advanced row
    s.push(hs('folfirinox','chemo','Systemic chemotherapy regimens',`<g class="fill" stroke="transparent">${box(230,366,120,60,'Induction chemo',['FOLFIRINOX or','gemcitabine + nab-paclitaxel'],'#dcecef','#1f7a8c')}${box(230,486,140,60,'First-line chemo',['FOLFIRINOX · NALIRIFOX','gemcitabine + nab-paclitaxel'],'#dcecef','#1f7a8c')}${box(400,486,130,60,'Second line',['liposomal irinotecan','+ fluorouracil'],'#dcecef','#1f7a8c')}</g>`));
    s.push(hs('radiation','radiation','Radiation (chemoradiation, SBRT) or Tumor Treating Fields in locally advanced disease',`<g class="fill" stroke="transparent">${box(500,366,120,60,'Radiation / TTFields',['local control;','no survival gain for RT'],'#fff8e6','#9a7b1d')}</g>`));
    s.push(arrow(192,390,228,390)+arrow(350,390,378,390)+arrow(480,390,498,390)+arrow(620,390,638,390));
    // metastatic row
    s.push(hs('daraxonrasib','targeted','Targeted and biomarker-directed options: the RAS inhibitor daraxonrasib, olaparib, pembrolizumab, fusion drugs',`<g class="fill" stroke="transparent">${box(560,486,190,60,'RAS inhibitor / targeted',['daraxonrasib (2026) · olaparib','pembrolizumab (dMMR) · fusion drugs'],'#f1e6f5','#7a4e8b')}</g>`));
    s.push(hs('clinical-trials','trials','Clinical trials at every stage',`<g class="fill" stroke="transparent">${box(770,486,110,60,'Trials','at every stage','#fff',C.line)}</g>`));
    s.push(arrow(192,510,228,510)+arrow(370,510,398,510)+arrow(530,510,558,510)+arrow(750,510,768,510));
    // monitoring band
    s.push(hs('clear-scan','monitoring','Monitoring: scans, CA 19-9 where it works, and tumor DNA tests in research',`<g class="fill" stroke="transparent">${box(780,122,198,180,'Monitoring','','#fbf9f4',C.line)}<text class="lbl small" x="796" y="164">scans every few months</text><text class="lbl small" x="796" y="182">CA 19-9 (not in non-secretors)</text><text class="lbl small" x="796" y="200">tumor DNA: strong positive,</text><text class="lbl small" x="796" y="216">weak negative signal</text><text class="lbl small" x="796" y="240">a clear scan = nothing large</text><text class="lbl small" x="796" y="256">enough to see</text><text class="lbl small" x="796" y="280">recurrence is systemic;</text><text class="lbl small" x="796" y="296">site changes outlook</text></g>`));
    // evidence box
    s.push(hs('reading-trial-results','evidence','How to read a treatment result',`<g class="fill" stroke="transparent">${box(780,318,198,150,'Reading the evidence','','#fbf9f4',C.line)}<text class="lbl small" x="796" y="360">median · hazard ratio · 5-year rate</text><text class="lbl small" x="796" y="378">who was counted (everyone vs resected)</text><text class="lbl small" x="796" y="396">shrinkage ≠ longer life</text><text class="lbl small" x="796" y="414">registry entry ≠ result</text><text class="lbl small" x="796" y="432">approval ≠ approved for every use</text><text class="lbl small" x="796" y="450">US status, with a date</text></g>`));
    // supportive band
    s.push(hs('palliative-care','supportive','Supportive and palliative care alongside treatment: digestion, nutrition, blood sugar, pain, clots, fever plan, stents, mood',`<g class="fill" stroke="transparent"><rect x="22" y="566" width="956" height="94" rx="10" fill="#fff4e8" stroke="#e4b67f" stroke-width="1.4"/><text class="lbl strong" x="38" y="590">Alongside every path: supportive care</text>${['Enzymes & digestion','Nutrition & muscle','Blood sugar','Pain','Clots','Fever plan','Stents & blockages','Mood & support','Palliative care'].map((n,i)=>`<rect x="${38+i*104}" y="602" width="96" height="40" rx="6" fill="#fff" stroke="#e4b67f"/><text class="lbl small" x="${86+i*104}" y="626" text-anchor="middle">${n}</text>`).join('')}</g>`));
    s.push(`</svg>`);
    return s.join('');
  }

  /* ---------------------------------------------------------------- CONNECTIONS (generated from data) */
  function connections(groups, topics, edges, selectedId){
    const W=1000,H=940; const s=[];
    s.push(`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Connections between atlas topics, arranged by group">`);
    s.push(`<rect width="${W}" height="${H}" fill="#fff"/><text class="svg-title" x="22" y="30">Connections</text><text class="svg-note" x="22" y="48">Each statement names both ends: select a topic to see what it contains, modulates, is measured by or treated by.</text>`);
    const gcols={diagnosis:'#4b6a9b',living:'#b9771c',anatomy:'#b5563a',ecosystem:'#4e7d4a',genes:'#7a4e8b',tests:'#3d7a8f',treatment:'#1f7a8c',research:'#9a7b1d'};
    // layout: 8 clusters in 4x2 grid
    const cols=4, cw=238, ch=430, x0=20, y0=62;
    const pos={}; const clusterRect={};
    groups.forEach((g,i)=>{ const cx=x0+(i%cols)*(cw+8), cy=y0+Math.floor(i/cols)*(ch+10); clusterRect[g.id]={x:cx,y:cy,w:cw,h:ch}; });
    const byGroup={}; topics.forEach(t=>{(byGroup[t.group]=byGroup[t.group]||[]).push(t)});
    groups.forEach(g=>{ const r=clusterRect[g.id]; const list=byGroup[g.id]||[]; const rowH=Math.min(22,(r.h-36)/list.length);
      s.push(`<g class="conn-cluster"><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="10"/><text x="${r.x+10}" y="${r.y+22}" fill="${gcols[g.id]}">${g.title} <tspan class="lbl small" fill="#6b7684">(${list.length})</tspan></text></g>`);
      list.forEach((t,i)=>{ const nx=r.x+8, ny=r.y+32+i*rowH; pos[t.id]={x:nx,y:ny,w:r.w-16,h:rowH-3,cx:nx+(r.w-16)/2,cy:ny+(rowH-3)/2};
        const short=t.title.length>38?t.title.slice(0,37)+'…':t.title;
        s.push(`<g class="conn-node hotspot" data-topic="${t.id}" data-hs="node-${t.id}" role="button" tabindex="0" aria-label="${t.title}" data-selected="${t.id===selectedId}"><rect x="${nx}" y="${ny}" width="${r.w-16}" height="${rowH-3}" rx="4"/><text class="lbl small" x="${nx+6}" y="${ny+rowH/2+1}" fill="${gcols[g.id]}">${short}</text></g>`);
      });
    });
    if(selectedId && pos[selectedId]){
      const p=pos[selectedId]; const seen=new Set();
      edges.filter(e=>e.from===selectedId||e.to===selectedId).forEach(e=>{ const o=e.from===selectedId?e.to:e.from; if(seen.has(o)||!pos[o]) return; seen.add(o); const q=pos[o];
        s.push(`<path class="conn-edge" d="M${p.cx},${p.cy} C${p.cx},${(p.cy+q.cy)/2} ${q.cx},${(p.cy+q.cy)/2} ${q.cx},${q.cy}"/><circle cx="${q.cx}" cy="${q.cy}" r="4" fill="#1f7a8c"/>`); });
      s.push(`<circle cx="${p.cx}" cy="${p.cy}" r="6" fill="#1f7a8c"/>`);
    }
    s.push(`</svg>`);
    return s.join('');
  }

  return { pancreas, ecosystem, cells, spread, treatment, connections };
})();
