import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core'
import { TabsPage } from './tabs.page';

const routes: Routes = [
	{
		path: '',
		component: TabsPage,
		children: [						
			{ path: 'profile', loadChildren: '../profile/profile.module#ProfilePageModule' },					
			{ path: 'ventas', loadChildren: '../ventas/ventas.module#VentasPageModule' },
			{ path: 'facturas', loadChildren: '../facturas/facturas.module#FacturasPageModule' },
			{ path: 'inventario', loadChildren: '../inventario/inventario.module#InventarioPageModule' },
			{ path: 'reportpage', loadChildren: '../reportpage/reportpage.module#ReportpagePageModule' },
			{ path: 'resumen', loadChildren: '../resumen/resumen.module#ResumenPageModule' },
			{ path: 'compras', loadChildren: '../compras/compras.module#ComprasPageModule' },
		]
	}	
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TabsRoutingModule { }
  