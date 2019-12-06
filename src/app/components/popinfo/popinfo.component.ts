import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { UserService } from 'src/app/user.service';
import { Empresa } from 'src/app/entities/Empresa';
import { Servidor } from 'src/app/entities/Servidor';

@Component({
  selector: 'app-popinfo',
  templateUrl: './popinfo.component.html',
  styleUrls: ['./popinfo.component.scss']
})
export class PopinfoComponent implements OnInit {

  constructor(public popoverCtrl: PopoverController,public usrService : UserService) { }

  items : Array<Servidor>;
  ngOnInit() {
    this.items = this.usrService.getServidores();
  }

  onClick( valor: Servidor){

     // console.log(valor);
    this.popoverCtrl.dismiss({item : valor});
  }
 

}
