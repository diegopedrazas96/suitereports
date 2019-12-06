import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FacturasPage } from './facturas.page';
import { TranslateModule } from '@ngx-translate/core';
import { PopinfoComponent } from '../components/popinfo/popinfo.component';
import { ComponentsModule } from '../components/components.module';
import { PipesModule } from '../pipes/pipes.module';
import { PopinfosucursalComponent } from '../components/popinfosucursal/popinfosucursal.component';

const routes: Routes = [
  {
    path: '',
    component: FacturasPage
  }
];

@NgModule({
  entryComponents:[
    PopinfoComponent,PopinfosucursalComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    PipesModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FacturasPage]
})
export class FacturasPageModule {}
