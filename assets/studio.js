/* Marie & André — template studio */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const K = window.KIT, PT = window.PAINTED;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const toast = t => { const e = $('#toast'); e.textContent = t; e.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove('on'), 1900); };
$$('[data-logo]').forEach(el => el.innerHTML = K.logo);

const INK = { grape:'#3F0013', fern:'#4A5A3D', peony:'#D86AA5', rose:'#DE9687', coral:'#FF8A5C', moss:'#889063', swallow:'#7C9FD4', red:'#CB484D', ivory:'#FAF7F2', brass:'#B08D4F' };
const INKNAME = { grape:'Grape Fizz', fern:'Evening Fern', peony:'Peony Pink', rose:'Antique Rose', coral:'Coral', moss:'Moss', swallow:'Swallow Blue', red:'Wedding Red', ivory:'Ivory', brass:'Antique Brass' };
const PINKT = '#D98096', SOFT = '#6B7660', MOSS = '#889063';
const DOODLES = K.groups.flatMap(g => g.items.map(i => ({...i, group:g.name})));
const doodle = slug => DOODLES.find(d => d.slug === slug);
const TBL = ['01-leu','02-opo','03-lis','04-ldn','05-cro','06-bru','07-lis','08-swi','09-fra','09-swi','10-thai','11-usa','12-sca','13-mal','14-sco','15-opo','16-tha','17-swi','18-lux','19-mad'];

/* a painted sprite placed in % of the sheet */
const sp = (k, x, y, w, extra = '') => `<img class="sp" src="assets/painted/${k}.png" alt="" style="left:${x}%;top:${y}%;width:${w}%;${extra}">`;
const spAt = (k) => { const p = PT[k]; return sp(k, p.x, p.y, p.pw); };
const cardSprites = (card, skip) => Object.entries(PT).filter(([k, p]) => p.card === card && !skip.includes(k)).map(([k]) => spAt(k)).join('');
const border = () => `<img class="sp full" src="assets/painted/border-a5.png" alt="">`;
const dv = () => `<div class="div"><i></i><b></b><i></i></div>`;
const pt = (n) => `calc(var(--k,1) * ${n}pt)`;

/* ================================================================ templates */
const T = {};

/* ---------------- MENU ---------------- */
T.menu = {
  name:'Menu', size:[148,210], label:'A5 · 148 × 210 mm',
  lead:'Your four menu layouts, built from the painted pieces on your approved cards. Use one card per place setting or one per table.',
  hint:'Print on A5 card at 100% scale with no margins. The text shrinks to fit if a course runs long.',
  defaults:{ layout:'still', title:'painted', titleText:'Menu', titleInk:'fern',
    courses:[
      {label:'Starter', pt:'entrada', items:'Burrata, heirloom tomatoes & white peach | basil oil · toasted sourdough'},
      {label:'Main', pt:'prato principal', items:'Slow-roasted Bísaro pork cheeks | sweet potato purée · glazed carrots · port jus\nor\nLine-caught sea bass | clams & coriander · crushed new potatoes'},
      {label:'Dessert', pt:'sobremesa', items:'Lemon & olive oil cake | strawberries · vanilla mascarpone\n~ followed by wedding cake & pastéis de nata'},
      {label:'Wines', pt:'vinhos', items:'Alvarinho · Vinho Verde 2025\nTouriga Nacional Rosé · Douro 2025\nTouriga Nacional · Douro 2022\nOld Tawny Port'}],
    footer:'Marie & André  ·  5 . 6 . 2027' },
  fields:[
    {k:'layout', t:'opts', l:'Layout', o:[['still','Still life'],['garden','Garden'],['border','Painted border'],['quiet','Quiet']]},
    {k:'title', t:'opts', l:'Title', o:[['painted','Painted “Menu”'],['script','Typed in WindSong']]},
    {k:'titleText', t:'text', l:'Title words', when:s => s.title === 'script'},
    {k:'titleInk', t:'ink', l:'Title ink', o:['fern','peony'], when:s => s.title === 'script'},
    {k:'courses', t:'list', l:'Courses', item:'Course', max:6, blank:{label:'Course', pt:'', items:'Dish | detail'},
      sub:[{k:'label', t:'text', l:'Heading'},{k:'pt', t:'text', l:'In Portuguese'},
           {k:'items', t:'area', l:'Dishes', help:'One dish per line. Put the detail after a | and it is set in italics below the dish. A line that is only “or” becomes a small italic “or”. Start a line with ~ for an italic note.'}]},
    {k:'footer', t:'text', l:'Footer'}],
  render(s){
    const L = { still:[17,17,23.5,7], garden:[15,15,21,7], border:[15,15,21.5,10], quiet:[16,16,28,8] }[s.layout];
    let art = '', title = '';
    if (s.layout === 'still') art = cardSprites('still', ['menu-lettering']);
    if (s.layout === 'garden') art = cardSprites('garden', ['menu-lettering-2']);
    if (s.layout === 'border') art = border() + sp('pink-sprig-small', 9, 6.2, 4.4) + sp('olive-sprig', 9.5, 82, 10);
    if (s.layout === 'quiet') art = sp('lemon-branch', 38.5, 3.2, 23);
    const ty = { still:13.8, garden:9.6, border:8.4, quiet:17.2 }[s.layout];
    if (s.title === 'painted') {
      const k = s.layout === 'garden' ? 'menu-lettering-2' : 'menu-lettering', p = PT[k];
      title = sp(k, s.layout === 'still' ? p.x : 50 - p.pw/2, ty, p.pw);
    } else {
      title = `<div class="box t-hand" style="left:0;right:0;top:${ty - 1.2}%;font-size:44pt;color:${INK[s.titleInk]};line-height:1">${esc(s.titleText)}</div>`;
    }
    const course = c => {
      const lines = String(c.items || '').split('\n').filter(x => x.trim()).map(line => {
        line = line.trim();
        if (/^or$/i.test(line)) return `<div class="t-ital" style="font-size:${pt(7.5)};color:${SOFT};margin:.6mm 0">or</div>`;
        if (line.startsWith('~')) return `<div class="t-ital" style="font-size:${pt(8.4)};color:${SOFT};margin-top:1mm">${esc(line.slice(1).trim())}</div>`;
        const [d, x] = line.split('|');
        return `<div class="t-serif" style="font-size:${pt(11)};line-height:1.25">${esc(d.trim())}</div>${x ? `<div class="t-ital" style="font-size:${pt(8.2)};color:${SOFT};line-height:1.3">${esc(x.trim())}</div>` : ''}`;
      }).join('');
      return `<div style="margin-bottom:${pt(9)}"><div class="t-caps" style="font-size:${pt(6.6)};letter-spacing:.32em;text-indent:.32em;color:${MOSS}">${esc(c.label)}</div>
        ${c.pt ? `<div class="t-ital" style="font-size:${pt(7.6)};color:${PINKT};margin:.3mm 0 1mm">${esc(c.pt)}</div>` : '<div style="height:1.4mm"></div>'}${lines}</div>`;
    };
    const body = s.courses.map(course).join(dv().replace('class="div"', `class="div" style="margin:${pt(-3)} 0 ${pt(7)}"`));
    return `<div class="sheet" style="width:148mm;height:210mm">${art}${title}
      <div class="box" data-fit="1.3" style="left:${L[0]}%;right:${L[1]}%;top:${L[2]}%;bottom:${L[3]}%">${body}
      <div class="t-caps" style="margin-top:auto;padding-top:${pt(4)};font-size:5.6pt;letter-spacing:.26em;text-indent:.26em;color:${MOSS};white-space:pre">${esc(s.footer)}</div></div></div>`;
  }
};

