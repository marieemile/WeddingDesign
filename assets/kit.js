/* Marie & André — design kit · main page */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const K = window.KIT;

/* ---------------- palette ---------------- */
const C = {
  sage:{n:'Sage Green',h:'#A8C29E'}, blush:{n:'Blush Pink',h:'#F4B6C8'}, butter:{n:'Butter Yellow',h:'#FFD76A'},
  coral:{n:'Coral',h:'#FF8A5C'}, powder:{n:'Powder Blue',h:'#B8D5F3'}, rose:{n:'Antique Rose',h:'#DE9687'},
  ivory:{n:'Ivory',h:'#FAF7F2'}, fern:{n:'Evening Fern',h:'#4A5A3D'}, brass:{n:'Antique Brass',h:'#B08D4F'},
  red:{n:'Wedding Red',h:'#CB484D'}, swallow:{n:'Swallow Blue',h:'#7C9FD4'}, moss:{n:'Moss',h:'#889063'},
  peony:{n:'Peony Pink',h:'#D86AA5'}, paper:{n:'Paper',h:'#F4EDE3'}
};
const SW = {
  primary:[
    ['sage','Primary 01','The brand\'s spine. Tablecloths, ribbon, envelopes, André\'s tie, sign backdrops and the painted border. It has a structural job, not a flower job.'],
    ['blush','Primary 02','The warm counterweight, and the only pink used as a ground: card borders, envelope liners, napkins. Anything pinker than this is a flower.']],
  accent:[
    ['butter','Accent 01','The colour of joy, and the hardest-working accent: napkins, tapers, wax seals. Only as a wash or a large field, or reversed out of fern. Never as a line on ivory.'],
    ['coral','Accent 02','The heat that stops it all going sweet. Use it smallest of all: one seal, one heart, the poppies.'],
    ['powder','Accent 03 · flowers only','Delphinium and tweedia. It turns pink, peach and yellow into wildflowers instead of sorbet. Never printed.']],
  neutral:[
    ['ivory','Ground','Warm cotton stock, candles, linen under everything. Never optical white, which goes cold against sage.'],
    ['fern','Ink','All text, everywhere. No black anywhere. Also sage\'s evening shade: deep green cloth on the long tables.'],
    ['brass','Metal','Foil, wax-seal rims, cutlery, candlesticks. Never silver, rose gold or chrome.'],
    ['rose','Signature','The wordmark\'s own ink. Hairlines and ribbon only, nothing larger.']],
  print:[
    ['red','Tees','Sampled from your inspiration shirt. Used for every tee lockup and the M&A marks on cotton.'],
    ['swallow','Lines in blue','A deepened powder blue for swallows and any blue line work. Powder itself is too pale to hold a line.'],
    ['moss','Watercolour edge','The darker pigment edge of the painted border, and the small caps on stationery.'],
    ['peony','Script pink','The pink script variant on menus, and the alternative tee colourway.']]
};
const FLORIST = [['Lilac','#E3D6F7'],['Blush Pink','#F4B6C8'],['Peony Pink','#D86AA5'],['Orchid Pink','#F2A8D1'],['Anthurium','#F6B6C1'],['Peach','#FFB28A'],['Coral','#FF8A5C'],['Butter Yellow','#FFD76A'],['Powder Blue','#B8D5F3'],['Chamomile','#FFF5A6'],['Sage','#A8C29E'],['Silver Green','#CBD9C3'],['Chartreuse','#A4D33A'],['Lime','#86B61F'],['Ivory','#FAF7F2']];
const DEEP = [['Terra Cotta','#EA785B'],['Bluebell','#A1A8BE'],['Moss','#889063'],['Evening Fern','#4A5A3D'],['Grasslands','#5F5420'],['Grape Fizz','#3F0013']];

const rgb = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16));
const toast = (t) => { const e = $('#toast'); e.textContent = t; e.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove('on'), 1600); };
const copy = (txt, msg) => { (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast(msg || 'Copied ' + txt), () => toast(txt)); };

