/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { LehrgangComponent } from './Lehrgang/Lehrgang.component';
import { BerufComponent } from './Beruf/Beruf.component';
import { EinsatzstelleComponent } from './Einsatzstelle/Einsatzstelle.component';

import { AdministratorComponent } from './Administrator/Administrator.component';
import { LernenderComponent } from './Lernender/Lernender.component';
import { KaufmannComponent } from './Kaufmann/Kaufmann.component';
import { AusbildnerComponent } from './Ausbildner/Ausbildner.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Lehrgang', component: LehrgangComponent },
  { path: 'Beruf', component: BerufComponent },
  { path: 'Einsatzstelle', component: EinsatzstelleComponent },
  { path: 'Administrator', component: AdministratorComponent },
  { path: 'Lernender', component: LernenderComponent },
  { path: 'Kaufmann', component: KaufmannComponent },
  { path: 'Ausbildner', component: AusbildnerComponent },
  { path: '**', redirectTo: '/auth/google' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
