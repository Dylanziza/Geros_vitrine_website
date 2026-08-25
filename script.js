/* ============================================================
   GEROS — interactions
   ============================================================ */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initProgressBar();
    initScrollSpy();
    initReveals();
    initCounter();
    initSpark();
    initFaq();
    initOfflineDemo();
    initHeroCanvas();
    initMagnet();
    initDownload();
    initHeroNet();
});

/* ---------- Navbar shrink ---------- */
function initNavbar() {
    const nav = document.getElementById('navbar');
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => {
        links.classList.toggle('active');
        toggle.classList.toggle('active');
    });
    links.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => {
            links.classList.remove('active');
            toggle.classList.remove('active');
        })
    );
}

/* ---------- Scroll progress ---------- */
function initProgressBar() {
    const bar = document.getElementById('progressBar');
    if (!bar) return;
    const update = () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (window.scrollY / h) * 100 + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
}

/* ---------- Active section highlight ---------- */
function initScrollSpy() {
    const links = document.querySelectorAll('.nav-links a');
    const map = {};
    links.forEach(l => {
        const id = l.getAttribute('href').slice(1);
        const sec = document.getElementById(id);
        if (sec) map[id] = { link: l, sec };
    });
    const onScroll = () => {
        const y = window.scrollY + 200;
        let current = null;
        Object.values(map).forEach(({ sec, link }) => {
            if (y >= sec.offsetTop) current = link;
        });
        links.forEach(l => l.classList.remove('active'));
        if (current) current.classList.add('active');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ---------- Reveal on scroll ---------- */
function initReveals() {
    const revealEls = document.querySelectorAll('.reveal, .reveal-phone');
    const cardEls = document.querySelectorAll('[data-mag], .prob-card, .role-card, .quote-card, .tech-item, .bento');

    if (prefersReduced) {
        revealEls.forEach(el => el.classList.add('in'));
        cardEls.forEach(el => el.classList.add('on-view'));
        return;
    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));

    const cardIo = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                const idx = [...e.target.parentElement.children].indexOf(e.target);
                e.target.style.transitionDelay = Math.min(idx, 5) * 0.07 + 's';
                e.target.classList.add('on-view');
                cardIo.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    cardEls.forEach(el => cardIo.observe(el));
}

/* ---------- Sales counter in phone ---------- */
function initCounter() {
    const el = document.getElementById('salesCounter');
    if (!el) return;
    const target = 120450;
    const format = n => n.toLocaleString('fr-FR').replace(/\u202f/g, ' ');

    if (prefersReduced) { el.textContent = format(target); return; }

    const run = () => {
        const dur = 1600, start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = format(Math.floor(target * eased));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver((e) => {
        if (e[0].isIntersecting) { run(); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(el);
}

/* ---------- Sparkline bars in phone ---------- */
function initSpark() {
    const spark = document.getElementById('spark');
    if (!spark) return;
    const heights = [30, 55, 40, 70, 50, 85, 60, 95, 72, 88, 65, 100];
    spark.innerHTML = heights.map(h => `<span style="height:${h}%"></span>`).join('');
}

/* ---------- FAQ accordion ---------- */
function initFaq() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
        const q = item.querySelector('.faq-q');
        const a = item.querySelector('.faq-a');
        q.addEventListener('click', () => {
            const open = item.classList.contains('active');
            items.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-a').style.maxHeight = null;
            });
            if (!open) {
                item.classList.add('active');
                a.style.maxHeight = a.scrollHeight + 'px';
            }
        });
    });
}