/* ---------------- DRINKS ---------------- */
const DRINK_ART = [['strawberry-mojito','Strawberry mojito'],['basil-smash','Basil smash'],['none','No painting']];
T.drinks = {
  name:'Signature drinks', size:[148,210], label:'A5 · 148 × 210 mm',
  lead:'His and hers, with the painted glasses. Stand it on the bar in a brass frame.',
  hint:'Print on A5 card at 100%, no margins. The painted border version is the one that matches the table suite.',
  defaults:{ layout:'scattered', frame:'border', eyebrow:'Our signature', title:'Drinks', sub:'bebidas da casa',
    a_who:'Hers', a_pt:'dela', a_name:'Virgin Strawberry\nMojito', a_ing:'strawberry · mint · lime\nsoda · alcohol-free', a_art:'strawberry-mojito',
    b_who:'His', b_pt:'dele', b_name:'Basil Smash', b_ing:'gin · fresh basil\nlemon · sugar syrup', b_art:'basil-smash',
    footer:'Marie & André  ·  5 . 6 . 2027' },
  fields:[
    {k:'layout', t:'opts', l:'Layout', o:[['scattered','Scattered'],['stacked','Stacked']]},
    {k:'frame', t:'opts', l:'Frame', o:[['border','Painted border'],['corners','Painted corners']]},
    {k:'eyebrow', t:'text', l:'Small line above'},{k:'title', t:'text', l:'Title (WindSong)'},{k:'sub', t:'text', l:'Line below (Portuguese)'},
    {sep:'First drink'},
    {k:'a_who', t:'text', l:'Whose'},{k:'a_pt', t:'text', l:'In Portuguese'},{k:'a_name', t:'area', l:'Name', help:'A new line breaks the name.'},{k:'a_ing', t:'area', l:'Ingredients'},{k:'a_art', t:'select', l:'Painting', o:DRINK_ART},
    {sep:'Second drink'},
    {k:'b_who', t:'text', l:'Whose'},{k:'b_pt', t:'text', l:'In Portuguese'},{k:'b_name', t:'area', l:'Name'},{k:'b_ing', t:'area', l:'Ingredients'},{k:'b_art', t:'select', l:'Painting', o:DRINK_ART},
    {sep:''},{k:'footer', t:'text', l:'Footer'}],
  render(s){
    const art = s.frame === 'border' ? border() + sp('pink-sprig-small', 9, 6.5, 4.4) + sp('olive-sprig', 9, 83, 9.5)
      : sp('lemon-branch', 1.7, 2.6, 22) + sp('swallow', 79, 2.5, 13) + sp('olive-sprig', 3.3, 84, 12) + sp('pink-sprig', 87, 74, 9);
    const block = (p, align = 'center') => `<div class="t-caps" style="font-size:7pt;letter-spacing:.32em;text-indent:.32em;color:${MOSS}">${esc(s[p+'who'])}</div>
      <div class="t-ital" style="font-size:8pt;color:${PINKT};margin:.4mm 0 1.6mm">${esc(s[p+'pt'])}</div>
      <div class="t-hand" style="font-size:${pt(21)};line-height:1.08">${esc(s[p+'name']).replace(/\n/g,'<br>')}</div>
      <div style="margin:2.6mm 0 2.2mm">${dv()}</div>
      <div class="t-ital" style="font-size:9pt;color:${SOFT};line-height:1.4">${esc(s[p+'ing']).replace(/\n/g,'<br>')}</div>`;
    const img = (k, style) => k === 'none' ? '' : `<img class="sp" src="assets/painted/${k}.png" alt="" style="${style}">`;
    const aw = k => k === 'basil-smash' ? 31 : 24;
    const head = `<div class="box" style="left:0;right:0;top:10.5%">
      <div class="t-caps" style="font-size:7.4pt;letter-spacing:.36em;text-indent:.36em;color:${MOSS}">${esc(s.eyebrow)}</div>
      <div class="t-hand" style="font-size:46pt;line-height:1.1;margin-top:-1mm">${esc(s.title)}</div>
      <div class="t-ital" style="font-size:9pt;color:${PINKT};margin-top:-1mm">${esc(s.sub)}</div></div>`;
    let body;
    if (s.layout === 'scattered') {
      body = img(s.a_art, `left:13%;top:29%;width:${aw(s.a_art)}%`) + `<div class="box" data-fit style="left:44%;right:9%;top:33%;height:24%">${block('a_')}</div>`
           + img(s.b_art, `right:12%;top:56%;width:${aw(s.b_art)}%`) + `<div class="box" data-fit style="left:9%;right:48%;top:63%;height:22%">${block('b_')}</div>`;
    } else {
      body = img(s.a_art, `left:50%;top:26%;width:${aw(s.a_art)*.62}%;transform:translateX(-50%)`) + `<div class="box" data-fit style="left:12%;right:12%;top:44.5%;height:17%">${block('a_')}</div>`
           + img(s.b_art, `left:50%;top:61%;width:${aw(s.b_art)*.62}%;transform:translateX(-50%)`) + `<div class="box" data-fit style="left:12%;right:12%;top:76.5%;height:13%">${block('b_')}</div>`;
    }
    return `<div class="sheet" style="width:148mm;height:210mm">${art}${head}${body}
      <div class="box t-caps" style="left:0;right:0;bottom:${s.frame === 'border' ? 8.6 : 6}%;font-size:5.6pt;letter-spacing:.26em;text-indent:.26em;color:${MOSS};white-space:pre">${esc(s.footer)}</div></div>`;
  }
};

