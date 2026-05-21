import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { EquipoService } from '../../services/equipo.service';
import { ToastService } from '../../services/toast.service';
import { Equipo, Nivel, NIVELES, NIVEL_CONFIG } from '../../models/equipo.model';

@Component({
  selector: 'app-equipo-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Gestión de <span class="accent">Equipos</span></h1>
        <p class="page-subtitle">
          @if (!loading()) { {{ equipos().length }} equipo{{ equipos().length !== 1 ? 's' : '' }} registrado{{ equipos().length !== 1 ? 's' : '' }} }
          @else { Cargando... }
        </p>
      </div>
      <a class="btn btn-primary" routerLink="/equipos/nuevo">
        <span>＋</span> Nuevo equipo
      </a>
    </div>

    <div class="toolbar">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input
          class="form-input search-input"
          type="text"
          placeholder="Buscar por nombre o descripción…"
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearch($event)"
        >
      </div>
      <select class="form-select filter-select" [(ngModel)]="nivelFilter" (ngModelChange)="onFilter()">
        <option value="">Todos los niveles</option>
        @for (n of niveles; track n) {
          <option [value]="n">{{ nivelConfig[n].label }}</option>
        }
      </select>
    </div>

    @if (loading()) {
      <div class="spinner"></div>
    } @else if (equipos().length === 0) {
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <div class="empty-title">No hay equipos</div>
        <p>{{ searchTerm || nivelFilter ? 'No se encontraron resultados para tu búsqueda.' : 'Crea tu primer equipo.' }}</p>
        <a class="btn btn-primary" style="margin-top:20px" routerLink="/equipos/nuevo">＋ Crear equipo</a>
      </div>
    } @else {
      <div class="grid">
        @for (e of equipos(); track e.id) {
          <div class="card" [class]="'card-' + e.nivel" (click)="navigate(e.id)">
            <div class="card-top">
              <div class="card-name">{{ e.nombre }}</div>
              <span class="badge" [class]="'badge-' + e.nivel">{{ e.nivel }}</span>
            </div>
            <p class="card-desc">{{ e.descripcion || 'Sin descripción.' }}</p>
            <div class="card-participants">
              @for (p of e.participantes.slice(0, 3); track p) {
                <span class="chip">{{ p }}</span>
              }
              @if (e.numParticipantes > 3) {
                <span class="chip chip-more">+{{ e.numParticipantes - 3 }}</span>
              }
            </div>
            <div class="card-footer" (click)="$event.stopPropagation()">
              <a class="btn btn-ghost btn-sm" [routerLink]="['/equipos', e.id]">Ver</a>
              <a class="btn btn-ghost btn-sm" [routerLink]="['/equipos', e.id, 'editar']">✏️ Editar</a>
              <button class="btn btn-danger btn-sm" (click)="deleteEquipo(e)">🗑️</button>
            </div>
          </div>
        }
      </div>
    }

    <!-- Confirm Delete Modal -->
    @if (deleteTarget()) {
      <div class="modal-overlay" (click)="cancelDelete()">
        <div class="confirm-modal" (click)="$event.stopPropagation()">
          <div class="confirm-title">⚠️ Eliminar equipo</div>
          <p class="confirm-text">
            ¿Estás seguro de que quieres eliminar <strong>{{ deleteTarget()!.nombre }}</strong>?
            Esta acción no se puede deshacer.
          </p>
          <div class="confirm-actions">
            <button class="btn btn-ghost" (click)="cancelDelete()">Cancelar</button>
            <button class="btn btn-danger" (click)="confirmDelete()" [disabled]="deleting()">
              {{ deleting() ? 'Eliminando…' : '🗑️ Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .page-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 36px; flex-wrap: wrap; gap: 16px; }
    .page-title { font-size: 36px; font-weight: 800; letter-spacing: -1px; }
    .accent { color: var(--accent); }
    .page-subtitle { font-size: 14px; color: var(--muted); margin-top: 4px; }
    .toolbar { display: flex; gap: 12px; margin-bottom: 28px; flex-wrap: wrap; }
    .search-wrap { position: relative; flex: 1; min-width: 240px; max-width: 400px; }
    .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 16px; z-index: 1; }
    .search-input { padding-left: 44px !important; }
    .filter-select { min-width: 180px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 24px;
      transition: all .25s; cursor: pointer; position: relative; overflow: hidden;
    }
    .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
    .card-EXPERTO::before      { background: var(--expert); }
    .card-AVANZADO::before     { background: var(--avanzado); }
    .card-INTERMEDIO::before   { background: var(--intermedio); }
    .card-PRINCIPIANTE::before { background: var(--principiante); }
    .card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,.4); }
    .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 8px; }
    .card-name { font-size: 18px; font-weight: 700; letter-spacing: -.4px; }
    .card-desc { font-size: 13px; color: var(--muted); margin-bottom: 16px; line-height: 1.6; min-height: 38px;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .card-participants { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
    .chip { background: var(--surface2); border: 1px solid var(--border); border-radius: 20px;
      padding: 4px 10px; font-size: 12px; color: var(--muted); font-family: var(--mono); }
    .chip-more { background: rgba(93,255,176,.1); border-color: rgba(93,255,176,.2); color: var(--accent); }
    .card-footer { display: flex; gap: 8px; border-top: 1px solid var(--border); padding-top: 16px; }
    .empty-state { text-align: center; padding: 80px 40px; color: var(--muted); }
    .empty-icon { font-size: 56px; margin-bottom: 16px; opacity: .4; }
    .empty-title { font-size: 18px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.75); z-index: 200;
      display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
    .confirm-modal { background: var(--surface); border: 1px solid rgba(255,107,107,.3);
      border-radius: 20px; width: 420px; padding: 36px; animation: popIn .25s ease; }
    @keyframes popIn { from { transform: scale(.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .confirm-title { font-size: 20px; font-weight: 800; margin-bottom: 12px; }
    .confirm-text { font-size: 14px; color: var(--muted); margin-bottom: 28px; line-height: 1.6; }
    .confirm-actions { display: flex; gap: 12px; justify-content: flex-end; }
  `]
})
export class EquipoListComponent implements OnInit, OnDestroy {
  private readonly svc = inject(EquipoService);
  private readonly toast = inject(ToastService);
  private readonly destroy$ = new Subject<void>();
  private readonly search$ = new Subject<string>();

  readonly equipos = signal<Equipo[]>([]);
  readonly loading = signal(true);
  readonly deleteTarget = signal<Equipo | null>(null);
  readonly deleting = signal(false);

  readonly niveles = NIVELES;
  readonly nivelConfig = NIVEL_CONFIG;
  searchTerm = '';
  nivelFilter: Nivel | '' = '';

  ngOnInit(): void {
    this.search$.pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.load());
    this.load();
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  navigate(id: number): void { }

  onSearch(val: string): void { this.search$.next(val); }

  onFilter(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.svc.listar(this.searchTerm || undefined, (this.nivelFilter as Nivel) || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => { this.equipos.set(data); this.loading.set(false); },
        error: () => { this.loading.set(false); this.toast.show('Error al cargar equipos', 'error'); }
      });
  }

  deleteEquipo(e: Equipo): void { this.deleteTarget.set(e); }
  cancelDelete(): void { this.deleteTarget.set(null); }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;
    this.deleting.set(true);
    this.svc.eliminar(target.id).subscribe({
      next: () => {
        this.toast.show(`Equipo "${target.nombre}" eliminado`, 'success');
        this.deleteTarget.set(null);
        this.deleting.set(false);
        this.load();
      },
      error: () => {
        this.toast.show('Error al eliminar el equipo', 'error');
        this.deleting.set(false);
      }
    });
  }
}
