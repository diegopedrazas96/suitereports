import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {

  languages = [];
  selected = "";
  constructor(public languageservice: LanguageService,public userservice:UserService,public router: Router) { }

  ngOnInit() {
    this.languages = this.languageservice.getLanguages();
    console.log(this.languages);
    this.selected = this.languageservice.selected;

  }

  select(lng){
    this.selected = lng;
    this.languageservice.setLanguage(lng)
    this.userservice.setIdioma(lng);
  }

  continuar(){

    this.router.navigate(['/tabs']);	
  }
}