$$('[data-swatches]').forEach(el => {
  el.innerHTML = SW[el.dataset.swatches].map(([k, role, use]) => {
    const c = C[k], [r,g,b] = rgb(c.h);
    return `<button class="sw reveal" data-hex="${c.h}"><div class="chip" style="background:${c.h}${k==='ivory'?';box-shadow:inset 0 -1px 0 var(--line)':''}"><span class="copied">Copied</span></div>
      <div class="meta"><div class="role">${role}</div><div class="nm">${c.n}</div><div class="hx">${c.h} · RGB ${r} ${g} ${b}</div><p class="use">${use}</p></div></button>`;
  }).join('');
});
$$('[data-dots]').forEach(el => {
  const list = el.dataset.dots === 'florist' ? FLORIST : DEEP;
  el.innerHTML = list.map(([n,h]) => `<button class="dot" data-hex="${h}"><i style="background:${h}"></i><span>${n}</span><small>${h}</small></button>`).join('');
});
document.addEventListener('click', e => {
  const b = e.target.closest('[data-hex]'); if (!b) return;
  copy(b.dataset.hex); b.classList.add('ok'); setTimeout(() => b.classList.remove('ok'), 1200);
});

/* ---------------- logo everywhere ---------------- */
$$('[data-logo]').forEach(el => el.innerHTML = K.logo);

/* ---------------- contrast tester ---------------- */
const lum = h => { const a = rgb(h).map(v => { v/=255; return v<=.03928 ? v/12.92 : Math.pow((v+.055)/1.055,2.4); }); return .2126*a[0]+.7152*a[1]+.0722*a[2]; };
const ratio = (a,b) => { const x = lum(a), y = lum(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
const INKS = ['fern','rose','peony','red','coral','moss','swallow','sage','blush','butter','brass','ivory'];
const GROUNDS = ['ivory','paper','fern','sage','blush','butter'];
const RULES = {
  'butter/ivory':'Unusable · butter vanishes on ivory', 'butter/paper':'Unusable · butter vanishes on paper',
  'sage/ivory':'Display size only · too pale below that', 'blush/ivory':'Washes only · never a line',
  'rose/ivory':'Wordmark & hairlines only', 'butter/fern':'The only place butter works', 'powder/ivory':'Flowers only'
};
let ct = { ink:'fern', ground:'ivory' };
const swb = (k, on, grp) => `<button class="swb${on?' on':''}" style="background:${C[k].h}" data-${grp}="${k}" title="${C[k].n}" aria-label="${C[k].n}"></button>`;
function drawCt(){
  $('#ctInk').innerHTML = INKS.map(k => swb(k, k===ct.ink, 'ink')).join('');
  $('#ctGround').innerHTML = GROUNDS.map(k => swb(k, k===ct.ground, 'gr')).join('');
  const o = $('#ctOut'); o.style.background = C[ct.ground].h; o.style.color = C[ct.ink].h;
  const r = ratio(C[ct.ink].h, C[ct.ground].h);
  let v = RULES[ct.ink+'/'+ct.ground] || (r >= 4.5 ? 'Text at any size' : r >= 3 ? 'Display & headings only' : r >= 1.6 ? 'Washes & large shapes only' : 'Not visible enough');
  if (ct.ink === ct.ground) v = 'Same colour';
  $('#ctVerdict').innerHTML = `${r.toFixed(2)} : 1<br>${v}`;
}
$('#ctInk').parentElement.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.ink) ct.ink = b.dataset.ink; if (b.dataset.gr) ct.ground = b.dataset.gr; drawCt();
});
drawCt();

/* ---------------- inkbars ---------------- */
function inkbar(el, keys, initial, onPick){
  el.insertAdjacentHTML('beforeend', keys.map(k => swb(k, k===initial, 'k')).join(''));
  el.addEventListener('click', e => {
    const b = e.target.closest('button[data-k]'); if (!b) return;
    $$('button[data-k]', el).forEach(x => x.classList.toggle('on', x === b)); onPick(b.dataset.k);
  });
}

/* ---------------- type tester ---------------- */
const ts = { face:'serif', size:64, ink:'fern' };
function drawT(){
  const s = $('#tStage').style; s.fontSize = ts.size + 'px'; s.color = C[ts.ink].h;
  s.fontFamily = ts.face==='sans'||ts.face==='caps' ? 'var(--sans)' : ts.face==='script' ? 'var(--script)' : 'var(--serif)';
  s.fontStyle = ts.face==='serif-i' ? 'italic' : 'normal';
  s.fontWeight = ts.face==='script' ? 500 : ts.face==='sans'||ts.face==='caps' ? 300 : 400;
  s.textTransform = ts.face==='caps' ? 'uppercase' : 'none';
  s.letterSpacing = ts.face==='caps' ? '.22em' : 'normal';
  s.fontFeatureSettings = ts.face==='serif'||ts.face==='serif-i' ? '"lnum"' : 'normal';
}
$('#tFace').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('#tFace button').forEach(x => x.classList.toggle('on', x===b)); ts.face = b.dataset.v; drawT(); });
$('#tSize').addEventListener('input', e => { ts.size = +e.target.value; drawT(); });
inkbar($('#tInk'), ['fern','peony','rose','red','coral','moss'], 'fern', k => { ts.ink = k; drawT(); });
drawT();

