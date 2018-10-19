
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyAccountPage } from './my-account';
import { LocalDataServiceProvider } from './../../providers/local-data-service/local-data-service';
import { RemoteDataServiceProvider } from '../../providers/remote-data-service/remote-data-service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    MyAccountPage,
  ],
  imports: [
    MomentModule,
    TranslateModule,
    IonicPageModule.forChild(MyAccountPage),
  ],
  providers: [
    LocalDataServiceProvider,
    RemoteDataServiceProvider,
    TranslateService
  ]
})
export class MyAccountPageModule {}
