import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrofactura'
})
export class FiltrofacturaPipe implements PipeTransform {

  transform(arreglo: any[], texto : string, columna:string,columna2:string): any [] {

    if(texto === ''){
      return arreglo;
    }

    texto = texto.toLowerCase();
    return arreglo.filter( item =>{
      if(item[columna] !== null && item[columna2] !== null){
          return item[columna].toLowerCase().includes(texto) ||  item[columna2].toLowerCase().includes(texto);
      }
    });
    return null;
  }

}