/* ---------------- svg helpers ---------------- */
const withColour = (svg, hex) => svg.replace(/currentColor/g, hex).replace('<svg ', svg.includes('xmlns=') ? '<svg ' : '<svg xmlns="http://www.w3.org/2000/svg" ');
function save(blob, name){ const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
const saveSvg = (svg, hex, name) => save(new Blob([withColour(svg, hex)], {type:'image/svg+xml'}), name + '.svg');
function savePng(svg, hex, name, px = 2000){
  const s = withColour(svg, hex), vb = (s.match(/viewBox="([^"]+)"/)||[])[1]?.split(/[ ,]+/).map(Number) || [0,0,100,100];
  const w = px, h = Math.round(px * vb[3] / vb[2]);
  const img = new Image(); const url = URL.createObjectURL(new Blob([s.replace('<svg ', `<svg width="${w}" height="${h}" `)], {type:'image/svg+xml'}));
  img.onload = () => { const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(img, 0, 0, w, h); c.toBlob(b => save(b, name + '.png')); URL.revokeObjectURL(url); };
  img.src = url;
}
const I_DL = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v8M4.5 7 8 10.5 11.5 7M3 13.5h10"/></svg>';

/* ---------------- logos ---------------- */
const LOGOS = [
  ['fern','ivory','Fern on ivory','The default',''],['rose','ivory','Rose on ivory','The romantic version',''],
  ['ivory','fern','Ivory on fern','Reversed, for evening',''],['butter','fern','Butter on fern','The only place butter works',''],
  ['ivory','sage','Ivory on sage','Display sizes',''],['fern','blush','Fern on blush','Liners, napkins',''],
  ['sage','ivory','Sage on ivory','Display size only','warn'],['blush','fern','Blush on fern','Wax & foil proofs','']
];
$('#logos').innerHTML = LOGOS.map(([ink, gr, t, s, w], i) => `<div class="lg reveal"><div class="pane" style="background:${C[gr].h};color:${C[ink].h}">
  <span class="badge ${w}">${w ? 'Use with care' : C[ink].h}</span>${K.logo}</div>
  <div class="meta"><div><b>${t}</b><small>${s}</small></div><div class="acts">
  <button class="ico" data-logo-dl="${i}" data-f="svg" title="Download SVG" aria-label="Download SVG">${I_DL}</button>
  <button class="ico" data-logo-dl="${i}" data-f="png" title="Download PNG" aria-label="Download PNG" style="font:500 9px/1 var(--sans)">PNG</button></div></div></div>`).join('');
$('#logos').addEventListener('click', e => {
  const b = e.target.closest('[data-logo-dl]'); if (!b) return;
  const [ink] = LOGOS[+b.dataset.logoDl], n = 'marie-andre-wordmark-' + ink;
  b.dataset.f === 'svg' ? saveSvg(K.logo, C[ink].h, n) : savePng(K.logo, C[ink].h, n, 3000);
});

/* ---------------- monograms & tees ---------------- */
const MONO = [
  ['kissing-sardines','Kissing sardines','The favourite · ~15 cm on the chest'],['ma-double-heart','Double heart','M & A in two hearts'],
  ['ma-hearts-arrow','Hearts & arrow','Arrow through the double heart'],['ma-oval-monogram','Oval monogram','M, a heart, A, in a broken oval'],
  ['ma-cartouche','Cartouche','With the date in italic'],['ma-azulejo','Azulejo tile','Double frame, corner flowers'],['ma-wax-seal','Wax seal','Drips and a knocked-out ring']];
const TEES = [
  ['the-mrs','The Mrs','Signature + sardines · 30 cm'],['the-mr','The Mr','Signature + sardines · 25.5 cm'],['just-married','Just Married','In the broken heart'],
  ['maxence-maid-of-honour','Maxence','Sister · maid of honour'],['david-man-of-honour','David','Bestie · man of honour'],['renee-bridesmaid','Renee','Sister · bridesmaid'],
  ['chiara-bridesmaid','Chiara','Bestie · bridesmaid'],['nicole-officiant','Nicole','Bestie · officiant']];
let monoInk = 'red';
const card = ([k, t, s]) => `<div class="mono-card reveal"><div class="pane" style="color:${C[monoInk].h}" data-pane>${K.tees[k]}</div>
  <div class="meta"><div><b>${t}</b><small>${s}</small></div><div class="acts">
  <button class="ico" data-mono="${k}" data-f="svg" title="Download SVG" aria-label="Download SVG">${I_DL}</button>
  <a class="ico" href="assets/tees/${k}.png" download title="Original PNG" aria-label="Original PNG" style="font:500 9px/1 var(--sans);text-decoration:none">PNG</a></div></div></div>`;
$('#monos').innerHTML = MONO.map(card).join('');
$('#tees-grid').innerHTML = TEES.map(card).join('');
inkbar($('#monoInk'), ['red','peony','fern','rose','coral'], 'red', k => { monoInk = k; $$('#monos [data-pane]').forEach(p => p.style.color = C[k].h); });
document.addEventListener('click', e => {
  const b = e.target.closest('[data-mono]'); if (!b) return;
  const inTees = b.closest('#tees-grid'); const ink = inTees ? 'red' : monoInk;
  saveSvg(K.tees[b.dataset.mono], C[ink].h, b.dataset.mono + '-' + ink);
});

/* ---------------- doodles ---------------- */
const D = { q:'', g:'All', ink:'fern', wash:false };
const WASH = { fern:'blush', coral:'butter', peony:'butter', rose:'blush', swallow:'butter', moss:'blush', red:'blush', brass:'blush' };
const all = K.groups.flatMap(g => g.items.map(i => ({...i, group:g.name})));
$('#dGroups').innerHTML = ['All', ...K.groups.map(g => g.name)].map(n => `<button class="chip-b${n==='All'?' on':''}" data-g="${n}">${n}</button>`).join('');
$('#dGroups').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('#dGroups button').forEach(x => x.classList.toggle('on', x===b)); D.g = b.dataset.g; drawD(); });
$('#dq').addEventListener('input', e => { D.q = e.target.value.trim().toLowerCase(); drawD(); });
$('#dWash').addEventListener('change', e => { D.wash = e.target.checked; drawD(); });
inkbar($('#dInk'), ['fern','coral','peony','rose','swallow','moss','brass'], 'fern', k => { D.ink = k; drawD(); });
const tile = i => `<button class="dd${i.traced?' traced':''}" data-slug="${i.slug}"><div class="art" style="color:${C[D.ink].h}">${D.wash && !i.traced ? `<i class="wash" style="background:${C[WASH[D.ink]].h}"></i>` : ''}${i.svg}</div><span>${i.cap}</span></button>`;
function drawD(){
  const m = i => !D.q || (i.cap + ' ' + i.slug + ' ' + i.group).toLowerCase().includes(D.q);
  const html = K.groups.filter(g => D.g==='All' || g.name===D.g).map(g => {
    const items = g.items.filter(m); if (!items.length) return '';
    return `<div class="dgroup"><div class="gh"><h3>${g.name}</h3><span class="count" style="font:400 11px/1 var(--sans);padding:6px 10px;border-radius:99px;background:var(--silver)">${items.length}</span></div>
      ${D.q ? '' : `<p class="gn">${g.note}</p>`}<div class="dgrid${g.items[0].traced?' wide':''}">${items.map(tile).join('')}</div></div>`;
  }).join('');
  $('#dList').innerHTML = html || `<p class="empty">Nothing called “${D.q}” yet. Try <i>glass</i>, <i>flower</i> or <i>heart</i>.</p>`;
}
drawD();
const modal = $('#modal');
$('#mClose').onclick = () => modal.close();
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
$('#dList').addEventListener('click', e => {
  const b = e.target.closest('[data-slug]'); if (!b) return;
  const i = all.find(x => x.slug === b.dataset.slug), hex = C[D.ink].h;
  const notes = i.traced ? 'Traced from your own artwork. It\'s a filled shape, not a stroke: recolour the fill, and never add a stroke. Print it 35 mm or larger.'
    : i.group === 'Marks & frames' ? 'Use it to end a line, frame a word or close a section. Keep it in the same ink as the rest of the piece.'
    : 'Stroke 1.9 on a 100-unit grid, round caps. Recolour by changing the one stroke value. For a wash, put a flat colour shape behind the line, 1–2 mm out of register.';
  $('#mBody').innerHTML = `<div class="mart"><div class="holder" style="color:${hex}">${D.wash && !i.traced ? `<i class="wash" style="position:absolute;inset:18% 14% 12% 22%;border-radius:46% 54% 50% 50%/56% 44% 56% 44%;opacity:.55;transform:translate(4%,5%) rotate(-8deg);background:${C[WASH[D.ink]].h}"></i>` : ''}${i.svg}</div></div>
    <div class="minfo"><p class="caps">${i.group}</p><h3>${i.cap}</h3><p class="mono">${i.slug}.svg · ${C[D.ink].n} ${hex}</p><p>${notes}</p>
    <div class="btns"><button class="pill small" data-m="svg">${I_DL} SVG</button><button class="pill small ghost" data-m="png">PNG · 2000 px</button><button class="pill small ghost" data-m="copy">Copy SVG code</button></div></div>`;
  $('#mBody').onclick = ev => {
    const a = ev.target.closest('[data-m]'); if (!a) return; const n = i.slug + '-' + D.ink;
    if (a.dataset.m === 'svg') saveSvg(i.svg, hex, n); else if (a.dataset.m === 'png') savePng(i.svg, hex, n); else copy(withColour(i.svg, hex), 'SVG copied');
  };
  modal.showModal();
});

