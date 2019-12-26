import { Component, OnInit } from '@angular/core';
import { Servidor } from '../entities/Servidor';
import { Sucursal } from '../entities/Sucursal';
import { RestApiService } from '../services/rest-api.service';
import { LoadingController, AlertController, PopoverController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { UserService } from '../user.service';
import { GoogletranslateService } from '../services/googletranslate.service';
import { TranslateService } from '@ngx-translate/core';
import { PopinfoComponent } from '../components/popinfo/popinfo.component';
import { PopinfosucursalComponent } from '../components/popinfosucursal/popinfosucursal.component';
import { Infraestructura } from '../entities/Enumeradores';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.page.html',
  styleUrls: ['./compras.page.scss'],
})

export class ComprasPage implements OnInit {
  rows:any;
  public initDate: Date;
  public initDateStr: string;
  public endDateStr: string;
  public endDate : Date;
  public sumTotal: number = 0;
  public sumTransacciones: number = 0;
  selectValue : any;
  searchText: string = "";
  lstSucursales = new Array<Servidor>();
  lstSucursalesLocales = new Array<Sucursal>();
  ipServer : string;
  nameServer : string;
  txtSucursal:string = "";
  strSelectedIp : string = "";
  infraTipo : string = ""
  txtIdSucursalInterna:string = "vacio";
  txtNombreSucursalInterna:string = "";
  filterMetadata = { count: 0 };
  currentDate: Date;
  createdItems: any;
  constructor(public api: RestApiService, 
              public loadingController: LoadingController,
              public datepipe: DatePipe,
              public usrservice : UserService,
              public alertController : AlertController,
              public googleTransApi : GoogletranslateService,
              private popoverCtrl : PopoverController,
              public translate : TranslateService) {}

  ngOnInit() {
    this.currentDate = new Date();
   this.initDateStr = this.currentDate.getFullYear()+ "-" + (this.currentDate.getMonth()+1) + "-" +  this.currentDate.getDate();
   this.endDateStr = this.currentDate.getFullYear()+ "-" + (this.currentDate.getMonth()+1) + "-" +  this.currentDate.getDate();
    this.initDate = new Date();
    this.endDate = new Date();  
    this.infraTipo = this.usrservice.getEmpresa().Infraestructura;
    
    this.lstSucursales = this.usrservice.getServidores()  ;
    this.lstSucursalesLocales = this.usrservice.getSucursales()  ;

  }

  
  search(){
    this.getData();
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
        this.strSelectedIp = dataReturned.data.item.dirIP  + ":" + dataReturned.data.item.Puerto;
      }
    });

   await popover.present();

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

  groupBy(list, keyGetter) : any {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}
 buscar( event ){
   this.searchText = event.detail.value;
 }
  
 validateForm() : boolean{
        // Valida el servidor
        if(this.lstSucursales !== undefined && this.lstSucursales.length === 1){
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
 groupElement(record,recordIndex,records){
  if ( recordIndex == 0){
    if(record.Proveedor != null || record.Proveedor != undefined){
      return record.Proveedor.toUpperCase();
    }else{
      return null;
    }
    
  }
  let almacenAnt = records[recordIndex - 1].Proveedor;
  let almacenAct = record.Proveedor;
  if ((almacenAnt  !== null || almacenAnt !== undefined) && (almacenAct !== null|| almacenAct !== undefined)){
    if(almacenAnt !== almacenAct){
      return record.Proveedor.toUpperCase(); 
    }
  }

  return null;

}
  async getData() {
    this.sumTotal = 0;
    this.searchText = '';  
    this.sumTransacciones = 0; 
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
    let initDateFormated =this.datepipe.transform(this.initDateStr, 'yyyy-MM-dd');
    let finalDateFormated =this.datepipe.transform(this.endDateStr, 'yyyy-MM-dd');
   

    await this.api.getCompras(this.strSelectedIp,this.infraTipo,this.txtIdSucursalInterna,initDateFormated,finalDateFormated)
      .subscribe(res => {
        console.log(res);
        this.rows = res[0];
        this.filterMetadata.count = this.rows.length;
       /* this.rows.forEach(element => {
          this.sumTotal = element.SubTotal + this.sumTotal;
      });  */   
    
        loading.dismiss();

      }, err => {
        console.log(err);
        loading.dismiss();
      });

      await this.api.getComprasTotal(this.strSelectedIp,this.infraTipo,this.txtIdSucursalInterna,initDateFormated,finalDateFormated)
      .subscribe(res => {
        this.sumTotal = res[0].Total;

        this.sumTransacciones= res[0].Transacciones;
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

