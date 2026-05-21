import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { EquipoService } from '../../services/equipo.service';
import { ToastService } from '../../services/toast.service';
import { NIVELES, NIVEL_CONFIG } from '../../models/equipo.model';

@Component({
  selector: 'app-equipo-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="form-page">
      <div class="form-header">
        <a class="btn btn-ghost btn-sm back-btn" routerLink="/equipos">← Volver</a>
        <div>
          <h1 class="page-title">
            {{ editId() ? 'Editar' : 'Nuevo' }} <span class="accent">Equipo</span>
          </h1>
          <p class="page-subtitle">{{ editId() ? 'Modifica los datos del equipo' : 'Registra un nuevo equipo' }}</p>
        </div>
      </div>

      @if (loadingEdit()) {
        <div class="spinner"></div>
      } @else {
        <form class="card-form" [formGroup]="form" (ngSubmit)="onSubmit()">

          <div class="form-grid">
            <!-- Nombre -->
            <div class="form-group full">
              <label class="form-label">Nombre del equipo *</label>
              <input class="form-input" formControlName="nombre" type="text" placeholder="Ej: Alpha Squad">
              @if (f['nombre'].invalid && f['nombre'].touched) {
                <div class="form-error">{{ getError('nombre') }}</div>
              }
            </div>

            <!-- Nivel -->
            <div class="form-group">
              <label class="form-label">Nivel *</label>
              <select class="form-select" formControlName="nivel">
                <option value="" disabled>Selecciona un nivel</option>
                @for (n of niveles; track n) {
                  <option [value]="n">{{ nivelConfig[n].label }}</option>
                }
              </select>
              @if (f['nivel'].invalid && f['nivel'].touched) {
                <div class="form-error">El nivel es obligatorio</div>
              }
            </div>

            <!-- Descripción -->
            <div class="form-group full">
              <label class="form-label">Descripción</label>
              <textarea class="form-textarea" formControlName="descripcion" placeholder="Describe el equipo, sus objetivos…"></textarea>
              <div class="char-count">{{ f['descripcion'].value?.length ?? 0 }}/300</div>
            </div>

            <!-- Participantes -->
            <div class="form-group full">
              <label class="form-label">Participantes *</label>
              <div class="participant-add">
                <input
                  class="form-input"
                  #pInput
                  type="text"
                  placeholder="Nombre del participante…"
                  (keydown.enter)="$event.preventDefault(); addParticipant(pInput.value); pInput.value=''"
                >
                <button type="button" class="btn btn-ghost" (click)="addParticipant(pInput.value); pInput.value=''">
                  Añadir
                </button>
              </div>
              @if (participantesArray.length > 0) {
                <div class="tags-wrap">
                  @for (p of participantesArray.controls; track $index) {
                    <div class="ptag">
                      {{ p.value }}
                      <span class="ptag-remove" (click)="removeParticipant($index)">✕</span>
                    </div>
                  }
                </div>
              }
              @if (form.get('participantes')?.invalid && form.get('participantes')?.touched) {
                <div class="form-error">Añade al menos un participante</div>
              }
            </div>
          </div>

          <div class="form-actions">
            <a class="btn btn-ghost" routerLink="/equipos">Cancelar</a>
            <button type="submit" class="btn btn-primary" [disabled]="submitting()">
              @if (submitting()) { Guardando… }
              @else { {{ editId() ? '💾 Guardar cambios' : '✅ Crear equipo' }} }
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .form-page { max-width: 700px; }
    .form-header { display: flex; align-items: center; gap: 20px; margin-bottom: 36px; }
    .back-btn { flex-shrink: 0; }
    .page-title { font-size: 32px; font-weight: 800; letter-spacing: -1px; }
    .accent { color: var(--accent); }
    .page-subtitle { font-size: 14px; color: var(--muted); margin-top: 4px; }
    .card-form {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 20px; padding: 40px;
    }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group { display: flex; flex-direction: column; }
    .full { grid-column: 1 / -1; }
    .char-count { font-family: var(--mono); font-size: 11px; color: var(--muted); text-align: right; margin-top: 4px; }
    .participant-add { display: flex; gap: 10px; margin-bottom: 12px; }
    .participant-add .form-input { flex: 1; margin-bottom: 0; }
    .tags-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
    .ptag {
      display: flex; align-items: center; gap: 8px;
      background: var(--surface2); border: 1px solid var(--border);
      border-radius: 20px; padding: 6px 12px;
      font-size: 13px; font-family: var(--mono);
    }
    .ptag-remove { cursor: pointer; color: var(--muted); font-size: 14px; transition: color .2s; }
    .ptag-remove:hover { color: var(--accent3); }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 32px; padding-top: 28px; border-top: 1px solid var(--border); }
    @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } .card-form { padding: 24px; } }
  `]
})
export class EquipoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(EquipoService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly editId = signal<number | null>(null);
  readonly loadingEdit = signal(false);
  readonly submitting = signal(false);
  readonly niveles = NIVELES;
  readonly nivelConfig = NIVEL_CONFIG;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    nivel: ['', Validators.required],
    descripcion: ['', Validators.maxLength(300)],
    participantes: this.fb.array([], Validators.required),
  });

  get f() { return this.form.controls; }
  get participantesArray() { return this.form.get('participantes') as FormArray; }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(+id);
      this.loadForEdit(+id);
    }
  }

  private loadForEdit(id: number): void {
    this.loadingEdit.set(true);
    this.svc.obtener(id).subscribe({
      next: e => {
        this.form.patchValue({ nombre: e.nombre, nivel: e.nivel, descripcion: e.descripcion });
        e.participantes.forEach(p => this.participantesArray.push(this.fb.control(p)));
        this.loadingEdit.set(false);
      },
      error: () => { this.toast.show('No se pudo cargar el equipo', 'error'); this.router.navigate(['/equipos']); }
    });
  }

  addParticipant(name: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (this.participantesArray.value.includes(trimmed)) {
      this.toast.show('Ese participante ya está en el equipo', 'error'); return;
    }
    this.participantesArray.push(this.fb.control(trimmed));
  }

  removeParticipant(index: number): void { this.participantesArray.removeAt(index); }

  getError(field: string): string {
    const c = this.f[field as keyof typeof this.f] as AbstractControl;
    if (c.hasError('required')) return 'Este campo es obligatorio';
    if (c.hasError('minlength')) return `Mínimo ${c.getError('minlength').requiredLength} caracteres`;
    if (c.hasError('maxlength')) return `Máximo ${c.getError('maxlength').requiredLength} caracteres`;
    return '';
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const payload = {
      nombre: this.f['nombre'].value!,
      nivel: this.f['nivel'].value! as any,
      descripcion: this.f['descripcion'].value || undefined,
      participantes: this.participantesArray.value,
    };

    this.submitting.set(true);
    const action = this.editId()
      ? this.svc.actualizar(this.editId()!, payload)
      : this.svc.crear(payload);

    action.subscribe({
      next: e => {
        this.toast.show(this.editId() ? `Equipo "${e.nombre}" actualizado` : `Equipo "${e.nombre}" creado`, 'success');
        this.router.navigate(['/equipos', e.id]);
      },
      error: err => {
        const msg = err.error?.mensaje || (this.editId() ? 'Error al actualizar' : 'Error al crear el equipo');
        this.toast.show(msg, 'error');
        this.submitting.set(false);
      }
    });
  }
}
