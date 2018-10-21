

import { HomePage } from './../home/home';

import { AccountInterface } from './../../shared/interfaces/account-interface';
import { SettingsInterface } from './../../shared/interfaces/settings-interface';
import { RemoteDataServiceProvider } from './../../providers/remote-data-service/remote-data-service';
import { LocalDataServiceProvider } from './../../providers/local-data-service/local-data-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ToSpeechProvider } from './../../providers/to-speech/to-speech';
import { Toast } from '@ionic-native/toast';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidator } from './../../shared/validators/password.validator';

import { MomentModule } from 'angular2-moment';

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

  public account: AccountInterface;

  public hasToken: boolean = false;


  /**
   * Formulaire de gestion du compte
   */
  public changePassword: FormGroup;

  /**
   * Formulaire de gestion des préférences
   */
  public changeSettings: FormGroup;

  /**
   * Stockage des messages de contrôle des formulaires
   */
  public validationMessages: any;

  /**
   * Limites basses et hautes pour le rayon de récupération des prix
   */
  public purchaseBounds: any = {
    "lower": 0,
    "higher": 50
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localDataService: LocalDataServiceProvider,
    private remoteDataService: RemoteDataServiceProvider,
    private textToSpeech: ToSpeechProvider,
    private translateService: TranslateService,
    private toast: Toast,
    private formBuilder: FormBuilder) {
      this.localDataService.getAccount().then((data) => {
        this.account = data;

        this.validationMessages = {
          'password': [
            { type: 'required', message: this.translateService.instant('account.password.required')},
            { type: 'pattern', message: this.translateService.instant('account.password.pattern') }
          ],
          'confirmPassword': [
            { type: 'required', message: this.translateService.instant('account.confirmPassword.required')}
          ],
          'matchPassword': [
            {type: 'areEqual', message: this.translateService.instant('account.matchPassword.equal')}
          ]
        };

        this._doPasswordForm();
        this._doSettingsForm();
      });
  }

  /**
   * Getter des champs de formulaire
   */
  public get password() { return this.changePassword.controls.password }
  public get confirmPassword() { return this.changePassword.controls.confirmPassword }
  public get useVocalMode() { return this.changeSettings.controls.useVocalMode }
  public get maxPurchaseRadius() { return this.changeSettings.controls.maxPurchaseRadius }
  public get notificationTime() { return this.changeSettings.controls.notificationTime }

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
    if (this.account.settings.useVocalMode) {
      this.textToSpeech.sayHello(
        this.account.forname
      );
    }
  }

  /**
   * Procède au changement de mot de passe
  */
  public onChangePassword() {
    this.remoteDataService.updatePassword(this.changePassword.value, this.account.mongoId).subscribe((account) => {
      // Met à jour la donnée localement
      this.account.salt = account.salt;
      this.localDataService.updateAccount(this.account).then(() => {
        this.toast.show(
          this.translateService.instant('myAccount.passwordUpdateSuccess'),
          '3000',
          'center'
        ).subscribe((toast) => {
          this.changePassword.reset();
        });
      });
    })
  }


  /**
   * Mise à jour des préférences utilisateur
   */
  public onChangeSettings() {
    console.info('Préférences : \n' + JSON.stringify(this.changeSettings.value));
    this.localDataService.updateSettings(this.changeSettings.value).then(() => {
      this.toast.show(
        this.translateService.instant('myAccount.settingsUpdateSuccess'),
        '3000',
        'center'
      ).subscribe((toast) => {
        // NOOP
      });
    });
  }

  /**
   * Définit le formulaire de changement de mot de passe
  */
  private _doPasswordForm() {
    this.changePassword = this.formBuilder.group({
      password: [
        '',
        [
          Validators.minLength(8),
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
        ]
      ],
      confirmPassword: [
          '',
          [
            Validators.required
          ]
        ]
    },
      { validator: Validators.compose([
          PasswordValidator.areEqual('password', 'confirmPassword', { 'areEqual': false })
        ])
      }
    );
  }


  private _doSettingsForm() {

    // Récupère l'heure des notifications

    this.changeSettings = this.formBuilder.group({
      useVocalMode: [
        this.account.settings.useVocalMode
      ],
      notificationTime: [
        this.account.settings.notificationTime
      ],
      maxPurchaseRadius: [
        this.account.settings.maxPurchaseRadius,
        [
          Validators.min(this.purchaseBounds.lower),
          Validators.max(this.purchaseBounds.higher)
        ]
      ]
    });

    console.info('changeSettings : ' + typeof this.changeSettings);
  }
}
