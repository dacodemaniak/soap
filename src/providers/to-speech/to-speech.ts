import { Injectable } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { TranslateService } from '@ngx-translate/core';

/*
  Generated class for the ToSpeechProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ToSpeechProvider {

  /**
   * Langue utilisée
   */
  private _locale: string;

  constructor(
    private textToSpeech: TextToSpeech,
    private translateService: TranslateService)
  {
    const _navigatorLanguage: string = window.navigator.language;
    const _userLanguage: string = _navigatorLanguage.split('-')[0];
    this._locale = /(fr|de|en|es)/gi.test(_userLanguage) ? _userLanguage + '-' + _userLanguage.toUpperCase() : 'fr-FR';
  }

  /**
   * Emet un bonjour au chargement de la page myaccount
   */
  public sayHello(forname: string) {
    this.textToSpeech.speak({
      text: this.translateService.instant('myAccount.hello') + forname,
      locale: this._locale,
      rate: 0.9
    })
    .then(() => {
      // NOOP
    })
    .catch((reason) => {
      console.warn(reason);
    })
  }

}
