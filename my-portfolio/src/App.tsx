import { useState, useEffect, useRef } from 'react';
import fondo from './fondo.avif';
import fondo2 from './fondo2.jpeg';
import imagenFondo from './fondo3.jpeg';
import satelite from './satelite.png';
import clip from './clip.png';
import clip2 from './clip2.png';
import persona1 from './persona1.jpeg';
import persona2 from './persona2.jpg';
import persona3 from './persona3.png';

// ─── TextType ─────────────────────────────────────────────────────────────────
interface TextTypeProps {
  texts: string[]; typingSpeed?: number; deletingSpeed?: number;
  pauseDuration?: number; showCursor?: boolean; cursorCharacter?: string; cursorBlinkDuration?: number;
}
function TextType({ texts, typingSpeed=75, deletingSpeed=50, pauseDuration=1500, showCursor=true, cursorCharacter='_', cursorBlinkDuration=0.5 }: TextTypeProps) {
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<'typing'|'pausing'|'deleting'>('typing');
  const [textIdx, setTextIdx] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  useEffect(() => {
    if (!showCursor) return;
    const i = setInterval(() => setCursorVisible(v => !v), cursorBlinkDuration * 1000);
    return () => clearInterval(i);
  }, [showCursor, cursorBlinkDuration]);
  useEffect(() => {
    const current = texts[textIdx] ?? '';
    if (phase === 'typing') {
      if (displayed.length < current.length) { const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length+1)), typingSpeed); return () => clearTimeout(t); }
      else { const t = setTimeout(() => setPhase('pausing'), pauseDuration); return () => clearTimeout(t); }
    }
    if (phase === 'pausing') { const t = setTimeout(() => setPhase('deleting'), 0); return () => clearTimeout(t); }
    if (phase === 'deleting') {
      if (displayed.length > 0) { const t = setTimeout(() => setDisplayed(d => d.slice(0,-1)), deletingSpeed); return () => clearTimeout(t); }
      else { setTextIdx(i => (i+1)%texts.length); setPhase('typing'); }
    }
  }, [displayed, phase, textIdx, texts, typingSpeed, deletingSpeed, pauseDuration]);
  return (
    <span style={{ fontFamily:'inherit', color:'inherit' }}>
      {displayed}
      {showCursor && <span style={{ opacity: cursorVisible?1:0, transition:'opacity 0.1s' }} aria-hidden="true">{cursorCharacter}</span>}
    </span>
  );
}

