import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { VentasPage } from './ventas.page';
import { ComponentsModule } from '../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../pipes/pipes.module';
import { PopinfoComponent } from '../components/popinfo/popinfo.component';
import { PopinfosucursalComponent } from '../components/popinfosucursal/popinfosucursal.component';

const routes: Routes = [
  {
    path: '',
    component: VentasPage
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
    TranslateModule,
    PipesModule,
    NgxDatatableModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VentasPage]
})
export class VentasPageModule {}