/* ---------------- TABLE NUMBER ---------------- */
T.table = {
  name:'Table number', size:[105,148], label:'A6 · 105 × 148 mm',
  lead:'One painting per table: a place that matters to the people sitting there. Or the painted-border version from the table suite.',
  hint:'Print on A6 card, or four to a sheet of A4 and trim. Use digits, which read the same in Portuguese and English.',
  defaults:{ style:'painting', painting:'01-leu', num:'1', font:'jost', ink:'fern', size:150, y:9, caption:'', capStyle:'caps', posies:true },
  fields:[
    {k:'style', t:'opts', l:'Style', o:[['painting','Oil painting'],['border','Painted border']]},
    {k:'painting', t:'thumbs', l:'Painting', when:s => s.style === 'painting'},
    {k:'num', t:'text', l:'Table number'},
    {k:'font', t:'opts', l:'Number in', o:[['jost','Jost 300'],['cormorant','Cormorant'],['italic','Cormorant italic']], help:'Jost is the safe choice: Cormorant’s 1 has a base serif and reads like an I.'},
    {k:'ink', t:'ink', l:'Number ink', o:['fern','ivory','peony','coral']},
    {k:'size', t:'range', l:'Number size', min:70, max:230},
    {k:'y', t:'range', l:'Number height on the card', min:2, max:60},
    {k:'caption', t:'text', l:'Caption (optional)', help:'For example the city in the painting, or a line of welcome.'},
    {k:'capStyle', t:'opts', l:'Caption in', o:[['caps','Spaced caps'],['hand','WindSong']], when:s => !!s.caption},
    {k:'posies', t:'toggle', l:'Painted posies in the corners', when:s => s.style === 'border'}],
  render(s){
    const ff = s.font === 'jost' ? "'Jost';font-weight:300" : s.font === 'italic' ? "'Cormorant Garamond';font-style:italic;font-weight:400" : "'Cormorant Garamond';font-weight:400";
    const col = INK[s.ink];
    const bg = s.style === 'painting' ? `<img class="sp full" src="assets/tables/${s.painting}.jpg" alt="" style="object-fit:cover">`
      : border() + (s.posies ? sp('pink-blossom', 8, 6, 26) + sp('lemon-blossom', 66, 70, 26) : '');
    const cap = s.caption ? (s.capStyle === 'hand'
      ? `<div class="t-hand" style="font-size:22pt;color:${col};margin-top:1mm">${esc(s.caption)}</div>`
      : `<div class="t-caps" style="font-size:7.5pt;letter-spacing:.36em;text-indent:.36em;color:${col};margin-top:2mm">${esc(s.caption)}</div>`) : '';
    const top = s.style === 'border' && s.y < 20 ? 30 : s.y;
    return `<div class="sheet" style="width:105mm;height:148mm">${bg}
      <div class="box" style="left:0;right:0;top:${top}%"><div style="font-family:${ff};font-size:${s.size}pt;line-height:.9;color:${col};font-variant-numeric:lining-nums">${esc(s.num)}</div>${cap}</div></div>`;
  }
};

