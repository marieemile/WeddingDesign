/* Marie's Dream Wedding — design system interactions */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const K = window.KIT;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DD = {}; K.groups.forEach(g => g.items.forEach(i => DD[i.slug] = i));

/* ---------- doodles & logo into the page ---------- */
$$('[data-logo]').forEach(el => el.innerHTML = K.logo);
$$('[data-dd]').forEach(el => { const d = DD[el.dataset.dd]; if (!d) return; el.innerHTML = d.svg; if (d.traced) el.classList.add('traced'); });
$$('[data-dd-i]').forEach(el => {
  const d = DD[el.dataset.ddI]; if (!d) return;
  if (el.tagName === 'SPAN' && !el.className) el.outerHTML = d.svg; else el.innerHTML = d.svg;
});

/* ---------- countdown to 13.30 Lisbon time (WEST, UTC+1) ---------- */
const T0 = Date.UTC(2027, 5, 5, 12, 30);
const pad = (n, l = 2) => String(n).padStart(l, '0');
function tick(){
  let s = Math.max(0, Math.floor((T0 - Date.now()) / 1000));
  const d = Math.floor(s / 86400); s -= d * 86400; const h = Math.floor(s / 3600); s -= h * 3600; const m = Math.floor(s / 60); s -= m * 60;
  $('[data-c="d"]').textContent = pad(d, 3); $('[data-c="h"]').textContent = pad(h); $('[data-c="m"]').textContent = pad(m); $('[data-c="s"]').textContent = pad(s);
}
tick(); setInterval(tick, 1000);

/* ---------- marquee ---------- */
const MQ = [['Wild','coupe'],['Romantic','mark-heart'],['Joyful','disco'],['Made by hand','bow'],['05 · 06 · 2027','rings'],['sempre amor','swallows'],['DIY','sardine']];
const one = MQ.map(([w, d]) => `<span>${w}<i>${DD[d] ? DD[d].svg : ''}</i></span>`).join('');
$('#marq').innerHTML = one + one;

/* ---------- colour ramps ---------- */
const RAMPS = [['Sage','#A8C29E','Primary'],['Blush','#F4B6C8','Primary'],['Evening Fern','#4A5A3D','Ink · never black'],['Butter','#FFD76A','Accent · fills only'],
  ['Coral','#FF8A5C','Accent · smallest'],['Powder Blue','#B8D5F3','Florals'],['Antique Rose','#DE9687','Wordmark only'],['Antique Brass','#B08D4F','Metal']];
const hx = h => [1,3,5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (h, t) => { const a = hx(h), b = [250,247,242]; return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('').toUpperCase(); };
const lum = h => { const [r,g,b] = hx(h); return (.299*r + .587*g + .114*b) / 255; };
$('#ramps').innerHTML = RAMPS.map(([n, h, role]) => `<div class="ramp rv"><div class="nm">${n}<small>${role}</small></div><div class="chips">${[0,.25,.5,.72,.88].map((t, i) => {
  const c = mix(h, t); return `<button class="chip" data-hex="${c}" style="background:${c};color:${lum(c) < .5 ? '#FAF7F2' : '#4A5A3D'}" aria-label="${n} ${i ? (100 - t*100).toFixed(0) + '%' : ''} ${c}"><span class="hx">${c}</span></button>`; }).join('')}</div></div>`).join('');
document.addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  navigator.clipboard && navigator.clipboard.writeText(c.dataset.hex).catch(() => {});
  c.classList.remove('copied'); void c.offsetWidth; c.classList.add('copied'); setTimeout(() => c.classList.remove('copied'), 1200);
});

