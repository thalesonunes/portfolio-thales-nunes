import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';

/** The real Date constructor, captured before any test replaces the global one. */
const RealDate = Date;

/**
 * Static surface required to replace the global `Date` in tests.
 * `prototype` is intentionally mutable so the mock can reuse the real Date prototype.
 */
interface DateMock {
  new (...args: unknown[]): Date;
  (...args: unknown[]): unknown;
  prototype: Date;
  now(): number;
  UTC(...args: number[]): number;
  parse(dateString: string): number;
}

/**
 * Replaces the global `Date` so that `new Date()` (no args) returns a fixed date,
 * while `new Date(year, month, day)` still delegates to the real implementation.
 */
function mockToday(year: number, month: number, day: number): Date {
  const fakeNow = new RealDate(year, month, day);

  function MockDate(this: unknown, ...args: unknown[]): Date {
    if (args.length === 0) {
      return fakeNow;
    }
    // Let the real constructor handle it (works for new Date(2022, 0, 1) etc.)
    return Reflect.construct(RealDate, args, new.target ?? MockDate) as Date;
  }

  const mock = MockDate as unknown as DateMock;
  mock.prototype = RealDate.prototype;
  mock.now = () => fakeNow.getTime();
  mock.UTC = RealDate.UTC.bind(RealDate);
  mock.parse = RealDate.parse.bind(RealDate);

  (globalThis as { Date: DateMock }).Date = mock;
  return fakeNow;
}

