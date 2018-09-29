import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { BarcodeServiceProvider } from './../../providers/barcode-service/barcode-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private barcodeService: BarcodeServiceProvider)
  {

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
