import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertchartComponent } from './alertchart/alertchart.component';
import { IonicModule } from '@ionic/angular';
import { PopinfoComponent } from './popinfo/popinfo.component';
import { PopinfosucursalComponent } from './popinfosucursal/popinfosucursal.component';

@NgModule({
  declarations: [AlertchartComponent, PopinfoComponent, PopinfosucursalComponent],
  exports:[AlertchartComponent,PopinfoComponent,PopinfosucursalComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ComponentsModule { }
