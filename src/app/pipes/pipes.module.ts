import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroPipe } from './filtro.pipe';
import { FiltrofacturaPipe } from './filtrofactura.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
  declarations: [FiltroPipe, FiltrofacturaPipe, SafeHtmlPipe],
  exports:[FiltroPipe,FiltrofacturaPipe,SafeHtmlPipe],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