/* ---------------- PLACE CARDS ---------------- */
const PC_DOODLES = DOODLES.filter(d => !d.traced && !d.slug.startsWith('frame'));
T.place = {
  name:'Place cards', size:[210,297], label:'A4 sheet · 10 cards of 85 × 55 mm',
  lead:'Your sardine tin, or a doodle card. Type everyone’s name once, write the table after a comma, and the studio lays them out ten to a sheet of A4.',
  hint:'Print at 100% on A4 micro-perforated business-card sheets (ten 85 × 55 mm cards, about 250 gsm), then snap them apart. No scissors needed.',
  defaults:{ names:'Maxence, 1\nDavid, 1\nChiara, 2\nRenee, 2\nNicole, 3\nTiago, 3', doodle:'sardine', ink:'red', layout:'tin', hello:'Olá', tableWord:'Table', wash:true },
  fields:[
    {k:'names', t:'area', l:'Guests', help:'One per line, as “Name, table number”. Leave the table off to print the name only.', rows:9},
    {k:'layout', t:'opts', l:'Design', o:[['tin','Sardine tin'],['side','Doodle beside'],['top','Doodle above'],['none','Name only']]},
    {k:'hello', t:'text', l:'Greeting on the tin', help:'“Olá” reads the same to both families.', when:s => s.layout === 'tin'},
    {k:'tableWord', t:'text', l:'Word before the number', help:'“Table”, “Mesa”, or leave it empty for the number alone.', when:s => s.layout !== 'tin'},
    {k:'doodle', t:'select', l:'Doodle', o:PC_DOODLES.map(d => [d.slug, d.group + ' · ' + d.cap]), when:s => s.layout !== 'none' && s.layout !== 'tin'},
    {k:'ink', t:'ink', l:'Ink (one per card)', o:['red','peony','fern','moss','grape'], help:'Wedding Red is the pick: it ties to the tees. Terra Cotta and Coral are too faint for thin script names.'},
    {k:'wash', t:'toggle', l:'Colour wash behind the doodle', when:s => s.layout === 'side' || s.layout === 'top'}],
  render(s){
    const list = String(s.names).split('\n').map(x => x.trim()).filter(Boolean).map(x => { const i = x.lastIndexOf(','); return i > 0 ? [x.slice(0, i).trim(), x.slice(i + 1).trim()] : [x, '']; });
    if (!list.length) list.push(['Guest name', '1']);
    const col = INK[s.ink], d = doodle(s.doodle) || doodle('sardine');
    const washC = { fern:'#F4B6C8', coral:'#FFD76A', peony:'#FFD76A', swallow:'#FFD76A', rose:'#F4B6C8', moss:'#F4B6C8' }[s.ink];
    const art = sz => s.layout === 'none' ? '' : `<div class="doo" style="position:relative;width:${sz}mm;height:${sz}mm;color:${col};flex:none">${s.wash ? `<i style="position:absolute;inset:18% 12% 14% 22%;border-radius:46% 54% 50% 50%/56% 44% 56% 44%;background:${washC};opacity:.55;transform:translate(5%,6%) rotate(-8deg)"></i>` : ''}<div style="position:relative;width:100%;height:100%">${d.svg}</div></div>`;
    const tbl = t => t ? `<div class="t-caps" style="font-size:6.4pt;letter-spacing:.34em;text-indent:.34em;color:${MOSS};margin-top:1.4mm">${esc(s.tableWord ? s.tableWord + ' ' : '')}${esc(t)}</div>` : '';
    const nm = n => `<div class="t-hand" data-name style="font-size:27pt;line-height:1.15;color:${col};white-space:nowrap">${esc(n)}</div>`;
    let uid = 0;
    const tin = ([n, t]) => window.DAYART.tin.replace(/__ID__/g, 'pc' + (uid++)).replace(/__INK__/g, col).replace('__NAME__', esc(n)).replace('__TABLE__', esc(t)).replace('>Olá</text>', '>' + esc(s.hello) + '</text>').replace('<svg ', '<svg style="width:100%;height:100%;display:block" ');
    const cardHtml = ([n, t]) => s.layout === 'tin' && window.DAYART ? tin([n, t]) : s.layout === 'side'
      ? `<div style="display:flex;align-items:center;gap:4mm;padding:0 7mm 0 6mm;height:100%">${art(30)}<div style="flex:1;min-width:0;text-align:center">${nm(n)}${tbl(t)}</div></div>`
      : `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:3mm 6mm;text-align:center">${s.layout === 'top' ? art(19) : ''}${nm(n)}${tbl(t)}</div>`;
    const pages = [];
    for (let p = 0; p < list.length; p += 10) {
      const cells = list.slice(p, p + 10).map((g, i) => {
        const x = 20 + (i % 2) * 85, y = 11 + Math.floor(i / 2) * 55;
        return `<div style="position:absolute;left:${x}mm;top:${y}mm;width:85mm;height:55mm;overflow:hidden" data-card>${cardHtml(g)}</div>`;
      }).join('');
      const marks = [];
      for (const x of [20, 105, 190]) marks.push(`<i style="position:absolute;left:${x}mm;top:4mm;width:.15mm;height:5mm;background:#4A5A3D"></i><i style="position:absolute;left:${x}mm;bottom:4mm;width:.15mm;height:5mm;background:#4A5A3D"></i>`);
      for (let r = 0; r <= 5; r++) { const y = 11 + r * 55; marks.push(`<i style="position:absolute;top:${y}mm;left:6mm;height:.15mm;width:6mm;background:#4A5A3D"></i><i style="position:absolute;top:${y}mm;right:6mm;height:.15mm;width:6mm;background:#4A5A3D"></i>`); }
      pages.push(`<div class="sheet" style="width:210mm;height:297mm">${marks.join('')}${cells}</div>`);
    }
    return pages.join('');
  },
  after(root){ $$('text.nm', root).forEach(t => { const max = +t.dataset.max, sz = +t.dataset.size; t.setAttribute('font-size', sz); try { const w = t.getComputedTextLength(); if (w > max) t.setAttribute('font-size', (sz * max / w).toFixed(2)); } catch (e) {} });
    $$('[data-name]', root).forEach(el => { const max = el.parentElement.clientWidth; let f = 27; while (el.scrollWidth > max && f > 12) { f -= 1; el.style.fontSize = f + 'pt'; } }); }
};

