import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'portfolio';
  sidebarOpen = false;
  activeSection = 'home';

  /** Career start date (January 2022). */
  private readonly careerStartDate = new Date(2022, 0, 1);

  /** Years and months of experience since the career start date. */
  readonly experienceText = this.calculateExperienceText();

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  scrollToSection(section: string) {
    this.activeSection = section;
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
      this.sidebarOpen = false;
    }
  }

  private calculateExperienceText(): string {
    const now = new Date();
    let years = now.getFullYear() - this.careerStartDate.getFullYear();
    let months = now.getMonth() - this.careerStartDate.getMonth();

    // Borrow one year when the current month is before the start month,
    // or when it is the same month but the current day is earlier.
    if (
      months < 0 ||
      (months === 0 && now.getDate() < this.careerStartDate.getDate())
    ) {
      years--;
      months += 12;
    }

    const parts: string[] = [];
    if (years > 0) {
      parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
    }
    if (months > 0) {
      parts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`);
    }
    return parts.join(' e ');
  }
}
