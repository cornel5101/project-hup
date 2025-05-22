import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './layout/main/main.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'list-projects',
        loadComponent: () =>
          import('./features/project/list-projects/list-projects.component').then(m => m.ListProjectsComponent)
      },
      {
        path: 'list-tasks',
        loadComponent: () =>
          import('./features/task/list-tasks/list-tasks.component').then(m => m.ListTasksComponent)
      },
      {
        path: 'list-users',
        loadComponent: () =>
          import('./features/users/users.component').then(m => m.UsersComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }