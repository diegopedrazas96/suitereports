import { Component, OnInit, ViewChild, ElementRef ,NgZone, ViewChildren} from '@angular/core';
import { LoadingController, AlertController, PopoverController } from '@ionic/angular';
import { RestApiService } from '../services/rest-api.service';
import { DatePipe } from '@angular/common'
import { Chart } from "chart.js";
import { GoogletranslateService, GoogleObj } from '../services/googletranslate.service';
import { UserService } from '../user.service';
import { PopinfoComponent } from '../components/popinfo/popinfo.component';
import { ThrowStmt } from '@angular/compiler';
import {Empresa} from '../entities/Empresa';
import { Servidor } from '../entities/Servidor';
import { TranslateService } from '@ngx-translate/core';
import { Infraestructura } from '../entities/Enumeradores';
import { PopinfosucursalComponent } from '../components/popinfosucursal/popinfosucursal.component';
import { Sucursal } from '../entities/Sucursal';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})

export class VentasPage implements OnInit {
  @ViewChild("lineCanvas") lineCanvas: ElementRef;
  @ViewChild('initDateTime') initDateTime;
  @ViewChildren('myVar') createdItems;
  data1: any;
  data2: any;
  data3: any;
  data4: any;
  rows:any;
  chartDataInfo :any;
  public initDate: Date;
  public initDateStr: string;
  public endDateStr: string;
  public endDate : Date;
  public sumTotal: number = 0;
  selectValue : any;
  searchText: string = "";
 public groupedList : any;
 public groupedKeyList  : any;
  lstSucursales = new Array<Servidor>();
  lstSucursalesLocales = new Array<Sucursal>();
  tablestyle = 'bootstrap';
  ipServer : string;
  nameServer : string;
  txtSucursal:string = "";
  strSelectedIp : string = "";
  infraTipo : string = ""
  txtIdSucursalInterna:string = "vacio";
  txtNombreSucursalInterna:string = "";
  filterMetadata = { count: 0 };
  constructor(public api: RestApiService, 
              public loadingController: LoadingController,
              public datepipe: DatePipe,
              public usrservice : UserService,
              public alertController : AlertController,
              public googleTransApi : GoogletranslateService,
              private zone:NgZone,
              private popoverCtrl : PopoverController,
              public translate : TranslateService) {}

  ngOnInit() {
    this.zone = new NgZone({ enableLongStackTrace: false });
   this.initDateStr = new Date().toISOString();
   this.endDateStr = new Date().toISOString();
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
    let initDateFormated =this.datepipe.transform(this.initDateStr, 'yyyy-MM-dd');
    let finalDateFormated =this.datepipe.transform(this.endDateStr, 'yyyy-MM-dd');
   

    this.api.getVentas(initDateFormated,finalDateFormated,this.strSelectedIp,this.infraTipo,this.txtIdSucursalInterna)
      .subscribe(res => {
        console.log(res);
        this.rows = res[0];

        let grouped = this.groupBy(this.rows, row => row.Grupo);
                    
        this.rows.forEach(element => {
            this.sumTotal = element.SubTotal + this.sumTotal;
        });
        console.log(this.createdItems.toArray().length);       
        this.groupedKeyList =   Array.from(grouped.keys());
        this.groupedList = grouped;
        
       /* this.zone.run(() => {
          this.groupedKeyList.forEach(keyElement => {
            let valor : string = "Valor Otro";
            keyElement = valor;           
          });

        });*/
       
        console.log("List Despues Traducir FOR EACH" + this.groupedKeyList);    
      
        
        if(this.usrservice.getUsuario().idioma !== "es"){

          if(this.rows === undefined || this.rows.length ===0  ){
            this.showAlert("No existen datos para traducir!", "");
    
          }else{
            this.groupedKeyList.forEach(keyElement => {
              let array = this.groupedList.get(keyElement);
              
              /*
              let objGoogleMaster: GoogleObj = new GoogleObj();
              objGoogleMaster.q = keyElement;
              objGoogleMaster.target = this.usrservice.getUsuario().idioma;
              this.googleTransApi.translate(objGoogleMaster).subscribe(
                  (res: any) => {
                    const index = this.groupedKeyList.findIndex((item) => item === keyElement);
                    this.groupedKeyList[index] =  res.data.translations[0].translatedText; 
                   // keyElement = res.data.translations[0].translatedText;                
                  },
                  err => {
                    console.log(err);
                  });*/
                  
              array.forEach(element => {
                let objGoogle: GoogleObj = new GoogleObj();
                objGoogle.q = [element.Producto.trim()];
                objGoogle.target = this.usrservice.getUsuario().idioma;
                 this.googleTransApi.translate(objGoogle).subscribe(
                    (res: any) => {
                      element.Producto = res.data.translations[0].translatedText;                                     
                    },
                    err => {
                      console.log(err);
                    });
              });        
            }); 

           /* this.groupedKeyList.forEach(keyElement => {
                let objGoogleMaster: GoogleObj = new GoogleObj();
                objGoogleMaster.q = keyElement;
                objGoogleMaster.target = this.usrservice.getUsuario().idioma;
                this.googleTransApi.translate(objGoogleMaster).subscribe(
                    (res: any) => {
                      const index = this.groupedKeyList.findIndex((item) => item === keyElement);
                      this.groupedKeyList[index] =  res.data.translations[0].translatedText; 
                    // keyElement = res.data.translations[0].translatedText;                
                    },
                    err => {
                      console.log(err);
                    });
              });
         
              console.log("List Despues Traducir FOR EACH" + this.groupedKeyList); */     
            // Traduccion para uno solo
            /*this.rows.forEach(element => {
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
            });*/
          }
          
        }
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
