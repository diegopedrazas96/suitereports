import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth'
import { UserService } from './user.service';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { ShareModule } from './share.module';
import { AngularFireFunctionsModule, FunctionsRegionToken} from '@angular/fire/functions'
import { environment } from 'src/environments/environment';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { DatePipe } from '@angular/common'
import { ComponentsModule } from './components/components.module';
import { GoogletranslateService } from './services/googletranslate.service';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PipesModule } from './pipes/pipes.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
	  BrowserModule, 
	  IonicModule.forRoot(), 
	  AppRoutingModule,
	  HttpClientModule,
	  TranslateModule.forRoot({
		loader: {
		  provide: TranslateLoader,
		  useFactory: (createTranslateLoader),
		  deps: [HttpClient]
		}
	  }),
	  AngularFireModule.initializeApp(environment.firebase),
	  AngularFireAuthModule,
	  AngularFirestoreModule,
	  ComponentsModule,
	  PipesModule,
	  ShareModule,
	  AngularFireFunctionsModule
	],
  providers: [
    StatusBar,
	SplashScreen,
	DatePipe,
	HTTP,
	{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
	{provide : FunctionsRegionToken , useValue : 'us-central1'},
	UserService,
	TranslateService,
	GoogletranslateService,
	AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
