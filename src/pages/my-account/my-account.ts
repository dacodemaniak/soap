import { HomePage } from './../home/home';

import { AccountInterface } from './../../shared/interfaces/account-interface';
import { RemoteDataServiceProvider } from './../../providers/remote-data-service/remote-data-service';
import { LocalDataServiceProvider } from './../../providers/local-data-service/local-data-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ToSpeechProvider } from './../../providers/to-speech/to-speech';
import { Toast } from '@ionic-native/toast';

/**
 * Generated class for the MyAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
})
export class MyAccountPage {

  private _account: AccountInterface;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localDataService: LocalDataServiceProvider,
    private remoteDataService: RemoteDataServiceProvider,
    private textToSpeech: ToSpeechProvider,
    private translateService: TranslateService,
    private toast: Toast) {
      this.localDataService.getAccount().then((data) => {
        this._account = data;
      })
  }

  /**
   * Détermine si on peut accéder à la vue courante
   */
  public ionViewCanEnter() {
    return new Promise((resolve, reject) => {
      if (this.localDataService.hasAccount()) {
        resolve(true);
      } else {
        reject(false);
        this.toast.show(
          this.translateService.instant('myAccount.noAccount'),
          '5000',
          'center'
        ).subscribe((toast) => {
          this.navCtrl.setRoot(HomePage);
        });

      }
    })
  }

  /**
   * Après chargement de la page...
   */
  public ionViewDidLoad() {
    this.textToSpeech.sayHello(
      this._account.forname
    );
  }

}
