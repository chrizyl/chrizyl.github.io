const photos = ["assets/myphoto.jpg", "assets/myphoto1.jpg", "assets/myphoto2.jpg", "assets/myphoto3.jpg"];
const crops = ["crop-0", "crop-1", "crop-2", "crop-3", "crop-4", "crop-5"];
const shufflePhotos = () => {
  const order = [...photos];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
};
const makePhotoSequence = () => {
  const sequence = [];
  while (sequence.length < 12) {
    const group = sequence.length % 2 === 0 ? 0 : 1;
    const choices = shufflePhotos().filter(photo => Math.floor(photos.indexOf(photo) / 2) === group);
    sequence.push(choices[0]);
  }
  return sequence;
};
const frames = order => order.map((photo, index) => {
  const crop = crops[index % crops.length];
  return `<div class="frame order-${index % crops.length} ${crop}"><img src="${photo}" alt="" loading="eager"></div>`;
}).join('');
const makeTrack = () => {
  const sequence = makePhotoSequence();
  return frames([...sequence, ...sequence]);
};
document.getElementById('trackA').innerHTML = makeTrack();
document.getElementById('trackB').innerHTML = makeTrack();

const landing = document.getElementById('landing');
document.getElementById('enter').addEventListener('click', () => {
  landing.classList.add('leaving');
  setTimeout(() => { landing.classList.add('gone'); document.body.classList.remove('locked'); document.body.classList.add('ready'); }, reducedMotion ? 0 : 1950);
}, { once: true });

document.getElementById('name').innerHTML = [...'Chrizyl'].map(c => `<span aria-hidden="true">${c}</span>`).join('');

const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .18, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('[data-r]').forEach(el => io.observe(el));

const env = document.getElementById('env'), stage = document.getElementById('stage');
const letters = [...document.querySelectorAll('.letter')];
function placeLetters() {
  const ec = { x: env.offsetLeft + env.offsetWidth / 2, y: env.offsetTop + env.offsetHeight / 2 };
  letters.forEach((l, index) => {
    l.style.setProperty('--n', index);
    let x = 0, y = 0, node = l;
    while (node && node !== stage) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent; }
    l.style.setProperty('--start-rotation', `${[-9, 6, -5, 8, -7, 4][index % 6]}deg`);
    l.style.setProperty('--dx', (ec.x - (x + l.offsetWidth / 2)) + 'px');
    l.style.setProperty('--dy', (ec.y - (y + l.offsetHeight / 2)) + 'px');
  });
}
addEventListener('load', placeLetters);
addEventListener('resize', placeLetters);
document.fonts?.ready.then(placeLetters);
new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { placeLetters(); env.classList.add('open'); o.disconnect(); } }), { threshold: .6 }).observe(env);

const folders = [
 { title: "Web Development", alt: false, desc: "Responsive Bootstrap layouts and a simple website with JSON integration.", tags: ["HTML5", "CSS3", "Bootstrap 5", "JSON"], count: "3 projects",
   items: [{ name: "Bento Grid Activity", desc: "Full-screen responsive ad layout using Bootstrap grid utilities.", href: "https://chrizyl.github.io/builds/ACT001/", img: "assets/bentopreview.png" },
           { name: "SVT Archive Activity", desc: "A simple website with JSON integration.", href: "https://chrizyl.github.io/builds/ACT002/", img: "assets/svtarchive.png" },
           { name: "Curatora", label: "MIDTERM", desc: "Curatora is a digital archive that helps users explore and organize curated collections.", href: "https://chrizyl.github.io/builds/MIDTERM/", img: "assets/Curatora.png" },
           { name: "More on GitHub", desc: "Browse the rest of my work.", href: "https://github.com/chrizyl", icon: "plus" }] },
 { title: "Exploring Works", alt: true, desc: "AquaSmile is a patient-friendly clinic web app with appointment booking and service pages. Clicket supports event browsing, seat selection, and ticket purchasing.", tags: ["PHP", "MySQL", "JavaScript"], count: "2 projects + more",
   items: [{ name: "AquaSmile Dental", desc: "Clinic site with appointment booking, service pages, and patient information.", href: "https://github.com/chrizyl", img: "assets/aqua.png" },
           { name: "Clicket Event Ticketing", desc: "Browse events and purchase tickets with dynamic seat selection.", href: "https://github.com/chrizyl", img: "assets/clicket.png" },
           { name: "More on GitHub", desc: "Browse the rest of my work.", href: "https://github.com/chrizyl", icon: "plus" }] }
];
const ext = h => h.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : '';
document.getElementById('pockets').innerHTML = folders.map((f, k) => `
 <div class="col-12 col-md-6" data-r="${k ? 'right' : 'left'}">
  <div class="folder-unit">
   <div class="project-panel" id="folder-projects-${k}" hidden></div>
   <div class="pocket${f.alt ? ' alt' : ''}" tabindex="0" role="button" aria-expanded="false" aria-controls="folder-projects-${k}" aria-label="Show projects in ${f.title} folder">
    <div class="p-back"></div>
    <div class="p-cards" aria-hidden="true">${f.items.slice(0, 3).map(i => `<div class="p-card">${i.icon === 'plus' ? '<span class="p-card-plus" aria-hidden="true">+</span>' : `<img src="${i.img}" alt="" loading="lazy">`}<em>${i.name}</em></div>`).join('')}</div>
    <div class="p-front"><h3>${f.title}</h3><p>${f.desc}</p><div class="tg">${f.tags.map(t => `<span>${t}</span>`).join('')}</div><div class="ft"><span>${f.count}</span><span>Hover to preview · Select to open</span></div></div>
   </div>
  </div>
 </div>`).join('');