/* ---------------- ORDER OF THE DAY ---------------- */
const DAY_DOODLES = [['', 'No doodle'], ...DOODLES.filter(d => !d.traced).map(d => [d.slug, d.group + ' · ' + d.cap])];
T.day = {
  name:'Order of the day', size:[148,210], label:'A5 · 148 × 210 mm',
  lead:'The timings for the day. Choose pen doodles or the painted border, but not both, because pen line and paint clash.',
  hint:'Print on A5 card at 100%. A timeline can carry one doodle per moment; anywhere else, three is plenty.',
  defaults:{ style:'pen', title:'The day', sub:'Saturday · 5 June 2027', ink:'fern',
    rows:[{time:'14:30', what:'Guests arrive', note:'chegada dos convidados', d:'the-house-sm'},{time:'15:00', what:'Ceremony', note:'cerimónia', d:'rings'},
      {time:'16:00', what:'Drinks & canapés', note:'aperitivos', d:'cheers'},{time:'17:00', what:'Golden-hour photos', note:'fotografias ao fim da tarde', d:'sun'},
      {time:'19:00', what:'Dinner & speeches', note:'jantar e discursos', d:'fork-knife'},{time:'21:00', what:'Cutting the cake', note:'corte do bolo', d:'cake'},
      {time:'21:30', what:'First dance', note:'primeira dança', d:'record-player'},{time:'& then', what:'Party till late', note:'festa até tarde', d:'disco'}],
    footer:'Marie & André · 5 . 6 . 2027' },
  fields:[
    {k:'style', t:'opts', l:'Style', o:[['pen','Pen doodles'],['painted','Painted border']]},
    {k:'title', t:'text', l:'Title (WindSong)'},{k:'sub', t:'text', l:'Date line'},
    {k:'ink', t:'ink', l:'Ink', o:['fern','coral','peony','swallow','rose']},
    {k:'rows', t:'list', l:'Timings', item:'Moment', max:9, blank:{time:'00:00', what:'Moment', note:'', d:''},
      sub:[{k:'time', t:'text', l:'Time'},{k:'what', t:'text', l:'What'},{k:'note', t:'text', l:'Note'},{k:'d', t:'select', l:'Doodle', o:DAY_DOODLES, when:s => s.style === 'pen'}]},
    {k:'footer', t:'text', l:'Footer'}],
  warn(s){ const n = s.style === 'pen' ? s.rows.filter(r => r.d).length : 0; return n > s.rows.length ? 'More doodles than moments.' : ''; },
  render(s){
    const col = INK[s.ink], pen = s.style === 'pen';
    const art = pen ? '' : border() + sp('pink-blossom', 8.5, 5.5, 12) + sp('lemon-blossom', 76, 79, 14);
    const row = r => `<div style="display:grid;grid-template-columns:${pen ? '19mm calc(var(--k,1)*12mm) 1fr' : '22mm 1fr'};align-items:center;gap:3mm;text-align:left;margin-bottom:${pt(9)}">
      <div class="t-caps" style="font-size:${pt(9.5)};letter-spacing:.14em;color:${col};text-align:right">${esc(r.time)}</div>
      ${pen ? `<div class="doo" style="width:calc(var(--k,1)*12mm);height:calc(var(--k,1)*12mm);color:${col}">${r.d && doodle(r.d) ? doodle(r.d).svg : ''}</div>` : ''}
      <div style="border-left:${pen ? 0 : '.3mm solid ' + PINKT};padding-left:${pen ? 0 : 4}mm"><div class="t-serif" style="font-size:${pt(14)};line-height:1.1">${esc(r.what)}</div>${r.note ? `<div class="t-ital" style="font-size:${pt(9)};color:${SOFT}">${esc(r.note)}</div>` : ''}</div></div>`;
    return `<div class="sheet" style="width:148mm;height:210mm;color:${pen ? col : '#4A5A3D'}">${art}
      <div class="box" style="left:0;right:0;top:${pen ? 8 : 10}%"><div class="t-hand" style="font-size:52pt;line-height:1.05;color:${col}">${esc(s.title)}</div>
      <div class="t-caps" style="font-size:7pt;letter-spacing:.34em;text-indent:.34em;color:${MOSS};margin-top:4.5mm">${esc(s.sub)}</div>
      <div style="margin-top:4mm">${pen ? `<div class="doo" style="width:9mm;height:9mm;color:${col};margin:0 auto">${doodle('mark-squiggle').svg}</div>` : dv()}</div></div>
      <div class="box" data-fit="1.55" style="left:${pen ? 10 : 16}%;right:${pen ? 14 : 16}%;top:${pen ? 33 : 34}%;bottom:12%;align-items:stretch;justify-content:center">${s.rows.map(row).join('')}</div>
      <div class="box t-caps" style="left:0;right:0;bottom:${pen ? 6 : 8.6}%;font-size:5.8pt;letter-spacing:.28em;text-indent:.28em;color:${MOSS}">${esc(s.footer)}</div></div>`;
  }
};

