import { Component, OnInit, ViewChildren } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { LoadingController, PopoverController, AlertController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Servidor } from '../entities/Servidor';
import { UserService } from '../user.service';
import { GoogletranslateService, GoogleObj } from '../services/googletranslate.service';
import { PopinfoComponent } from '../components/popinfo/popinfo.component';
import { TranslateService } from '@ngx-translate/core';
import { PopinfosucursalComponent } from '../components/popinfosucursal/popinfosucursal.component';
import { Infraestructura } from '../entities/Enumeradores';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.page.html',
  styleUrls: ['./facturas.page.scss'],
})
export class FacturasPage implements OnInit {
  @ViewChildren('myVar') createdItems;
  
  data1: any;
  data2: any;
  data3: any;
  data4: any;
  rows:any;
  public initDate: String;
  public endDate : String;
  public sumTotal: number = 0;
  lstSucursales = new Array<Servidor>();
  txtSucursal:string = "";
  strSelectedIp : string = "";
  tablestyle = 'bootstrap';
  searchText: string = "";
  txtIdSucursalInterna: string = "vacio";
  txtNombreSucursalInterna : string = "";
  infraTipo: string = "";
  constructor(public api: RestApiService, 
              public loadingController: LoadingController,
              public datepipe: DatePipe,
              public usrservice:UserService,
              private popoverCtrl : PopoverController,
              public alertController : AlertController,
              public googleTransApi : GoogletranslateService,
              public translate: TranslateService) { }

  ngOnInit() {
    this.initDate = new Date().toISOString();
    this.endDate = new Date().toISOString();
    this.lstSucursales = this.usrservice.getServidores();
    this.infraTipo = this.usrservice.getEmpresa().Infraestructura;
     
  }

  async mostrarPopSucursal(evento){
    const popover = await this.popoverCtrl.create({
        component : PopinfosucursalComponent,
        event: evento,
        mode : 'ios',
        backdropDismiss : false

    });

    popover.onWillDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
      
        this.txtIdSucursalInterna = dataReturned.data.item.IdSucursal;
        this.txtNombreSucursalInterna = dataReturned.data.item.Descripcion;
       // this.strSelectedIp = dataReturned.data.item.dirIP  + ":" + dataReturned.data.item.Puerto;

      }
    });

   await popover.present();

  }
  async mostrarPop(evento){
    const popover = await this.popoverCtrl.create({
        component : PopinfoComponent,
        event: evento,
        mode : 'ios',
        backdropDismiss : false

    });

    popover.onWillDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
      
        this.txtSucursal = dataReturned.data.item.Nombre;
        this.strSelectedIp = dataReturned.data.item.dirIP + ":" + dataReturned.data.item.Puerto;
      }
    });

   await popover.present();

  }
  buscar( event ){
    this.searchText = event.detail.value;
  }
  search(){
    this.getData();
  }

  validateForm() : boolean{
    // Valida el servidor
    if(this.lstSucursales.length === 1){
      this.strSelectedIp = this.lstSucursales[0].dirIP + ":" + this.lstSucursales[0].Puerto;
    }else{
      if(this.strSelectedIp.length ===0){
        this.translate.get('TABS_FACTURAS.alert_suc').subscribe(
          value => {this.showAlert(value, "");});
          
        return false;
        }
    }
    if(this.infraTipo === Infraestructura[Infraestructura.Centralizado]){
      if(this.txtIdSucursalInterna.length ===0){
        this.translate.get('TABS_FACTURAS.alert_suc').subscribe(
          value => {this.showAlert(value, "");});
          
        return false;
        }
     }
    
    
     return true;
}
  async getData() {

  if(!this.validateForm()){
    return;
  }
  let valorLoading = "";
  this.translate.get('TABS_FACTURAS.alert_cargando').subscribe(
    value => {
      // value is our translated string
     // let alertTitle = value;
     valorLoading = value;
    }
  )

    const loading = await this.loadingController.create({
      message: valorLoading,
    });
    await loading.present();
    let initDateFormated =this.datepipe.transform(this.initDate, 'yyyy-MM-dd');
    let finalDateFormated =this.datepipe.transform(this.endDate, 'yyyy-MM-dd');
 

    this.api.getFacturas(initDateFormated,finalDateFormated,this.strSelectedIp,this.infraTipo,this.txtIdSucursalInterna)
      .subscribe(res => {
        console.log(res);
        this.rows = res[0];
        this.rows.forEach(element => {
            this.sumTotal = element.ImporteNeto + this.sumTotal;
        });
        console.log(this.createdItems.toArray().length);
       /* if(this.usrservice.getUsuario().idioma !== "es"){

          if(this.rows === undefined || this.rows.length ===0  ){
            this.showAlert("No existen datos para traducir!", "");
    
          }else{
            
            // Traduccion para uno solo
            this.rows.forEach(element => {
              let objGoogle: GoogleObj = new GoogleObj();
              objGoogle.q = element.Producto;
              objGoogle.target = this.usrservice.getUsuario().idioma;
               this.googleTransApi.translate(objGoogle).subscribe(
                  (res: any) => {
                    element.Producto = res.data.translations[0].translatedText;                
                  },
                  err => {
                    console.log(err);
                  });
            });
          }
          
        }*/
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  async showAlert(header:string,message:string) {

		const alert = await this.alertController.create({
		  header,
		  message,
		  buttons: ['OK']
		});
	
		await alert.present();
	  }
}
