import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { NavController, NavParams } from 'ionic-angular';

import { AccountInterface } from './../../shared/interfaces/account-interface';
import { LocalDataServiceProvider } from './../../providers/local-data-service/local-data-service';
import { TranslateService } from '@ngx-translate/core';
import { PasswordValidator } from './../../shared/validators/password.validator';

/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  /**
   * Formulaire de gestion du compte
   */
  public signupForm: FormGroup;

  /**
   * Définition des messages d'erreur
   */
  public validationMessages: any = {};

  /**
   * Compte existant ou à créer
   */
  private _account: AccountInterface;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private localDataService: LocalDataServiceProvider,
    private translateService: TranslateService) {
  }

  public get userName() { return this.signupForm.controls.userName }
  public get name() { return this.signupForm.controls.name }
  public get email() { return this.signupForm.controls.email }
  public get password() { return this.signupForm.controls.matchPassword }
  ionViewDidLoad(){}

  ionViewWillEnter() {
    this._setValidationMessages();
    this._doForm();
  }

  public onSignIn() {}

  public onForgotPassword() {}

  private _setValidationMessages() {
    this.validationMessages = {
      'userName': [
          { type: 'required', message: this.translateService.get('account.username.required') },
          { type: 'minlength', message: this.translateService.get('account.username.minLength') },
          { type: 'maxlength', message: this.translateService.get('account.username.maxLength') },
          { type: 'pattern', message: this.translateService.get('account.username.pattern') },
          { type: 'validUsername', message: this.translateService.get('account.username.valid') }
        ],
        'name': [
          { type: 'required', message: this.translateService.get('account.name.required') }
        ],
        'password': [
          {type: 'required', message: this.translateService.get('account.password.required')},
        ],
        'confirmPassword': [
          {type: 'required', message: this.translateService.get('account.confirmPassword.required')}
        ],
        'matchPassword': [
          {type: 'areEqual', message: this.translateService.get('account.matchPassword.equal')}
        ]

      }
  }
  /**
   * Instancie le formulaire de création / mise à jour du compte
   */
  private _doForm() {
    this.localDataService.getAccount().then((data) => {
      console.warn('account.ts account is loaded');
      this._account = data;

      // Génère le formulaire
      this.signupForm = this.formBuilder.group({
         userName: [
           this._account.userName,
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(25),
            Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
          ]
        ],
         name: [
           this._account.name,
           [Validators.required]
         ],
         forname: [
           this._account.forname
         ],
         email: [
           this._account.email,
           [
             Validators.required,
             Validators.email
           ]
        ],
         phone: [
            this._account.phone
         ],
         birthDate: [
            this._account.birthDate
         ],
         gender: [
           this._account.gender,
           [
             Validators.required
           ]
         ],
         matchPassword: this.formBuilder.group(
           {
             password: [
               this._account.secureKey,
               [
                 Validators.minLength(8),
                 Validators.required,
                 Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')

               ]
              ],
             confirmPassword: [
               this._account.secureKey,
               [
                 Validators.required
               ]
              ]
           }, (formGroup: FormGroup) => {
             return PasswordValidator.areEqual(formGroup)
           }
         )
         // @todo Ajouter la composition de contrôle des mots de passe
      })
    })
  }

}
