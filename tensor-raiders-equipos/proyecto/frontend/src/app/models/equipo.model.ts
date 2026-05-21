export type Nivel = 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO' | 'EXPERTO';

export interface Equipo {
  id: number;
  nombre: string;
  nivel: Nivel;
  descripcion: string;
  participantes: string[];
  numParticipantes: number;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface EquipoRequest {
  nombre: string;
  nivel: Nivel;
  descripcion?: string;
  participantes: string[];
}

export interface Estadisticas {
  totalEquipos: number;
  porNivel: Record<Nivel, number>;
}

export const NIVELES: Nivel[] = ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO', 'EXPERTO'];

export const NIVEL_CONFIG: Record<Nivel, { label: string; color: string }> = {
  PRINCIPIANTE: { label: 'Principiante', color: 'var(--principiante)' },
  INTERMEDIO:   { label: 'Intermedio',   color: 'var(--intermedio)' },
  AVANZADO:     { label: 'Avanzado',     color: 'var(--avanzado)' },
  EXPERTO:      { label: 'Experto',      color: 'var(--expert)' },
};
