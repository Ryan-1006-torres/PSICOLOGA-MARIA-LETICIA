import { useEffect, useRef, useState, type MouseEvent } from "react";

const whatsappNumber = "5511933706643";
const whatsappMessage = "Olá, Maria Leticia! Gostaria de saber mais sobre os atendimentos e agendar uma sessão.";
const whatsappBaseUrl = `https://wa.me/${whatsappNumber}`;
const whatsappUrl = `${whatsappBaseUrl}?text=${encodeURIComponent(whatsappMessage)}`;
const whatsappAppUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`;

const navigation = [
  { label: "Sobre", href: "#sobre" },
  { label: "Áreas de atuação", href: "#atuacao" },
  { label: "Atendimento", href: "#atendimento" },
];

type IconProps = { className?: string };

function ArrowUpRight({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 19 19 5M7 5h12v12" />
    </svg>
  );
}

function ArrowRight({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}

function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.4 11.4a8.4 8.4 0 0 1-12.2 7.5L3.5 20l1.2-4.6A8.4 8.4 0 1 1 20.4 11.4Z" />
      <path d="M8.5 8.3c.3-.5.6-.5.9-.5h.3c.2 0 .4.2.5.5l.7 1.6c.1.3.1.4-.1.7l-.5.6c.6 1.1 1.5 2 2.6 2.6l.6-.5c.2-.2.4-.2.7-.1l1.6.7c.3.1.5.3.5.6v.3c0 .3-.1.6-.5.9-.5.4-1 .6-1.6.5-3.5-.7-5.9-3.1-6.6-6.6-.1-.6.1-1.1.5-1.6Z" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.5" cy="6.7" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWhatsappHelpOpen, setWhatsappHelpOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "manual">("idle");
  const whatsappDialogRef = useRef<HTMLDialogElement>(null);
  const whatsappInputRef = useRef<HTMLInputElement>(null);

  const handleWhatsappClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // A sandboxed site preview cannot open WhatsApp's redirected page in its popup.
    if (window.self !== window.top) {
      event.preventDefault();
      setCopyStatus("idle");
      setWhatsappHelpOpen(true);
    }
  };

  const copyWhatsappLink = async () => {
    try {
      await navigator.clipboard.writeText(whatsappUrl);
      setCopyStatus("copied");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = whatsappUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      if (copied) {
        setCopyStatus("copied");
        return;
      }
      whatsappInputRef.current?.focus();
      whatsappInputRef.current?.select();
      setCopyStatus("manual");
    }
  };

  useEffect(() => {
    const dialog = whatsappDialogRef.current;
    if (!dialog) return;
    if (isWhatsappHelpOpen && !dialog.open) dialog.showModal();
    if (!isWhatsappHelpOpen && dialog.open) dialog.close();
  }, [isWhatsappHelpOpen]);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 30);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px 100px 0px" }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Pular para o conteúdo</a>

      <header className={`site-header${isScrolled || menuOpen ? " site-header--solid" : ""}`}>
        <div className="header-inner page-width">
          <a className="header-brand" href="#inicio" aria-label="Maria Leticia, início" onClick={() => setMenuOpen(false)}>
            <span className="header-brand-name">Maria Leticia</span>
            <span className="header-brand-subtitle">PSICÓLOGA & PSICANALISTA</span>
          </a>

          <nav className="desktop-nav" aria-label="Navegação principal">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>{item.label}</a>
            ))}
          </nav>

          <a className="header-cta" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={handleWhatsappClick}>
            Agendar sessão <ArrowUpRight />
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={menuOpen ? "menu-line menu-line--first open" : "menu-line menu-line--first"} />
            <span className={menuOpen ? "menu-line menu-line--last open" : "menu-line menu-line--last"} />
          </button>
        </div>

        <nav className={`mobile-nav${menuOpen ? " mobile-nav--open" : ""}`} id="mobile-navigation" aria-label="Navegação mobile" aria-hidden={!menuOpen}>
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
          <a className="mobile-nav-contact" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={(event) => { setMenuOpen(false); handleWhatsappClick(event); }}>
            Agendar pelo WhatsApp <ArrowUpRight />
          </a>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="inicio" aria-labelledby="hero-name">
          <img className="hero-photo" src="/images/consultorio-hero.jpg" alt="Ambiente acolhedor com uma poltrona próxima à luz natural" fetchPriority="high" />
          <div className="hero-inner page-width">
            <div className="hero-content">
              <div className="hero-brand hero-animate">
                <h1 id="hero-name">Maria Leticia</h1>
                <p>PSICÓLOGA <span>|</span> PSICANALISTA <span>|</span> NEUROPSICÓLOGA</p>
              </div>
              <div className="hero-rule hero-animate" aria-hidden="true" />
              <h2 className="hero-title hero-animate">Um espaço para<br /><em>se escutar.</em></h2>
              <p className="hero-description hero-animate">
                Atendimento psicológico on-line, com acolhimento e respeito ao seu próprio tempo.
              </p>
              <div className="hero-actions hero-animate">
                <a className="button button--dark" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={handleWhatsappClick}>
                  <WhatsAppIcon className="button-icon" />
                  Agende sua sessão
                  <ArrowUpRight className="button-arrow" />
                </a>
                <a className="quiet-link" href="#sobre">Conheça meu trabalho <ArrowRight /></a>
              </div>
            </div>
          </div>
        </section>

        <section className="intro section-padding" id="sobre" aria-labelledby="intro-title">
          <div className="page-width intro-grid">
            <div className="reveal">
              <span className="eyebrow">SOBRE O CUIDADO</span>
              <h2 className="section-title" id="intro-title">Há espaço para<br />o que você <em>sente.</em></h2>
            </div>
            <div className="intro-copy reveal reveal-delay-1">
              <p>Na terapia, cada história encontra tempo e espaço para ser ouvida. Minha proposta é oferecer uma escuta atenta e sensível, para que você possa se conhecer melhor e encontrar seus próprios caminhos.</p>
              <a className="underlined-link" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={handleWhatsappClick}>
                Vamos conversar <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>

        <section className="expertise section-padding" id="atuacao" aria-labelledby="expertise-title">
          <div className="page-width">
            <div className="section-heading reveal">
              <span className="eyebrow">ÁREAS DE ATUAÇÃO</span>
              <h2 className="section-title" id="expertise-title">Diferentes olhares,<br /><em>um cuidado singular.</em></h2>
              <p>Cada processo é único. O caminho é construído a partir da sua história e do que você precisa.</p>
            </div>

            <div className="expertise-list">
              <article className="expertise-item reveal">
                <span className="expertise-number">01</span>
                <h3>Psicoterapia</h3>
                <p>Um espaço de acolhimento para falar sobre emoções, relações e os desafios da vida.</p>
              </article>
              <article className="expertise-item reveal reveal-delay-1">
                <span className="expertise-number">02</span>
                <h3>Psicanálise</h3>
                <p>Uma escuta que abre caminho para compreender sua história e seus próprios processos.</p>
              </article>
              <article className="expertise-item reveal reveal-delay-2">
                <span className="expertise-number">03</span>
                <h3>Neuropsicologia</h3>
                <p>Um olhar atento para a relação entre cognição, comportamento e emoções.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="attendance section-padding" id="atendimento" aria-labelledby="attendance-title">
          <div className="page-width attendance-grid">
            <div className="attendance-image-wrap reveal">
              <img src="/images/detalhe-acolhimento.jpg" alt="Caderno aberto e xícara em um ambiente tranquilo" />
            </div>
            <div className="attendance-content reveal reveal-delay-1">
              <span className="eyebrow">ATENDIMENTO ON-LINE</span>
              <h2 className="section-title" id="attendance-title">O cuidado se adapta<br /><em>à sua vida.</em></h2>
              <p className="attendance-lead">As sessões acontecem exclusivamente on-line, oferecendo um espaço de cuidado e acolhimento no seu próprio ritmo.</p>

              <a className="button button--dark attendance-button" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={handleWhatsappClick}>
                <WhatsAppIcon className="button-icon" />
                Saiba mais pelo WhatsApp
                <ArrowUpRight className="button-arrow" />
              </a>
            </div>
          </div>
        </section>

        <section className="contact" id="contato" aria-labelledby="contact-title">
          <div className="contact-inner reveal">
            <span className="eyebrow">O PRIMEIRO PASSO</span>
            <h2 id="contact-title">Quando fizer sentido para você,<br /><em>podemos começar.</em></h2>
            <p>Uma mensagem pode ser o começo de uma nova conversa. Entre em contato para saber mais sobre os atendimentos e agendar sua sessão.</p>
            <a className="button button--light" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={handleWhatsappClick}>
              <WhatsAppIcon className="button-icon" />
              Conversar no WhatsApp
              <ArrowUpRight className="button-arrow" />
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="page-width footer-top">
          <div className="footer-identity">
            <a href="#inicio" className="footer-logo">Maria Leticia</a>
            <p>Psicóloga | Psicanalista | Neuropsicóloga</p>
          </div>
          <div className="footer-links">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={handleWhatsappClick}><WhatsAppIcon /> (11) 93370-6643</a>
            <a href="https://www.instagram.com/psico.marialeticia/" target="_blank" rel="noopener noreferrer"><InstagramIcon /> @psico.marialeticia</a>
          </div>
        </div>
        <div className="page-width footer-bottom">
          <span>© {new Date().getFullYear()} Maria Leticia. Todos os direitos reservados.</span>
          <a href="#inicio">Voltar ao início <span aria-hidden="true">↑</span></a>
        </div>
      </footer>

      <dialog className="wa-dialog" ref={whatsappDialogRef} onClose={() => setWhatsappHelpOpen(false)} aria-labelledby="wa-dialog-title">
        <button className="wa-dialog-close" type="button" aria-label="Fechar" onClick={() => setWhatsappHelpOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M5 5 19 19M19 5 5 19" /></svg>
        </button>
        <span className="eyebrow">CONTATO</span>
        <h2 id="wa-dialog-title">Vamos conversar?</h2>
        <p>Este visualizador pode bloquear a abertura do WhatsApp. Copie o link e cole em uma nova aba do navegador.</p>
        <label className="wa-dialog-label" htmlFor="wa-dialog-url">Link direto para o WhatsApp</label>
        <div className="wa-dialog-copy">
          <input id="wa-dialog-url" ref={whatsappInputRef} value={whatsappBaseUrl} readOnly onFocus={(event) => event.currentTarget.select()} />
          <button type="button" onClick={copyWhatsappLink}>Copiar</button>
        </div>
        {copyStatus !== "idle" && (
          <p className="wa-dialog-feedback" role="status">
            {copyStatus === "copied" ? "Link com mensagem pronta copiado. Cole em uma nova aba." : "Selecione e copie o link acima para abrir em outra aba."}
          </p>
        )}
        <a className="wa-dialog-app" href={whatsappAppUrl}>Tentar abrir no aplicativo <ArrowUpRight /></a>
        <p className="wa-dialog-number">Ou use o número (11) 93370-6643.</p>
      </dialog>
    </>
  );
}

export default App;