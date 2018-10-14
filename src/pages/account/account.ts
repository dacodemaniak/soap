import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';

import { AccountInterface } from './../../shared/interfaces/account-interface';
import { LocalDataServiceProvider } from './../../providers/local-data-service/local-data-service';
import { TranslateService } from '@ngx-translate/core';
import { PasswordValidator } from './../../shared/validators/password.validator';
import { UserNameValidator } from '../../shared/validators/username.validator';

import { RemoteDataServiceProvider } from './../../providers/remote-data-service/remote-data-service';

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

  /**
   * Contrôle l'affichage du spinner
   */
  public running: boolean = false;

  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private localDataService: LocalDataServiceProvider,
    private remoteDataService: RemoteDataServiceProvider,
    private translateService: TranslateService,
    private toast: Toast) {
      this._doForm();
  }

  public get userName() { return this.signupForm.controls.userName }
  public get name() { return this.signupForm.controls.name }
  public get email() { return this.signupForm.controls.email }
  public get password() { return this.signupForm.controls.password }
  public get confirmPassword() { return this.signupForm.controls.confirmPassword }

  ionViewDidLoad(){}

  ionViewWillEnter() {
    this._setValidationMessages();
  }

  /**
   * Ferme la boîte modale
   */
  public decline(): void {
    this.viewCtrl.dismiss();
  }

  public isFemale(): boolean {
    return this._account.gender === 0;
  }

  /**
   * Crée un compte à partir des données du formulaire
   */
  public onSignIn() {
    this.running = true;
    this.remoteDataService.signup(this.signupForm.value).subscribe((datas: any) => {
      // Met à jour les données locales
      this.localDataService.setAccount(datas);
      this.running = false;
      this.viewCtrl.dismiss();
      // Affiche le toast de bienvenue
      this.translateService.get('account.welcome').subscribe((translation: string)  => {
        this.toast.show(
          translation,
          '5000',
          'center'
        ).subscribe((toast) => {
          // NOOP
        });
      });
    })
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

  private _setValidationMessages() {

    this.validationMessages = {
      'userName': [
          {
            type: 'required',
            message: this.translateService.instant('account.userName.required') },
          { type: 'minlength', message: this.translateService.instant('account.userName.minLength') },
          { type: 'maxlength', message: this.translateService.instant('account.userName.maxLength') },
          { type: 'pattern', message: this.translateService.instant('account.userName.pattern') },
          { type: 'alreadyExists', message: this.translateService.instant('account.userName.alreadyExists') }
        ],
        'name': [
          { type: 'required', message: this.translateService.instant('account.name.required') }
        ],
        'email': [
          { type: 'required', message: this.translateService.instant('account.email.required') },
          { type: 'pattern', message: this.translateService.instant('account.email.pattern') }
        ],
        'password': [
          {type: 'required', message: this.translateService.instant('account.password.required')},
        ],
        'confirmPassword': [
          {type: 'required', message: this.translateService.instant('account.confirmPassword.required')}
        ],
        'matchPassword': [
          {type: 'areEqual', message: this.translateService.instant('account.matchPassword.equal')}
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

      // Génère un message toast si le compte n'a pas encore été créé
      if (this._account.userName === '') {
        this.translateService.get('account.doCreate').subscribe((translation: string)  => {
          this.toast.show(
            translation,
            '5000',
            'center'
          ).subscribe((toast) => {

          });
        });

      }

      // Génère le formulaire
      this.signupForm = this.formBuilder.group({
         userName: [
           this._account.userName,
          [
            Validators.required,
            UserNameValidator.alreadyExists(this.remoteDataService, {alreadyExists: true}),
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
             Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')
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
         // @todo Ajouter la composition de contrôle des mots de passe
      },
      { validator: Validators.compose([
          PasswordValidator.areEqual('password', 'confirmPassword', { 'areEqual': false })
        ])
      })
    })
  }

}
