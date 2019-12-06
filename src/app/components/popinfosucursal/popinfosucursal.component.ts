import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { UserService } from 'src/app/user.service';
import { Sucursal } from 'src/app/entities/Sucursal';

@Component({
  selector: 'app-popinfosucursal',
  templateUrl: './popinfosucursal.component.html',
  styleUrls: ['./popinfosucursal.component.scss']
})
export class PopinfosucursalComponent implements OnInit {

  constructor(public popoverCtrl: PopoverController,public usrService : UserService) { }

  items : Array<Sucursal>;
  ngOnInit() {
    this.items = this.usrService.getSucursales();
  }

  onClick( valor: Sucursal){

     // console.log(valor);
    this.popoverCtrl.dismiss({item : valor});
  }
 
}
