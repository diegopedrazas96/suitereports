import { Servidor } from "./Servidor";
import { Empresa } from "./Empresa";
import { Sucursal } from "./Sucursal";
export class Usuario{
    public usuario: string;
	public IdUsuario: number;
	public IdEmpresa:number;
    public nombre : string ;
    public idioma : string ;
    public multiidioma : boolean ;
    public lstServidores : Array<Servidor> ;
    public lstSucursales : Array<Sucursal> ;
    public empresa : Empresa ;
}