/* ---------------- painted ---------------- */
const PAINT = [['basil-smash','Basil Smash · his'],['strawberry-mojito','Strawberry Mojito · hers'],['menu-lettering','“Menu”, painted'],['menu-lettering-2','“Menu”, second hand'],
 ['lemon-branch','Lemon branch'],['lemon-drop','Hanging lemon'],['lemon-blossom','Lemon & blossom'],['vine-flower','Trailing vine'],['swallow','Swallow'],['swallow-2','Swallow, banking'],
 ['ribbon-bow','Ribbon bow'],['ribbon-tail','Ribbon tail'],['pink-blossom','Pink blossom'],['pink-flower-stem','Flower stem'],['pink-sprig','Pink sprig'],['pink-sprig-small','Small sprig'],
 ['olive-sprig','Olive sprig'],['olives','Olives'],['willow-sprig','Willow leaves'],['herb-sprig','Herb sprig'],['small-sprig','Tiny sprig'],['leaf','Leaf'],['leaf-2','Leaf, long'],
 ['wine-glass','Glass of rosé'],['garlic','Garlic'],['azulejo-tile','Azulejo tile'],['tile-flower','Tile flower'],['basil-doodle','Basil, inked'],['strawberry-doodle','Strawberry, inked'],['border-a5','Painted border · A5 / A6']];
