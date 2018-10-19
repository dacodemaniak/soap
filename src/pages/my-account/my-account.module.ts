import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyAccountPage } from './my-account';
import { LocalDataServiceProvider } from './../../providers/local-data-service/local-data-service';
import { RemoteDataServiceProvider } from '../../providers/remote-data-service/remote-data-service';

@NgModule({
  declarations: [
    MyAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(MyAccountPage),
  ],
  providers: [
    LocalDataServiceProvider,
    RemoteDataServiceProvider
  ]
})
export class MyAccountPageModule {}
