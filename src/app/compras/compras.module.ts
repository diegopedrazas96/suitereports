import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComprasPage } from './compras.page';
import { PopinfoComponent } from '../components/popinfo/popinfo.component';
import { PopinfosucursalComponent } from '../components/popinfosucursal/popinfosucursal.component';
import { ComponentsModule } from '../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: ComprasPage
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
    RouterModule.forChild(routes)
  ],
  declarations: [ComprasPage]
})
export class ComprasPageModule {}
