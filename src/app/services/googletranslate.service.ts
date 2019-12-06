
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class GoogletranslateService {

  constructor(private _http: HttpClient) { }

  translate(obj: GoogleObj) {
    return this._http.post(url , obj);
  }
}
const url = 'https://translation.googleapis.com/language/translate/v2?key=AIzaSyDONnlXJGAuK90eeEBR1MMbKThrvIARgtQ';

export class GoogleObj {
  q: string[];
  readonly source: string = 'es';
  target: string = 'en';
  readonly format: string = 'text';

  constructor() {}
}
