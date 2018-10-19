import { Component } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { LocalDataServiceProvider } from './../../providers/local-data-service/local-data-service';
import { BarcodeServiceProvider } from './../../providers/barcode-service/barcode-service';

import { AccountPage } from './../account/account';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private translateService: TranslateService,
    private localDataService: LocalDataServiceProvider,
    private barcodeService: BarcodeServiceProvider)
  {

  }

  public ionViewCanEnter() {
    const dataService = this.localDataService;
    return new Promise((resolve) => {
      dataService.init().then(() => {
        console.log('Récupération du compte terminée');
        resolve(true);
      });
    })
  }

  /**
   * Après le chargement de la page...
   */
  public ionViewDidLoad(){
    console.log('Home : Vérification du compte local');
    if (!this.localDataService.hasAccount()) {
      // Affichage du dialogue de choix : Signin / Signup
      const SignAlert = this.alertCtrl.create({
        title: this.translateService.instant('home.sign.title'),
        message: this.translateService.instant('home.sign.msg'),
        buttons: [
          {
            text: this.translateService.instant('home.sign.signin'),
            handler: () => {
              // Go to login page
            }
          },
          {
            text: this.translateService.instant('home.sign.signup'),
            handler: () => {
              // Go to account page
              const accountModal = this.modalCtrl.create(
                AccountPage,
                {}
              );
              accountModal.present();
            }
          }
        ]

      });
      SignAlert.present();
    }
  }

  public scan(): void {
    this.barcodeService.scan().then((barcodeResult) => {
      if (!barcodeResult.cancelled) {
        // Chercher le produit concerné
        console.log('Récupère le produit concerné : ' + barcodeResult.text);
      }
    });
  }

}
