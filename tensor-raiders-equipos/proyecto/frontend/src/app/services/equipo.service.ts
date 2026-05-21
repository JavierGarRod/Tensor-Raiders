import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipo, EquipoRequest, Estadisticas, Nivel } from '../models/equipo.model';

@Injectable({ providedIn: 'root' })
export class EquipoService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/equipos';

  listar(buscar?: string, nivel?: Nivel): Observable<Equipo[]> {
    let params = new HttpParams();
    if (buscar) params = params.set('buscar', buscar);
    else if (nivel) params = params.set('nivel', nivel);
    return this.http.get<Equipo[]>(this.base, { params });
  }

  obtener(id: number): Observable<Equipo> {
    return this.http.get<Equipo>(`${this.base}/${id}`);
  }

  crear(equipo: EquipoRequest): Observable<Equipo> {
    return this.http.post<Equipo>(this.base, equipo);
  }

  actualizar(id: number, equipo: EquipoRequest): Observable<Equipo> {
    return this.http.put<Equipo>(`${this.base}/${id}`, equipo);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  estadisticas(): Observable<Estadisticas> {
    return this.http.get<Estadisticas>(`${this.base}/estadisticas`);
  }
}
