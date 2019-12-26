import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(arreglo: any[], texto : string,filterMetadata : any, columna:string): any [] {

    if(texto === ''){
      filterMetadata.count = arreglo.length;
      return arreglo;
    }

    texto = texto.toLowerCase();
    let filterArreglo = arreglo.filter( item =>{
      if (item[columna]!== undefined && item[columna]!== null){
        return item[columna].toLowerCase().includes(texto);
      }
     
  });
  if(filterArreglo!== undefined){
    filterMetadata.count = filterArreglo.length;
  }
    
    return filterArreglo;
    
  }

}