/* ---------------- WELCOME SIGN ---------------- */
T.welcome = {
  name:'Welcome sign', size:[148,210], label:'A-series portrait · scales to A2 or A1',
  lead:'The sign at the gate. It’s designed at A5 and scales cleanly: the wordmark is vector and the painting is high resolution.',
  hint:'For a large sign, save the PDF and ask the printer to scale it to A2 (420 × 594 mm) or A1. The proportions are the same.',
  defaults:{ art:'venue', eyebrow:'Welcome to the wedding of', logoInk:'rose', names:'', date:'5 June 2027', venue:'Portugal', hand:'sempre amor em Portugal' },
  fields:[
    {k:'art', t:'opts', l:'Artwork', o:[['venue','Venue watercolour'],['border','Painted border'],['none','Paper only']], help:'No pen doodles on a piece with the venue painting.'},
    {k:'eyebrow', t:'text', l:'Line above'},
    {k:'logoInk', t:'ink', l:'Wordmark', o:['rose','fern']},
    {k:'names', t:'text', l:'Names under the wordmark (optional)', help:'The wordmark already says M & A. Add “Marie & André” here if you want it spelled out.'},
    {k:'hand', t:'text', l:'Line in WindSong'},
    {k:'date', t:'text', l:'Date'},{k:'venue', t:'text', l:'Place'}],
  render(s){
    const art = s.art === 'venue'
      ? `<div style="position:absolute;left:14%;right:14%;bottom:7%;height:46%;border-radius:999px 999px 6mm 6mm;background:#EFF3EA;overflow:hidden"><img src="assets/venue-faded.jpg" alt="" style="position:absolute;left:4%;width:92%;bottom:2%;mix-blend-mode:multiply"></div>`
      : s.art === 'border' ? border() + sp('pink-blossom', 9, 5.5, 18) + sp('lemon-blossom', 71, 75, 19) + sp('swallow', 76, 8, 12) : '';
    const top = s.art === 'venue' ? 9 : 22;
    return `<div class="sheet" style="width:148mm;height:210mm">${art}
      <div class="box" style="left:10%;right:10%;top:${top}%">
        <div class="t-caps" style="font-size:7.6pt;letter-spacing:.38em;text-indent:.38em;color:${MOSS}">${esc(s.eyebrow)}</div>
        <div style="width:78mm;margin:7mm auto 0;color:${INK[s.logoInk]}">${K.logo}</div>
        ${s.names ? `<div class="t-serif" style="font-size:15pt;letter-spacing:.2em;text-indent:.2em;text-transform:uppercase;margin-top:5mm">${esc(s.names)}</div>` : ''}
        ${s.hand ? `<div class="t-hand" style="font-size:24pt;color:${PINKT};margin-top:4mm">${esc(s.hand)}</div>` : ''}
        <div style="margin:4mm 0">${dv()}</div>
        <div class="t-caps" style="font-size:8.4pt;letter-spacing:.34em;text-indent:.34em">${esc(s.date)}</div>
        <div class="t-ital" style="font-size:11pt;color:${SOFT};margin-top:1.4mm">${esc(s.venue)}</div>
      </div></div>`;
  }
};

