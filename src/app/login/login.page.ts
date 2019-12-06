import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import {AngularFireFunctions} from '@angular/fire/functions';
import {AlertController} from '@ionic/angular';
import { Usuario } from '../entities/Usuario';
import { Empresa } from '../entities/Empresa';
import { Servidor } from '../entities/Servidor';
import { GoogletranslateService, GoogleObj } from '../services/googletranslate.service';
import { LanguageService } from '../services/language.service';
import { Infraestructura } from '../entities/Enumeradores';
import { RestApiService } from '../services/rest-api.service';
import { Sucursal } from '../entities/Sucursal';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

	username: string = ""
	password: string = ""
	public busy : boolean;

	constructor(public alertController: AlertController, 
				public user: UserService, 
				public aff: AngularFireFunctions,
				public languageservice: LanguageService,
				public gootrans: GoogletranslateService,
				public router: Router,
				public api: RestApiService,) { }

	ngOnInit(): void {
		this.busy = false;
		/*
		let objGoog: GoogleObj = new  GoogleObj();
		objGoog.q = ["Mensaje de Prueba","Texto2"];
		objGoog.target = "zh";
		this.gootrans.translate(objGoog).subscribe(
			(res: any) => {
			  
			  console.log("Resultado:" + res.data.translations[0].translatedText);
			},
			err => {
			  console.log(err);
			}
		  );*/
			
}

async showAlert(header:string,message:string) {

    const alert = await this.alertController.create({
      header,
	  message,
      buttons: ['OK']
    });

    await alert.present();
  }
	async login() {
		const { username, password } = this
		try {
			this.busy = true;
			// kind of a hack. 
			const srvUsers = this.aff.httpsCallable('getUser');
			
			await srvUsers({username: this.username,password : this.password}).toPromise().then(data =>{
				console.log(data);
				if(data.length > 0){
				let dataResult = data[0];	
				console.log(dataResult);
				let usrNew = new Usuario;
				usrNew.IdEmpresa = data[0].IdEmpresa;
				usrNew.usuario = this.username;
				usrNew.IdUsuario = data[0].IdUsuario;
				usrNew.nombre = data[0].Nombre;
				usrNew.idioma = "es";	
				usrNew.multiidioma = data[0].Multiidioma;
				this.user.setUser(usrNew);
				this.languageservice.setInitialAppLanguage();
				this.username = "";
				this.password = "";
						
					
				
				
		   }else{
			this.showAlert("Usuario No Encontrado","");
			this.busy = false;
		   }
		});	
		
		const srvCompany = this.aff.httpsCallable('getCompany');
		await srvCompany({ IdEmpresa: this.user.getUsuario().IdEmpresa }).toPromise().then(data => {
						console.log(data);
						if (data.length > 0) {
							let empresa = new Empresa;
							empresa.IdEmpresa = data[0].IdEmpresa;
							empresa.Descripcion = data[0].Descripcion;
							empresa.Tipo = data[0].Tipo;
							empresa.Infraestructura = data[0].Infraestructura
							this.user.setEmpresa(empresa);
							
						}
						else {
							this.showAlert("Empresa no Encontrada", "");
							this.busy = false;
						}
					});	
					const srvServidores = this.aff.httpsCallable('getServers');
					await srvServidores({ IdEmpresa: this.user.getUsuario().IdEmpresa }).subscribe(data => {
						console.log(data);
						if (data.length > 0) {
							let lstServidores = new Array<Servidor>();
							data.forEach(element => {
								let server = new Servidor();
								server.IdEmpresa = element.IdEmpresa;
								server.IdServidor = element.IdServidor;
								server.dirIP = element.IP;
								server.Nombre = element.Nombre;
								server.Puerto = element.Puerto;
								lstServidores.push(server);
							});
							this.user.setServidores(lstServidores);
							let objInfraestructura = Infraestructura.Centralizado;
							if ( this.user.getEmpresa().Infraestructura === Infraestructura[objInfraestructura]){
								let diriP = this.user.getServidores()[0].dirIP;
								//this.api.getSucursalesCentrales	
								this.api.getSucursalesCentrales(diriP)
								.subscribe(res => {

									console.log(res);
									let lstSucursales = new Array<Sucursal>();
									if (res[0].length > 0) {
										res[0].forEach((item) => {
												let server = new Sucursal();
												server.IdSucursal = item.IdSucursal;
												server.Descripcion = item.Descripcion;
												lstSucursales.push(server);																															
										});
									}
									
									
									this.user.setSucursales(lstSucursales);							  
								}, err => {
									console.log(err);
								});
							}
						}
						else {
							this.showAlert("Servidores no Encontrados!", "");
							this.busy = false;
						}
					});	
					
					this.busy = false;
				this.showAlert("Usuario Correcto","");
				let  usr = this.user.getUsuario();
				if(usr.multiidioma){
					this.router.navigate(['/language']);	
				}else{
					this.router.navigate(['/tabs']);	
				}
		} catch(err) {
			console.dir(err)
			this.busy = false;
			this.showAlert("Error",err.message);
			if(err.code === "auth/user-not-found") {
				console.log("User not found")
			}
		}
	}

}
