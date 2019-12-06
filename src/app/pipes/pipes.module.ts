import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroPipe } from './filtro.pipe';
import { FiltrofacturaPipe } from './filtrofactura.pipe';

@NgModule({
  declarations: [FiltroPipe, FiltrofacturaPipe],
  exports:[FiltroPipe,FiltrofacturaPipe],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
