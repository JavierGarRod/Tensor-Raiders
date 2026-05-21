import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { EquipoService } from '../../services/equipo.service';
import { ToastService } from '../../services/toast.service';
import { Equipo, NIVEL_CONFIG } from '../../models/equipo.model';

@Component({
  selector: 'app-equipo-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="detail-page">
      <a class="btn btn-ghost btn-sm back-btn" routerLink="/equipos">← Volver al listado</a>

      @if (loading()) {
        <div class="spinner" style="margin-top:60px"></div>
      } @else if (equipo()) {
        <div class="detail-layout">
          <!-- Main card -->
          <div class="detail-card">
            <div class="detail-header">
              <div>
                <div class="nivel-bar" [style.background]="nivelConfig[equipo()!.nivel].color"></div>
                <span class="badge" [class]="'badge-' + equipo()!.nivel">{{ equipo()!.nivel }}</span>
                <h1 class="detail-name">{{ equipo()!.nombre }}</h1>
              </div>
              <div class="header-actions">
                <a class="btn btn-ghost" [routerLink]="['/equipos', equipo()!.id, 'editar']">✏️ Editar</a>
                <button class="btn btn-danger" (click)="showDelete = true">🗑️ Eliminar</button>
              </div>
            </div>

            @if (equipo()!.descripcion) {
              <div class="section">
                <div class="section-title">Descripción</div>
                <p class="description">{{ equipo()!.descripcion }}</p>
              </div>
            }

            <div class="section">
              <div class="section-title">Participantes ({{ equipo()!.numParticipantes }})</div>
              <div class="participants-grid">
                @for (p of equipo()!.participantes; track p) {
                  <div class="participant-card">
                    <div class="avatar" [style.background]="getAvatarColor($index)">
                      {{ getInitials(p) }}
                    </div>
                    <span class="participant-name">{{ p }}</span>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Meta sidebar -->
          <div class="meta-card">
            <div class="meta-title">Información</div>
            <div class="meta-item">
              <span class="meta-key">ID</span>
              <span class="meta-val mono">#{{ equipo()!.id }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-key">Nivel</span>
              <span class="badge" [class]="'badge-' + equipo()!.nivel">{{ equipo()!.nivel }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-key">Participantes</span>
              <span class="meta-val">{{ equipo()!.numParticipantes }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-key">Creado</span>
              <span class="meta-val mono small">{{ equipo()!.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-key">Actualizado</span>
              <span class="meta-val mono small">{{ equipo()!.fechaActualizacion | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
          </div>
        </div>
      } @else {
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <div class="empty-title">Equipo no encontrado</div>
          <a class="btn btn-primary" style="margin-top:20px" routerLink="/equipos">Ver todos los equipos</a>
        </div>
      }
    </div>

    <!-- Delete confirm -->
    @if (showDelete) {
      <div class="modal-overlay" (click)="showDelete = false">
        <div class="confirm-modal" (click)="$event.stopPropagation()">
          <div class="confirm-title">⚠️ Eliminar equipo</div>
          <p class="confirm-text">
            ¿Eliminar <strong>{{ equipo()!.nombre }}</strong>? Esta acción no se puede deshacer.
          </p>
          <div class="confirm-actions">
            <button class="btn btn-ghost" (click)="showDelete = false">Cancelar</button>
            <button class="btn btn-danger" (click)="confirmDelete()" [disabled]="deleting()">
              {{ deleting() ? 'Eliminando…' : '🗑️ Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .detail-page { max-width: 960px; }
    .back-btn { margin-bottom: 28px; display: inline-flex; }
    .detail-layout { display: grid; grid-template-columns: 1fr 260px; gap: 24px; align-items: start;
      @media (max-width: 768px) { grid-template-columns: 1fr; } }
    .detail-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 36px; }
    .detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
    .nivel-bar { width: 40px; height: 4px; border-radius: 2px; margin-bottom: 12px; }
    .detail-name { font-size: 32px; font-weight: 800; letter-spacing: -1px; margin-top: 10px; }
    .header-actions { display: flex; gap: 10px; flex-wrap: wrap; }
    .section { margin-top: 28px; padding-top: 28px; border-top: 1px solid var(--border); }
    .section-title { font-family: var(--mono); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
    .description { font-size: 15px; color: var(--muted); line-height: 1.8; }
    .participants-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
    .participant-card {
      display: flex; align-items: center; gap: 10px;
      background: var(--surface2); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 12px 14px;
      font-size: 14px; transition: border-color .2s;
    }
    .participant-card:hover { border-color: var(--accent); }
    .avatar {
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; flex-shrink: 0; color: #fff;
    }
    .participant-name { font-weight: 600; font-size: 13px; }
    .meta-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 28px; }
    .meta-title { font-size: 16px; font-weight: 700; margin-bottom: 20px; }
    .meta-item { display: flex; flex-direction: column; gap: 4px; padding: 12px 0; border-bottom: 1px solid var(--border); }
    .meta-item:last-child { border-bottom: none; }
    .meta-key { font-family: var(--mono); font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); }
    .meta-val { font-weight: 600; font-size: 14px; }
    .mono { font-family: var(--mono); }
    .small { font-size: 12px; }
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
export class EquipoDetailComponent implements OnInit {
  private readonly svc = inject(EquipoService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly equipo = signal<Equipo | null>(null);
  readonly loading = signal(true);
  readonly deleting = signal(false);
  readonly nivelConfig = NIVEL_CONFIG;
  showDelete = false;

  private readonly avatarColors = [
    'linear-gradient(135deg,#4361ee,#5dffb0)',
    'linear-gradient(135deg,#8b5cf6,#4361ee)',
    'linear-gradient(135deg,#f59e0b,#ff6b6b)',
    'linear-gradient(135deg,#10b981,#4361ee)',
    'linear-gradient(135deg,#ff6b6b,#8b5cf6)',
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.load(+id);
  }

  private load(id: number): void {
    this.svc.obtener(id).subscribe({
      next: e => { this.equipo.set(e); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  getAvatarColor(index: number): string {
    return this.avatarColors[index % this.avatarColors.length];
  }

  confirmDelete(): void {
    const e = this.equipo();
    if (!e) return;
    this.deleting.set(true);
    this.svc.eliminar(e.id).subscribe({
      next: () => {
        this.toast.show(`Equipo "${e.nombre}" eliminado`, 'success');
        this.router.navigate(['/equipos']);
      },
      error: () => { this.toast.show('Error al eliminar', 'error'); this.deleting.set(false); }
    });
  }
}
