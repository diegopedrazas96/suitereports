import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../user.service';
import { text } from '@angular/core/src/render3';


@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = "";
  constructor(private translate : TranslateService,private userService : UserService) { }


  setInitialAppLanguage(){
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);

    let usuario = this.userService.getUsuario();
    if(usuario.idioma !== undefined){
        this.setLanguage(usuario.idioma);
        this.selected = usuario.idioma;
    }
  }
  getLanguages(){
    return [
         { text: 'Español',value:'es',img:"../../assets/img/espana.png"},
         { text: 'Ingles',value:'en',img:"../../assets/img/eeuu.png"},
         { text: 'Chino',value:'zh',img:'../../assets/img/china.png'}
    ];
  }
  setLanguage(lng) {
    this.translate.use(lng);
    this.selected = lng;
    this.userService.setIdioma(lng);
  
  }
}
