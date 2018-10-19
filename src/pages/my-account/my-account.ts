
import { HomePage } from './../home/home';

import { AccountInterface } from './../../shared/interfaces/account-interface';
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

  public validationMessages: any;

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
      })
  }

  /**
   * Getter des champs de formulaire
   */
  public get password() { return this.changePassword.controls.password }
  public get confirmPassword() { return this.changePassword.controls.confirmPassword }

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
      this.account.forname
    );
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

}