/* ================================================================ state */
const KEY = 'ma-studio-v2';
let store = {};
try { store = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { store = {}; }
const clone = o => JSON.parse(JSON.stringify(o));
let cur = (location.hash.slice(1) in T) ? location.hash.slice(1) : (store._cur in T ? store._cur : 'menu');
const st = id => (store[id] = Object.assign(clone(T[id].defaults), store[id] || {}));
const persist = () => { try { store._cur = cur; localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} };

/* ================================================================ panel */
const swb = (k, on) => `<button class="swb${on ? ' on' : ''}" data-v="${k}" style="background:${INK[k]}" title="${INKNAME[k]}" aria-label="${INKNAME[k]}"></button>`;
function control(f, val, path){
  const id = 'f_' + path.replace(/\W/g, '_');
  const help = f.help ? `<p class="help">${f.help}</p>` : '';
  switch (f.t) {
    case 'text': return `<div class="fld"><label for="${id}">${f.l}</label><input type="text" id="${id}" data-p="${path}" value="${esc(val)}">${help}</div>`;
    case 'area': return `<div class="fld"><label for="${id}">${f.l}</label><textarea id="${id}" data-p="${path}" rows="${f.rows || 3}">${esc(val)}</textarea>${help}</div>`;
    case 'select': return `<div class="fld"><label for="${id}">${f.l}</label><select id="${id}" data-p="${path}">${f.o.map(([v, n]) => `<option value="${esc(v)}"${v === val ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select>${help}</div>`;
    case 'opts': return `<div class="fld"><span class="lbl">${f.l}</span><div class="opts" data-p="${path}">${f.o.map(([v, n]) => `<button data-v="${v}" class="${v === val ? 'on' : ''}">${n}</button>`).join('')}</div>${help}</div>`;
    case 'ink': return `<div class="fld"><span class="lbl">${f.l} · ${INKNAME[val] || ''}</span><div class="inks" data-p="${path}">${f.o.map(k => swb(k, k === val)).join('')}</div>${help}</div>`;
    case 'range': return `<div class="fld"><label for="${id}">${f.l}</label><input type="range" id="${id}" data-p="${path}" data-num min="${f.min}" max="${f.max}" value="${val}">${help}</div>`;
    case 'toggle': return `<div class="fld"><label class="tog" style="text-transform:none;letter-spacing:.02em;font-size:14px;color:var(--fern)"><input type="checkbox" data-p="${path}" ${val ? 'checked' : ''}> ${f.l}</label></div>`;
    case 'thumbs': return `<div class="fld"><span class="lbl">${f.l}</span><div class="thumbs" data-p="${path}" style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px">${TBL.map(t => `<button data-v="${t}" title="${t}" style="padding:0;border:2px solid ${t === val ? 'var(--fern)' : 'transparent'};border-radius:8px;overflow:hidden;aspect-ratio:1/1.4;background:none"><img src="assets/tables/${t}.jpg" alt="${t}" loading="lazy" style="width:100%;height:100%;object-fit:cover"></button>`).join('')}</div><p class="help">${val.replace('-', ' · ').toUpperCase()}</p></div>`;
  }
  return '';
}
function drawPanel(){
  const t = T[cur], s = st(cur);
  let h = `<h1>${t.name}</h1><p class="lead">${t.lead}</p>`;
  const w = t.warn && t.warn(s); if (w) h += `<p class="warn">${w}</p>`;
  for (const f of t.fields) {
    if ('sep' in f) { h += `<div class="sep"></div>${f.sep ? `<p class="caps" style="margin:-4px 0 14px">${f.sep}</p>` : ''}`; continue; }
    if (f.when && !f.when(s)) continue;
    if (f.t === 'list') {
      h += `<div class="fld"><span class="lbl">${f.l}</span></div>` + s[f.k].map((it, i) => `<div class="group"><div class="gt"><b>${f.item} ${i + 1}</b><span class="acts">
        <button data-mv="${f.k}:${i}:-1" title="Move up" aria-label="Move up">↑</button> <button data-mv="${f.k}:${i}:1" title="Move down" aria-label="Move down">↓</button> <button data-rm="${f.k}:${i}" title="Remove" aria-label="Remove">✕</button></span></div>
        ${f.sub.filter(x => !x.when || x.when(s)).map(x => control(x, it[x.k], `${f.k}.${i}.${x.k}`)).join('')}</div>`).join('')
        + (s[f.k].length < f.max ? `<button class="add" data-add="${f.k}">+ Add ${f.item.toLowerCase()}</button>` : '');
      continue;
    }
    h += control(f, s[f.k], f.k);
  }
  const p = $('#panel'), y = p.scrollTop; p.innerHTML = h; p.scrollTop = y;
  $('#info').textContent = t.label;
  $('#hint').textContent = t.hint;
}
function setPath(path, v){
  const s = st(cur), parts = path.split('.'); let o = s;
  while (parts.length > 1) o = o[parts.shift()];
  o[parts[0]] = v; persist();
}
const listField = k => T[cur].fields.find(f => f.k === k);
$('#panel').addEventListener('input', e => {
  const el = e.target.closest('[data-p]'); if (!el || el.tagName === 'DIV') return;
  setPath(el.dataset.p, el.type === 'checkbox' ? el.checked : el.hasAttribute('data-num') ? +el.value : el.value);
  queue(el.tagName === 'SELECT' || el.type === 'checkbox');
});
$('#panel').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const s = st(cur);
  const grp = b.closest('[data-p]');
  if (grp && b.dataset.v !== undefined) { setPath(grp.dataset.p, b.dataset.v); queue(true); return; }
  if (b.dataset.add) { s[b.dataset.add].push(clone(listField(b.dataset.add).blank)); persist(); queue(true); return; }
  if (b.dataset.rm) { const [k, i] = b.dataset.rm.split(':'); if (s[k].length > 1) s[k].splice(+i, 1); persist(); queue(true); return; }
  if (b.dataset.mv) { const [k, i, d] = b.dataset.mv.split(':'), a = s[k], j = +i + +d; if (j >= 0 && j < a.length) { [a[i], a[j]] = [a[j], a[i]]; persist(); queue(true); } }
});

