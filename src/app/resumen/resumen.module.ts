import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ResumenPage } from './resumen.page';
import { PopinfoComponent } from '../components/popinfo/popinfo.component';
import { PopinfosucursalComponent } from '../components/popinfosucursal/popinfosucursal.component';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../components/components.module';
import { PipesModule } from '../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: ResumenPage
  }
];

@NgModule({
  entryComponents:[
    PopinfoComponent,PopinfosucursalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ComponentsModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ResumenPage]
})
export class ResumenPageModule {}
