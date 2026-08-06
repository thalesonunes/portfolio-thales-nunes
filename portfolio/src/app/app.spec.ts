import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';

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
    const OriginalDate = Date;

    /**
     * Replaces global Date so that `new Date()` (no args) returns a fixed date.
     * `new Date(year, month, day)` still delegates to the real implementation.
     */
    function mockToday(year: number, month: number, day: number): Date {
      const fakeNow = new OriginalDate(year, month, day);

      const MockDate: any = function (this: any, ...args: any[]) {
        if (args.length === 0) {
          return fakeNow;
        }
        // Let the real constructor handle it (works for new Date(2022, 0, 1) etc.)
        const inst = Reflect.construct(
          OriginalDate,
          args,
          new.target ?? MockDate,
        );
        return inst;
      };

      MockDate.prototype = OriginalDate.prototype;
      MockDate.now = () => fakeNow.getTime();
      MockDate.UTC = OriginalDate.UTC.bind(OriginalDate);
      MockDate.parse = OriginalDate.parse.bind(OriginalDate);

      (globalThis as any).Date = MockDate;
      return fakeNow;
    }

    afterEach(() => {
      (globalThis as any).Date = OriginalDate;
    });

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
    const OriginalDate = Date;

    afterEach(() => {
      (globalThis as any).Date = OriginalDate;
    });

    it('should display experience text in the about section', () => {
      const fakeNow = new OriginalDate(2026, 7, 6);

      const MockDate: any = function (this: any, ...args: any[]) {
        if (args.length === 0) {
          return fakeNow;
        }
        const inst = Reflect.construct(
          OriginalDate,
          args,
          new.target ?? MockDate,
        );
        return inst;
      };

      MockDate.prototype = OriginalDate.prototype;
      MockDate.now = () => fakeNow.getTime();
      MockDate.UTC = OriginalDate.UTC.bind(OriginalDate);
      MockDate.parse = OriginalDate.parse.bind(OriginalDate);

      (globalThis as any).Date = MockDate;

      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const aboutSection = fixture.nativeElement.querySelector(
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
});