/* ================================================================ render + fit */
let raf = 0, needPanel = false;
function queue(panelToo){ needPanel = needPanel || panelToo; cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { if (needPanel) drawPanel(); needPanel = false; drawSheet(); }); }
function fitBoxes(root){
  $$('[data-fit]', root).forEach(b => {
    let k = +(b.dataset.fit || 1); b.style.setProperty('--k', k);
    while (b.scrollHeight > b.clientHeight + 1 && k > 0.5) { k -= 0.02; b.style.setProperty('--k', k.toFixed(3)); }
  });
}
let zoomMode = 'fit';
function drawSheet(){
  const t = T[cur], s = st(cur);
  $('#sheets').innerHTML = t.render(s);
  const done = () => { fitBoxes($('#sheets')); t.after && t.after($('#sheets')); scale(); };
  done(); document.fonts && document.fonts.ready.then(done);
  $$('#tpls a').forEach(a => a.classList.toggle('on', a.dataset.t === cur));
  const w = t.warn && t.warn(s), wEl = $('.panel .warn');
  if (!!w !== !!wEl) needPanel = true;
}
function scale(){
  const c = $('#canvas'), sh = $('#sheets');
  sh.style.zoom = 1;
  const W = sh.offsetWidth, H = sh.offsetHeight;
  const z = zoomMode === 'fit' ? Math.min((c.clientWidth - 48) / W, (c.clientHeight - 48) / Math.min(H, $('.sheet', sh).offsetHeight), 2.2) : 1;
  sh.style.zoom = Math.max(z, 0.2);
}
window.addEventListener('resize', scale);
$('#zoom').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; zoomMode = b.dataset.z; $$('#zoom button').forEach(x => x.classList.toggle('on', x === b)); scale(); });

/* ================================================================ template nav */
$('#tpls').innerHTML = Object.entries(T).map(([id, t]) => `<a data-t="${id}" href="#${id}">${t.name}</a>`).join('');
$('#tpls').addEventListener('click', e => { const a = e.target.closest('a'); if (!a) return; e.preventDefault(); go(a.dataset.t); });
function go(id){ cur = id; history.replaceState(null, '', '#' + id); persist(); $('#panel').scrollTop = 0; drawPanel(); drawSheet(); }
window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (h in T && h !== cur) go(h); });

/* ================================================================ output */
$('#printBtn').onclick = () => {
  const [w, h] = T[cur].size;
  $('#pageSize').textContent = `@page{size:${w}mm ${h}mm;margin:0}`;
  const pr = $('#printRoot'); pr.innerHTML = $('#sheets').innerHTML;
  // the copies keep the fitted sizes from the preview (inline --k and font sizes)
  setTimeout(() => window.print(), 60);
};
$('#pngBtn').onclick = async () => {
  if (!window.htmlToImage) { toast('PNG export needs an internet connection. Use Print → Save as PDF instead.'); return; }
  const b = $('#pngBtn'); b.disabled = true; b.textContent = 'Painting…';
  const sh = $('#sheets'), z = sh.style.zoom; sh.style.zoom = 1; sh.classList.add('exporting');
  try {
    const sheets = $$('.sheet', sh);
    for (let i = 0; i < sheets.length; i++) {
      const url = await htmlToImage.toPng(sheets[i], { pixelRatio: 300 / 96, backgroundColor:'#F4EDE3', style:{ boxShadow:'none' } });
      const a = document.createElement('a'); a.href = url; a.download = `marie-andre-${cur}${sheets.length > 1 ? '-page-' + (i + 1) : ''}.png`; a.click();
    }
    toast('PNG saved at 300 dpi');
  } catch (err) { console.error(err); toast('Couldn’t paint the PNG. Use Print → Save as PDF instead.'); }
  sh.style.zoom = z; sh.classList.remove('exporting'); b.disabled = false; b.textContent = 'Download PNG';
};
$('#resetBtn').onclick = () => { if (!confirm(`Reset the ${T[cur].name.toLowerCase()} to the original words?`)) return; store[cur] = clone(T[cur].defaults); persist(); drawPanel(); drawSheet(); };
window.addEventListener('afterprint', () => { $('#printRoot').innerHTML = ''; });

go(cur);
})();
