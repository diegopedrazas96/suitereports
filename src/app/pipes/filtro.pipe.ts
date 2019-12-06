import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(arreglo: any[], texto : string,filterMetadata : any, columna:string): any [] {

    if(texto === ''){
      return arreglo;
    }

    texto = texto.toLowerCase();
    arreglo.filter( item =>{
      return item[columna].toLowerCase().includes(texto);
  });
  if(arreglo!== undefined){
    filterMetadata.count = arreglo.length;
  }
    
    return arreglo;
    
  }

}
