import { Component, OnInit, ViewChild } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { LoadingController, AlertController, PopoverController, IonInfiniteScroll } from '@ionic/angular';
import { UserService } from '../user.service';
import { GoogletranslateService, GoogleObj } from '../services/googletranslate.service';
import { Servidor } from '../entities/Servidor';
import { PopinfoComponent } from '../components/popinfo/popinfo.component';
import { TranslateService } from '@ngx-translate/core';
import { PopinfosucursalComponent } from '../components/popinfosucursal/popinfosucursal.component';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  @ViewChild( IonInfiniteScroll ) infiniteScroll: IonInfiniteScroll;
  public lstResult:any;
  searchText: string = "";
  txtSucursal:string = "";
  strSelectedIp : string = "";
  lstSucursales = new Array<Servidor>();
  public groupedList : any;
  public groupedKeyList  : any;
  infraTipo: string;
  txtIdSucursalInterna: string = "vacio";
  txtNombreSucursalInterna: string = "";
  constructor(public api: RestApiService, 
    public loadingController: LoadingController,
    public usrservice : UserService,
    public alertController : AlertController,
    public googleTransApi : GoogletranslateService,
    private popoverCtrl : PopoverController,
    private translate : TranslateService) { }

ngOnInit() {
  this.lstSucursales = this.usrservice.getServidores() ;
  this.infraTipo = this.usrservice.getEmpresa().Infraestructura;
}

buscar( event ){
  this.searchText = event.detail.value;
}
search(){
    this.getData();
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
      this.strSelectedIp = dataReturned.data.item.dirIP  + ":" + dataReturned.data.item.Puerto;;
    }
  });

 await popover.present();

}
async getData() {

        if(this.lstSucursales.length === 1){
          this.strSelectedIp = this.lstSucursales[0].dirIP + ":" + this.lstSucursales[0].Puerto;
      }else{
        if(this.strSelectedIp.length ===0){
          this.translate.get('TABS_FACTURAS.alert_suc').subscribe(
            value => {
              // value is our translated string
             // let alertTitle = value;
              this.showAlert(value, "");
            }
          )
          return;
        }
        
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
    
      this.api.getInventario(this.strSelectedIp,this.infraTipo,this.txtIdSucursalInterna)
      .subscribe(res => {
            console.log(res);
            this.lstResult = res[0];
            let grouped = this.groupBy(this.lstResult, row => row.IdAlmacen);
            this.groupedKeyList =   Array.from(grouped.keys());
            this.groupedList = grouped;


            if(this.usrservice.getUsuario().idioma !== "es"){

            if(this.lstResult === undefined || this.lstResult.length ===0  ){
                  let valorTranslate = "";
                    this.translate.get('MESSAGES.sin_datos_traducir').subscribe(
                              value => {
                  
                                valorTranslate = value;
                        }
                  )
                  this.showAlert(valorTranslate, "");
            }else{
              this.groupedKeyList.forEach(keyElement => {
                let array = this.groupedList.get(keyElement);
                
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
  
              /*this.groupedKeyList.forEach(keyElement => {
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
                });*/
           
                console.log("List Despues Traducir FOR EACH" + this.groupedKeyList);   
            // Traduccion para uno solo
            /*  this.lstResult.forEach(element => {
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

  loadMoreData(event){
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.lstResult.length == 1000) {
        event.target.disabled = true;
        this.infiniteScroll.disabled = true;
      }
    }, 500);
  } 
}
