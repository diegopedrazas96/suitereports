import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { first } from 'rxjs/operators'
import { auth } from 'firebase/app'
import { Usuario } from './entities/Usuario'
import { Empresa } from './entities/Empresa'
import { Servidor } from './entities/Servidor'
import { Sucursal } from './entities/Sucursal'


interface user {
	usuario: string,
	IdUsuario: number,
	IdEmpresa:number,
	nombre : string
}

@Injectable()
export class UserService {
	private user: Usuario

	constructor(private afAuth: AngularFireAuth) {

	}

	setUser(user: Usuario) {
		this.user = user;
	}
	setEmpresa(empresa: Empresa) {
		this.user.empresa = empresa;
	}

	setServidores(lstServidores: Array<Servidor>) {
		this.user.lstServidores = lstServidores;
	}
	setSucursales(lstSucursales: Array<Sucursal>) {
		this.user.lstSucursales = lstSucursales;
	}
	setIdioma(valor: string) {
		this.user.idioma = valor;
	}
	getServidores() : Array<Servidor> {
		return this.user.lstServidores;
	}
	getSucursales() : Array<Sucursal> {
		return this.user.lstSucursales;
	}
	getEmpresa() {
		return this.user.empresa;
	}
	getUsername(): string {
		return this.user.nombre;
	}
	getUsuario(): Usuario {
		return this.user;
	}

	
	async isAuthenticated() {
		if(this.user !== undefined) return true

		/*const user = await this.afAuth.authState.pipe(first()).toPromise()

		if(user) {
			this.setUser({
				n: user.email.split('@')[0],
				uid: user.uid
			})

			return true
		}*/
		return false
	}

	getUID(): number {
		return this.user.IdUsuario
	}
}