/* ---------- toasts ---------- */
const TI = { ok:['#A8C29E','mark-heart'], info:['#B8D5F3','envelope'], warn:['#FFD76A','mark-sparkle'], err:['#FFC4AD','mark-squiggle'] };
const TT = { ok:['Lovely!','Your RSVP is in. See you there!'], info:['Invites are on their way','The dove is flying them over now.'], warn:['A little reminder','RSVPs close soon. Don’t forget the dietary notes.'], err:['Oops','That table is already full.'] };
function toast(type, title, text){
  const [bg, ic] = TI[type] || TI.info; const [t0, x0] = TT[type] || TT.info;
  const el = document.createElement('div'); el.className = 'toast';
  el.innerHTML = `<span class="ti" style="background:${bg}">${DD[ic].svg}</span><div><b>${title || t0}</b>${text || x0}</div>`;
  $('#toasts').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, 3200);
}
document.addEventListener('click', e => { const b = e.target.closest('[data-toast]'); if (b) toast(b.dataset.toast); });

/* ---------- confetti ---------- */
const CC = ['#F4B6C8','#FFD76A','#A8C29E','#B8D5F3','#FF8A5C','#E3D6F7','#D86AA5'];
function confetti(n = 90, ox){
  if (reduce) return;
  const box = document.createElement('div'); box.className = 'confetti'; document.body.appendChild(box);
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    if (i % 9 === 0) { p.className = 'h'; p.textContent = '♥'; } else p.style.background = CC[i % CC.length];
    const x = ox != null ? ox + (Math.random() - .5) * 240 : Math.random() * innerWidth;
    p.style.left = x + 'px';
    p.style.setProperty('--x', (Math.random() - .5) * 260 + 'px');
    p.style.setProperty('--rot', (Math.random() * 900 - 450) + 'deg');
    p.style.setProperty('--d', (1.8 + Math.random() * 1.6) + 's');
    p.style.animationDelay = Math.random() * .35 + 's';
    box.appendChild(p);
  }
  setTimeout(() => box.remove(), 4200);
}
$('#yes').addEventListener('click', e => { confetti(120); toast('ok', 'Yay! 💐', 'See you on 5 June 2027.'); });

/* loading button */
$('#loadBtn').addEventListener('click', function(){
  if (this.classList.contains('loading')) return;
  const t = this.textContent; this.classList.add('loading'); this.textContent = 'Sending ';
  setTimeout(() => { this.classList.remove('loading'); this.textContent = 'Sent ✓'; const r = this.getBoundingClientRect(); confetti(40, r.left + r.width/2); toast('ok');
    setTimeout(() => this.textContent = t, 2200); }, 1300);
});

/* ---------- RSVP pills cycle ---------- */
const RS = [['yes','✓ Attending'],['maybe','… Pending'],['no','✕ Declined']];
function cycle(p){
  const i = RS.findIndex(([c]) => p.classList.contains(c)), [c, t] = RS[(i + 1) % 3];
  RS.forEach(([x]) => p.classList.remove(x)); p.classList.add(c); p.textContent = t;
  p.classList.remove('wiggle'); void p.offsetWidth; p.classList.add('wiggle');
  if (c === 'yes') { const r = p.getBoundingClientRect(); confetti(24, r.left + r.width/2); }
}
document.addEventListener('click', e => { const p = e.target.closest('[data-rsvp]'); if (p) cycle(p); });

/* ---------- avatars ---------- */
const PARTY = [['Maxence','Maid of honour · Marie’s sister','#F4B6C8'],['David','Man of honour','#B8D5F3'],['Chiara','Bridesmaid','#FFD76A'],['Renee','Bridesmaid · Marie’s sister','#A8C29E'],['Nicole','Officiant','#E3D6F7'],['Tiago','Officiant','#FFC4AD']];
$('#stack').innerHTML = PARTY.map(([n,, c]) => `<span class="av" style="background:${c}" title="${n}">${n[0]}</span>`).join('');

