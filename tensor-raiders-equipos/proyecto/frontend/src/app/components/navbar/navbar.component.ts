import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EquipoService } from '../../services/equipo.service';
import { Estadisticas, NIVEL_CONFIG } from '../../models/equipo.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-symbol">TR/</div>
        <div class="logo-sub">Tensor Raiders</div>
      </div>

      <nav>
        <a class="nav-item" routerLink="/equipos" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
          <span class="nav-icon">▤</span> Equipos
        </a>
        <a class="nav-item" routerLink="/equipos/nuevo" routerLinkActive="active">
          <span class="nav-icon">＋</span> Registrar
        </a>
      </nav>

      @if (stats()) {
        <div class="sidebar-stats">
          <div class="sidebar-stats-title">Por nivel</div>
          @for (nivel of niveles; track nivel) {
            <div class="stat-row">
              <span class="stat-dot" [style.background]="nivelesConfig[nivel].color"></span>
              <span class="stat-label">{{ nivelesConfig[nivel].label }}</span>
              <span class="stat-num">{{ stats()!.porNivel[nivel] ?? 0 }}</span>
            </div>
          }
        </div>
      }
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px; flex-shrink: 0;
      background: var(--surface);
      border-right: 1px solid var(--border);
      display: flex; flex-direction: column;
      padding: 32px 0;
      position: sticky; top: 0; height: 100vh;
      @media (max-width: 768px) { display: none; }
    }
    .logo { padding: 0 28px 28px; border-bottom: 1px solid var(--border); }
    .logo-symbol { font-size: 28px; font-weight: 800; letter-spacing: -1px; color: var(--accent); line-height: 1; }
    .logo-sub { font-size: 11px; color: var(--muted); letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; font-family: var(--mono); }
    nav { padding: 24px 16px; flex: 1; }
    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 16px; border-radius: var(--radius);
      cursor: pointer; transition: all .2s; font-weight: 600;
      font-size: 14px; color: var(--muted); margin-bottom: 4px;
      border: 1px solid transparent; text-decoration: none;
    }
    .nav-item:hover { color: var(--text); background: var(--surface2); }
    .nav-item.active { color: var(--accent); background: rgba(93,255,176,.08); border-color: rgba(93,255,176,.2); }
    .nav-icon { font-size: 18px; }
    .sidebar-stats { margin: 16px; padding: 16px; background: var(--surface2); border-radius: var(--radius); border: 1px solid var(--border); }
    .sidebar-stats-title { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: var(--muted); font-family: var(--mono); margin-bottom: 12px; }
    .stat-row { display: flex; align-items: center; padding: 4px 0; font-size: 13px; gap: 8px; }
    .stat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .stat-label { flex: 1; color: var(--muted); }
    .stat-num { font-family: var(--mono); font-weight: 500; }
  `]
})
export class NavbarComponent implements OnInit {
  private readonly svc = inject(EquipoService);
  readonly stats = signal<Estadisticas | null>(null);
  readonly niveles = ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO', 'EXPERTO'] as const;
  readonly nivelesConfig = NIVEL_CONFIG;

  ngOnInit(): void { this.loadStats(); }
  private loadStats(): void {
    this.svc.estadisticas().subscribe({ next: d => this.stats.set(d), error: () => {} });
  }
}
