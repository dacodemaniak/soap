import { BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { TranslateService } from '@ngx-translate/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Injectable } from '@angular/core';

import { BarcodeInterface } from './../../shared/interfaces/barcode-interface';

import * as Constants from './../../shared/constants/constants';
/*
  Generated class for the BarcodeServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BarcodeServiceProvider {

  private _scanDatas: BarcodeInterface;

  private _barcodePrompt: string;

  constructor(
    private scanner: BarcodeScanner,
    private translateService: TranslateService)
  {

    this._barcodePrompt = this.translateService.instant('barcodescanner.prompt');

     //this._barcodePrompt = 'Placez le code barre dans la zone du lecteur';
  }

    /**
     * Retourne une promesse de lecture de code barre
     */
    public scan(): Promise<BarcodeInterface> {
      let _scanDatas = this._scanDatas;
      let _scanOptions: BarcodeScannerOptions = Constants._SCAN_OPTIONS;
      _scanOptions.prompt = this._barcodePrompt;

      return new Promise((resolve) => {
        this.scanner.scan(_scanOptions).then((barcodeData) => {
          _scanDatas.cancelled = barcodeData.cancelled;
          _scanDatas.format = barcodeData.format;
          _scanDatas.text = barcodeData.text;

          resolve(_scanDatas);
        });
      });
    }
}
