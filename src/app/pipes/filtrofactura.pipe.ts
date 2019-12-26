import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrofactura'
})
export class FiltrofacturaPipe implements PipeTransform {

  transform(arreglo: any[], texto : string,filterMetadata : any, columna:string,columna2:string): any [] {

    if(texto === ''){
      filterMetadata.count = arreglo.length;
      return arreglo;
    }

    texto = texto.toLowerCase();
    let filterArreglo = arreglo.filter( item =>{
      if(item[columna] !== null && item[columna2] !== null){
          return item[columna].toLowerCase().includes(texto) ||  item[columna2].toLowerCase().includes(texto);
      }
    });
    
  if(filterArreglo!== undefined){
    filterMetadata.count = filterArreglo.length;
  }
    
    return filterArreglo;
  }

}