/* ---------- segmented tabs ---------- */
const DAY = [
  ['rings','#F4B6C8','13.30','The ceremony','In front of the house, with the venue behind us. Nicole and Tiago officiate together, and live music plays us down the aisle and back.'],
  ['cheers','#FFD76A','Afterwards','Drinks & canapés','The band plays straight through the drinks hour, and the signature drinks are on the bar.'],
  ['fork-knife','#A8C29E','Evening','Dinner','Sharing plates at the long tables: starters, mains, dessert, then the wedding cake.'],
  ['disco','#B8D5F3','After dark','The party','The DJ takes over for the first dance, then the rest of the night.']];
function seg(el, onPick){
  const ind = $('.ind', el);
  const place = b => { ind.style.left = b.offsetLeft + 'px'; ind.style.width = b.offsetWidth + 'px'; };
  el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('button', el).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); place(b); onPick(+b.dataset.i); });
  const go = () => place($('button.on', el)); go(); addEventListener('resize', go); document.fonts && document.fonts.ready.then(go);
}
const drawDay = i => { const [d, c, t, h, p] = DAY[i]; $('#dayPanel').innerHTML = `<div class="panel" role="tabpanel"><div class="pic" style="background:${c}">${DD[d].svg}</div><div><span class="pill flat">${t}</span><h3>${h}</h3><p>${p}</p></div></div>`; };
seg($('#dayTabs'), drawDay); drawDay(0);

/* ---------- the menu template (same layouts as the studio) ---------- */
const PT = window.PAINTED || {};
const MENU0 = [
  ['Starter','entrada',[['Burrata, heirloom tomatoes & white peach','basil oil · toasted sourdough']]],
  ['Main','prato principal',[['Slow-roasted Bísaro pork cheeks','sweet potato purée · glazed carrots · port jus'],'or',['Line-caught sea bass','clams & coriander · crushed new potatoes']]],
  ['Dessert','sobremesa',[['Lemon & olive oil cake','strawberries · vanilla mascarpone'],'~followed by wedding cake & pastéis de nata']],
  ['Wines','vinhos',[['Alvarinho · Vinho Verde 2025'],['Touriga Nacional Rosé · Douro 2025'],['Touriga Nacional · Douro 2022'],['Old Tawny Port']]]];
const LAY = ['still','garden','border','quiet'];
const BOX = { still:[17,17,23.5,7], garden:[15,15,21,7], border:[15,15,21.5,10], quiet:[16,16,28,8] };
const TY = { still:13.8, garden:9.6, border:8.4, quiet:17.2 };
let mLay = 'still';
const spi = (k, x, y, w, d = 0) => `<img src="assets/painted/${k}.png" alt="" style="left:${x}%;top:${y}%;width:${w}%;animation-delay:${d}ms">`;
const card = c => Object.entries(PT).filter(([k, p]) => p.card === c && !k.startsWith('menu-lettering')).map(([k, p], i) => spi(k, p.x, p.y, p.pw, i * 35)).join('');
function drawArt(){
  let a = { still:() => card('still'), garden:() => card('garden'),
    border:() => `<img class="full" src="assets/painted/border-a5.png" alt="">` + spi('pink-sprig-small', 9, 6.2, 4.4, 80) + spi('olive-sprig', 9.5, 82, 10, 140),
    quiet:() => spi('lemon-branch', 38.5, 3.2, 23) }[mLay]();
  if ($('#mPainted').checked) { const k = mLay === 'garden' ? 'menu-lettering-2' : 'menu-lettering', p = PT[k]; a += spi(k, mLay === 'still' ? p.x : 50 - p.pw/2, TY[mLay], p.pw, 60); }
  else a += `<div class="ttl" contenteditable spellcheck="false" style="pointer-events:auto;top:${TY[mLay] - 1.2}%;color:${$('#mPink').checked ? '#D86AA5' : '#4A5A3D'}">Menu</div>`;
  $('#mArt').innerHTML = a;
  const [l, r, t, b] = BOX[mLay], bx = $('#mBox'); Object.assign(bx.style, { left:l + '%', right:r + '%', top:t + '%', bottom:b + '%' });
  setTimeout(fitMenu, 520);
}
const ce = (cls, t) => `<div class="${cls}" contenteditable spellcheck="false">${t}</div>`;
function drawText(){
  $('#mBox').innerHTML = MENU0.map(([lab, pt, items]) => `<div class="m-course">${ce('m-lab', lab)}${ce('m-pt', pt)}${items.map(it =>
    it === 'or' ? ce('m-or', 'or') : typeof it === 'string' ? ce('m-det', it.slice(1)) : ce('m-dish', it[0]) + (it[1] ? ce('m-det', it[1]) : '')).join('')}</div>`)
    .join('<div class="m-div"><i></i><b></b><i></i></div>') + ce('m-foot', 'Marie &amp; André  ·  5 . 6 . 2027');
  fitMenu();
}
function fitMenu(){
  const b = $('#mBox'); let k = 1.3; b.style.setProperty('--k', k);
  while (b.scrollHeight > b.clientHeight + 1 && k > .5) { k -= .02; b.style.setProperty('--k', k.toFixed(3)); }
}
seg($('#mTabs'), i => { mLay = LAY[i]; drawArt(); });
$('#mPainted').addEventListener('change', drawArt); $('#mPink').addEventListener('change', drawArt);
$('#mBox').addEventListener('input', fitMenu);
$('#mBox').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } });
$('#mReset').addEventListener('click', () => { drawText(); toast('ok', 'Back to the original', 'The menu words are reset.'); });
drawText(); drawArt(); addEventListener('resize', fitMenu); document.fonts && document.fonts.ready.then(fitMenu);

