import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GeneralTableComponent } from './features/general-table/general-table.component';

const routes: Routes = [
  { path: '', redirectTo: '/general-table', pathMatch: 'full' } ,

  { path: 'general-table', component: GeneralTableComponent },

  {
    path: 'brief-info',
    loadComponent: () =>
      import('./features/brief-information/brief-information.component').then(
        (module) => module.BriefInformationComponent
      )
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
