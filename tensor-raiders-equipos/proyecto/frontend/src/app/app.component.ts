import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastContainerComponent } from './shared/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastContainerComponent],
  template: `
    <div class="layout">
      <app-navbar />
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
    <app-toast-container />
  `,
  styles: [`
    .layout { display: flex; min-height: 100vh; position: relative; z-index: 1; }
    .main-content { flex: 1; padding: 40px 48px; overflow-y: auto;
      @media (max-width: 768px) { padding: 24px 16px; }
    }
  `]
})
export class AppComponent {}
