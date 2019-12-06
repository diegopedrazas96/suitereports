import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import {UserService}  from '../user.service';


const apiUrl = "http://localhost/megav2/";
const params = {};
const headers = new Headers({"Content-type":"application/json",
                "Access-Control-Allow-Origin" : "*",
              "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE"});
             // headers = new Headers({'user-key': '1234567890123'});
@Injectable({
  providedIn: 'root'
})



export class RestApiService {

  
  constructor(private http: HttpClient,private nativeHttp : HTTP,private usrService : UserService ) { }

 
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }


  getData(): Observable<any> {
    //let headers = new HttpHeaders();
    //headers.append()
    let response1 = this.http.get(apiUrl+'api/product/list');
    let servers = this.usrService.getServidores();
    //let response2= this.http.get(apiUrl+'IN/110001');
   // let response3 = this.http.get(apiUrl+'BR/01000-000');
    //let response4 = this.http.get(apiUrl+'FR/01000');
    //return forkJoin([response1, response2, response3, response4]);
    return forkJoin([response1]);
  }

  getVentas(initDate : string,finalDate:string,strIp : string,strInfraestructura : string,strIdSucursal : string): Observable<any> {
    //let headers = new HttpHeaders();
    //headers.append()
    //let response1 = this.http.get(apiUrl+'api/product/list');
    let response1 ;
    //let servers = this.usrService.getServidores();
    let objEmpresa = this.usrService.getEmpresa();

    try {
      response1 = this.http.get("http://"+strIp+'/megav2/api/ionicreports/ventas/'+objEmpresa.Tipo+'/'+initDate + '/'+finalDate+'/'+strInfraestructura+'/'+strIdSucursal);
     } catch (error) {
       console.log(error.message);
     }
    /*servers.forEach(element => {
        
    });*/

    
    //let response2= this.http.get(apiUrl+'IN/110001');
   // let response3 = this.http.get(apiUrl+'BR/01000-000');
    //let response4 = this.http.get(apiUrl+'FR/01000');
    //return forkJoin([response1, response2, response3, response4]);
    return forkJoin([response1]);
  }

  getFacturas(initDate : string,finalDate:string,strIp : string,strInfraestructura:string , strIdSucursal): Observable<any> {
   
    let response1 ;
    let servers = this.usrService.getServidores();
    
    try {
      response1 = this.http.get("http://"+strIp+'/megav2/api/ionicreports/facturas/'+initDate + '/'+finalDate + '/'+strInfraestructura+'/'+strIdSucursal);
     } catch (error) {
       console.log(error.message);
     }
    return forkJoin([response1]);
  }

  getSucursalesCentrales(strIp : string): Observable<any> {
   
    let response1 ;
    //let servers = this.usrService.getServidores();
    
    try {
      response1 = this.http.get("http://"+strIp+'/megav2/api/sucursal/');
     } catch (error) {
       console.log(error.message);
     }
    return forkJoin([response1]);
  }


  getInventario(dirIP:String,strTipo:string , strIdSucursal): Observable<any> {
    
    let response1 ;
    let servers = this.usrService.getServidores();
    let objEmpresa = this.usrService.getEmpresa();
    try {
      response1 = this.http.get("http://"+dirIP+'/megav2/api/ionicreports/inventario/'+strTipo+'/'+strIdSucursal);
     } catch (error) {
       console.log(error.message);
     }
   

    return forkJoin([response1]);
  }
  getDataServer(serverUrl:string): Observable<any> {
    let response1 = this.http.get(apiUrl+'US/00210');
    let response2= this.http.get(apiUrl+'IN/110001');
    let response3 = this.http.get(apiUrl+'BR/01000-000');
    let response4 = this.http.get(apiUrl+'FR/01000');
    return forkJoin([response1, response2, response3, response4]);
  }



}