document.querySelectorAll('#pockets [data-r]').forEach(el => io.observe(el));
const pockets = document.querySelectorAll('.pocket');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
initAboutCarousel();
const setExpanded = (p, on) => {
  p.classList.toggle('expanded', on);
  p.setAttribute('aria-expanded', String(on));
  document.getElementById(p.getAttribute('aria-controls')).hidden = !on;
};
pockets.forEach(p => {
  const panel = document.getElementById(p.getAttribute('aria-controls'));
  panel.hidden = true;
  p.addEventListener('click', () => {
    const on = !p.classList.contains('expanded');
    if (on) pockets.forEach(other => { if (other !== p) setExpanded(other, false); });
    setExpanded(p, on);
  });
  p.addEventListener('keydown', e => {
    if (e.target === p && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); p.click(); }
    if (e.key === 'Escape' && p.classList.contains('expanded')) { setExpanded(p, false); p.focus(); }
  });
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    p.addEventListener('pointerenter', () => p.classList.add('preview-open'));
    p.addEventListener('pointerleave', () => p.classList.remove('preview-open'));
  }
});

(() => {
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const calmMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const palette = [
    { bg: '#ecd3cf', fg: '#3a0710', chip: 'rgba(58,7,16,.1)' },
    { bg: '#d98b94', fg: '#3a0710', chip: 'rgba(58,7,16,.12)' },
    { bg: '#a3263a', fg: '#fff', chip: 'rgba(255,255,255,.18)' },
    { bg: '#f6efe9', fg: '#4a0c19', chip: 'rgba(74,12,25,.08)' }
  ];
  const carouselBehavior = calmMotion ? 'auto' : 'smooth';

  document.querySelectorAll('.project-panel').forEach((panel, folderIndex) => {
    const folder = folders[folderIndex];
    if (!folder) return;

    panel.innerHTML = `
      <div class="wc-head">
        <span class="wc-label">Inside ${folder.title}</span>
        <div class="wc-nav">
          <button class="wc-btn prev" type="button" aria-label="Previous project"><i class="bi bi-arrow-left" aria-hidden="true"></i></button>
          <button class="wc-btn next" type="button" aria-label="Next project"><i class="bi bi-arrow-right" aria-hidden="true"></i></button>
        </div>
      </div>
      <div class="wc-track" tabindex="0" role="region" aria-label="${folder.title} projects">
        ${folder.items.map((item, index) => `<a class="wc tone-${index % palette.length} tilt-${index % 4}" draggable="false" href="${item.href}" ${ext(item.href)}>
          <span class="wc-in">
            <span class="wc-num">${item.label || String(index + 1).padStart(2, '0')}</span>
            <span class="wc-title">${item.name}</span>
            <span class="wc-desc">${item.desc}</span>
            <span class="wc-img${item.icon === 'plus' ? ' wc-img-plus' : ''}">${item.icon === 'plus' ? '<span aria-hidden="true">+</span>' : `<img draggable="false" src="${item.img}" alt="" loading="lazy">`}</span>
            <span class="wc-go"><i class="bi bi-arrow-up-right" aria-hidden="true"></i></span>
            <span class="wc-glare" aria-hidden="true"></span>
          </span>
        </a>`).join('')}
      </div>
      <div class="wc-dots" role="group" aria-label="Project carousel position">${folder.items.map((_, index) => `<button class="wc-dot" type="button" aria-label="Go to project ${index + 1}"></button>`).join('')}</div>`;

    const track = panel.querySelector('.wc-track');
    const cards = [...track.querySelectorAll('.wc')];
    const dots = [...panel.querySelectorAll('.wc-dot')];
    const previous = panel.querySelector('.prev');
    const next = panel.querySelector('.next');
    const step = () => (cards[0]?.offsetWidth || 218) + 16;
    const sync = () => {
      const max = track.scrollWidth - track.clientWidth;
      let activeIndex = Math.round(track.scrollLeft / step());
      if (max > 0 && track.scrollLeft >= max - 2) activeIndex = cards.length - 1;
      activeIndex = Math.max(0, Math.min(activeIndex, cards.length - 1));
      dots.forEach((dot, index) => {
        dot.classList.toggle('on', index === activeIndex);
        if (index === activeIndex) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = max <= 0 || track.scrollLeft >= max - 2;
    };

    track.addEventListener('scroll', sync, { passive: true });
    addEventListener('resize', sync);
    sync();
    previous.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: carouselBehavior }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: carouselBehavior }));
    dots.forEach((dot, index) => dot.addEventListener('click', () => track.scrollTo({ left: index * step(), behavior: carouselBehavior })));
    track.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); track.scrollBy({ left: step(), behavior: carouselBehavior }); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); track.scrollBy({ left: -step(), behavior: carouselBehavior }); }
    });

    let dragging = false, moved = false, startX = 0, startScroll = 0;
    track.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      dragging = true; moved = false; startX = event.clientX; startScroll = track.scrollLeft;
    });
    addEventListener('pointermove', event => {
      if (!dragging) return;
      const delta = event.clientX - startX;
      if (!moved && Math.abs(delta) > 6) { moved = true; track.classList.add('dragging'); }
      if (moved) track.scrollLeft = startScroll - delta;
    });
    addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('dragging');
      setTimeout(() => { moved = false; }, 0);
    });
    addEventListener('pointercancel', () => {
      dragging = false;
      moved = false;
      track.classList.remove('dragging');
    });
    track.addEventListener('click', event => {
      if (moved) { event.preventDefault(); event.stopPropagation(); }
    }, true);
    track.addEventListener('dragstart', event => event.preventDefault());

    if (finePointer && !calmMotion) cards.forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        card.style.setProperty('--ry', `${((px - .5) * 16).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${((.5 - py) * 16).toFixed(2)}deg`);
        card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  });

  document.querySelectorAll('.pocket').forEach(folderPocket => {
    const hint = folderPocket.querySelector('.ft span:last-child');
    const panel = document.getElementById(folderPocket.getAttribute('aria-controls'));
    new MutationObserver(() => {
      const expanded = folderPocket.getAttribute('aria-expanded') === 'true';
      if (hint) hint.textContent = expanded ? 'Select to close' : 'Hover to preview · Select to open';
      if (expanded && panel.querySelector('.wc-track')) {
        const track = panel.querySelector('.wc-track');
        track.scrollLeft = 0;
        track.dispatchEvent(new Event('scroll'));
        setTimeout(() => panel.scrollIntoView({ behavior: carouselBehavior, block: 'nearest' }), 200);
      }
    }).observe(folderPocket, { attributes: true, attributeFilter: ['aria-expanded'] });
  });

  const skillRows = [...document.querySelectorAll('.sk')];
  const countUp = (element, amount, progress) => {
    if (!element) return;
    progress?.setAttribute('aria-valuenow', String(amount));
    if (calmMotion) {
      element.textContent = `${amount}%`;
      return;
    }
    const started = performance.now();
    const duration = 1300;
    const tick = now => {
      const fraction = Math.min((now - started) / duration, 1);
      element.textContent = `${Math.round(amount * (1 - Math.pow(1 - fraction, 3)))}%`;
      if (fraction < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const playBars = () => skillRows.forEach((row, index) => setTimeout(() => {
    const amount = Number(row.dataset.v);
    const fill = row.querySelector('.fill');
    const progress = row.querySelector('.bar');
    if (!fill || !Number.isFinite(amount)) return;
    fill.style.width = `${amount}%`;
    countUp(row.querySelector('b'), amount, progress);
  }, calmMotion ? 0 : index * 150));
  const resetBars = () => skillRows.forEach(row => {
    const fill = row.querySelector('.fill');
    const progress = row.querySelector('.bar');
    if (!fill) return;
    fill.style.transition = 'none';
    fill.style.width = '0%';
    if (progress) progress.setAttribute('aria-valuenow', '0');
    const value = row.querySelector('b');
    if (value) value.textContent = '0%';
    void fill.offsetWidth;
    fill.style.transition = '';
  });

  let barsPlayed = false, barsBusy = false;
  const startBars = () => {
    barsPlayed = true;
    barsBusy = true;
    playBars();
    setTimeout(() => { barsBusy = false; }, 2200);
  };
  const envelope = document.getElementById('env');
  const aboutStage = document.getElementById('stage');
  if (envelope && aboutStage) {
    const finishEnvelopeMotion = () => {
      setTimeout(() => aboutStage.classList.add('settled'), calmMotion ? 0 : 3000);
      setTimeout(startBars, calmMotion ? 0 : 2600);
    };
    if (envelope.classList.contains('open')) finishEnvelopeMotion();
    else {
      new MutationObserver((_, observer) => {
        if (!envelope.classList.contains('open')) return;
        observer.disconnect();
        finishEnvelopeMotion();
      }).observe(envelope, { attributes: true, attributeFilter: ['class'] });
    }

    if (finePointer && !calmMotion) document.querySelectorAll('.about-grid .letter').forEach(letter => {
      letter.addEventListener('pointermove', event => {
        if (!aboutStage.classList.contains('settled')) return;
        const rect = letter.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        letter.style.setProperty('--ry', `${((px - .5) * 9).toFixed(2)}deg`);
        letter.style.setProperty('--rx', `${((.5 - py) * 9).toFixed(2)}deg`);
        letter.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
        letter.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      });
      letter.addEventListener('pointerleave', () => {
        letter.style.setProperty('--rx', '0deg');
        letter.style.setProperty('--ry', '0deg');
      });
    });

    const skillsCard = document.querySelector('.lw.skills .letter');
    if (finePointer && skillsCard) skillsCard.addEventListener('pointerenter', () => {
      if (!barsPlayed || barsBusy) return;
      barsBusy = true;
      resetBars();
      setTimeout(startBars, 60);
    });
  }
})();

const bar = document.getElementById('progress'), heroIn = document.getElementById('heroIn');
addEventListener('scroll', () => {
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (max > 0 ? y / max * 100 : 0) + '%';
  if (y < innerHeight && !reducedMotion) { heroIn.style.transform = `translateY(${y * .28}px) scale(${1 - y / 3000})`; heroIn.style.opacity = Math.max(0, 1 - y / (innerHeight * .8)); }
}, { passive: true });
const links = document.querySelectorAll('.nav-link[href^="#"]');
document.querySelectorAll('header[id],section[id]').forEach(sec => new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + sec.id));
}), { rootMargin: '-45% 0px -50% 0px' }).observe(sec));

function initAboutCarousel() {
  const carousel = document.getElementById('aboutCarousel');
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll('.about-slide')];
  const count = carousel.querySelector('.carousel-count');
  let active = 0;
  let timer = null;
  const show = index => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const on = i === active;
      slide.classList.toggle('active', on);
      slide.setAttribute('aria-hidden', String(!on));
      slide.inert = !on;
    });
    count.textContent = `${String(active + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };
  show(0);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const resume = () => { if (!timer) timer = window.setInterval(() => show(active + 1), 3000); };
  const pause = () => { window.clearInterval(timer); timer = null; };
  carousel.addEventListener('pointerenter', pause);
  carousel.addEventListener('pointerleave', resume);
  carousel.addEventListener('focusin', pause);
  carousel.addEventListener('focusout', event => { if (!carousel.contains(event.relatedTarget)) resume(); });
  resume();
}
