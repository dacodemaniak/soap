import { BarcodeScannerOptions } from "@ionic-native/barcode-scanner";
import { isDevMode } from '@angular/core';

/**
 * @name Constants Définition des constantes de l'application
 * @author IDea Factory (dev-team@ideafactory.fr) - Sept. 2018
 * @package shared/constants
 * @version 1.0.0
 */
export class Constants {
  private static get _DEV_MODE(): boolean {
    return isDevMode() ? true : false;
  }

  public static get _API_ROOT(): string {
    return Constants._DEV_MODE ? 'http://192.168.1.99:3000/' : 'https://apiv2.soappli.com/';
  }
}

  export const _SCAN_OPTIONS: BarcodeScannerOptions =
    {
      preferFrontCamera : true, // iOS and Android
      showFlipCameraButton : true, // iOS and Android
      showTorchButton : true, // iOS and Android
      torchOn: true, // Android, launch with the torch switched on (if available)
      prompt : '', // Android
      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      formats : "all", // default: all but PDF_417 and RSS_EXPANDED
      disableAnimations : true, // iOS
      disableSuccessBeep: false // iOS and Android
    }