$('#paint').innerHTML = PAINT.map(([k, n]) => `<a class="pt reveal" href="assets/painted/${k}.png" download="${k}.png" title="Download ${n}" style="text-decoration:none${k==='border-a5'?';grid-column:span 2':''}"><div class="im"><img src="assets/painted/${k}.png" alt="${n}" loading="lazy"></div><span>${n}</span></a>`).join('');

/* ---------------- tables ---------------- */
const TBL = ['01-leu','02-opo','03-lis','04-ldn','05-cro','06-bru','07-lis','08-swi','09-fra','09-swi','10-thai','11-usa','12-sca','13-mal','14-sco','15-opo','16-tha','17-swi','18-lux','19-mad'];
$('#tables').innerHTML = TBL.map(t => `<figure><img src="assets/tables/${t}.jpg" alt="Table painting ${t}" loading="lazy"><figcaption>${t.replace('-',' · ').toUpperCase()}</figcaption></figure>`).join('');

/* ---------------- nav + reveal ---------------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin:'0px 0px -8% 0px' });
const watch = () => $$('.reveal:not(.in)').forEach(el => io.observe(el));
watch(); new MutationObserver(watch).observe(document.body, { childList:true, subtree:true });
const links = $$('#nav a'), secs = links.map(a => $(a.getAttribute('href')));
const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); const on = $('#nav a.on'), nav = $('#nav'); if (on) nav.scrollTo({ left: on.offsetLeft - nav.clientWidth/2 + on.clientWidth/2, behavior:'smooth' }); } }), { rootMargin:'-45% 0px -50% 0px' });
secs.forEach(s => s && so.observe(s));
})();