/* ---------- watercolour doodles ---------- */
const PAINT = [['basil-smash','Basil Smash'],['strawberry-mojito','Strawberry Mojito'],['lemon-branch','Lemon branch'],['lemon-drop','Hanging lemon'],['lemon-blossom','Lemon & blossom'],
  ['swallow','Swallow'],['swallow-2','Swallow, banking'],['ribbon-bow','Ribbon bow'],['ribbon-tail','Ribbon tail'],['pink-blossom','Pink blossom'],['pink-flower-stem','Flower stem'],
  ['pink-sprig','Pink sprig'],['olive-sprig','Olive sprig'],['olives','Olives'],['willow-sprig','Willow leaves'],['herb-sprig','Herb sprig'],['wine-glass','Glass of rosé'],
  ['garlic','Garlic'],['azulejo-tile','Azulejo tile'],['tile-flower','Tile flower'],['vine-flower','Trailing vine'],['menu-lettering','“Menu”, painted'],['basil-doodle','Basil, inked'],['strawberry-doodle','Strawberry, inked']];
$('#paints').innerHTML = PAINT.map(([k, n]) => `<a class="paint${['ribbon-bow','vine-flower','menu-lettering'].includes(k) ? ' wide' : ''}" href="assets/painted/${k}.png" download="${k}.png" title="Download ${n}"><div class="im"><img src="assets/painted/${k}.png" alt="${n}" loading="lazy"></div><span>${n}</span></a>`).join('');

/* ---------- chip input ---------- */
const chips = $('#chips'), inv = $('#inv');
const addChip = n => { const c = document.createElement('span'); c.className = 'chipx'; c.innerHTML = `${n.replace(/[<>&]/g, '')}<button aria-label="Remove ${n.replace(/"/g, '')}">✕</button>`; chips.insertBefore(c, inv); };
['Maxence','David'].forEach(addChip);
inv.addEventListener('keydown', e => {
  if (e.key === 'Enter' && inv.value.trim()) { e.preventDefault(); addChip(inv.value.trim()); inv.value = ''; }
  if (e.key === 'Backspace' && !inv.value) { const last = $$('.chipx', chips).pop(); last && last.remove(); }
});
chips.addEventListener('click', e => { const b = e.target.closest('.chipx button'); if (b) { const c = b.parentElement; c.classList.add('out'); setTimeout(() => c.remove(), 240); } else inv.focus(); });