/* ---------- Offline demo (signature interactive) ---------- */
function initOfflineDemo() {
    const sw = document.getElementById('netSwitch');
    const nsLabel = document.getElementById('nsLabel');
    const status = document.getElementById('demoStatus');
    const feed = document.getElementById('demoFeed');
    const sellBtn = document.getElementById('demoSell');
    const netBadge = document.getElementById('netBadge');
    if (!sw || !feed) return;

    let online = true;
    let sales = [];
    let id = 0;

    const products = [
        ['Riz 5kg', 6000, 'wave'],
        ['Huile 1L', 1500, 'orange'],
        ['Savon × 4', 1200, 'cash'],
        ['Sucre 1kg', 900, 'wave'],
        ['Pain × 3', 450, 'cash'],
        ['Lait × 2', 1800, 'orange'],
    ];

    const money = n => n.toLocaleString('fr-FR').replace(/\u202f/g, ' ');

    function render() {
        if (sales.length === 0) {
            feed.innerHTML = `<div class="demo-empty">Aucune vente pour l'instant.<br>Appuyez sur « Enregistrer une vente ».</div>`;
            return;
        }
        feed.innerHTML = sales.slice(-4).reverse().map(s => `
            <div class="feed-row">
                <span>${s.name}</span>
                <span class="fr-amt">${money(s.amount)}</span>
                <span class="fr-state ${s.synced ? 'synced' : 'pending'}">
                    ${s.synced ? '✓ Synchro' : '⏳ En attente'}
                </span>
            </div>`).join('');
    }

    function setStatus(mode) {
        status.className = 'demo-status' + (mode === 'online' ? '' : ' ' + mode);
        if (mode === 'online') {
            status.innerHTML = `<i class="fas fa-wifi"></i><span>Connecté — tout est synchronisé</span>`;
        } else if (mode === 'offline') {
            status.innerHTML = `<i class="fas fa-wifi-slash"></i><span>Hors ligne — les ventes sont sauvegardées</span>`;
        } else if (mode === 'syncing') {
            status.innerHTML = `<i class="fas fa-rotate fa-spin"></i><span>Retour du réseau — synchronisation…</span>`;
        }
    }

    function addSale() {
        const [name, amount, method] = products[id % products.length];
        id++;
        sales.push({ name, amount, method, synced: online });
        render();
    }

    function goOffline() {
        online = false;
        sw.setAttribute('aria-pressed', 'true');
        nsLabel.textContent = 'Rétablir le réseau';
        setStatus('offline');
        if (netBadge) { netBadge.classList.add('offline'); netBadge.innerHTML = '<i class="fas fa-wifi-slash"></i> Hors ligne'; }
    }

    function goOnline() {
        online = true;
        sw.setAttribute('aria-pressed', 'false');
        nsLabel.textContent = 'Couper le réseau';
        const pending = sales.some(s => !s.synced);
        if (netBadge) { netBadge.classList.remove('offline'); netBadge.innerHTML = '<i class="fas fa-wifi"></i> En ligne'; }
        if (pending) {
            setStatus('syncing');
            setTimeout(() => {
                sales.forEach(s => s.synced = true);
                render();
                setStatus('online');
            }, 1400);
        } else {
            setStatus('online');
        }
    }

    sw.addEventListener('click', () => online ? goOffline() : goOnline());
    sellBtn.addEventListener('click', addSale);

    // seed a couple of sales
    addSale();
    addSale();
}

/* ---------- Hero net badge subtle idle (kept in sync with demo) ---------- */
function initHeroNet() { /* handled inside offline demo */ }

/* ---------- Hero canvas: connected particle field ---------- */
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w, h, dpr, particles = [], mouse = { x: -999, y: -999 };
    const NAVY = 'rgba(43,58,82,';
    const ORANGE = 'rgba(239,125,0,';

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        seed();
    }

    function seed() {
        const count = Math.min(70, Math.floor((w * h) / 16000));
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.8 + 0.8,
            orange: Math.random() > 0.82,
        }));
    }

    function step() {
        ctx.clearRect(0, 0, w, h);

        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            // gentle mouse repel
            const dx = p.x - mouse.x, dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 120) {
                p.x += (dx / dist) * 0.8;
                p.y += (dy / dist) * 0.8;
            }
        }

        // links
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < 130) {
                    const alpha = (1 - d / 130) * 0.14;
                    ctx.strokeStyle = NAVY + alpha + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        // dots
        for (const p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = (p.orange ? ORANGE : NAVY) + '0.55)';
            ctx.fill();
        }

        raf = requestAnimationFrame(step);
    }

    let raf;
    window.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    window.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });
    window.addEventListener('resize', resize);

    resize();
    if (!prefersReduced) step();
    else {
        // static single frame
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = (p.orange ? ORANGE : NAVY) + '0.4)';
            ctx.fill();
        }
    }
}

/* ---------- Magnetic tilt on bento + phone parallax ---------- */
function initMagnet() {
    if (prefersReduced) return;

    // Phone subtle tilt following cursor
    const phone = document.getElementById('heroPhone');
    if (phone) {
        const wrap = phone.closest('.hero-phone');
        wrap.addEventListener('mousemove', e => {
            const r = wrap.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            phone.style.animation = 'none';
            phone.style.transform =
                `rotateY(${-14 + px * 10}deg) rotateX(${6 - py * 10}deg)`;
        });
        wrap.addEventListener('mouseleave', () => {
            phone.style.animation = '';
            phone.style.transform = '';
        });
    }

    // Bento cards magnetic glow-follow
    document.querySelectorAll('[data-mag]').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ---------- Download button ---------- */
function initDownload() {
    const btn = document.getElementById('downloadBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        window.location.href =
            'https://drive.usercontent.google.com/download?id=1I5OJTlGxjC6aOhNFqaEXo58-jFY22lXT&export=download&authuser=0';
        toast('Le téléchargement va démarrer…');
    });
}

function toast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = `
        position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);
        background:#141d2b;color:#fff;padding:.85rem 1.5rem;border-radius:100px;
        font-family:'Sora',sans-serif;font-size:.9rem;font-weight:500;z-index:10000;
        box-shadow:0 20px 40px -12px rgba(0,0,0,.4);opacity:0;transition:.3s cubic-bezier(.2,.7,.2,1);`;
    document.body.appendChild(t);
    requestAnimationFrame(() => {
        t.style.opacity = '1';
        t.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => t.remove(), 300);
    }, 2800);
}