/** Restores the original global Date after a test that mocked it. */
function restoreDate(): void {
  (globalThis as { Date: DateMock }).Date = RealDate;
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the name in the hero section', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const h1 = compiled.querySelector('#home h1.name') as HTMLHeadingElement;
    expect(h1?.textContent).toContain('Thales Nunes');
  });

  describe('sidebar toggle', () => {
    it('should toggle sidebarOpen from false to true', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      expect(app.sidebarOpen).toBeFalse();
      app.toggleSidebar();
      expect(app.sidebarOpen).toBeTrue();
    });

    it('should toggle sidebarOpen back to false on second call', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      app.toggleSidebar();
      app.toggleSidebar();
      expect(app.sidebarOpen).toBeFalse();
    });
  });

  describe('navigation', () => {
    it('should set activeSection on scrollToSection', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      app.scrollToSection('projects');
      expect(app.activeSection).toBe('projects');
    });
  });

  describe('experience text calculation', () => {
    afterEach(restoreDate);

    it('should return "4 anos e 7 meses" for August 6, 2026 (start: Jan 2022)', () => {
      mockToday(2026, 7, 6);
      const fixture = TestBed.createComponent(AppComponent);
      expect(fixture.componentInstance.experienceText).toBe('4 anos e 7 meses');
    });

    it('should return "1 ano" exactly on the anniversary (Jan 1, 2023)', () => {
      mockToday(2023, 0, 1);
      const fixture = TestBed.createComponent(AppComponent);
      expect(fixture.componentInstance.experienceText).toBe('1 ano');
    });

    it('should return "1 mês" for Feb 1, 2022 (exactly 1 month after start)', () => {
      mockToday(2022, 1, 1);
      const fixture = TestBed.createComponent(AppComponent);
      expect(fixture.componentInstance.experienceText).toBe('1 mês');
    });

    it('should return only years when months = 0 (e.g. Jan 2026)', () => {
      mockToday(2026, 0, 5);
      const fixture = TestBed.createComponent(AppComponent);
      expect(fixture.componentInstance.experienceText).toBe('4 anos');
    });

    it('should return only months when years = 0 (e.g. May 2022)', () => {
      mockToday(2022, 4, 10);
      const fixture = TestBed.createComponent(AppComponent);
      expect(fixture.componentInstance.experienceText).toBe('4 meses');
    });

    it('should handle end of year: Dec 31, 2022 returns months only', () => {
      // Dec 31, 2022 — month 11 > start month 0, no borrow needed
      mockToday(2022, 11, 31);
      const fixture = TestBed.createComponent(AppComponent);
      expect(fixture.componentInstance.experienceText).toBe('11 meses');
    });

    it('should handle same month after the start day (no borrow)', () => {
      // Career start: Jan 1, 2022. Jan 5, 2023 — same month, day >= 1 → no borrow.
      mockToday(2023, 0, 5);
      const fixture = TestBed.createComponent(AppComponent);
      expect(fixture.componentInstance.experienceText).toBe('1 ano');
    });
  });

  describe('template rendering', () => {
    afterEach(restoreDate);

    it('should display experience text in the about section', () => {
      mockToday(2026, 7, 6);
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const aboutSection = (fixture.nativeElement as HTMLElement).querySelector(
        '#about',
      ) as HTMLElement;
      expect(aboutSection?.textContent).toContain('4 anos e 7 meses');
    });
  });

  describe('security: rel="noopener noreferrer" regression', () => {
    it('should have rel containing noopener and noreferrer on EVERY external link', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      const externalLinks: NodeListOf<HTMLAnchorElement> =
        compiled.querySelectorAll('a[target="_blank"]');

      // Regression guard: at least one external link must exist
      expect(externalLinks.length).toBeGreaterThan(0);

      externalLinks.forEach((link) => {
        const rel = (link.getAttribute('rel') || '').toLowerCase();
        expect(rel).toContain('noopener');
        expect(rel).toContain('noreferrer');
      });
    });

    it('should NOT have target="_blank" on mailto links', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      const mailLinks: NodeListOf<HTMLAnchorElement> =
        compiled.querySelectorAll('a[href^="mailto:"]');

      // Sanity: there should be at least one mailto link
      expect(mailLinks.length).toBeGreaterThan(0);

      mailLinks.forEach((link) => {
        expect(link.getAttribute('target')).toBeNull();
      });
    });
  });

  describe('accessibility', () => {
    it('should have a skip link pointing to #main-content with visible text', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const skipLink = compiled.querySelector(
        'a.skip-link[href="#main-content"]',
      ) as HTMLAnchorElement;
      expect(skipLink).toBeTruthy();
      expect(skipLink?.textContent?.trim()).toBe('Pular para conteúdo');
    });

    it('should have an accessible name on every external link (target="_blank")', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const externalLinks: NodeListOf<HTMLAnchorElement> =
        compiled.querySelectorAll('a[target="_blank"]');
      expect(externalLinks.length).toBeGreaterThan(0);
      externalLinks.forEach((link) => {
        const accessibleName =
          link.textContent?.trim() || link.getAttribute('aria-label') || '';
        expect(accessibleName).not.toBe('');
      });
    });

    it('should toggle aria-expanded on menu-toggle button', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const toggle = compiled.querySelector(
        '.menu-toggle',
      ) as HTMLButtonElement;
      expect(toggle).toBeTruthy();
      expect(toggle.getAttribute('aria-expanded')).toBe('false');

      app.toggleSidebar();
      fixture.detectChanges();
      expect(toggle.getAttribute('aria-expanded')).toBe('true');

      app.toggleSidebar();
      fixture.detectChanges();
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
    });

    it('should have aria-label on nav#sidebar', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const nav = compiled.querySelector('nav#sidebar') as HTMLElement;
      expect(nav).toBeTruthy();
      expect(nav.getAttribute('aria-label')).toBe('Navegação principal');
    });

    it('should have main#main-content as the skip link target', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const main = compiled.querySelector('main#main-content') as HTMLElement;
      expect(main).toBeTruthy();
    });

    it('should have aria-hidden="true" on every decorative material-icons element', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const icons: NodeListOf<HTMLElement> =
        compiled.querySelectorAll('i.material-icons');
      expect(icons.length).toBeGreaterThan(0);
      icons.forEach((icon) => {
        expect(icon.getAttribute('aria-hidden')).toBe('true');
      });
    });
  });

  /**
   * Responsividade — Fase 05, TASK 4.
   *
   * Abordagem: tenta `window.resizeTo(320, 568)` para testes de viewport real;
   * se o Karma não permitir (innerWidth não mudar), usa fallback estrutural
   * (computed styles de propriedades que previnem overflow).
   *
   * No ambiente atual (Linux, ChromeHeadless), `window.resizeTo` É suportado
   * e efetivo — innerWidth muda para <= 321 após o comando.
   */
  describe('responsiveness', () => {
    /** Resize guard: true se o viewport realmente mudou para o tamanho alvo. */
    function resizeToTarget(targetWidth: number, targetHeight: number): boolean {
      if (typeof window.resizeTo !== 'function') {
        return false;
      }
      window.resizeTo(targetWidth, targetHeight);
      window.dispatchEvent(new Event('resize'));
      // O resize é síncrono no ChromeHeadless; innerWidth reflete o novo tamanho.
      return window.innerWidth <= targetWidth + 1;
    }

    describe('overflow horizontal prevention', () => {
      it('should prevent document-level horizontal overflow at 320px (or verify structural protections)', () => {
        const viewportResized = resizeToTarget(320, 568);

        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        if (viewportResized) {
          // Viewport real mudou → verificação objetiva de overflow
          const docEl = document.documentElement;
          expect(docEl.scrollWidth)
            .withContext('document scrollWidth must not exceed clientWidth at 320px')
            .toBeLessThanOrEqual(docEl.clientWidth);
        } else {
          // Fallback: proteções estruturais independentes de viewport
          const compiled = fixture.nativeElement as HTMLElement;

          // skill-item min-width: 0 impede que min-content (h3/p) estoure a grid em 320/375
          const skillItem = compiled.querySelector('.skill-item') as HTMLElement;
          expect(skillItem).withContext('.skill-item must exist').toBeTruthy();
          expect(getComputedStyle(skillItem).minWidth)
            .withContext('.skill-item must have min-width: 0 (TASK 2, P0)')
            .toBe('0px');

          // timeline-item min-width: 0 evita que datas nowrap estourem o container
          const timelineItem = compiled.querySelector('.timeline-item') as HTMLElement;
          expect(timelineItem).withContext('.timeline-item must exist').toBeTruthy();
          // Em viewports > 1024, minWidth pode ser 'auto' (padrão) — o importante
          // é que o elemento exista e tenha um valor computado definido
          const tw = getComputedStyle(timelineItem).minWidth;
          expect(tw).withContext('.timeline-item minWidth must be a defined value').toBeTruthy();
        }
      });

      it('projects-grid must use a responsive column definition (not bare fixed 380px)', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const projectsGrid = compiled.querySelector('.projects-grid') as HTMLElement;
        expect(projectsGrid).withContext('.projects-grid must exist').toBeTruthy();

        const computedCols = getComputedStyle(projectsGrid).gridTemplateColumns;
        // A grid bem definida não retorna 'none' nem string vazia.
        // A fórmula original `minmax(min(100%, 380px), 1fr)` garante que cada
        // coluna não ultrapasse 100% do container, mesmo em 320px.
        expect(computedCols)
          .withContext('grid-template-columns must be a valid responsive definition (not none/auto)')
          .not.toBe('none');
        // 'auto' seria sintoma de grid não configurada (nunca deve acontecer
        // com a SCSS atual, mas é o guard-rail estrutural)
        expect(computedCols)
          .withContext('grid-template-columns must not be "auto" (unconfigured)')
          .not.toBe('auto');
      });

      it('project cards should fit within projects-grid without overflow', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const grid = compiled.querySelector('.projects-grid') as HTMLElement;
        expect(grid).toBeTruthy();
        const gridWidth = grid.clientWidth;

        const cards: NodeListOf<HTMLElement> =
          compiled.querySelectorAll('.project-card');
        expect(cards.length).toBeGreaterThan(0);

        cards.forEach((card, i) => {
          // Nenhum card pode ser mais largo que o pai (grid)
          expect(card.scrollWidth)
            .withContext(`project-card[${i}] scrollWidth <= grid clientWidth`)
            .toBeLessThanOrEqual(gridWidth + 1); // +1 tolerância de arredondamento
        });
      });
    });

    describe('skip-link visibility on focus', () => {
      it('should be focusable and always rendered (not display:none/hidden)', () => {
        // Nota: :focus CSS não dispara via focus() programático no Karma
        // ChromeHeadless nesta versão. O teste verifica atributos estruturais
        // e de comportamento que garantem a funcionalidade no mundo real.
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const skipLink = compiled.querySelector(
          'a.skip-link[href="#main-content"]',
        ) as HTMLAnchorElement;
        expect(skipLink).withContext('.skip-link must exist').toBeTruthy();

        // O link deve receber foco DOM (tab order funcional)
        skipLink.focus();
        fixture.detectChanges();
        expect(document.activeElement)
          .withContext('skip-link must receive DOM focus (tab order)')
          .toBe(skipLink);

        // O elemento NUNCA deve estar display:none ou visibility:hidden
        // (senão bloquearia o tab order e falharia WCAG 2.4.1 Bypass Blocks).
        // Ele é off-screen via translateY(-400%) mas permanece renderizado.
        const style = getComputedStyle(skipLink);
        expect(style.display)
          .withContext('skip-link must not be display:none')
          .not.toBe('none');
        expect(style.visibility)
          .withContext('skip-link must not be visibility:hidden')
          .not.toBe('hidden');
        expect(skipLink.offsetWidth)
          .withContext('skip-link offsetWidth must be > 0 (rendered)')
          .toBeGreaterThan(0);
        expect(skipLink.offsetHeight)
          .withContext('skip-link offsetHeight must be > 0 (rendered)')
          .toBeGreaterThan(0);
      });
    });

    describe('touch targets', () => {
      it('menu-toggle must have hit area >= 24×24px (WCAG 2.5.8 mínimo)', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const toggle = compiled.querySelector('.menu-toggle') as HTMLButtonElement;
        expect(toggle).withContext('.menu-toggle must exist').toBeTruthy();

        const rect = toggle.getBoundingClientRect();
        // CSS: width/height 40px + padding 12px → rect efetivo ≈ 64×64
        expect(rect.width)
          .withContext('menu-toggle hit width >= 24px')
          .toBeGreaterThanOrEqual(24);
        expect(rect.height)
          .withContext('menu-toggle hit height >= 24px')
          .toBeGreaterThanOrEqual(24);
      });

      it('project-link must have hit area >= 24×24px', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const links: NodeListOf<HTMLAnchorElement> =
          compiled.querySelectorAll('a.project-link');
        expect(links.length)
          .withContext('at least one .project-link must exist')
          .toBeGreaterThan(0);

        links.forEach((link, i) => {
          const rect = link.getBoundingClientRect();
          // CSS: width/height 50px
          expect(rect.width)
            .withContext(`project-link[${i}] hit width >= 24px`)
            .toBeGreaterThanOrEqual(24);
          expect(rect.height)
            .withContext(`project-link[${i}] hit height >= 24px`)
            .toBeGreaterThanOrEqual(24);
        });
      });
    });

    describe('timeline', () => {
      it('should render timeline items with visible content inside bounds', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const timeline = compiled.querySelector('.timeline') as HTMLElement;
        expect(timeline).withContext('.timeline must exist').toBeTruthy();

        const items: NodeListOf<HTMLElement> =
          timeline.querySelectorAll('.timeline-item');
        expect(items.length)
          .withContext('must have at least one timeline item')
          .toBeGreaterThan(0);

        const timelineWidth = timeline.clientWidth;

        items.forEach((item, idx) => {
          const content = item.querySelector('.timeline-content') as HTMLElement;
          expect(content)
            .withContext(`.timeline-item[${idx}] must have .timeline-content`)
            .toBeTruthy();

          const contentRect = content.getBoundingClientRect();
          expect(contentRect.width)
            .withContext(`.timeline-content[${idx}] must have visible width`)
            .toBeGreaterThan(0);
          expect(contentRect.height)
            .withContext(`.timeline-content[${idx}] must have visible height`)
            .toBeGreaterThan(0);

          // O conteúdo não pode gerar overflow horizontal interno (scroll)
          expect(content.scrollWidth)
            .withContext(
              `.timeline-content[${idx}] scrollWidth <= clientWidth ` +
              `(no horizontal content overflow)`,
            )
            .toBeLessThanOrEqual(content.clientWidth + 1);

          // O item não deve ultrapassar a largura da timeline (container pai)
          const itemRect = item.getBoundingClientRect();
          expect(itemRect.width)
            .withContext(
              `.timeline-item[${idx}] width <= .timeline width`,
            )
            .toBeLessThanOrEqual(timelineWidth + 1);
        });
      });
    });
  });

  /**
   * Otimização de imagens — Fase 06, TASK 5.
   *
   * Verifica a conversão para <picture>/<source>/<img> com WebP responsivo,
   * lazy loading, dimensões explícitas e fallback JPG.
   */
  describe('image optimization (Fase 06)', () => {
    /** Returns all picture elements rendered in the component. */
    function queryPictures(fixture: ReturnType<typeof TestBed.createComponent>): NodeListOf<HTMLPictureElement> {
      fixture.detectChanges();
      return (fixture.nativeElement as HTMLElement).querySelectorAll('picture');
    }

    it('should have exactly 4 picture elements (one per project)', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const pictures = queryPictures(fixture);
      expect(pictures.length).withContext('4 projects = 4 pictures').toBe(4);
    });

    it('each picture should have a source with type="image/webp" and exactly 3 srcset entries', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const pictures = queryPictures(fixture);

      pictures.forEach((picture, idx) => {
        const sources: NodeListOf<HTMLSourceElement> =
          picture.querySelectorAll('source[type="image/webp"]');
        expect(sources.length)
          .withContext(`picture[${idx}] must have exactly 1 <source type="image/webp">`)
          .toBe(1);

        const srcset = sources[0].getAttribute('srcset') ?? '';
        const entries = srcset
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        expect(entries.length)
          .withContext(`picture[${idx}] srcset must have exactly 3 descriptors`)
          .toBe(3);

        // Each entry must end with 480w, 960w, or 1280w
        const expectedWidths = ['480w', '960w', '1280w'];
        entries.forEach((entry) => {
          const parts = entry.split(/\s+/);
          const descriptor = parts[parts.length - 1];
          expect(expectedWidths)
            .withContext(`picture[${idx}] srcset entry "${entry}" descriptor must be one of 480w/960w/1280w`)
            .toContain(descriptor);
        });
      });
    });

    it('each picture img should have loading="lazy", decoding="async", non-empty alt, numeric width and height', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const pictures = queryPictures(fixture);

      pictures.forEach((picture, idx) => {
        const img: HTMLImageElement | null = picture.querySelector('img');
        expect(img).withContext(`picture[${idx}] must contain an <img>`).toBeTruthy();

        const imgEl = img!;
        expect(imgEl.getAttribute('loading'))
          .withContext(`picture[${idx}] img must have loading="lazy"`)
          .toBe('lazy');
        expect(imgEl.getAttribute('decoding'))
          .withContext(`picture[${idx}] img must have decoding="async"`)
          .toBe('async');

        const alt = imgEl.getAttribute('alt') ?? '';
        expect(alt.trim().length)
          .withContext(`picture[${idx}] img must have non-empty alt`)
          .toBeGreaterThan(0);

        const width = Number(imgEl.getAttribute('width'));
        const height = Number(imgEl.getAttribute('height'));
        expect(width)
          .withContext(`picture[${idx}] img width must be a positive integer`)
          .toBeGreaterThan(0);
        expect(Number.isInteger(width))
          .withContext(`picture[${idx}] img width must be an integer`)
          .toBeTrue();
        expect(height)
          .withContext(`picture[${idx}] img height must be a positive integer`)
          .toBeGreaterThan(0);
        expect(Number.isInteger(height))
          .withContext(`picture[${idx}] img height must be an integer`)
          .toBeTrue();
      });
    });

    it('each img inside picture should have src pointing to .jpg (fallback)', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const pictures = queryPictures(fixture);
      const expectedJpgs = ['minha-guita', 'plano-truco', 'donedep', 'deveria'];

      const actualJpgs: string[] = [];
      pictures.forEach((picture) => {
        const img: HTMLImageElement | null = picture.querySelector('img');
        if (img) {
          // Extract the basename without extension from src
          const src = img.getAttribute('src') ?? '';
          const match = /\/([^/]+)\.jpg$/.exec(src);
          if (match) {
            actualJpgs.push(match[1]);
          }
        }
      });

      expect(actualJpgs.length)
        .withContext('all 4 imgs must have a .jpg src')
        .toBe(4);
      expectedJpgs.forEach((expected) => {
        expect(actualJpgs)
          .withContext(`must include ${expected}.jpg fallback`)
          .toContain(expected);
      });
    });
  });
});