/* ---------- dropdown ---------- */
const dd = $('#dd'), ddb = $('.dd-btn', dd);
ddb.addEventListener('click', e => { e.stopPropagation(); const o = dd.classList.toggle('open'); ddb.setAttribute('aria-expanded', o); });
document.addEventListener('click', e => { if (!dd.contains(e.target)) { dd.classList.remove('open'); ddb.setAttribute('aria-expanded', false); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { dd.classList.remove('open'); ddb.setAttribute('aria-expanded', false); } });

/* ---------- icon grid ---------- */
const ICONS = ['coupe','cheers','flutes','wine-glass','martini','highball','bottle','olives','sardine','fish-platter','bread','cherries','grapes','tomatoes','cake','macarons','cafe','fork-knife',
  'rings','ring-ribbon','envelope','dove-letter','bow','swallows','heart-glasses','car-bow','sun','star','disco','lights','bunting','balloons','popper','sparkler','candle','record-player',
  'daisy','peony','poppy','cosmos','chamomile','bouquet','azulejo','casa-vila-verde','fountain','mark-heart','mark-sparkle','mark-bloom'];
$('#iconGrid').innerHTML = ICONS.filter(s => DD[s]).map(s => `<button class="ico" data-copy="${s}" title="${DD[s].cap}" aria-label="Copy ${DD[s].cap}">${DD[s].svg}</button>`).join('');
$('#iconGrid').addEventListener('click', e => {
  const b = e.target.closest('[data-copy]'); if (!b) return; const d = DD[b.dataset.copy];
  const svg = d.svg.replace(/currentColor/g, '#4A5A3D').replace('<svg ', d.svg.includes('xmlns') ? '<svg ' : '<svg xmlns="http://www.w3.org/2000/svg" ');
  navigator.clipboard && navigator.clipboard.writeText(svg).catch(() => {});
  b.classList.remove('wiggle'); void b.offsetWidth; b.classList.add('wiggle');
  toast('ok', d.cap, 'SVG copied, in Evening Fern.');
});

/* ---------- calendar file ---------- */
$('#ics').addEventListener('click', () => {
  const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Marie and Andre//Dream Wedding//EN','BEGIN:VEVENT','UID:marie-andre-20270605@dream-wedding',
    'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z','DTSTART:20270605T123000Z','DTEND:20270605T230000Z',
    'SUMMARY:Marie & André’s wedding','DESCRIPTION:Ceremony at 13.30. The address is on your invitation.','END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type:'text/calendar' })); a.download = 'marie-andre-wedding.ics'; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 800); toast('ok', 'Saved to your calendar', 'Saturday 5 June 2027, from 13.30.');
});

/* ---------- motion token demo ---------- */
const md = $('#motionDemo'); md.closest('.tok').addEventListener('mouseenter', () => md.style.transform = 'translateX(34px) rotate(14deg) scale(1.08)');
md.closest('.tok').addEventListener('mouseleave', () => md.style.transform = '');

/* ---------- parallax stickers ---------- */
const por = $('#portrait');
if (!reduce && matchMedia('(pointer:fine)').matches) {
  addEventListener('mousemove', e => {
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    $$('[data-par]', por).forEach(s => { const k = +s.dataset.par * 18; s.style.setProperty('--px', (x * k) + 'px'); s.style.setProperty('--py', (y * k) + 'px'); });
  }, { passive:true });
}

/* ---------- reveal, progress bars & counters ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; const el = e.target; el.classList.add('on'); io.unobserve(el);
  $$('.bar i[data-w]', el).forEach(b => setTimeout(() => b.style.width = b.dataset.w + '%', 200));
  $$('[data-to]', el).forEach(s => {
    const to = +s.dataset.to, of = s.textContent.split('/')[1].trim(), t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / 1400), v = Math.round(to * (1 - Math.pow(1 - k, 3))); s.textContent = `${v} / ${of}`; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
}), { rootMargin:'0px 0px -10% 0px' });
$$('.rv').forEach(el => io.observe(el));
})();
