import { Component, OnInit, NgZone } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { LoadingController, AlertController, PopoverController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { UserService } from '../user.service';
import { GoogletranslateService } from '../services/googletranslate.service';
import { TranslateService } from '@ngx-translate/core';
import { Servidor } from '../entities/Servidor';
import { PopinfoComponent } from '../components/popinfo/popinfo.component';
import { Infraestructura } from '../entities/Enumeradores';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.page.html',
  styleUrls: ['./resumen.page.scss'],
})
export class ResumenPage implements OnInit {
  initDateStr: string;
  endDateStr: string;
  initDate: Date;
  endDate: Date;
  infraTipo: any;
  lstSucursales = new Array<Servidor>();
  ipServer : string;
  txtSucursal: any;
  strSelectedIp: string;
  resultStr: string = "";
  currentDate: Date;
  constructor(  public api: RestApiService, 
                public loadingController: LoadingController,
                public datepipe: DatePipe,
                public usrservice : UserService,
                public alertController : AlertController,
                public googleTransApi : GoogletranslateService,
                private zone:NgZone,
                private popoverCtrl : PopoverController,
                public translate : TranslateService) { }

  ngOnInit() {
    this.currentDate = new Date();

    this.initDateStr = this.currentDate.getFullYear()+ "-" + (this.currentDate.getMonth()+1) + "-" +  this.currentDate.getDate();
    this.endDateStr = this.currentDate.getFullYear()+ "-" + (this.currentDate.getMonth()+1) + "-" +  this.currentDate.getDate();
   
     this.initDate = new Date();
     this.endDate = new Date();  
     this.infraTipo = this.usrservice.getEmpresa().Infraestructura;
     
     this.lstSucursales = this.usrservice.getServidores()  ;
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
    
     
    
     return true;
}
  async getData() {
    if(!this.validateForm()){
      return;
    }
    let valorLoading = "";
    this.translate.get('TABS_FACTURAS.alert_cargando').subscribe(
      value => {
        
       valorLoading = value;
      }
    )
    const loading = await this.loadingController.create({
      message: valorLoading,
    });
    await loading.present();
    let initDateFormated =this.datepipe.transform(this.initDateStr, 'yyyy-MM-dd');
    let finalDateFormated =this.datepipe.transform(this.endDateStr, 'yyyy-MM-dd');
   

    this.api.getResumen(initDateFormated,finalDateFormated,this.strSelectedIp,this.infraTipo)
      .subscribe(res => {
        console.log(res);
        this.resultStr = res[0];
        
        loading.dismiss();

      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }
  search(){
    this.getData();
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
