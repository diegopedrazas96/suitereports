import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { Usuario} from '../entities/Usuario'
import { Empresa} from '../entities/Empresa'
import { Servidor} from '../entities/Servidor'


@Component({
	selector: 'app-page',
	templateUrl: './profile.page.html',
	styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
	
	usuario : Usuario

	constructor( private user: UserService, private router: Router) {
		this.usuario = user.getUsuario();
		console.log(this.usuario);
	}


	ngOnInit() {
	}

	ngOnDestroy() {
		
	}


	closeSesion(){
		this.user.setUser(undefined);
		this.router.navigate(['/login']);
	}
	/*goTo(postID: string) {

		this.router.navigate(['/tabs/post/' + postID.split('/')[0]])
	}*/

	
}