// ─── Clip Toggler ─────────────────────────────────────────────────────────────
function ClipToggler() {
  const [isClip1, setIsClip1] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClip1(prev => !prev);
    }, isClip1 ? 2000 : 250); 
    return () => clearTimeout(timer);
  }, [isClip1]);

  return (
    <div style={{ position: 'relative', width: '74px', height: '74px', flexShrink: 0 }} aria-hidden="true">
      <img 
        src={clip} 
        alt="" 
        style={{ 
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain',
          opacity: isClip1 ? 1 : 0, transition: 'opacity 0.25s ease-in-out' 
        }} 
      />
      <img 
        src={clip2} 
        alt="" 
        style={{ 
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain',
          opacity: isClip1 ? 0 : 1, transition: 'opacity 0.25s ease-in-out' 
        }} 
      />
    </div>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;700&family=Google+Sans+Display:wght@400;700&family=Google+Sans+Mono:wght@400;700&display=block');
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=block');

  .app-root {
    opacity: 0;
    transition: opacity 0.25s ease;
  }
  .app-root.fonts-ready {
    opacity: 1;
  }

  :root {
    --font-sans: 'Google Sans', 'Product Sans', system-ui, sans-serif;
    --font-display: 'Google Sans Display', 'Google Sans', system-ui, sans-serif;
    --font-mono: 'Google Sans Mono', 'Space Mono', monospace;
    --font-nav: 'Space Grotesk', system-ui, sans-serif;
  }

  body { font-family: var(--font-sans); font-weight: 700; }
  h1, h2, h3 { font-family: var(--font-display); font-weight: 700; }
  code, .font-mono, [class*="font-mono"] { font-family: var(--font-mono) !important; }

  @keyframes revealLine {
    0%   { transform: translateX(-110%); opacity: 0; }
    60%  { opacity: 1; }
    100% { transform: translateX(0%); opacity: 1; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes satelliteFloat {
    0%   { transform: translateX(0px) translateY(0px) rotate(-2deg); }
    25%  { transform: translateX(50px) translateY(-15px) rotate(2deg); }
    50%  { transform: translateX(0px) translateY(-20px) rotate(2deg); }
    75%  { transform: translateX(-50px) translateY(-15px) rotate(-2deg); }
    100% { transform: translateX(0px) translateY(0px) rotate(-2deg); }
  }

  @keyframes cardFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }

  @keyframes pixelDissolve {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes slideOver {
    0%   { transform: translateY(100vh); border-radius: 24px 24px 0 0; }
    60%  { border-radius: 12px 12px 0 0; }
    100% { transform: translateY(0%); border-radius: 0; }
  }

  @keyframes cardRise {
    0%   { clip-path: inset(100% 0 0 0 round 24px 24px 0 0); }
    100% { clip-path: inset(0% 0 0 0 round 0 0 0 0); }
  }

  @keyframes lightSweep {
    0%   { left: -140px; opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { left: calc(100% + 20px); opacity: 0; }
  }

  .hero-line { display:block; overflow:visible; line-height:0.88; }
  .hero-line span { display:block; overflow:hidden; padding-bottom:0.1em; animation: revealLine 0.9s cubic-bezier(0.16,1,0.3,1) both; }
  .hero-line:nth-child(1) span { animation-delay:0.1s; }
  .hero-line:nth-child(2) span { animation-delay:0.35s; }
  .fade-up { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
  .fade-up-1 { animation-delay:0.7s; }
  .fade-up-2 { animation-delay:0.9s; }
  .fade-up-3 { animation-delay:1.1s; }

  .fondo2-slide {
    animation: slideOver 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    will-change: transform, border-radius;
  }
  .fondo3-hidden {
    clip-path: inset(100% 0 0 0 round 24px 24px 0 0);
  }
  .fondo3-show {
    animation: cardRise 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  @keyframes bubblePop {
    0%   { transform: scale(0.7); opacity: 0; }
    60%  { transform: scale(1.08); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes clientFadeIn {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .client-card-anim {
    animation: clientFadeIn 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .client-img-wrap {
    display: block;
    position: relative;
    width: 100%;
    flex: 1;
    min-height: 300px;
    overflow: hidden;
    border-radius: 12px 12px 0 0;
    cursor: pointer;
  }
  .client-img-overlay {
    position: absolute;
    inset: 0;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
  }
  .client-img-wrap:hover .client-img-overlay {
    background: rgba(0, 0, 0, 0.62);
  }
  .client-visit-label {
    color: #ffffff;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    opacity: 0;
    transform: scale(0.88) translateY(6px);
    transition: opacity 0.28s ease, transform 0.28s ease;
    pointer-events: none;
    border: 2px solid rgba(255,255,255,0.75);
    padding: 10px 26px;
    border-radius: 8px;
  }
  .client-img-wrap:hover .client-visit-label {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  .carousel-btn {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(0,0,0,0.05);
    border: 1px solid rgba(0,0,0,0.12);
    color: rgba(0,0,0,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }
  .carousel-btn:hover {
    background: rgba(0,0,0,0.1);
    border-color: rgba(0,0,0,0.3);
    color: #000000;
  }
  .project-card:hover img {
    transform: scale(1.04);
  }
  .carousel-dot {
    height: 8px;
    width: 8px;
    border-radius: 4px;
    background: rgba(0,0,0,0.18);
    border: none;
    cursor: pointer;
    transition: width 0.35s cubic-bezier(0.22,1,0.36,1), background 0.35s;
    padding: 0;
  }
  .carousel-dot.active {
    width: 28px !important;
    background: #000000;
  }

  .faq-answer {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .faq-answer.open {
    grid-template-rows: 1fr;
  }
  .faq-answer > div { overflow: hidden; }

  @media (max-width: 767px) {
    .sobre-mi-flex { flex-direction: column !important; min-height: auto !important; }
    .sobre-mi-img { width: 100% !important; min-height: 260px !important; }
    .sobre-mi-img > div { background: linear-gradient(to bottom, transparent 60%, #f5f4f0) !important; }
    .sobre-mi-content { padding: 36px 24px 48px !important; }
    .sobre-mi-stats { gap: 20px !important; }
    .alcance-row { flex-direction: column !important; gap: 32px !important; }
    .alcance-text { flex: 0 0 auto !important; max-width: 100% !important; }
    .clientes-head { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
    .clientes-desc { text-align: left !important; max-width: 100% !important; }
  }
`;

// ─── Particle Canvas ──────────────────────────────────────────────────────────
interface PData { x:number; y:number; vx:number; vy:number; size:number; opacity:number; shape:number; angle:number; vangle:number; }

function ParticleCanvas({ scrollSpeed }: { scrollSpeed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<PData[]>([]);
  const raf = useRef<number>(0);
  const scrollSpeedRef = useRef(scrollSpeed);

  useEffect(() => { scrollSpeedRef.current = scrollSpeed; }, [scrollSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    particles.current = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(0.2 + Math.random() * 0.5),
      size: 2.5 + Math.random() * 5,
      opacity: 0.3 + Math.random() * 0.6,
      shape: Math.floor(Math.random() * 4),
      angle: Math.random() * Math.PI * 2,
      vangle: (Math.random() - 0.5) * 0.02,
    }));

    const drawParticle = (p: PData) => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.strokeStyle = 'rgba(255,255,255,1)';
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.lineWidth = 1;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const s = p.size;
      if (p.shape === 0) {
        ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(s, 0); ctx.stroke();
      } else if (p.shape === 1) {
        ctx.beginPath(); ctx.moveTo(-s*0.6,0); ctx.lineTo(s*0.6,0); ctx.moveTo(0,-s*0.6); ctx.lineTo(0,s*0.6); ctx.stroke();
      } else if (p.shape === 2) {
        ctx.beginPath(); ctx.moveTo(0,-s*0.7); ctx.lineTo(s*0.4,0); ctx.lineTo(0,s*0.7); ctx.lineTo(-s*0.4,0); ctx.closePath(); ctx.fill();
      } else {
        ctx.beginPath(); ctx.arc(0,0,s*0.4,0,Math.PI*2); ctx.fill();
      }
      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const boost = 1 + scrollSpeedRef.current * 8;
      particles.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy * boost;
        p.angle += p.vangle;
        if (p.y < -20) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -20) p.x = canvas.width + 10;
        if (p.x > canvas.width + 20) p.x = -10;
        drawParticle(p);
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:1, pointerEvents:'none' }} />;
}

// ─── Clean Slide-Over Transition ─────────────────────────────────────────────
function SlideTransition({ visible }: { visible: boolean }) {
  const [triggered, setTriggered] = useState(false);
  useEffect(() => { if (visible && !triggered) setTriggered(true); }, [visible]);
  if (!triggered) return null;
  return null;
}

// ─── Clients Carousel ─────────────────────────────────────────────────────────
interface ClientData { img: string; title: string; desc: string; url: string; }

// ↓↓↓ Para agregar más clientes, añadí un objeto nuevo a este array ↓↓↓
const clientsData: ClientData[] = [
  {
    img: persona1,
    title: 'Angels Beauty',
    desc: 'Desarrollo de web responsive para mostrar servicios de maquillaje y cursos. Requirió Panel de control',
    url: 'https://angelsbeauty.pages.dev/',
  },
  {
    img: persona2,
    title: 'Romina Bruera',
    desc: 'Desarrollo de sitio web responsive para mostrar servicios de maquillaje, colorimetria y uñas, ademas de cursos de perfeccionamiento. Requirió panel de control',
    url: 'https://rominabruera.pages.dev/',
  },
  {
    img: persona3,
    title: 'Barcelona GYM',
    desc: 'Desarrollo de sitio web con panel de control para gimnasio en Córdoba. Gestión de palnes y servicios.',
    url: 'https://barcelonagym.pages.dev/',
  },
];

function ClientsCarousel() {
  const [current, setCurrent] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const total = clientsData.length;

  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 768 ? 1 : 2);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const prev = () => setCurrent(c => (c - itemsPerPage + total) % total);
  const next = () => setCurrent(c => (c + itemsPerPage) % total);
  const visibleClients = clientsData.slice(current, current + itemsPerPage).concat(
    current + itemsPerPage > total ? clientsData.slice(0, (current + itemsPerPage) % total) : []
  );
  const pageNum = Math.floor(current / itemsPerPage) + 1;
  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${itemsPerPage}, 1fr)`, gap: '20px' }}>
        {visibleClients.map((client, idx) => (
          <a key={idx} href={client.url} target="_blank" rel="noopener noreferrer"
            className="client-card-anim project-card"
            aria-label={`Visitar sitio de ${client.title}`}
            style={{
              display: 'flex', flexDirection: 'column',
              background: '#0f0f0f',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', overflow: 'hidden',
              textDecoration: 'none',
              animation: `cardFloat ${3 + idx * 0.5}s ease-in-out infinite`,
              animationDelay: `${idx * 0.4}s`,
              transition: 'border-color 0.25s, transform 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {/* Card top bar */}
            <div style={{ padding: '16px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'11px', letterSpacing:'0.12em', color:'rgba(255,255,255,0.22)' }}>
                {String((current + idx) % total + 1).padStart(2, '0')}
              </span>
              <span style={{ color:'rgba(255,255,255,0.25)', fontSize:'16px', lineHeight:1 }}>↗</span>
            </div>
            {/* Image */}
            <div style={{ margin: '14px 16px', borderRadius: '10px', overflow: 'hidden', aspectRatio: '3/4', position: 'relative', flexShrink: 0 }}>
              <img
                src={client.img}
                alt={`Sitio web de ${client.title}`}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
              />
              <div className="client-img-overlay">
                <span className="client-visit-label">Visitar</span>
              </div>
            </div>
            {/* Footer */}
            <div style={{ padding: '12px 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.1rem', color:'#ffffff', margin:0, letterSpacing:'-0.02em' }}>
                {client.title}
              </h3>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'11px', letterSpacing:'0.08em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase' }}>
                Visitar →
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Navigation: counter + arrows */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'12px', letterSpacing:'0.1em', color:'rgba(0,0,0,0.35)' }}>
          {String(pageNum).padStart(2,'0')} <span style={{ color:'rgba(0,0,0,0.15)' }}>—</span> {String(totalPages).padStart(2,'0')}
        </span>
        <div style={{ display:'flex', gap:'8px' }}>
          <button onClick={prev} className="carousel-btn" aria-label="Anterior">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button onClick={next} className="carousel-btn" aria-label="Siguiente">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      {/* Hidden dots - kept for compatibility */}
      <div style={{ display: 'none' }}>
        {Array.from({ length: Math.ceil(total / itemsPerPage) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i * itemsPerPage)}
            className={`carousel-dot${i * itemsPerPage === current ? ' active' : ''}`}
            aria-label={`Ir a grupo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────
const faqs = [
  { q: '¿Que tipo de paginas desarrollas?', a: 'Principalmente LandingPages estaticas, Paginas con panel de control y Software local.' },
  { q: '¿Cuanto cuesta desarrollar una Pagina Web?', a: 'El precio depende de la complejidad del proyecto, la cantidad de secciones, las funcionalidades requeridas y el nivel de personalización. Solicita un presupuesto y recibirás una propuesta adaptada. Si necesitas una aproximación, las Landing Pages parten de los U$D 80 / ARS 150.000' },
  { q: '¿Cuanto tiempo dura el desarrollo?', a: 'El tiempo de desarrollo varía según la complejidad del proyecto. En general, las Landing Pages pueden desarrollarse en 1-3 dias, mientras que proyectos más complejos pueden tomar una o varias semanas' },
  { q: '¿Desarrollas sistemas de Gestión para negocios?', a: 'Sí. Desarrollo sistemas web personalizados para administrar clientes, ventas, turnos, inventario, pedidos, empleados y otros procesos específicos de cada negocio.' },
  { q: '¿Necesito conocimientos técnicos para administrar mi sitio web?', a: 'No. El objetivo es que puedas utilizar tu sitio o sistema de forma sencilla. Además, recibirás orientación sobre las funciones principales.' },
  { q: '¿Ayudas con el posicionamiento en Google?', a: 'Sí. Los proyectos se desarrollan siguiendo buenas prácticas de SEO para mejorar la visibilidad en buscadores y aumentar las posibilidades de aparecer en los resultados de Google.' }
];

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ display:'flex', flexDirection:'column' }} itemScope itemType="https://schema.org/FAQPage">
      {faqs.map((faq, idx) => (
        <div key={idx} itemScope itemProp="mainEntity" itemType="https://schema.org/Question" style={{
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <button
            onClick={() => setOpen(open === idx ? null : idx)}
            aria-expanded={open === idx}
            aria-controls={`faq-answer-${idx}`}
            id={`faq-button-${idx}`}
            style={{
              width:'100%', display:'flex', alignItems:'center',
              padding:'28px 0', background:'none', border:'none', cursor:'pointer',
              textAlign:'left', gap:'20px',
            }}
          >
            <span aria-hidden="true" style={{
              fontFamily:'var(--font-mono)', fontSize:'11px', letterSpacing:'0.1em',
              color:'rgba(255,255,255,0.2)', flexShrink:0, width:'20px',
            }}>{String(idx + 1).padStart(2, '0')}</span>
            <span itemProp="name" style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'clamp(15px, 1.6vw, 20px)', color:'#ffffff', lineHeight:1.3, flex:1 }}>
              {faq.q}
            </span>
            <span aria-hidden="true" style={{
              flexShrink:0, width:'32px', height:'32px', borderRadius:'50%',
              border: `1px solid ${open === idx ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)'}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              color: open === idx ? '#ffffff' : 'rgba(255,255,255,0.35)',
              fontSize:'20px', fontWeight:200, lineHeight:1,
              transform: open === idx ? 'rotate(45deg)' : 'rotate(0deg)',
              transition:'transform 0.4s cubic-bezier(0.22,1,0.36,1), color 0.2s, border-color 0.2s',
            }}>+</span>
          </button>
          <div
            id={`faq-answer-${idx}`}
            role="region"
            aria-labelledby={`faq-button-${idx}`}
            className={`faq-answer${open === idx ? ' open' : ''}`}
            itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"
          >
            <div>
              <p itemProp="text" style={{ fontFamily:'var(--font-sans)', fontSize:'0.95rem', lineHeight:'1.85', color:'rgba(255,255,255,0.5)', paddingBottom:'28px', paddingLeft:'40px', paddingRight:'52px' }}>
                {faq.a}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── NavBar ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { href: '#inicio', label: 'Inicio', id: 'inicio' },
  { href: '#sobre-mi', label: 'Perfil', id: 'sobre-mi' },
  { href: '#FAQ', label: 'FAQ', id: 'FAQ' },
  { href: '#contacto', label: 'Contacto', id: 'contacto' },
];

function NavBar() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [bubbleStyle, setBubbleStyle] = useState<React.CSSProperties>({});
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const navRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const el = itemRefs.current[activeIdx];
    const nav = navRef.current;
    if (!el || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setBubbleStyle({
      left: elRect.left - navRect.left,
      width: elRect.width,
      height: elRect.height,
      animation: isFirstRender.current ? 'bubblePop 0.4s cubic-bezier(0.22,1,0.36,1) both' : 'none',
    });
    isFirstRender.current = false;
  }, [activeIdx]);

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map(i => i.id);
    const observers: IntersectionObserver[] = [];
    const visible = new Set<string>();

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) visible.add(id);
        else visible.delete(id);
        const firstVisible = sectionIds.find(s => visible.has(s));
        if (firstVisible) {
          const idx = sectionIds.indexOf(firstVisible);
          setActiveIdx(idx);
        }
      }, { rootMargin: '-50% 0px -45% 0px', threshold: 0 });
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <nav ref={navRef} aria-label="Menú de navegación principal" className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center select-none"
      style={{
        background: '#000000',
        borderRadius: '999px',
        padding: '2px',
        position: 'fixed',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}>
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '4px',
        background: '#333333',
        borderRadius: '999px',
        pointerEvents: 'none',
        transition: isFirstRender.current ? 'none' : 'left 0.45s cubic-bezier(0.22,1,0.36,1), width 0.45s cubic-bezier(0.22,1,0.36,1)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
        ...bubbleStyle,
      }} />
      {NAV_ITEMS.map((item, idx) => (
        <a
          key={idx}
          ref={el => { itemRefs.current[idx] = el; }}
          href={item.href}
          onClick={() => setActiveIdx(idx)}
          aria-current={activeIdx === idx ? 'page' : undefined}
          className="px-2 sm:px-4 py-1 sm:py-2 text-[11px] sm:text-[13px] uppercase font-medium active:scale-95"
          style={{
            fontFamily: 'var(--font-nav)',
            letterSpacing: '0.18em',
            position: 'relative',
            zIndex: 1,
            color: activeIdx === idx ? '#ffffff' : 'rgba(255,255,255,0.5)',
            transition: 'color 0.3s ease',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >{item.label}</a>
      ))}
    </nav>
  );
}

const SAT_DONE = 0.5;

export default function App() {
  const [fontsReady, setFontsReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(performance.now());
  const satelliteLanded = scrollProgress >= SAT_DONE;
  const [showFondo3, setShowFondo3] = useState(false);
  const fondo3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = fondo;
    link.type = 'image/avif';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(style);
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setFontsReady(true));
    } else {
      setFontsReady(true);
    }
  }, []);

  useEffect(() => {
    const ANIM_ZONE = window.innerHeight;
    const onScroll = () => {
      const now = performance.now();
      const dt = now - lastTime.current || 16;
      const dy = Math.abs(window.scrollY - lastScrollY.current);
      const speed = Math.min(1, dy / dt * 5);
      setScrollSpeed(speed);
      lastScrollY.current = window.scrollY;
      lastTime.current = now;
      const p = Math.min(1, Math.max(0, window.scrollY / ANIM_ZONE));
      setScrollProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
  }, [satelliteLanded]);

  useEffect(() => {
    const sentinel = document.getElementById('fondo3-sentinel');
    if (!sentinel) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShowFondo3(true); obs.disconnect(); }
    }, { rootMargin: '0px 0px 100% 0px' });
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);


  // Datos Estructurados (JSON-LD) inyectados de forma invisible para SEO Local y de Marca Personal
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": "Alexis Delgado",
      "jobTitle": "Programador Web Fullstack",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Córdoba",
        "addressRegion": "Córdoba Province",
        "addressCountry": "Argentina"
      },
      "knowsAbout": ["Cloud Computing", "DevOps", "Docker", "Linux", "React", "Sistemas de Información"],
      "url": "https://tu-dominio.com" // Reemplaza esto con la URL final de tu portfolio
    }
  };

  return (
    <div className={`app-root${fontsReady ? ' fonts-ready' : ''} bg-[#f5f4f0] text-[#f8fafc]/80 min-h-screen antialiased selection:bg-[#1a6fff] selection:text-white`}
      style={{ fontFamily: 'var(--font-sans)' }}>
      

      {/* ── NAV ───────────────────────────────────────────────────────────────── */}
      <NavBar />

      {/* ── HERO 200vh sticky ─────────────────────────────────────────────────── */}
      <header id="inicio" style={{ height:'100vh' }}>
        <div style={{ position:'sticky', top:0, height:'100vh', overflow:'hidden' }}>

          <div aria-hidden="true" style={{
            position:'absolute', inset:0, zIndex:0,
            backgroundImage:`url(${fondo})`,
            backgroundSize:'cover', backgroundPosition:'center',
            backgroundAttachment:'fixed',
            contain:'layout style paint',
          }} />

          <ParticleCanvas scrollSpeed={scrollSpeed} />

          <img src={satelite} alt="Ilustración 3D de satélite de telecomunicaciones en el espacio" style={{
            position:'absolute', top:'8%',
            left:'5%',
            width:'540px',
            opacity: 0.8,
            zIndex:5, pointerEvents:'none',
            animation: 'satelliteFloat 6s ease-in-out infinite',
            willChange:'transform',
          }} />

          <div aria-hidden="true" className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-[#1a6fff]/30 to-transparent z-10 fade-up fade-up-1" />

          <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-16">
            <div className="max-w-4xl">
              {fontsReady && (
                <>
                  <h1 style={{ fontFamily:'var(--font-display)', fontWeight:800, letterSpacing:'-0.03em', lineHeight:0.9, textTransform:'uppercase' }}>
                    <span className="hero-line" style={{ fontSize:'clamp(35px, 8.7vw, 35px)', color:'#f8fafc' }}><span>Programador</span></span>
                    <span className="hero-line" style={{ fontSize:'clamp(35px, 10.2vw, 35px)', color:'#000000' }}><span>Web | Córdoba</span></span>
                  </h1>
                  <p className="fade-up fade-up-2 mt-8 max-w-2xl"
                    style={{ fontFamily:'var(--font-display)', fontWeight:800, letterSpacing:'-0.02em', lineHeight:1.05, textTransform:'uppercase', fontSize:'clamp(23px, 2.5vw, 23px)', color:'#f8fafc' }}>
                    Programador web Fullstack en Córdoba, Argentina. Especializado en paginas web y software para negocios y emprendedores
                  </p>
                  <div className="fade-up fade-up-2 mt-10 flex gap-4">
                    <a href="https://wa.link/tua7ix" target="_blank" rel="noopener noreferrer" aria-label="Escribirme directamente por WhatsApp" className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/20 text-white hover:text-[#25D366]">
                      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.052 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/ezequieldelgadotech/" target="_blank" rel="noopener noreferrer" aria-label="Visitar perfil técnico en Instagram" className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/20 text-white hover:text-[#E1306C]">
                      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          <div aria-hidden="true" className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 fade-up fade-up-3 flex flex-col items-center gap-2"
            style={{ opacity: satelliteLanded ? 0 : 0.3, transition:'opacity 0.4s ease' }}>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.15em' }}>scroll</span>
            <span className="w-[1px] h-8 bg-white/30 animate-pulse" />
          </div>

        </div>
      </header>

      <div aria-hidden="true" style={{ position:'relative', height:'2px', overflow:'hidden', background:'rgba(248,250,252,0.06)', zIndex:15 }}>
  <div style={{
    position:'absolute', top:0, left:0, height:'100%', width:'120px',
    background:'linear-gradient(90deg, transparent, rgba(26,111,255,0.6), white, rgba(26,111,255,0.6), transparent)',
    boxShadow:'0 0 12px 4px rgba(26,111,255,0.4)',
    animation:'lightSweep 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
  }} />
</div>

      {/* ── CONTENIDO ─────────────────────────────────────────────────────────── */}
      <main>

        {/* SOBRE MÍ */}
        <section id="sobre-mi" aria-label="Sobre Mi" style={{ position:'relative', zIndex:10, background:'#f5f4f0', overflow:'hidden' }}>
          {/* Texto decorativo fondo */}
          <div aria-hidden="true" style={{
            position:'absolute', bottom:'-16px', right:'36%',
            fontFamily:'var(--font-display)', fontWeight:900,
            fontSize:'clamp(80px, 14vw, 180px)',
            color:'rgba(0,0,0,0.03)', lineHeight:1, letterSpacing:'-0.04em',
            pointerEvents:'none', userSelect:'none',
          }}>PERFIL</div>

          <div className="sobre-mi-flex" style={{ display:'flex', alignItems:'stretch', minHeight:'65vh' }}>
            {/* Imagen izquierda */}
            <div className="sobre-mi-img" style={{
              width:'42%', flexShrink:0,
              backgroundImage:`url(${fondo2})`,
              backgroundSize:'cover', backgroundPosition:'center',
              position:'relative',
            }}>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, transparent 60%, #f5f4f0)', pointerEvents:'none' }} />
            </div>

            {/* Contenido derecha */}
            <div className="sobre-mi-content" style={{ flex:1, padding:'72px 64px', display:'flex', flexDirection:'column', justifyContent:'center', position:'relative', zIndex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'36px' }}>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'11px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(0,0,0,0.3)', flexShrink:0 }}>Sobre mí</p>
                <div style={{ flex:1, height:'1px', background:'rgba(0,0,0,0.08)' }} />
              </div>

              <h2 style={{
                fontFamily:'var(--font-display)', fontWeight:800,
                letterSpacing:'-0.04em', fontSize:'clamp(38px, 5vw, 68px)',
                color:'#000000', lineHeight:0.93, marginBottom:'28px',
              }}>
                Ezequiel<br/>
                <span style={{ color:'rgba(0,0,0,0.25)' }}>Delgado</span>
              </h2>

              <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.95rem', lineHeight:'1.85', color:'rgba(0,0,0,0.55)', maxWidth:'460px', marginBottom:'40px' }}>
                Programador web y estudiante de 5to año de Ingeniería en Sistemas de Información en la UTN-FRC (Córdoba). Me apasiona diseñar soluciones de software para negocios y emprendedores con el objetivo de liberar su potencial.
              </p>

              {/* Stats */}
              <div className="sobre-mi-stats" style={{ display:'flex', gap:'28px', alignItems:'center', flexWrap:'wrap' }}>
                <div>
                  <p style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.75rem', letterSpacing:'-0.03em', color:'#000000', lineHeight:1 }}>5to</p>
                  <p style={{ fontFamily:'var(--font-mono)', fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(0,0,0,0.35)', marginTop:'5px' }}>Año ISI</p>
                </div>
                <div style={{ width:'1px', height:'36px', background:'rgba(0,0,0,0.1)' }} />
                <div>
                  <p style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.75rem', letterSpacing:'-0.03em', color:'#000000', lineHeight:1 }}>UTN</p>
                  <p style={{ fontFamily:'var(--font-mono)', fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(0,0,0,0.35)', marginTop:'5px' }}>FRC · Córdoba</p>
                </div>
                <div style={{ width:'1px', height:'36px', background:'rgba(0,0,0,0.1)' }} />
                <ClipToggler />
              </div>
            </div>
          </div>
        </section>

        {/* ALCANCE GLOBAL */}
        <section style={{ background: '#000000', padding: '80px 48px', position: 'relative', zIndex: 10, overflow: 'hidden' }}>
          <div className="max-w-7xl mx-auto alcance-row" style={{ display: 'flex', alignItems: 'center', gap: '64px', flexWrap: 'wrap' }}>
            {/* Texto izquierda */}
            <div className="alcance-text" style={{ flex: '0 0 320px', maxWidth: '340px' }}>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'11px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:'20px' }}>Alcance global</p>
              <p style={{ fontFamily:'var(--font-sans)', fontSize:'1.05rem', lineHeight:'1.85', color:'rgba(255,255,255,0.65)', fontStyle:'italic' }}>
                "En un mundo conectado, el talento viaja más rápido que nunca. Desde Argentina, creo experiencias digitales pensadas para llegar a cualquier rincón del planeta."
              </p>
            </div>
            {/* Mapa derecha */}
            <div style={{ flex: 1, minWidth: '280px' }}>
              <img src="/assets/world-map.svg" alt="Mapa mundial" style={{ width: '100%', display: 'block', filter: 'invert(1)', opacity: 0.85 }} aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* FRANJA DE MARCAS/SPONSORS */}
        <section style={{ background: '#000000', padding: '20px 24px', position: 'relative', zIndex: 10 }}>
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-12 flex-wrap">
            <img src="/assets/marca1.png" alt="Marca 1" style={{ height: '44px', objectFit: 'contain' }} />
            <img src="/assets/marca2.png" alt="Marca 2" style={{ height: '58px', objectFit: 'contain', marginTop: '8px' }} />
            <img src="/assets/marca3.png" alt="Marca 3" style={{ height: '58px', objectFit: 'contain' }} />
          </div>
        </section>

        {/* SECCIÓN CLIENTES */}
        <section id="servicios" style={{ background:'#f5f4f0', padding:'96px 48px', position:'relative', zIndex:10, overflow:'hidden' }}>
          {/* Texto decorativo fondo */}
          <div aria-hidden="true" style={{
            position:'absolute', top:'50%', right:'-16px',
            transform:'translateY(-50%)',
            fontFamily:'var(--font-display)', fontWeight:900,
            fontSize:'clamp(100px, 16vw, 200px)',
            color:'rgba(0,0,0,0.025)', lineHeight:1, letterSpacing:'-0.04em',
            pointerEvents:'none', userSelect:'none',
          }}>WORK</div>

          <div className="max-w-7xl mx-auto" style={{ position:'relative', zIndex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'20px', marginBottom:'16px' }}>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'11px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(0,0,0,0.3)', flexShrink:0 }}>Trabajos</p>
              <div style={{ flex:1, height:'1px', background:'rgba(0,0,0,0.08)' }} />
            </div>

            <div className="clientes-head" style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'56px', gap:'32px', flexWrap:'wrap' }}>
              <h2 style={{
                fontFamily:'var(--font-display)', fontWeight:800,
                letterSpacing:'-0.04em',
                fontSize:'clamp(38px, 6vw, 72px)',
                color:'#000000', lineHeight:0.93,
              }}>
                Clientes<br/>
                <span style={{ color:'rgba(0,0,0,0.22)', fontSize:'0.65em', fontWeight:700 }}>& proyectos</span>
              </h2>
              <p className="clientes-desc" style={{ fontFamily:'var(--font-sans)', fontSize:'0.9rem', lineHeight:'1.85', color:'rgba(0,0,0,0.45)', maxWidth:'380px', textAlign:'right' }}>
                Cada negocio es diferente, por eso cada página web también debería serlo. Trabajo de cerca con mis clientes para crear sitios modernos, rápidos y fáciles de usar.
              </p>
            </div>

            <ClientsCarousel />
          </div>
        </section>

        <div id="fondo3-sentinel" aria-hidden="true" style={{ height: 1, pointerEvents:'none' }} />

        {/* FAQ */}
        <section ref={fondo3Ref} className={showFondo3 ? 'fondo3-show' : 'fondo3-hidden'} id="FAQ" style={{
          position: 'relative',
          zIndex: 20,
          background: '#000000',
          padding: '96px 48px',
          overflow: 'hidden',
        }}>
          {/* Texto decorativo de fondo */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: '50%', right: '-16px',
            transform: 'translateY(-50%)',
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(100px, 16vw, 200px)',
            color: 'rgba(255,255,255,0.025)',
            lineHeight: 1, letterSpacing: '-0.04em',
            pointerEvents: 'none', userSelect: 'none',
          }}>FAQ</div>

          <div className="max-w-3xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'20px', marginBottom:'56px' }}>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'11px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', flexShrink:0 }}>Preguntas frecuentes</p>
              <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.08)' }} />
            </div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, letterSpacing:'-0.04em', fontSize:'clamp(36px, 6vw, 72px)', color:'#ffffff', marginBottom:'56px', lineHeight:0.95 }}>
              ¿Tenés dudas?<br/>
              <span style={{ color:'rgba(255,255,255,0.3)' }}>Acá las respondo.</span>
            </h2>
            <FaqSection />
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" aria-labelledby="contacto-title" style={{
          background: '#f5f4f0',
          position: 'relative',
          zIndex: 10,
          padding: '112px 48px 96px',
          overflow: 'hidden',
        }}>
          {/* Texto decorativo de fondo */}
          <div aria-hidden="true" style={{
            position: 'absolute', bottom: '-24px', right: '-8px',
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(80px, 14vw, 180px)',
            color: 'rgba(0,0,0,0.04)',
            lineHeight: 1, letterSpacing: '-0.04em',
            pointerEvents: 'none', userSelect: 'none',
          }}>HOLA.</div>

          <div className="max-w-4xl mx-auto" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'11px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(0,0,0,0.3)', marginBottom:'28px' }}>Contacto</p>
            <h2 id="contacto-title" style={{
              fontFamily:'var(--font-display)', fontWeight:900,
              letterSpacing:'-0.04em',
              fontSize:'clamp(56px, 10vw, 120px)',
              color:'#000000', lineHeight:0.92,
              marginBottom:'36px',
            }}>
              Hablemos.
            </h2>
            <a href="mailto:alexisd55588@gmail.com" style={{
              display:'inline-block',
              fontFamily:'var(--font-mono)', fontSize:'clamp(0.8rem, 1.2vw, 0.95rem)',
              color:'rgba(0,0,0,0.45)', textDecoration:'none',
              borderBottom:'1px solid rgba(0,0,0,0.2)', paddingBottom:'3px',
              marginBottom:'52px',
              transition:'color 0.2s, border-color 0.2s',
            }}>
              alexisd55588@gmail.com
            </a>
            <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
              <a href="https://wa.link/tua7ix" target="_blank" rel="noopener noreferrer"
                style={{
                  display:'flex', alignItems:'center', gap:'10px',
                  padding:'14px 32px', borderRadius:'999px',
                  background:'#000000', color:'#ffffff',
                  fontFamily:'var(--font-sans)', fontSize:'0.9rem', fontWeight:600,
                  textDecoration:'none', letterSpacing:'0.02em',
                  transition:'opacity 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity='0.8')}
                onMouseLeave={e => (e.currentTarget.style.opacity='1')}
              >
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.052 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                WhatsApp
              </a>
              <a href="https://www.instagram.com/ezequieldelgadotech/" target="_blank" rel="noopener noreferrer"
                style={{
                  display:'flex', alignItems:'center', gap:'10px',
                  padding:'14px 32px', borderRadius:'999px',
                  background:'transparent', color:'#000000',
                  border:'1.5px solid rgba(0,0,0,0.25)',
                  fontFamily:'var(--font-sans)', fontSize:'0.9rem', fontWeight:600,
                  textDecoration:'none', letterSpacing:'0.02em',
                  transition:'background 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor='rgba(0,0,0,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(0,0,0,0.25)'; }}
              >
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
              </a>
            </div>
          </div>
        </section>

        {/* IMAGEN FINAL */}
        <div style={{
          width: '100%',
          height: 'clamp(280px, 40vw, 480px)',
          backgroundImage: `url(${imagenFondo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          zIndex: 10,
        }} aria-hidden="true" />

      </main>

      <footer style={{ background:'#000000', padding:'20px 48px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)' }}>
          &copy; 2026 Alexis Delgado
        </span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(255,255,255,0.15)' }}>
          React + Vite + Tailwind
        </span>
      </footer>

    </div>
  );
}