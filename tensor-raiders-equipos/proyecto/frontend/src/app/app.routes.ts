import { Routes } from '@angular/router';
import { EquipoListComponent } from './components/equipo-list/equipo-list.component';
import { EquipoFormComponent } from './components/equipo-form/equipo-form.component';
import { EquipoDetailComponent } from './components/equipo-detail/equipo-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'equipos', pathMatch: 'full' },
  { path: 'equipos', component: EquipoListComponent },
  { path: 'equipos/nuevo', component: EquipoFormComponent },
  { path: 'equipos/:id', component: EquipoDetailComponent },
  { path: 'equipos/:id/editar', component: EquipoFormComponent },
  { path: '**', redirectTo: 'equipos' },
];
